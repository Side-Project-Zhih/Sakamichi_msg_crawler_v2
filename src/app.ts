import dotenv from "dotenv";

import { DbMongo } from "./database/DbMongo";
import { CommandGetMemberList } from "./command/CommandGetMemberList";
import { CommandGetMultiMemberMsg } from "./command/CommandGetMultiMemberMsg";
import { NogiFactory } from "./groupFactory/NogiFactory";
import { SakuraFactory } from "./groupFactory/SakuraFactory";
import { HinataFactory } from "./groupFactory/HinataFactory";
import { AbstractGroupFactory } from "./groupFactory/AbstractGroupFactory";

import yargs from "yargs";
dotenv.config();

const COMMANDS = {
  group: {
    alias: "g",
    describe: "chose group sakura / nogi / hinata ex: -g sakura",
    string: true,
  },
  members: {
    alias: "m",
    describe:
      "input member id ex: -m 21, if you want to download  multiple members please input ex: -m 21 11",
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
};

const args = yargs.options(COMMANDS).help().argv as {
  group: string;
  members: Array<string>;
  showSakuraMember: boolean;
  showNogiMember: boolean;
  showHinataMember: boolean;
  // startDate: string;
};

async function main() {
  try {
    console.log("DOWNLOAD START");

    const db = new DbMongo(
      "mongodb://localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000",
      "MessageCrawler"
    );
    let factory: AbstractGroupFactory | undefined;
    let refreshToken: string;
    // COMMAND GET_MEMBER_LIST
    if (args.showNogiMember || args.showSakuraMember || args.showHinataMember) {
      if (args.showNogiMember) {
        refreshToken = process.env.NOGI_REFRESH_TOKEN as string;
        factory = new NogiFactory(refreshToken, db);
      } else if (args.showSakuraMember) {
        refreshToken = process.env.SAKURA_REFRESH_TOKEN as string;
        factory = new SakuraFactory(refreshToken, db);
      } else if (args.showHinataMember) {
        refreshToken = process.env.HINATA_REFRESH_TOKEN as string;
        factory = new HinataFactory(refreshToken, db);
      }

      if (factory === undefined) {
        throw new Error();
      }

      const invoker = factory.getInvoker();

      invoker.setCommand(new CommandGetMemberList());
      return await invoker.execute();
    }

    // COMMAND GET_MULTI_MEMBER_MSG
    switch (args.group) {
      case "nogi": {
        refreshToken = process.env.NOGI_REFRESH_TOKEN as string;
        factory = new NogiFactory(refreshToken, db);
        break;
      }
      case "sakura": {
        refreshToken = process.env.SAKURA_REFRESH_TOKEN as string;
        factory = new SakuraFactory(refreshToken, db);
        break;
      }
      case "hinata": {
        refreshToken = process.env.HINATA_REFRESH_TOKEN as string;
        factory = new HinataFactory(refreshToken, db);
        break;
      }
    }

    if (factory === undefined) {
      throw new Error();
    }

    const invoker = factory.getInvoker();
    invoker.setCommand(new CommandGetMultiMemberMsg(args.members));

    await invoker.execute();
  } catch (error) {
    console.error(error);
  }
}

main().then(() => {
  console.log("DONE");
  process.exit();
});
