from pyteal import *
from algosdk.future import transaction
from algosdk.v2client import algod
import os
import pathlib
from util import deploy, get_private_key_from_mnemonic

#if Resource: application_args = (user_address, asset_total, asset_unit_name, asset_name, asset_url, asset_metadata_hash, asset_manager_address)
# Resource must include the address of the apat field of their no_op txn
#if User: application_args = ()
# User must include the ASA ID in the apas field of their no_op txn


class LocalState:
    SCHEMA: transaction.StateSchema = transaction.StateSchema(
        num_uints=1, num_byte_slices=0)

    class Variables:
        ASSET: TealType.bytes = Bytes("asset")


class GlobalState:
    SCHEMA: transaction.StateSchema = transaction.StateSchema(
        num_uints=0, num_byte_slices=0)


def approval_program():

    create_asa = Seq([
        Assert(Txn.application_args.length() == Int(5)),
        # Create an asset
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetConfig,
            TxnField.config_asset_total: Btoi(Txn.application_args[0]),
            TxnField.config_asset_decimals: Int(0),
            TxnField.config_asset_unit_name: Txn.application_args[1],
            TxnField.config_asset_name: Txn.application_args[2],
            TxnField.config_asset_url: Txn.application_args[3],
            TxnField.config_asset_metadata_hash: Txn.application_args[4],
            TxnField.config_asset_manager: Global.creator_address(),
            TxnField.config_asset_reserve: Global.creator_address(),
            TxnField.config_asset_freeze: Global.creator_address(),
            TxnField.config_asset_clawback: Global.creator_address()
        }),
        InnerTxnBuilder.Submit(),
        App.localPut(
            Txn.accounts[1], LocalState.Variables.ASSET, InnerTxn.created_asset_id()),
        Return(InnerTxn.created_asset_id())
    ])

    user_asa_info = App.localGetEx(
        Txn.sender(), App.id(), LocalState.Variables.ASSET)

    num_asa = AssetHolding.balance(
        App.id(), Txn.assets[0])

    claim_asa = Seq([
        user_asa_info,
        If(user_asa_info.hasValue(), Seq([
            num_asa,
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.asset_receiver: Txn.sender(),
                TxnField.asset_amount: num_asa.value(),
                # Must be in the assets array sent as part of the application call
                TxnField.xfer_asset: user_asa_info.value(),
            }),
            InnerTxnBuilder.Submit(),
            Return(Int(1))
        ]), Err())
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
    with open(os.path.join(pathlib.Path(__file__).parent, 'blockin_local_approval.teal'), 'w') as f:
        approval_teal = compileTeal(
            approval_program(), Mode.Application, version=5)
        f.write(approval_teal)

    with open(os.path.join(pathlib.Path(__file__).parent, 'blockin_local_clear.teal'), 'w') as f:
        clear_teal = compileTeal(clear_program(), Mode.Application, version=5)
        f.write(clear_teal)

    if upload:
        
        # initialize an algodClient
        algod_client = algod.AlgodClient(API_TOKEN, API_URL, {
            "x-api-key": API_TOKEN})

        # Create & Deploy the Application
        return deploy(algod_client, get_private_key_from_mnemonic(MNEMONIC),
               approval_teal, clear_teal, GlobalState.SCHEMA, LocalState.SCHEMA)