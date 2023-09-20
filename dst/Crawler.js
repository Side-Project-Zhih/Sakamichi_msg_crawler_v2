"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DownloadDataModel_1 = __importDefault(require("./DataModel/DownloadDataModel"));
const MessageDataModel_1 = __importDefault(require("./DataModel/MessageDataModel"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const MemberDataModel_1 = __importDefault(require("./DataModel/MemberDataModel"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
dayjs_1.default.extend(utc_1.default);
const DATE_FORMAT = "YYYYMMDDHHmmss";
const FILE_DATE_FORMAT = "YYYYMMDD-HHmmss";
class Crawler {
    constructor({ apiController, db, downloader }) {
        this.apiController = apiController;
        this.db = db;
        this.downloader = downloader;
    }
    async getMemberList() {
        const groupName = this.apiController.name;
        const isDbMembersExist = await this.db.checkMemberList(groupName);
        if (!isDbMembersExist) {
            await this.upsertMemberList();
        }
        const members = await this.db.getMemberList(groupName);
        return members;
    }
    async upsertMemberList() {
        const groupName = this.apiController.name;
        await this.apiController.getAccessToken();
        const rawMembers = await this.apiController.getMemberList();
        await (0, mkdirp_1.default)(`${process.cwd()}/public/${groupName}/profile`);
        const upsertMembers = [];
        const downloadItems = [];
        for (const rawMember of rawMembers) {
            const queryData = await this.db.getMembersInfo(groupName, [String(rawMember.id)]);
            if (queryData.length > 0) {
                continue;
            }
            upsertMembers.push(...MemberDataModel_1.default.transform([rawMember], groupName));
            const downloadItem = DownloadDataModel_1.default.transformMember([rawMember], groupName);
            downloadItems.push(...downloadItem);
        }
        if (upsertMembers.length === 0) {
            console.log("No new member");
            console.log("Update member list finished");
            return;
        }
        await this.db.storeMemberList(upsertMembers);
        await this.downloader.download(downloadItems);
        console.log("Update member list finished");
    }
    async crawlMessage({ memberIds, startDate, endDate }) {
        const accessToken = await this.apiController.getAccessToken();
        const isDbMembersExist = await this.db.checkMemberList(this.apiController.name);
        if (!isDbMembersExist) {
            await this.upsertMemberList();
        }
        if (!memberIds) {
            const rawMembers = await this.apiController.getMemberList(accessToken);
            memberIds = rawMembers.filter(member => member.subscription).map((member) => {
                return String(member.id);
            });
        }
        const members = await this.db.getMembersInfo(this.apiController.name, memberIds);
        for (const member of members) {
            startDate = this.getStartDate({ startDate: startDate, lastUpdated: member.last_updated });
            if (!endDate) {
                endDate = this.getEndDate(endDate);
            }
            const processingMember = `group: ${this.apiController.name} member: ${member.name}`;
            const event = `${processingMember} DOWNLOAD COST TIME`;
            const initDir = `${this.apiController.name}/${member.name}`;
            await (0, mkdirp_1.default)(`${process.cwd()}/public/${initDir}`);
            console.log(`${processingMember} DOWNLOAD START`);
            //============================================================================
            console.time(event);
            const memberId = member.member_id;
            const rawMessages = await this.fetchMessages(memberId, startDate, endDate, accessToken);
            const messages = MessageDataModel_1.default.transform(rawMessages, member);
            const downloadItems = DownloadDataModel_1.default.transformMessage(rawMessages, member);
            const last_updated = dayjs_1.default.utc(endDate).format(DATE_FORMAT);
            if (messages.length !== 0) {
                await this.db.bulkStoreMsg(messages);
                await this.downloader.download(downloadItems);
            }
            await this.db.updateMemberLastUpdate(this.apiController.name, memberId, last_updated);
            console.timeEnd(event);
            //============================================================================
            console.log(`${processingMember} DOWNLOAD FINISHED`);
        }
    }
    async updatePhoneImage() {
        const data = await this.apiController.getPhoneImage();
        await (0, mkdirp_1.default)(`${process.cwd()}/public/${this.apiController.name}/phoneImage`);
        const date = dayjs_1.default.utc().format(FILE_DATE_FORMAT);
        for (const rawMember of data) {
            const isExist = await this.db.checkMemberByName(this.apiController.name, rawMember.name);
            const [member] = await this.db.getMembersInfo(this.apiController.name, [String(rawMember.id)]);
            if (!isExist || !member) {
                continue;
            }
            if (member.phone_image === rawMember.phone_image) {
                console.log(`No need to update phone image for ${rawMember.name}`);
                continue;
            }
            await this.db.updatePhoneImage(member.member_id, this.apiController.name, rawMember.phone_image);
            const downloadItems = DownloadDataModel_1.default.transformMemberImage([rawMember], this.apiController.name, date);
            await this.downloader.download(downloadItems);
            console.log(`Update phone image for ${rawMember.name}`);
        }
        console.log("Update phone image finished");
    }
    async fetchMessages(memberId, starDate, endDate, accessToken) {
        let isEnd = false;
        const messagesContainer = [];
        const LIMIT = "200";
        while (!isEnd) {
            const { messages, continuation } = await this.apiController.getMessages(memberId, {
                order: "asc",
                created_from: starDate,
                create_to: endDate,
                count: LIMIT,
            }, accessToken);
            messagesContainer.push(...messages);
            starDate = this.getNewStartDate(continuation);
            if (!continuation) {
                isEnd = true;
            }
        }
        return messagesContainer;
    }
    getNewStartDate(continuation) {
        if (!continuation)
            return null;
        const continuationInfo = JSON.parse(Buffer.from(continuation, "base64").toString("ascii"));
        return continuationInfo.created_from;
    }
    getStartDate({ startDate, lastUpdated }) {
        if (startDate) {
            return dayjs_1.default.utc(startDate).toISOString();
        }
        return lastUpdated
            ? dayjs_1.default.utc(lastUpdated).toISOString()
            : dayjs_1.default.utc("20120101").toISOString();
    }
    getEndDate(endDate) {
        if (!endDate) {
            return dayjs_1.default.utc().toISOString();
        }
        return dayjs_1.default.utc(endDate).toISOString();
    }
}
exports.default = Crawler;
//# sourceMappingURL=Crawler.js.map