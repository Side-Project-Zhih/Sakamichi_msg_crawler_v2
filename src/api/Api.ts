import { TRequestHeader } from "../type/type";

abstract class Api {
  protected abstract GET_UPDATE_TOKEN: string;
  protected abstract GET_MEMBER_LIST: string;
  protected abstract GET_MESSAGE: string;
  
  protected getRequestHeader(accessToken: string | void) {
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

  protected getMsgApi(
    memberId: string,
    queryParams: { [prop: string]: string }
  ) {
    let output = this.GET_MESSAGE + `/${memberId}/timeline?`;
    for (const key in queryParams) {
      output += `${key}=${queryParams[key]}&`;
    }
    return output;
  }
}

export { Api };
