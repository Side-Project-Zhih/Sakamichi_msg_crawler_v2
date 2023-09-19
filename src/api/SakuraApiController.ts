import ApiController from "./ApiController";

export default class SakuraApiController extends ApiController {
    public name: string = "sakura";
    public GET_UPDATE_TOKEN: string =
        "https://api.s46.glastonr.net/v2/update_token";
    public GET_MEMBER_LIST: string = "https://api.s46.glastonr.net/v2/groups";
    public GET_MESSAGE: string = "https://api.s46.glastonr.net/v2/groups";
    public GET_PHONE_IMAGE: string = "https://api.s46.glastonr.net/v2/members";
    protected refreshToken: string = process.env.SAKURA_REFRESH_TOKEN || "";

    constructor() {
        super();
    }
}

