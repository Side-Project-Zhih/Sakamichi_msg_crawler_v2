import {} from "../type/type";
interface ICommand {
  execute(): Promise<void>;
}

export { ICommand };
