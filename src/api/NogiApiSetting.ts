import {ApiAndSetting} from "./ApiAndSetting";
import dotenv from "dotenv";

const envPath =  `${process.cwd()}/.env`;
dotenv.config({path: envPath});


const NOGI_API_AND_SETTING: ApiAndSetting = {
    name: "nogi",
    GET_UPDATE_TOKEN: "https://api.n46.glastonr.net/v2/update_token",
    GET_MEMBER_LIST: "https://api.n46.glastonr.net/v2/groups",
    GET_MESSAGE: "https://api.n46.glastonr.net/v2/groups",
    GET_PHONE_IMAGE: "https://api.n46.glastonr.net/v2/members",
    refreshToken: process.env.NOGI_REFRESH_TOKEN || ""
};

export default NOGI_API_AND_SETTING;

