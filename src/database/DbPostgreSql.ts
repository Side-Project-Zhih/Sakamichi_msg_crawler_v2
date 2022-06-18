import { IDatabase } from "../interface/interface";

class DbPostgreSql implements IDatabase {
  async init() {}
  async storeMemberList(members: Array<TMember>) {}
  async bulkStoreMsg(messages: Array<TMessage>) {}
  async getMemberList() {}
  async getMembersInfo(members: Array<string>) {}
  async checkMemberList() {}
}
