import ApiController from "./ApiController";
import HinataApiController from "./HinataApiController";
import SakuraApiController from "./SakuraApiController";
import NogiApiController from "./NogiApiController";

export default class ApiControllerFactory {
    static create(group: string): ApiController {
        switch (group) {
            case "hinata":
                return new HinataApiController();
            case "sakura":
                return new SakuraApiController();
            case "nogi":
                return new NogiApiController();
            default:
                throw new Error("group is not found");
        }
    }
}
