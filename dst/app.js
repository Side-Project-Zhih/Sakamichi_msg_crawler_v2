"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const yargs_1 = __importDefault(require("yargs"));
const commandSetting_1 = require("./const/commandSetting");
const DbMongo_1 = __importDefault(require("./database/DbMongo"));
const Crawler_1 = __importDefault(require("./Crawler"));
const Downloader_1 = __importDefault(require("./Downloader"));
const ApiController_1 = __importDefault(require("./api/ApiController"));
const envPath = `${process.cwd()}/.env`;
dotenv_1.default.config({ path: envPath });
const args = yargs_1.default.options(commandSetting_1.COMMANDS).help().argv;
async function main() {
    try {
        console.log("DOWNLOAD START");
        const DB_HOST = process.env.DB_HOST || 'localhost';
        const db = new DbMongo_1.default(`mongodb://${DB_HOST}:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000`, "MessageCrawler");
        const downloader = new Downloader_1.default();
        // COMMAND GET_MEMBER_LIST
        if (args.showMember) {
            const group = args.showMember;
            const apiController = ApiController_1.default.create(group);
            const crawler = new Crawler_1.default({
                apiController: apiController,
                db: db,
                downloader: downloader
            });
            const members = await crawler.getMemberList();
            console.log(members);
            return;
        }
        // COMMAND UPDATE_MEMBER_LIST
        if (args.updateMemberList) {
            const group = args.updateMemberList;
            const apiController = ApiController_1.default.create(group);
            const crawler = new Crawler_1.default({
                apiController: apiController,
                db: db,
                downloader: downloader
            });
            await crawler.upsertMemberList();
            return;
        }
        // COMMAND UPDATE_PHONE_IMAGE
        if (args.updatePhoneImage) {
            const group = args.updatePhoneImage;
            const apiController = ApiController_1.default.create(group);
            const crawler = new Crawler_1.default({
                apiController: apiController,
                db: db,
                downloader: downloader
            });
            await crawler.updatePhoneImage();
            return;
        }
        if (args.group) {
            const group = args.group;
            const apiController = ApiController_1.default.create(group);
            const crawler = new Crawler_1.default({
                apiController: apiController,
                db: db,
                downloader: downloader
            });
            const startDate = args.time ? args.time : undefined;
            await crawler.crawlMessage({
                memberIds: args.members,
                startDate: startDate,
            });
        }
    }
    catch (error) {
        console.error(error);
    }
}
main().then(() => {
    console.log("DONE");
    process.exit();
});
//# sourceMappingURL=app.js.map