import { Api } from "./Api";

class SakuraApi extends Api {
  constructor() {
    super();
  }
  public GET_UPDATE_TOKEN: string =
    "https://api.s46.glastonr.net/v2/update_token";
  public GET_MEMBER_LIST: string = "https://api.s46.glastonr.net/v2/groups";
  public GET_MESSAGE: string = "https://api.s46.glastonr.net/v2/groups";
}

export { SakuraApi };
