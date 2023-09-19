import ApiController from "./ApiController";

export default class NogiApiController extends ApiController {
    public name: string = "nogi";
    public GET_UPDATE_TOKEN: string =
        "https://api.n46.glastonr.net/v2/update_token";
    public GET_MEMBER_LIST: string = "https://api.n46.glastonr.net/v2/groups";
    public GET_MESSAGE: string = "https://api.n46.glastonr.net/v2/groups";
    public GET_PHONE_IMAGE: string = "https://api.n46.glastonr.net/v2/members";
    protected refreshToken: string = process.env.NOGI_REFRESH_TOKEN || "";

    constructor() {
        super();
    }
}

