"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const envPath = `${process.cwd()}/.env`;
dotenv_1.default.config({ path: envPath });
const HINATA_API_AND_SETTING = {
    name: "hinata",
    GET_UPDATE_TOKEN: "https://api.kh.glastonr.net/v2/update_token",
    GET_MEMBER_LIST: "https://api.kh.glastonr.net/v2/groups",
    GET_MESSAGE: "https://api.kh.glastonr.net/v2/groups",
    GET_PHONE_IMAGE: "https://api.kh.glastonr.net/v2/members",
    refreshToken: process.env.HINATA_REFRESH_TOKEN || "",
};
exports.default = HINATA_API_AND_SETTING;
//# sourceMappingURL=HinataApiSetting.js.map