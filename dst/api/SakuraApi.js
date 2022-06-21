"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SakuraApi = void 0;
const Api_1 = require("./Api");
class SakuraApi extends Api_1.Api {
    constructor() {
        super();
        this.GET_UPDATE_TOKEN = "https://api.s46.glastonr.net/v2/update_token";
        this.GET_MEMBER_LIST = "https://api.s46.glastonr.net/v2/groups";
        this.GET_MESSAGE = "https://api.s46.glastonr.net/v2/groups";
        this.GET_PHONE_IMAGE = "https://api.s46.glastonr.net/v2/members";
    }
}
exports.SakuraApi = SakuraApi;
//# sourceMappingURL=SakuraApi.js.map