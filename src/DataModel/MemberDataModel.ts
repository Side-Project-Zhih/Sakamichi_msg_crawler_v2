import {RawMember} from "../api/ApiController";

import {Member} from "../type/Member";

export default class MemberDataModel {
    static transform(rawMembers: RawMember[], groupName: string, lastUpdated?: string): Member[] {
        return rawMembers.map(rawMember => ({
            member_id: String(rawMember.id),
            name: rawMember.name,
            group: groupName,
            last_updated: lastUpdated,
            thumbnail: rawMember.thumbnail,
            phone_image: rawMember.phone_image,
        }));
    }
}