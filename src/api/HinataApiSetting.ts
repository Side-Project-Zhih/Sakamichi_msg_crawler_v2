import {ApiAndSetting} from "./ApiAndSetting";
import dotenv from "dotenv";

const envPath =  `${process.cwd()}/.env`;
dotenv.config({path: envPath});

const HINATA_API_AND_SETTING: ApiAndSetting = {
    name: "hinata",
    GET_UPDATE_TOKEN: "https://api.kh.glastonr.net/v2/update_token",
    GET_MEMBER_LIST: "https://api.kh.glastonr.net/v2/groups",
    GET_MESSAGE: "https://api.kh.glastonr.net/v2/groups",
    GET_PHONE_IMAGE: "https://api.kh.glastonr.net/v2/members",
    refreshToken: process.env.HINATA_REFRESH_TOKEN || "",
};


export default HINATA_API_AND_SETTING;
