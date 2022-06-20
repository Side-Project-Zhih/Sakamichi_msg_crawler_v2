"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NogiApi = void 0;
const Api_1 = require("./Api");
class NogiApi extends Api_1.Api {
    constructor() {
        super();
        this.GET_UPDATE_TOKEN = "https://api.n46.glastonr.net/v2/update_token";
        this.GET_MEMBER_LIST = "https://api.n46.glastonr.net/v2/groups";
        this.GET_MESSAGE = "https://api.n46.glastonr.net/v2/groups";
    }
}
exports.NogiApi = NogiApi;
//# sourceMappingURL=NogiApi.js.map