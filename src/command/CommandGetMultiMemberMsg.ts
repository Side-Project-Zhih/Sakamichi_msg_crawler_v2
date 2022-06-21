import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { ICommand } from "../interface/interface";
import { AbstractGroupFactory } from "../groupFactory/AbstractGroupFactory";
import ERROR_MESSAGE from "../const/error";

dayjs.extend(utc);

class CommandGetMultiMemberMsg implements ICommand {
  private _receiver?: AbstractGroupFactory;
  constructor(
    private _memberList: Array<string>,
    private _starDate: string | void,
    private _endDate: string | void
  ) {}

  async execute() {
    if (this._receiver === undefined) {
      throw new Error(ERROR_MESSAGE.NO_RECEIVER);
    }

    await this._receiver.getMultiMemberMsg(
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
