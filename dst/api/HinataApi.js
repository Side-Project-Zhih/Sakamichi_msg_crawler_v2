"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HinataApi = void 0;
const Api_1 = require("./Api");
class HinataApi extends Api_1.Api {
    constructor() {
        super();
        this.GET_UPDATE_TOKEN = "https://api.kh.glastonr.net/v2/update_token";
        this.GET_MEMBER_LIST = "https://api.kh.glastonr.net/v2/groups";
        this.GET_MESSAGE = "https://api.kh.glastonr.net/v2/groups";
        this.GET_PHONE_IMAGE = "https://api.kh.glastonr.net/v2/members";
    }
}
exports.HinataApi = HinataApi;
//# sourceMappingURL=HinataApi.js.map