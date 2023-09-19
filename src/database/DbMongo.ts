import {IDatabase} from "./IDatabase";
import {Db, MongoClient} from "mongodb";
import {Member} from "../type/Member";
import {Message} from "../type/Message";


export default class DbMongo implements IDatabase {
    private _database?: Db;

    constructor(private _url: string, private _dbName: string) {
    }

    async storeMemberList(members: Array<Member>) {
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
        } catch (error) {
            console.error(error);
            throw new Error();
        }
    }

    async bulkStoreMsg(messages: Array<Message>) {
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
        } catch (error) {
            console.error(error);
            throw new Error();
        }
    }

    async getMemberList(group: string) {
        await this.lazyLoad();
        try {
            const list = await this._database?.collection("Member")
                .find({group})
                .project({_id: 0, group: 0})
                .sort({member_id: 1})
                .toArray();

            const output = list as Array<Member>;
            return output;
        } catch (error) {
            console.error(error);
            throw new Error();
        }
    }

    async getMembersInfo(group: string, members: Array<string>) {
        await this.lazyLoad();
        const list = await this._database?.collection("Member")
            .find({
                group,
                member_id: {
                    $in: members,
                },
            })
            .project({_id: 0})
            .toArray();

        const output = list as Array<Member>;
        return output;
    }

    async checkMemberList(group: string) {
        await this.lazyLoad();
        try {
            const member = await this._database?.collection("Member").findOne({
                group,
            });
            const isExist = !!member;

            return isExist;
        } catch (error) {
            console.error(error);
            throw new Error();
        }
    }

    async updatePhoneImage(memberId: string, group: string, imageUrl: string) {
        await this.lazyLoad();
        try {
            const data = await this._database?.collection("Member").findOneAndUpdate(
                {member_id: memberId, group},
                {
                    $set: {
                        phone_image: imageUrl,
                    },
                },
                {
                    returnDocument: "before",
                }
            );

        } catch (error) {
            console.error(error);
            throw new Error();
        }
    }

    async checkMemberByName(group: string, name: string) {
        await this.lazyLoad();
        try {
            const member = await this._database?.collection("Member").findOne({
                group,
                name,
            });
            const isExist = !!member;

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
        await this.lazyLoad();
        try {

            await this._database?.collection("Member").updateOne(
                {group, member_id: memberId},
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

    private async lazyLoad() {
        if (!this._database) {
            const client = new MongoClient(this._url);
            await client.connect();
            this._database = client.db(this._dbName);
        }
    }
}

