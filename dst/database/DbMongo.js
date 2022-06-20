"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbMongo = void 0;
const mongodb_1 = require("mongodb");
class DbMongo {
    constructor(_url, _dbName) {
        this._url = _url;
        this._dbName = _dbName;
    }
    async init() {
        const client = new mongodb_1.MongoClient(this._url);
        await client.connect();
        this._database = client.db(this._dbName);
    }
    async storeMemberList(members) {
        if (this._database === undefined) {
            throw new Error();
        }
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
    }
    async bulkStoreMsg(messages) {
        if (this._database === undefined) {
            throw new Error();
        }
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
    }
    async getMemberList(group) {
        if (this._database === undefined) {
            throw new Error();
        }
        const database = this._database;
        const list = await database
            .collection("Member")
            .find({ group })
            .project({ _id: 0, group: 0 })
            .sort({ member_id: 1 })
            .toArray();
        const output = list;
        return output;
    }
    async getMembersInfo(group, members) {
        if (this._database === undefined) {
            throw new Error();
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
        const output = list;
        return output;
    }
    async checkMemberList(group) {
        if (this._database === undefined) {
            throw new Error();
        }
        const database = this._database;
        const member = await database.collection("Member").findOne({
            group,
        });
        const isExist = !!member;
        return isExist;
    }
    async updateMemberLastUpdate(group, memberId, last_updated) {
        if (this._database === undefined) {
            throw new Error();
        }
        const database = this._database;
        await database.collection("Member").updateOne({ group, member_id: memberId }, {
            $set: {
                last_updated,
            },
        });
    }
}
exports.DbMongo = DbMongo;
//# sourceMappingURL=DbMongo.js.map