from numpy import uint64
from pyteal import *
from algosdk.future import transaction
from algosdk.v2client import algod
import os
import pathlib
from util import deploy, get_private_key_from_mnemonic

#if Resource: application_args = (user_address_bytes, asset_total, asset_unit_name, asset_name, asset_url, asset_metadata_hash, asset_manager_address)
# NOT TRUE Resource must include the address of the apat field of their no_op txn
#if User: application_args = ()
# User must include the ASA ID in the apas field of their no_op txn


# ASA Byteslice scheme: user_address[32B], asset_id[8B], round_created[8B]
ADDRESS_LEN = Int(32)
ASSET_ID_LEN = Int(8)
ROUND_LEN = Int(8)
FREE_AFTER_ROUNDS = Int(72)
class LocalState:
    SCHEMA: transaction.StateSchema = transaction.StateSchema(num_uints=0, num_byte_slices=0)

class GlobalState:
    SCHEMA: transaction.StateSchema = transaction.StateSchema(num_uints=0, num_byte_slices=64)
    class Variables:
        ASSET_PREFIX: TealType.bytes = Bytes("asset_")

def approval_program():

    asa_slot = ScratchVar(TealType.uint64)
    i = ScratchVar(TealType.uint64)
    curr_slot = ScratchVar(TealType.bytes)
    curr_i_round = ScratchVar(TealType.uint64)
    oldest_created = ScratchVar(TealType.uint64)

    create_asa = Seq([
        asa_slot.store(Int(64)),
        oldest_created.store(Global.round()),
        For(i.store(Int(0)), i.load() < Int(64), i.store(i.load() + Int(1))).Do(Seq([
            If(App.globalGet(Concat(GlobalState.Variables.ASSET_PREFIX, Itob(i.load()))) != Int(0), 
                Seq([
                    curr_slot.store(App.globalGet(Concat(GlobalState.Variables.ASSET_PREFIX, Itob(i.load())))),
                    curr_i_round.store(Btoi(Extract(curr_slot.load(), ADDRESS_LEN + ASSET_ID_LEN, ROUND_LEN))),
                    If(And(curr_i_round.load() <= Global.round() - FREE_AFTER_ROUNDS, curr_i_round.load() < oldest_created.load()), Seq([
                        asa_slot.store(i.load()),
                        oldest_created.store(curr_i_round.load())
                    ]))
                ]), 
                Seq([
                    asa_slot.store(i.load()),
                    Break()
                ])
            ),
        ])),
        If(asa_slot.load() == Int(64), Err()),
        Assert(Txn.application_args.length() == Int(7)),
        # Create an asset
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetConfig,
            TxnField.config_asset_total: Btoi(Txn.application_args[1]),
            TxnField.config_asset_decimals: Int(0),
            TxnField.config_asset_unit_name: Txn.application_args[2],
            TxnField.config_asset_name: Txn.application_args[3],
            TxnField.config_asset_url: Txn.application_args[4],
            TxnField.config_asset_metadata_hash: Txn.application_args[5],
            TxnField.config_asset_manager: Txn.application_args[6],
            TxnField.config_asset_reserve: Txn.application_args[6],
            TxnField.config_asset_freeze: Txn.application_args[6],
            TxnField.config_asset_clawback: Txn.application_args[6]
        }),
        InnerTxnBuilder.Submit(),
        App.globalPut(Concat(GlobalState.Variables.ASSET_PREFIX, Itob(asa_slot.load())), Concat(Txn.application_args[0], Itob(InnerTxn.created_asset_id()), Itob(Global.round()))),
        Return(Int(1))
    ])

    get_user_asa_info = Seq([
        asa_slot.store(Int(64)),
        For(i.store(Int(0)), i.load() < Int(64), i.store(i.load() + Int(1))).Do(Seq([
            If(App.globalGet(Concat(GlobalState.Variables.ASSET_PREFIX, Itob(i.load()))) != Int(0), 
                Seq([
                    curr_slot.store(App.globalGet(Concat(GlobalState.Variables.ASSET_PREFIX, Itob(i.load())))),
                    If(Extract(curr_slot.load(), Int(0), ADDRESS_LEN) == Txn.sender(), Seq([
                        asa_slot.store(i.load()),
                        Break()
                    ]))
                ])
            ),
        ])),
        If(asa_slot.load() == Int(64), Err())
    ])
    asset_balance = AssetHolding.balance(App.id(), Txn.assets[0])

    claim_asa = Seq([
        get_user_asa_info,
        asset_balance,
        Assert(asset_balance.hasValue()),
        # Send the assest to the specified address
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.asset_receiver: Txn.sender(),
            TxnField.asset_amount: asset_balance.value(),
            # Must be in the assets array sent as part of the application call
            TxnField.xfer_asset: Btoi(Extract(App.globalGet(Concat(GlobalState.Variables.ASSET_PREFIX, Itob(asa_slot.load()))), ADDRESS_LEN, ASSET_ID_LEN)),
        }),
        InnerTxnBuilder.Submit(),
        Return(Int(1))
    ])

    handle_noop = If(Global.creator_address() ==
                     Txn.sender(), create_asa, claim_asa)

    # TODO: Can set a required fee for users to pay when they opt-in, could be used for one-time payments for a service
    handle_optin = Seq([
        Return(Int(1))
    ])

    handle_closeout = Seq([
        Return(Int(1))
    ])

    handle_updateapp = If(Global.creator_address() ==
                          Txn.sender(), Return(Int(1)), Err())

    handle_deleteapp = If(Global.creator_address() ==
                          Txn.sender(), Return(Int(1)), Err())

    program = Cond(
        [Txn.on_completion() == OnComplete.NoOp, handle_noop],
        [Txn.on_completion() == OnComplete.OptIn, handle_optin],
        [Txn.on_completion() == OnComplete.CloseOut, handle_closeout],
        [Txn.on_completion() == OnComplete.UpdateApplication, handle_updateapp],
        [Txn.on_completion() == OnComplete.DeleteApplication, handle_deleteapp]
    )
    return program


def clear_program():
    program = Return(Int(1))
    return program


def create(API_TOKEN, API_URL, MNEMONIC, upload=False):
    # Compile to TEAL
    with open(os.path.join(pathlib.Path(__file__).parent, 'blockin_global_approval.teal'), 'w') as f:
        approval_teal = compileTeal(approval_program(), Mode.Application, version=5)
        f.write(approval_teal)

    with open(os.path.join(pathlib.Path(__file__).parent, 'blockin_global_clear.teal'), 'w') as f:
        clear_teal = compileTeal(clear_program(), Mode.Application, version=5)
        f.write(clear_teal)

    if upload:
        
        # initialize an algodClient
        algod_client = algod.AlgodClient(API_TOKEN, API_URL, {
            "x-api-key": API_TOKEN})

        # Create & Deploy the Application
        return deploy(algod_client, get_private_key_from_mnemonic(MNEMONIC),
               approval_teal, clear_teal, GlobalState.SCHEMA, LocalState.SCHEMA)