"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoker = void 0;
const AbstractGroupFactory_1 = require("../groupFactory/AbstractGroupFactory");
const LIMIT = 50;
class Invoker {
    constructor(receiver) {
        this.receiver = receiver;
        this.commandList = [];
    }
    setCommand(command) {
        if (command.setReceiver !== undefined &&
            this.receiver instanceof AbstractGroupFactory_1.AbstractGroupFactory) {
            command.setReceiver(this.receiver);
        }
        this.commandList.push(command);
    }
    async execute() {
        if (this.commandList.length === 0) {
            return;
        }
        const rounds = Math.ceil(this.commandList.length / LIMIT);
        for (let round = 0; round < rounds; round++) {
            const startIndex = round * LIMIT;
            const endIndex = (round + 1) * LIMIT;
            const runList = this.commandList
                .slice(startIndex, endIndex)
                .map((mission) => mission.execute());
            await Promise.allSettled(runList);
        }
    }
}
exports.Invoker = Invoker;
//# sourceMappingURL=Invoker.js.map