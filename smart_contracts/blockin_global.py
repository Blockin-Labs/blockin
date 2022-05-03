from pyteal import *

def approval_program():
    handle_noop = Seq([
        Return(Int(1))
    ])

    handle_optin = Seq([
        Return(Int(1))
    ])

    handle_closeout = Seq([
        Return(Int(1))
    ])

    handle_updateapp = Err()

    handle_deleteapp = Err()

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

with open('blockin_global_approval.teal', 'w') as f:
    compiled = compileTeal(approval_program(), Mode.Application, version=6)
    f.write(compiled)

with open('blockin_global_clear.teal', 'w') as f:
    compiled = compileTeal(clear_program(), Mode.Application, version=6)
    f.write(compiled)