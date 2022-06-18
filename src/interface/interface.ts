import {} from "../type/type";
interface ICommand {
  execute(): Promise<void>;
  setReceiver?(receiver: any): void;
}

export { ICommand };
