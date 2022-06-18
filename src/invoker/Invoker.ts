import { AbstractGroupFactory } from "../groupFactory/AbstractGroupFactory";
import { ICommand } from "../interface/interface";

class Invoker {
  private commandList: Array<ICommand> = [];
  constructor(private receiver: AbstractGroupFactory | void) {}

  setCommand(command: ICommand) {
    command.setReceiver(this.receiver);
    this.commandList.push(command);
  }
  async execute() {
    for (const command of this.commandList) {
      await command.execute();
    }
  }
}


export {Invoker}