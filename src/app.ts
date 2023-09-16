import dotenv from "dotenv";

import { DbMongo } from "./database/DbMongo";
import { CommandGetMemberList } from "./command/CommandGetMemberList";
import { CommandGetMultiMemberMsg } from "./command/CommandGetMultiMemberMsg";
import { CommandUpdatePhoneImage } from "./command/CommandUpdatePhoneImage";
import { CommandUpdateMemberList } from "./command/CommandUpdateMemberList";


import { NogiFactory } from "./groupFactory/NogiFactory";
import { SakuraFactory } from "./groupFactory/SakuraFactory";
import { HinataFactory } from "./groupFactory/HinataFactory";
import { AbstractGroupFactory } from "./groupFactory/AbstractGroupFactory";

import yargs from "yargs";
import dayjs from "dayjs";
dotenv.config();

const COMMANDS = {
  group: {
    alias: "g",
    describe: "chose group sakura / nogi / hinata ex: -g sakura",
    string: true,
  },
  time: {
    alias: "t",
    describe: "chose specific time ex: -t 2020-01-01; It's is possible to cowork with -g",
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
  updateMemberList: {
    alias: "update_member",
    describe:
      "update member list, please input group name ex: --update_member nogi",
    string: true,
  },
  updatePhoneImage: {
    alias: "update_phone",
    describe:
      "update phone image, please input group name ex: --update_image nogi",
    string: true,
  },
};

const args = yargs.options(COMMANDS).help().argv as {
  group: string;
  members: Array<string>;
  showSakuraMember: boolean;
  showNogiMember: boolean;
  showHinataMember: boolean;
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

    // COMMAND UPDATE_MEMBER_LIST
    if (args.updateMemberList) {
      switch (args.updateMemberList) {
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
      invoker.setCommand(new CommandUpdateMemberList());

      return await invoker.execute();
    }

    // COMMAND UPDATE_PHONE_IMAGE
    if (args.updatePhoneImage) {
      switch (args.updatePhoneImage) {
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
      invoker.setCommand(new CommandUpdatePhoneImage());

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
    const time = args.time;
    if(time && !dayjs(time).isValid()){
        console.log("Invalid time format please input YYYYMMDD");
      return
    }
    invoker.setCommand(new CommandGetMultiMemberMsg(args.members, time));

    await invoker.execute();
  } catch (error) {
    console.error(error);
  }
}

main().then(() => {
  console.log("DONE");
  process.exit();
});
