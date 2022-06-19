import { ICommand } from "../interface/interface";
import { AbstractGroupFactory } from "../groupFactory/AbstractGroupFactory";

class CommandGetMemberList implements ICommand {
  private _receiver?: AbstractGroupFactory;

  async execute() {
    if (this._receiver === undefined) {
      throw new Error();
    }
    const list = await this._receiver.getMemberList();
    console.log(list)
  }

  setReceiver(receiver: AbstractGroupFactory) {
    this._receiver = receiver;
  }
}

export { CommandGetMemberList };
