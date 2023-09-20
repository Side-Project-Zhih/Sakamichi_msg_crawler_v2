"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const DATE_FORMAT = "YYYYMMDDHHmmss";
const FILE_DATE_FORMAT = "YYYYMMDD-HHmmss";
class MessageDataModel {
    static transform(rawMessages, member) {
        return rawMessages.map((rawMessage) => {
            const { type, text, file, published_at, updated_at, state } = rawMessage;
            const { member_id, group } = member;
            const dir = `${group}/${member.name}`;
            const storeObj = {
                member_id,
                group,
                type,
                text,
                state,
                published_at: dayjs_1.default.utc(published_at).format(DATE_FORMAT),
                updated_at: dayjs_1.default.utc(updated_at).format(DATE_FORMAT),
            };
            const date = dayjs_1.default.utc(published_at).format(FILE_DATE_FORMAT);
            const filename = `${date}-${type}`;
            if (type !== "text") {
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
                storeObj.dir = dir;
                storeObj.file = `${filename}.${fileExtension}`;
            }
            return storeObj;
        });
    }
}
exports.default = MessageDataModel;
//# sourceMappingURL=MessageDataModel.js.map