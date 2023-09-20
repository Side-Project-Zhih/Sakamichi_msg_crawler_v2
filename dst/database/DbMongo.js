"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class DbMongo {
    constructor(_url, _dbName) {
        this._url = _url;
        this._dbName = _dbName;
    }
    async storeMemberList(members) {
        await this.lazyLoad();
        if (members.length === 0) {
            return;
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
            await this._database?.collection("Member").bulkWrite(formatArray);
        }
        catch (error) {
            console.error(error);
            throw new Error();
        }
    }
    async bulkStoreMsg(messages) {
        await this.lazyLoad();
        try {
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
            await this._database?.collection("Message").bulkWrite(formatArray);
        }
        catch (error) {
            console.error(error);
            throw new Error();
        }
    }
    async getMemberList(group) {
        await this.lazyLoad();
        try {
            const list = await this._database?.collection("Member")
                .find({ group })
                .project({ _id: 0, group: 0 })
                .sort({ member_id: 1 })
                .toArray();
            const output = list;
            return output;
        }
        catch (error) {
            console.error(error);
            throw new Error();
        }
    }
    async getMembersInfo(group, members) {
        await this.lazyLoad();
        const list = await this._database?.collection("Member")
            .find({
            group,
            member_id: {
                $in: members,
            },
        })
            .project({ _id: 0 })
            .toArray();
        const output = list;
        return output;
    }
    async checkMemberList(group) {
        await this.lazyLoad();
        try {
            const member = await this._database?.collection("Member").findOne({
                group,
            });
            const isExist = !!member;
            return isExist;
        }
        catch (error) {
            console.error(error);
            throw new Error();
        }
    }
    async updatePhoneImage(memberId, group, imageUrl) {
        await this.lazyLoad();
        try {
            const data = await this._database?.collection("Member").findOneAndUpdate({ member_id: memberId, group }, {
                $set: {
                    phone_image: imageUrl,
                },
            }, {
                returnDocument: "before",
            });
        }
        catch (error) {
            console.error(error);
            throw new Error();
        }
    }
    async checkMemberByName(group, name) {
        await this.lazyLoad();
        try {
            const member = await this._database?.collection("Member").findOne({
                group,
                name,
            });
            const isExist = !!member;
            return isExist;
        }
        catch (error) {
            console.error(error);
            throw new Error();
        }
    }
    async updateMemberLastUpdate(group, memberId, last_updated) {
        await this.lazyLoad();
        try {
            await this._database?.collection("Member").updateOne({ group, member_id: memberId }, {
                $set: {
                    last_updated,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error();
        }
    }
    async lazyLoad() {
        if (!this._database) {
            const client = new mongodb_1.MongoClient(this._url);
            await client.connect();
            this._database = client.db(this._dbName);
        }
    }
}
exports.default = DbMongo;
//# sourceMappingURL=DbMongo.js.map