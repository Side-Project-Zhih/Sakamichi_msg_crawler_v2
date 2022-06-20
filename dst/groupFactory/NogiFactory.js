"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NogiFactory = void 0;
const AbstractGroupFactory_1 = require("./AbstractGroupFactory");
const NogiApi_1 = require("../api/NogiApi");
const axios_1 = __importDefault(require("axios"));
const LIMIT = "200";
class NogiFactory extends AbstractGroupFactory_1.AbstractGroupFactory {
    constructor(refreshToken, db) {
        super(db);
        this.refreshToken = refreshToken;
        this.api = new NogiApi_1.NogiApi();
        this.group = "nogi";
    }
    async getAuth() {
        const payload = { refresh_token: this.refreshToken };
        const headers = this.api.getRequestHeader();
        const res = await axios_1.default.post(this.api.GET_UPDATE_TOKEN, payload, {
            headers,
        });
        const { access_token } = res.data;
        this.accessToken = access_token;
        return access_token;
    }
    async fetchMsg(memberId, starDate, endDate, msgContainer) {
        const apiUrl = this.api.getMsgApi(memberId, {
            count: LIMIT,
            order: "asc",
            created_from: starDate,
            create_to: endDate,
        });
        const headers = this.api.getRequestHeader(this.accessToken);
        const res = await (0, axios_1.default)(apiUrl, { headers });
        const { messages, continuation } = res.data;
        msgContainer.push(...messages);
        if (continuation) {
            const continuationInfo = JSON.parse(Buffer.from(continuation, "base64").toString("ascii"));
            const newStarDate = continuationInfo.created_from;
            await this.fetchMsg(memberId, newStarDate, endDate, msgContainer);
        }
        return msgContainer;
    }
}
exports.NogiFactory = NogiFactory;
//# sourceMappingURL=NogiFactory.js.map