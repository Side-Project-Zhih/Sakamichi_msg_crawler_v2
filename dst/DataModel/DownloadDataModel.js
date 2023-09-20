"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const FILE_DATE_FORMAT = "YYYYMMDD-HHmmss";
class DownloadDataModel {
    static transformMember(rawMembers, group) {
        return rawMembers.map((member) => {
            return {
                link: member.thumbnail,
                filename: member.name,
                dir: `${group}/profile`,
                fileExtension: "jpg",
                type: "picture",
            };
        });
    }
    static transformMemberImage(rawMembers, group, date) {
        return rawMembers.map((member) => {
            return {
                link: member.phone_image,
                filename: `phone-${member.name}-${date}`,
                dir: `${group}/phoneImage`,
                fileExtension: "jpg",
                type: "picture",
            };
        });
    }
    static transformMessage(rawMessages, member) {
        const dir = `${member.group}/${member.name}`;
        return rawMessages.filter(rawMessage => rawMessage.type !== 'text').map((rawMessage) => {
            const { type, file, published_at } = rawMessage;
            const date = dayjs_1.default.utc(published_at).format(FILE_DATE_FORMAT);
            const filename = `${date}-${type}`;
            let fileExtension = "";
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
            const downloadObj = {
                link: file,
                filename,
                dir,
                fileExtension,
                type,
            };
            return downloadObj;
        });
    }
}
exports.default = DownloadDataModel;
//# sourceMappingURL=DownloadDataModel.js.map