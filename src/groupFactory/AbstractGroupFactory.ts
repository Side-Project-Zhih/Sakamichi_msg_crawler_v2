import axios, { AxiosResponse } from "axios";
import { Invoker } from "../invoker/Invoker";
import { Api } from "../api/Api";
import { IDatabase } from "../interface/interface";


abstract class AbstractGroupFactory {
  private accessToken?: string;
  constructor(
    private api: Api,
    private db: IDatabase,
    private refreshToken: string
  ) {}

  async getMultiMemberMsg(
    group: string,
    members: Array<string>,
    starDate: string,
    endDate: string
  ) {}

  async getMemberList() {
    await this.db.init();
    const isExist = await this.db.checkMemberList();
    if (!isExist) {
      const headers = {};
      const data = ((await axios.get("", { headers })) as AxiosResponse).data;
      //TODO: 整理資料
      // .....
      const list: Array<object> = [];
      //
      await this.db.storeMemberList(list);
      return list;
    }
    const list = await this.db.getMemberList();

    return list;
  }

  async getMemberInfo(members: Array<string>) {
    await this.db.init();
  }

  async getSpecTimeMsg(
     group: string,
     member: string,
     starDate: string,
     endDate: string
  ) {}

  async downloadSpecTimeItems(starDate: "string", endDate: string) {}

  getInvoker() {
    return new Invoker(this);
  }
  protected abstract getAuth(): Promise<string>;
  protected abstract fetchMsg(
    memberId: string,
    starDate: string,
    endDate: string,
    msgContainer: Array<any>
  ): Promise<Array<any>>;
}

export { AbstractGroupFactory };
