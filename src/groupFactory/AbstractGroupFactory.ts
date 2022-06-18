import axios, { AxiosResponse } from "axios";
import { Invoker } from "../invoker/Invoker";

abstract class AbstractGroupFactory {
  private accessToken?: string;
  constructor(
    private api: IApi,
    private db: database,
    private refreshToken: string
  ) {}

  protected async getMultiMemberMsg(members: Array<string>) {}

  protected async getMemberList() {
    await this.db.init();
    const isExist = await this.db.checkMemberList();
    if (!isExist) {
      const headers = {};
      const data = ((await axios.get("", { headers })) as AxiosResponse).data;
      //TODO: 整理資料
      // .....
      const list = [];
      //
      await this.db.storeMemberList(list);
      return list;
    }
    const list = await this.db.getMemberList();

    return list;
  }

  protected async getMemberInfo(members: Array<string>) {
    await this.db.init();

  }

  protected async getSpecTimeMsg() {}

  protected async downloadSpecTimeItems(starDate: "string", endDate: string) {}

  protected getInvoker() {
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
