import {Member} from "../type/Member";
import {Message} from "../type/Message";

interface IDatabase {
    storeMemberList(members: Array<Member>): Promise<void>;

    bulkStoreMsg(messages: Array<Message>): Promise<void>;

    getMemberList(group: string): Promise<Array<Member>>;

    getMembersInfo(
        group: string,
        members: Array<string>
    ): Promise<Array<Member>>;

    checkMemberList(group: string): Promise<boolean>;

    updatePhoneImage(
        memberId: string,
        group: string,
        imageUrl: string
    ): Promise<void>;

    checkMemberByName(group: string, name: string): Promise<boolean>;

    updateMemberLastUpdate(
        group: string,
        memberId: string,
        date: string
    ): Promise<void>;
}

export {IDatabase};