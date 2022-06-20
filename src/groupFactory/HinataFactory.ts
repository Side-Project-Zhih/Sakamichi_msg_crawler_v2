import { AbstractGroupFactory } from "./AbstractGroupFactory";
import { HinataApi } from "../api/HinataApi";
import { IDatabase } from "../interface/interface";
import axios, { AxiosResponse } from "axios";
import { TResMessage } from "../type/type";

const LIMIT = "200";

class HinataFactory extends AbstractGroupFactory {
  public api: HinataApi = new HinataApi();
  public accessToken?: string;
  public group: string = "hinata";
  constructor(private refreshToken: string, db: IDatabase) {
    super(db);
  }

  async getAuth() {
    const payload = { refresh_token: this.refreshToken };
    const headers = this.api.getRequestHeader();
    const res: AxiosResponse = await axios.post(
      this.api.GET_UPDATE_TOKEN,
      payload,
      {
        headers,
      }
    );

    const { access_token } = res.data;
    this.accessToken = access_token;
    return access_token;
  }

  async fetchMsg(
    memberId: string,
    starDate: string,
    endDate: string,
    msgContainer: Array<TResMessage>
  ) {
    const apiUrl = this.api.getMsgApi(memberId, {
      count: LIMIT,
      order: "asc",
      created_from: starDate,
      create_to: endDate,
    });
    const headers = this.api.getRequestHeader(this.accessToken);
    const res: AxiosResponse = await axios(apiUrl, { headers });
    const { messages, continuation } = res.data;

    msgContainer.push(...messages);

    if (continuation) {
      const continuationInfo = JSON.parse(
        Buffer.from(continuation, "base64").toString("ascii")
      );
      const newStarDate = continuationInfo.created_from;
      await this.fetchMsg(memberId, newStarDate, endDate, msgContainer);
    }

    return msgContainer;
  }
}

export { HinataFactory };
