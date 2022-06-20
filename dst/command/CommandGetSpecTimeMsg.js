"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandGetSpecTimeMsg = void 0;
class CommandGetSpecTimeMsg {
    constructor(_group, _member, _starDate, _endDate) {
        this._group = _group;
        this._member = _member;
        this._starDate = _starDate;
        this._endDate = _endDate;
    }
    async execute() {
        if (this._receiver === undefined) {
            throw new Error();
        }
        await this._receiver.getSpecTimeMsg(this._group, this._member, this._starDate, this._endDate);
    }
    setReceiver(receiver) {
        this._receiver = receiver;
    }
}
exports.CommandGetSpecTimeMsg = CommandGetSpecTimeMsg;
//# sourceMappingURL=CommandGetSpecTimeMsg.js.map