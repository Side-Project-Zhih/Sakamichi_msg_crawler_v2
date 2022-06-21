import { ICommand } from "../interface/interface";
import { AbstractGroupFactory } from "../groupFactory/AbstractGroupFactory";
import ERROR_MESSAGE from "../const/error"

class CommandGetMemberList implements ICommand {
  private _receiver?: AbstractGroupFactory;

  async execute() {
    if (this._receiver === undefined) {
      throw new Error(ERROR_MESSAGE.NO_RECEIVER);
    }
    const list = await this._receiver.getMemberList();
    console.log(list)
  }

  setReceiver(receiver: AbstractGroupFactory) {
    this._receiver = receiver;
  }
}

export { CommandGetMemberList };
