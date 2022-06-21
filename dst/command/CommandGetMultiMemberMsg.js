"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandGetMultiMemberMsg = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const error_1 = __importDefault(require("../const/error"));
dayjs_1.default.extend(utc_1.default);
class CommandGetMultiMemberMsg {
    constructor(_memberList, _starDate, _endDate) {
        this._memberList = _memberList;
        this._starDate = _starDate;
        this._endDate = _endDate;
    }
    async execute() {
        if (this._receiver === undefined) {
            throw new Error(error_1.default.NO_RECEIVER);
        }
        await this._receiver.getMultiMemberMsg(this._memberList, this._starDate, this._endDate);
    }
    setReceiver(receiver) {
        this._receiver = receiver;
    }
}
exports.CommandGetMultiMemberMsg = CommandGetMultiMemberMsg;
//# sourceMappingURL=CommandGetMultiMemberMsg.js.map