from pyteal import *
import os
import pathlib
#if Resource: application_args = (user_address, asset_total, asset_unit_name, asset_name, asset_url, asset_metadata_hash, asset_manager_address)
#if User: application_args = ()
# User must include the ASA ID in the apas field of their no_op txn


def approval_program():

    create_asa = Seq([
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
        #TODO: NEEDS TO STORE CREATED ASSET_ID BUT STILL FIGURING IT OUT
        #App.localPut(Txn.accounts[1], Itob(Int(0)), InnerTxn.created_asset_id()),
        App.localPut(Txn.accounts[1], Itob(Int(0)), Int(InnerTxn.created_asset_id().field.id)),
        Return(Int(1))
    ])

    user_asa_info = App.localGetEx(Txn.sender(), Int(0), Itob(Int(0)))
    user_has_asa = Seq([
        user_asa_info,
        If(user_asa_info.hasValue(), user_asa_info.value(), Int(0))
    ])

    claim_asa = If(user_has_asa, Seq([
        # Send the assest to the specified address
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.asset_receiver: Txn.sender(),
            TxnField.asset_amount: Int(1000),
            # Must be in the assets array sent as part of the application call
            TxnField.xfer_asset: user_asa_info.value(),
        }),
        InnerTxnBuilder.Submit(),
        Return(Int(1))
    ]), Err())

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


with open(os.path.join(pathlib.Path(__file__).parent, 'blockin_local_approval.teal'), 'w') as f:
    compiled = compileTeal(approval_program(), Mode.Application, version=5)
    f.write(compiled)

with open(os.path.join(pathlib.Path(__file__).parent, 'blockin_local_clear.teal'), 'w') as f:
    compiled = compileTeal(clear_program(), Mode.Application, version=5)
    f.write(compiled)
