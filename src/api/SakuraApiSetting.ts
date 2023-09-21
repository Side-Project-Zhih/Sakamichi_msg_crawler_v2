import {ApiAndSetting} from "./ApiAndSetting";
import dotenv from "dotenv";

const envPath = `${process.cwd()}/.env`;
dotenv.config({path: envPath});

const SAKURA_API_AND_SETTING: ApiAndSetting = {
    name: "sakura",
    GET_UPDATE_TOKEN: "https://api.s46.glastonr.net/v2/update_token",
    GET_MEMBER_LIST: "https://api.s46.glastonr.net/v2/groups",
    GET_MESSAGE: "https://api.s46.glastonr.net/v2/groups",
    GET_PHONE_IMAGE: "https://api.s46.glastonr.net/v2/members",
    refreshToken: process.env.SAKURA_REFRESH_TOKEN || ""
};


export default SAKURA_API_AND_SETTING;