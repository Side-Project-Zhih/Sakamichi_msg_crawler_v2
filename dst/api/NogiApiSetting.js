"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const envPath = `${process.cwd()}/.env`;
dotenv_1.default.config({ path: envPath });
const NOGI_API_AND_SETTING = {
    name: "nogi",
    GET_UPDATE_TOKEN: "https://api.n46.glastonr.net/v2/update_token",
    GET_MEMBER_LIST: "https://api.n46.glastonr.net/v2/groups",
    GET_MESSAGE: "https://api.n46.glastonr.net/v2/groups",
    GET_PHONE_IMAGE: "https://api.n46.glastonr.net/v2/members",
    refreshToken: process.env.NOGI_REFRESH_TOKEN || ""
};
exports.default = NOGI_API_AND_SETTING;
//# sourceMappingURL=NogiApiSetting.js.map