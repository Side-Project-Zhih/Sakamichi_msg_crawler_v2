import mongodb, { MongoClient } from "mongodb";

import { IDatabase } from "../interface/interface";
import { TMember, TMessage } from "../type/type";
import ERROR_MESSAGE from "../const/error";

class DbMongo implements IDatabase {
  private _database?: mongodb.Db;
  constructor(private _url: string, private _dbName: string) {}
  async init() {
    const client = new MongoClient(this._url);
    await client.connect();
    this._database = client.db(this._dbName);
  }
  async storeMemberList(members: Array<TMember>) {
    if (this._database === undefined) {
      throw new Error(ERROR_MESSAGE.NO_DB_CONNECTION);
    }

    try {
      const database = this._database;
      const formatArray = members.map((member) => ({
        updateOne: {
          filter: {
            group: member.group,
            member_id: member.member_id,
          },
          update: {
            $set: member,
          },
          upsert: true,
        },
      }));

      await database.collection("Member").bulkWrite(formatArray);
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  async bulkStoreMsg(messages: Array<TMessage>) {
    if (this._database === undefined) {
      throw new Error(ERROR_MESSAGE.NO_DB_CONNECTION);
    }

    try {
      const database = this._database;
      const formatArray = messages.map((message) => ({
        updateOne: {
          filter: {
            group: message.group,
            member_id: message.member_id,
            published_at: message.published_at,
          },
          update: {
            $set: message,
          },
          upsert: true,
        },
      }));

      await database.collection("Message").bulkWrite(formatArray);
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  async getMemberList(group: string) {
    if (this._database === undefined) {
      throw new Error(ERROR_MESSAGE.NO_DB_CONNECTION);
    }
    try {
      const database = this._database;

      const list = await database
        .collection("Member")
        .find({ group })
        .project({ _id: 0, group: 0 })
        .sort({ member_id: 1 })
        .toArray();

      const output = list as Array<TMember>;
      return output;
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }
  async getMembersInfo(group: string, members: Array<string>) {
    if (this._database === undefined) {
      throw new Error(ERROR_MESSAGE.NO_DB_CONNECTION);
    }
    const database = this._database;
    const list = await database
      .collection("Member")
      .find({
        group,
        member_id: {
          $in: members,
        },
      })
      .project({ _id: 0, group: 0 })
      .toArray();

    const output = list as Array<TMember>;
    return output;
  }
  async checkMemberList(group: string) {
    if (this._database === undefined) {
      throw new Error(ERROR_MESSAGE.NO_DB_CONNECTION);
    }
    try {
      const database = this._database;
      const member = await database.collection("Member").findOne({
        group,
      });
      const isExist = !!member;
      if(!isExist) {
        console.log('沒有member list')
      }
      return isExist;
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  async updateMemberLastUpdate(
    group: string,
    memberId: string,
    last_updated: string
  ) {
    if (this._database === undefined) {
      throw new Error(ERROR_MESSAGE.NO_DB_CONNECTION);
    }

    try {
      const database = this._database;

      await database.collection("Member").updateOne(
        { group, member_id: memberId },
        {
          $set: {
            last_updated,
          },
        }
      );
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }
}

export { DbMongo };
