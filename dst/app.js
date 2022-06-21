"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const DbMongo_1 = require("./database/DbMongo");
const CommandGetMemberList_1 = require("./command/CommandGetMemberList");
const CommandGetMultiMemberMsg_1 = require("./command/CommandGetMultiMemberMsg");
const CommandUpdatePhoneImage_1 = require("./command/CommandUpdatePhoneImage");
const CommandUpdateMemberList_1 = require("./command/CommandUpdateMemberList");
const NogiFactory_1 = require("./groupFactory/NogiFactory");
const SakuraFactory_1 = require("./groupFactory/SakuraFactory");
const HinataFactory_1 = require("./groupFactory/HinataFactory");
const yargs_1 = __importDefault(require("yargs"));
dotenv_1.default.config();
const COMMANDS = {
    group: {
        alias: "g",
        describe: "chose group sakura / nogi / hinata ex: -g sakura",
        string: true,
    },
    members: {
        alias: "m",
        describe: "input member id ex: -m 21, if you want to download  multiple members please input ex: -m 21 11",
        array: true,
        string: true,
    },
    showSakuraMember: {
        alias: "s",
        describe: "show sakurazaka member id",
        boolean: true,
    },
    showNogiMember: {
        alias: "n",
        describe: "show nogizaka member id",
        boolean: true,
    },
    showHinataMember: {
        alias: "h",
        describe: "show hinatazaka member id",
        boolean: true,
    },
    updateMemberList: {
        alias: "update_member",
        describe: "update member list, please input group name ex: --update_member nogi",
        string: true,
    },
    updatePhoneImage: {
        alias: "update_phone",
        describe: "update phone image, please input group name ex: --update_image nogi",
        string: true,
    },
};
const args = yargs_1.default.options(COMMANDS).help().argv;
async function main() {
    try {
        console.log("DOWNLOAD START");
        const db = new DbMongo_1.DbMongo("mongodb://localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000", "MessageCrawler");
        let factory;
        let refreshToken;
        // COMMAND GET_MEMBER_LIST
        if (args.showNogiMember || args.showSakuraMember || args.showHinataMember) {
            if (args.showNogiMember) {
                refreshToken = process.env.NOGI_REFRESH_TOKEN;
                factory = new NogiFactory_1.NogiFactory(refreshToken, db);
            }
            else if (args.showSakuraMember) {
                refreshToken = process.env.SAKURA_REFRESH_TOKEN;
                factory = new SakuraFactory_1.SakuraFactory(refreshToken, db);
            }
            else if (args.showHinataMember) {
                refreshToken = process.env.HINATA_REFRESH_TOKEN;
                factory = new HinataFactory_1.HinataFactory(refreshToken, db);
            }
            if (factory === undefined) {
                throw new Error();
            }
            const invoker = factory.getInvoker();
            invoker.setCommand(new CommandGetMemberList_1.CommandGetMemberList());
            return await invoker.execute();
        }
        // COMMAND UPDATE_MEMBER_LIST
        if (args.updateMemberList) {
            switch (args.updateMemberList) {
                case "nogi": {
                    refreshToken = process.env.NOGI_REFRESH_TOKEN;
                    factory = new NogiFactory_1.NogiFactory(refreshToken, db);
                    break;
                }
                case "sakura": {
                    refreshToken = process.env.SAKURA_REFRESH_TOKEN;
                    factory = new SakuraFactory_1.SakuraFactory(refreshToken, db);
                    break;
                }
                case "hinata": {
                    refreshToken = process.env.HINATA_REFRESH_TOKEN;
                    factory = new HinataFactory_1.HinataFactory(refreshToken, db);
                    break;
                }
            }
            if (factory === undefined) {
                throw new Error();
            }
            const invoker = factory.getInvoker();
            invoker.setCommand(new CommandUpdateMemberList_1.CommandUpdateMemberList());
            return await invoker.execute();
        }
        // COMMAND UPDATE_PHONE_IMAGE
        if (args.updatePhoneImage) {
            switch (args.updatePhoneImage) {
                case "nogi": {
                    refreshToken = process.env.NOGI_REFRESH_TOKEN;
                    factory = new NogiFactory_1.NogiFactory(refreshToken, db);
                    break;
                }
                case "sakura": {
                    refreshToken = process.env.SAKURA_REFRESH_TOKEN;
                    factory = new SakuraFactory_1.SakuraFactory(refreshToken, db);
                    break;
                }
                case "hinata": {
                    refreshToken = process.env.HINATA_REFRESH_TOKEN;
                    factory = new HinataFactory_1.HinataFactory(refreshToken, db);
                    break;
                }
            }
            if (factory === undefined) {
                throw new Error();
            }
            const invoker = factory.getInvoker();
            invoker.setCommand(new CommandUpdatePhoneImage_1.CommandUpdatePhoneImage());
            return await invoker.execute();
        }
        // COMMAND GET_MULTI_MEMBER_MSG
        switch (args.group) {
            case "nogi": {
                refreshToken = process.env.NOGI_REFRESH_TOKEN;
                factory = new NogiFactory_1.NogiFactory(refreshToken, db);
                break;
            }
            case "sakura": {
                refreshToken = process.env.SAKURA_REFRESH_TOKEN;
                factory = new SakuraFactory_1.SakuraFactory(refreshToken, db);
                break;
            }
            case "hinata": {
                refreshToken = process.env.HINATA_REFRESH_TOKEN;
                factory = new HinataFactory_1.HinataFactory(refreshToken, db);
                break;
            }
        }
        if (factory === undefined) {
            throw new Error();
        }
        const invoker = factory.getInvoker();
        invoker.setCommand(new CommandGetMultiMemberMsg_1.CommandGetMultiMemberMsg(args.members));
        await invoker.execute();
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