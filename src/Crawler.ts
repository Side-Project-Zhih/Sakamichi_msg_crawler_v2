import Downloader from "./Downloader";
import DownloadDataModel, {DownloadItem} from "./DataModel/DownloadDataModel";
import MessageDataModel from "./DataModel/MessageDataModel";
import mkdirp from "mkdirp";
import MemberDataModel from "./DataModel/MemberDataModel";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {IDatabase} from "./database/IDatabase";
import ApiController, {RawMessage} from "./api/ApiController";
import {Member} from "./type/Member";


dayjs.extend(utc);

const DATE_FORMAT = "YYYYMMDDHHmmss";
const FILE_DATE_FORMAT = "YYYYMMDD-HHmmss";
export default class Crawler {
    private apiController: ApiController;
    private db: IDatabase;
    private downloader: Downloader;

    constructor({apiController, db, downloader}: {
        apiController: ApiController,
        db: IDatabase,
        downloader: Downloader,
    }) {
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


        await mkdirp(`${process.cwd()}/public/${groupName}/profile`);

        const upsertMembers: Member[] = [];
        const downloadItems: DownloadItem [] = [];


        for (const rawMember of rawMembers) {
            const queryData = await this.db.getMembersInfo(groupName, [String(rawMember.id)]);

            if (queryData.length > 0) {
                continue;
            }

            upsertMembers.push(...MemberDataModel.transform([rawMember], groupName));
            const downloadItem = DownloadDataModel.transformMember([rawMember], groupName);
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

    async crawlMessage({memberIds, startDate, endDate}: {
        memberIds?: string[],
        startDate?: string,
        endDate?: string
    }) {
        const accessToken = await this.apiController.getAccessToken();
        const isDbMembersExist = await this.db.checkMemberList(this.apiController.name);
        if (!isDbMembersExist) {
            await this.upsertMemberList();
        }

        if (!memberIds) {
            const rawMembers = await this.apiController.getMemberList(accessToken);
            memberIds = rawMembers.filter(member => member.subscription).map<string>((member) => {
                return String(member.id);
            });
        }
        const members = await this.db.getMembersInfo(this.apiController.name, memberIds);
        for (const member of members) {
            startDate = this.getStartDate({startDate: startDate, lastUpdated: member.last_updated});

            if (!endDate) {
                endDate = this.getEndDate(endDate);
            }

            const processingMember = `group: ${this.apiController.name} member: ${member.name}`;
            const event = `${processingMember} DOWNLOAD COST TIME`;

            const initDir = `${this.apiController.name}/${member.name}`;
            await mkdirp(`${process.cwd()}/public/${initDir}`);

            console.log(`${processingMember} DOWNLOAD START`);
            //============================================================================
            console.time(event);
            const memberId = member.member_id;
            const rawMessages = await this.fetchMessages(memberId, startDate, endDate, accessToken);
            const messages = MessageDataModel.transform(rawMessages, member);
            const downloadItems = DownloadDataModel.transformMessage(rawMessages, member);

            const last_updated = dayjs.utc(endDate).format(DATE_FORMAT);

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
        await mkdirp(`${process.cwd()}/public/${this.apiController.name}/phoneImage`);
        const date = dayjs.utc().format(FILE_DATE_FORMAT);
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
            const downloadItems = DownloadDataModel.transformMemberImage([rawMember], this.apiController.name, date);
            await this.downloader.download(downloadItems);
            console.log(`Update phone image for ${rawMember.name}`);
        }

        console.log("Update phone image finished");
    }

    private async fetchMessages(
        memberId: string,
        starDate: string,
        endDate: string,
        accessToken: string
    ) {
        let isEnd = false;
        const messagesContainer: RawMessage[] = [];
        const LIMIT = "200";
        while (!isEnd) {
            const {messages, continuation} = await this.apiController.getMessages(memberId, {
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

    private getNewStartDate(continuation?: string) {
        if (!continuation) return null;
        const continuationInfo = JSON.parse(
            Buffer.from(continuation, "base64").toString("ascii")
        );
        return continuationInfo.created_from;
    }

    private getStartDate({startDate, lastUpdated}: { startDate?: string, lastUpdated?: string }) {
        if (startDate) {
            return dayjs.utc(startDate).toISOString();
        }
        return lastUpdated
            ? dayjs.utc(lastUpdated).toISOString()
            : dayjs.utc("20120101").toISOString();
    }

    private getEndDate(endDate?: string) {
        if (!endDate) {
            return dayjs.utc().toISOString();
        }
        return dayjs.utc(endDate).toISOString();
    }
}