import { ICommand } from "../interface/interface";
import { AbstractGroupFactory } from "../groupFactory/AbstractGroupFactory";

class CommandGetMemberList implements ICommand {
  private _receiver?: AbstractGroupFactory;

  async execute() {
    if (this._receiver === undefined) {
      throw new Error();
    }
    await this._receiver.getMemberList();
  }
  setReceiver(receiver: AbstractGroupFactory) {
    this._receiver = receiver;
  }
}

export { CommandGetMemberList };
