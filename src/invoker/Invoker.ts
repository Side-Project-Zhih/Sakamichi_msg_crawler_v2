import {AbstractGroupFactory} from "../groupFactory/AbstractGroupFactory";
import {ICommand} from "../interface/interface";

const LIMIT = 50;

class Invoker {
    private commandList: Array<ICommand> = [];

    constructor(private receiver: AbstractGroupFactory | void) {
    }

    get getAmount() {
        return this.commandList.length;
    }

    setCommand(command: ICommand) {
        if (
            command.setReceiver !== undefined &&
            this.receiver instanceof AbstractGroupFactory
        ) {
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

export {Invoker};
