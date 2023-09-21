import dotenv from "dotenv";
import yargs from "yargs";
import {COMMANDS} from "./const/commandSetting";
import DbMongo from "./database/DbMongo";
import Crawler from "./Crawler";
import Downloader from "./Downloader";
import ApiController from "./api/ApiController";

const envPath = `${process.cwd()}/.env`;
dotenv.config({path: envPath});

const args = yargs.options(COMMANDS).help().argv as {
    group: string;
    members: Array<string>;
    showMember: string;
    updateMemberList: string;
    updatePhoneImage: string;
    time: string;
    // startDate: string;
};


async function main() {
    try {
        console.log("DOWNLOAD START");
        const DB_HOST = process.env.DB_HOST || 'localhost';
        const db = new DbMongo(
            `mongodb://${DB_HOST}:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000`,
            "MessageCrawler"
        );
        const downloader = new Downloader();

        // COMMAND GET_MEMBER_LIST
        if (args.showMember) {
            const group = args.showMember;
            const apiController = ApiController.create(group);

            const crawler = new Crawler({
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
            const apiController = ApiController.create(group);
            const crawler = new Crawler({
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
            const apiController = ApiController.create(group);
            const crawler = new Crawler({
                apiController: apiController,
                db: db,
                downloader: downloader
            });
            await crawler.updatePhoneImage();
            return;
        }

        if (args.group) {
            const group = args.group;
            const apiController = ApiController.create(group);
            const crawler = new Crawler({
                apiController: apiController,
                db: db,
                downloader: downloader
            });
            const startDate = args.time ? args.time : undefined;
            await crawler.crawlMessage(
                {
                    memberIds: args.members,
                    startDate: startDate,
                }
            );
        }
    } catch (error) {
        console.error(error);
    }
}

main().then(() => {
    console.log("DONE");
    process.exit();
});
