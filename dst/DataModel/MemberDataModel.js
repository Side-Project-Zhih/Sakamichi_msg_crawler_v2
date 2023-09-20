"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MemberDataModel {
    static transform(rawMembers, groupName, lastUpdated) {
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
exports.default = MemberDataModel;
//# sourceMappingURL=MemberDataModel.js.map