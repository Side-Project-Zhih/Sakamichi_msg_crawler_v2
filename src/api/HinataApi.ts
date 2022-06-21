import { Api } from "./Api";

class HinataApi extends Api {
  constructor() {
    super();
  }
  public GET_UPDATE_TOKEN: string =
    "https://api.kh.glastonr.net/v2/update_token";
  public GET_MEMBER_LIST: string = "https://api.kh.glastonr.net/v2/groups";
  public GET_MESSAGE: string = "https://api.kh.glastonr.net/v2/groups";
  public GET_PHONE_IMAGE: string = "https://api.kh.glastonr.net/v2/members";
}

export { HinataApi };
