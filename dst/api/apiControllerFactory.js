"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HinataApiController_1 = __importDefault(require("./HinataApiController"));
const SakuraApiController_1 = __importDefault(require("./SakuraApiController"));
const NogiApiController_1 = __importDefault(require("./NogiApiController"));
class ApiControllerFactory {
    static create(group) {
        switch (group) {
            case "hinata":
                return new HinataApiController_1.default();
            case "sakura":
                return new SakuraApiController_1.default();
            case "nogi":
                return new NogiApiController_1.default();
            default:
                throw new Error("group is not found");
        }
    }
}
exports.default = ApiControllerFactory;
//# sourceMappingURL=apiControllerFactory.js.map