import { ICommand } from "../interface/interface";
import { AbstractGroupFactory } from "../groupFactory/AbstractGroupFactory";
import ERROR_MESSAGE from "../const/error";

class CommandUpdatePhoneImage implements ICommand {
  private _receiver?: AbstractGroupFactory;

  async execute() {
    if (this._receiver === undefined) {
      throw new Error(ERROR_MESSAGE.NO_RECEIVER);
    }
    await this._receiver.updatePhoneImage();
  }

  setReceiver(receiver: AbstractGroupFactory) {
    this._receiver = receiver;
  }
}

export { CommandUpdatePhoneImage };
