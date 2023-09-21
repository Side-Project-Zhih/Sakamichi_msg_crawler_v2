"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ApiMap_1 = __importDefault(require("./ApiMap"));
class ApiController {
    constructor(api) {
        this.name = api.name;
        this.GET_UPDATE_TOKEN = api.GET_UPDATE_TOKEN;
        this.GET_MEMBER_LIST = api.GET_MEMBER_LIST;
        this.GET_MESSAGE = api.GET_MESSAGE;
        this.GET_PHONE_IMAGE = api.GET_PHONE_IMAGE;
        this.refreshToken = api.refreshToken;
    }
    static create(groupName) {
        const api = ApiMap_1.default[groupName];
        return new ApiController(api);
    }
    async getAccessToken() {
        const payload = { refresh_token: this.refreshToken };
        const headers = this.getRequestHeader();
        const res = await axios_1.default.post(this.GET_UPDATE_TOKEN, payload, {
            headers,
        });
        const { access_token } = res.data;
        return access_token;
    }
    async getPhoneImage(accessToken) {
        if (!accessToken)
            accessToken = await this.getAccessToken();
        const headers = this.getRequestHeader(accessToken);
        const res = await axios_1.default.get(this.GET_PHONE_IMAGE, {
            headers,
        });
        return res.data;
    }
    async getMessages(memberId, queryParams, accessToken) {
        if (!accessToken)
            accessToken = await this.getAccessToken();
        const headers = this.getRequestHeader(accessToken);
        const url = this.getMsgApi(memberId, queryParams);
        const res = await axios_1.default.get(url, {
            headers,
        });
        return res.data;
    }
    async getMemberList(accessToken) {
        if (!accessToken)
            accessToken = await this.getAccessToken();
        const headers = this.getRequestHeader(accessToken);
        const res = await axios_1.default.get(this.GET_MEMBER_LIST, {
            headers,
        });
        // TODO check type
        const data = res.data;
        return data.filter(member => member.state === "open");
    }
    getMsgApi(memberId, queryParams) {
        let output = this.GET_MESSAGE + `/${memberId}/timeline?`;
        for (const key in queryParams) {
            output += `${key}=${queryParams[key]}&`;
        }
        return output;
    }
    getRequestHeader(accessToken) {
        const output = {
            Connection: "keep-alive",
            Accept: "application/json",
            "X-Talk-App-ID": "jp.co.sonymusic.communication.sakurazaka 2.3",
        };
        if (accessToken) {
            output.Authorization = `Bearer ${accessToken}`;
        }
        return output;
    }
}
exports.default = ApiController;
//# sourceMappingURL=ApiController.js.map