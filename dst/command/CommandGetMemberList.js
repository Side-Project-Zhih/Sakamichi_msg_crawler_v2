"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandGetMemberList = void 0;
const error_1 = __importDefault(require("../const/error"));
class CommandGetMemberList {
    async execute() {
        if (this._receiver === undefined) {
            throw new Error(error_1.default.NO_RECEIVER);
        }
        const list = await this._receiver.getMemberList();
        console.log(list);
    }
    setReceiver(receiver) {
        this._receiver = receiver;
    }
}
exports.CommandGetMemberList = CommandGetMemberList;
//# sourceMappingURL=CommandGetMemberList.js.map