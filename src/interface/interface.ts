import { TMember, TMessage } from "../type/type";
import { AbstractGroupFactory } from "../groupFactory/AbstractGroupFactory";
interface ICommand {
  execute(): Promise<void>;
  setReceiver?(receiver: AbstractGroupFactory): void;
}

interface IDatabase {
  init(): Promise<void>;
  storeMemberList(members: Array<TMember>): Promise<void>;
  bulkStoreMsg(messages: Array<TMessage>): Promise<void>;
  getMemberList(): Promise<Array<TMember>>;
  getMembersInfo(members: Array<string>): Promise<Array<TMember>>;
  checkMemberList(): Promise<boolean>;
}

export { ICommand, IDatabase };
