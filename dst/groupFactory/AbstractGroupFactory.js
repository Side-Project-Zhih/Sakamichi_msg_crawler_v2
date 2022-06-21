"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractGroupFactory = void 0;
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
dayjs_1.default.extend(utc_1.default);
const Invoker_1 = require("../invoker/Invoker");
const CommandDownloadItem_1 = require("../command/CommandDownloadItem");
const mkdirp_1 = __importDefault(require("mkdirp"));
const FILE_DATE_FORMAT = "YYYYMMDD-HHmmss";
const DATE_FORMAT = "YYYYMMDDHHmmss";
class AbstractGroupFactory {
    constructor(db) {
        this.db = db;
    }
    async getMultiMemberMsg(members, startDate, endDate) {
        try {
            const group = this.group;
            await this.db.init();
            const isPass = await this.db.checkMemberList(group);
            if (!isPass) {
                await this.getAuth();
                const api = this.api.GET_MEMBER_LIST;
                const headers = this.api.getRequestHeader(this.accessToken);
                const res = await axios_1.default.get(api, { headers });
                let data = res.data;
                const list = data
                    .filter((item) => item.state === "open")
                    .map((item) => ({
                    member_id: "" + item.id,
                    name: item.name,
                    group,
                }));
                await this.db.storeMemberList(list);
            }
            const membersInfo = await this.db.getMembersInfo(group, members);
            for (const memberId of members) {
                const member = membersInfo.find((item) => item.member_id === memberId);
                if (!member) {
                    continue;
                }
                startDate = member.last_updated
                    ? dayjs_1.default.utc(member.last_updated).toISOString()
                    : dayjs_1.default.utc("20120101").toISOString();
                // startDate = dayjs.utc("20120101").toISOString();
                endDate = dayjs_1.default.utc(new Date()).toISOString();
                const dir = `${group}/${member.name}`;
                const event = `${dir} DOWNLOAD COST TIME`;
                await (0, mkdirp_1.default)(`${process.cwd()}/public/${dir}`);
                console.log(`${dir} DOWNLOAD START`);
                //============================================================================
                console.time(event);
                const downLoadInvoker = new Invoker_1.Invoker();
                const storeMessages = [];
                await this.getAuth();
                const messages = await this.fetchMsg(memberId, startDate, endDate, []);
                for (const message of messages) {
                    const { type, text, file, published_at, updated_at, state } = message;
                    const dateObject = dayjs_1.default.utc(published_at);
                    const year = dateObject.format("YYYY");
                    const month = dateObject.format("MM");
                    const day = dateObject.format("DD");
                    const storeObj = {
                        member_id: memberId,
                        group,
                        type,
                        text,
                        state,
                        published_at: dayjs_1.default.utc(published_at).format(DATE_FORMAT),
                        updated_at: dayjs_1.default.utc(updated_at).format(DATE_FORMAT),
                        year,
                        month,
                        day,
                    };
                    const date = dayjs_1.default.utc(published_at).format(FILE_DATE_FORMAT);
                    if (type !== "text") {
                        let fileExtension = "";
                        const filename = `${date}-${type}`;
                        const downloadObj = {
                            link: file,
                            filename,
                            dir,
                            fileExtension,
                            type,
                        };
                        switch (type) {
                            case "picture": {
                                fileExtension = "jpg";
                                break;
                            }
                            case "voice": {
                                fileExtension = "mp4";
                                break;
                            }
                            case "video": {
                                fileExtension = "mp4";
                                break;
                            }
                            case "text": {
                                break;
                            }
                        }
                        downloadObj.fileExtension = fileExtension;
                        storeObj.dir = dir;
                        storeObj.file = `${filename}.${fileExtension}`;
                        downLoadInvoker.setCommand(new CommandDownloadItem_1.CommandDownloadItem(downloadObj));
                    }
                    storeMessages.push(storeObj);
                }
                if (storeMessages.length > 0) {
                    await this.db.bulkStoreMsg(storeMessages);
                }
                await downLoadInvoker.execute();
                const last_updated = dayjs_1.default.utc(endDate).format(DATE_FORMAT);
                await this.db.updateMemberLastUpdate(group, memberId, last_updated);
                console.timeEnd(event);
                //============================================================================
                console.log(`${dir} DOWNLOAD FINISHED`);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    async getMemberList() {
        try {
            const group = this.group;
            await this.db.init();
            const isExist = await this.db.checkMemberList(group);
            if (!isExist) {
                await this.getAuth();
                const apiUrl = this.api.GET_MEMBER_LIST;
                const headers = this.api.getRequestHeader(this.accessToken);
                const res = await axios_1.default.get(apiUrl, { headers });
                let data = res.data;
                const list = data
                    .filter((item) => item.state === "open")
                    .map((item) => ({
                    member_id: "" + item.id,
                    name: item.name,
                    group,
                }));
                await this.db.storeMemberList(list);
                return list;
            }
            const list = await this.db.getMemberList(group);
            return list;
        }
        catch (error) {
            console.error(error);
        }
    }
    async getSpecTimeMsg(group, member, starDate, endDate) { }
    async downloadSpecTimeItems(starDate, endDate) { }
    getInvoker() {
        return new Invoker_1.Invoker(this);
    }
    async getMemberInfo(members) {
        const group = this.group;
        const memberInfo = await this.db.getMembersInfo(group, members);
        return memberInfo;
    }
}
exports.AbstractGroupFactory = AbstractGroupFactory;
//# sourceMappingURL=AbstractGroupFactory.js.map