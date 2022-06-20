"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandGetMemberList = void 0;
class CommandGetMemberList {
    async execute() {
        if (this._receiver === undefined) {
            throw new Error();
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