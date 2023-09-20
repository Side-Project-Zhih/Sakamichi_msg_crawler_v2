"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiController_1 = __importDefault(require("./ApiController"));
class SakuraApiController extends ApiController_1.default {
    constructor() {
        super();
        this.name = "sakura";
        this.GET_UPDATE_TOKEN = "https://api.s46.glastonr.net/v2/update_token";
        this.GET_MEMBER_LIST = "https://api.s46.glastonr.net/v2/groups";
        this.GET_MESSAGE = "https://api.s46.glastonr.net/v2/groups";
        this.GET_PHONE_IMAGE = "https://api.s46.glastonr.net/v2/members";
        this.refreshToken = process.env.SAKURA_REFRESH_TOKEN || "";
    }
}
exports.default = SakuraApiController;
//# sourceMappingURL=SakuraApiController.js.map