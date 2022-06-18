import { ICommand } from "../interface/interface";
import { AbstractGroupFactory } from "../groupFactory/AbstractGroupFactory";

class CommandGetMultiMemberMsg implements ICommand {
  private _receiver?: AbstractGroupFactory;
  constructor(
    private _group: string,
    private _memberList: Array<string>,
    private _starDate: string,
    private _endDate: string
  ) {}
  
  async execute() {
    if (this._receiver === undefined) {
      throw new Error();
    }
    await this._receiver.getMultiMemberMsg(
      this._group,
      this._memberList,
      this._starDate,
      this._endDate
    );
  }
  setReceiver(receiver: AbstractGroupFactory) {
    this._receiver = receiver;
  }
}

export { CommandGetMultiMemberMsg };
