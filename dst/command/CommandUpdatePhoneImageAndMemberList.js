"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandUpdatePhoneImageAndMemberList = void 0;
const error_1 = __importDefault(require("../const/error"));
class CommandUpdatePhoneImageAndMemberList {
    async execute() {
        if (this._receiver === undefined) {
            throw new Error(error_1.default.NO_RECEIVER);
        }
        await this._receiver.updatePhoneImageAndMemberList();
    }
    setReceiver(receiver) {
        this._receiver = receiver;
    }
}
exports.CommandUpdatePhoneImageAndMemberList = CommandUpdatePhoneImageAndMemberList;
//# sourceMappingURL=CommandUpdatePhoneImageAndMemberList.js.map