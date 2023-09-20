"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiController_1 = __importDefault(require("./ApiController"));
class NogiApiController extends ApiController_1.default {
    constructor() {
        super();
        this.name = "nogi";
        this.GET_UPDATE_TOKEN = "https://api.n46.glastonr.net/v2/update_token";
        this.GET_MEMBER_LIST = "https://api.n46.glastonr.net/v2/groups";
        this.GET_MESSAGE = "https://api.n46.glastonr.net/v2/groups";
        this.GET_PHONE_IMAGE = "https://api.n46.glastonr.net/v2/members";
        this.refreshToken = process.env.NOGI_REFRESH_TOKEN || "";
    }
}
exports.default = NogiApiController;
//# sourceMappingURL=NogiApiController.js.map