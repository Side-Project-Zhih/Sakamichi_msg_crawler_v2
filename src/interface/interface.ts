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
  getMemberList(group: string): Promise<Array<TMember>>;
  getMembersInfo(
    group: string,
    members: Array<string>
  ): Promise<Array<TMember>>;
  checkMemberList(group: string): Promise<boolean>;
  updateMemberLastUpdate(
    group: string,
    memberId: string,
    date: string
  ): Promise<void>;
}

export { ICommand, IDatabase };
