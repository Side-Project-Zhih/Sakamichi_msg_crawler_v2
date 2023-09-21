"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const envPath = `${process.cwd()}/.env`;
dotenv_1.default.config({ path: envPath });
const SAKURA_API_AND_SETTING = {
    name: "sakura",
    GET_UPDATE_TOKEN: "https://api.s46.glastonr.net/v2/update_token",
    GET_MEMBER_LIST: "https://api.s46.glastonr.net/v2/groups",
    GET_MESSAGE: "https://api.s46.glastonr.net/v2/groups",
    GET_PHONE_IMAGE: "https://api.s46.glastonr.net/v2/members",
    refreshToken: process.env.SAKURA_REFRESH_TOKEN || ""
};
exports.default = SAKURA_API_AND_SETTING;
//# sourceMappingURL=SakuraApiSetting.js.map