import { TRequestHeader } from "../type/type";

abstract class Api {
  abstract GET_UPDATE_TOKEN: string;
  abstract GET_MEMBER_LIST: string;
  abstract GET_MESSAGE: string;
  abstract GET_PHONE_IMAGE: string;

  getRequestHeader(accessToken: string | void) {
    const output: TRequestHeader = {
      Connection: "keep-alive",
      Accept: "application/json",
      "X-Talk-App-ID": "jp.co.sonymusic.communication.sakurazaka 2.2",
    };

    if (accessToken) {
      output.Authorization = `Bearer ${accessToken}`;
    }
    return output;
  }

  getMsgApi(memberId: string, queryParams: { [prop: string]: string }) {
    let output = this.GET_MESSAGE + `/${memberId}/timeline?`;
    for (const key in queryParams) {
      output += `${key}=${queryParams[key]}&`;
    }
    return output;
  }
}

export { Api };
