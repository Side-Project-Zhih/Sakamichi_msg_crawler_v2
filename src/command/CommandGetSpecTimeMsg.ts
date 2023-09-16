import {ICommand} from "../interface/interface";
import {AbstractGroupFactory} from "../groupFactory/AbstractGroupFactory";
import ERROR_MESSAGE from "../const/error";


class CommandGetSpecTimeMsg implements ICommand {
    private _receiver?: AbstractGroupFactory;

    constructor(
        private _group: string,
        private _member: string,
        private _starDate: string,
        private _endDate: string
    ) {
    }

    async execute() {
        if (this._receiver === undefined) {
            throw new Error(ERROR_MESSAGE.NO_RECEIVER);
        }
        await this._receiver.getSpecTimeMsg(
            this._group,
            this._member,
            this._starDate,
            this._endDate
        );
    }

    setReceiver(receiver: AbstractGroupFactory) {
        this._receiver = receiver;
    }
}

export {CommandGetSpecTimeMsg};
