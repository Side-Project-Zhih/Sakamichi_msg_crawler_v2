"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HinataApiSetting_1 = __importDefault(require("./HinataApiSetting"));
const NogiApiSetting_1 = __importDefault(require("./NogiApiSetting"));
const SakuraApiSetting_1 = __importDefault(require("./SakuraApiSetting"));
const API_MAP = {
    hinata: HinataApiSetting_1.default,
    nogi: NogiApiSetting_1.default,
    sakura: SakuraApiSetting_1.default,
};
exports.default = API_MAP;
//# sourceMappingURL=ApiMap.js.map