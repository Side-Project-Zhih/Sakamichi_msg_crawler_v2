"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandGetSpecTimeMsg = void 0;
const error_1 = __importDefault(require("../const/error"));
class CommandGetSpecTimeMsg {
    constructor(_group, _member, _starDate, _endDate) {
        this._group = _group;
        this._member = _member;
        this._starDate = _starDate;
        this._endDate = _endDate;
    }
    async execute() {
        if (this._receiver === undefined) {
            throw new Error(error_1.default.NO_RECEIVER);
        }
        await this._receiver.getSpecTimeMsg(this._group, this._member, this._starDate, this._endDate);
    }
    setReceiver(receiver) {
        this._receiver = receiver;
    }
}
exports.CommandGetSpecTimeMsg = CommandGetSpecTimeMsg;
//# sourceMappingURL=CommandGetSpecTimeMsg.js.map