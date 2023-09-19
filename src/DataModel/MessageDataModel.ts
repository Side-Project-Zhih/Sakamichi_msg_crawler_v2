import {RawMessage} from "../api/ApiController";
import dayjs from "dayjs";
import {Member} from "../type/Member";
import {Message} from "../type/Message";

const DATE_FORMAT = "YYYYMMDDHHmmss";
const FILE_DATE_FORMAT = "YYYYMMDD-HHmmss";

export default class MessageDataModel {
    static transform(rawMessages: RawMessage[], member: Member): Message[] {
        return rawMessages.map((rawMessage) => {
            const {type, text, file, published_at, updated_at, state} = rawMessage;
            const {member_id, group} = member;
            const dir = `${group}/${member.name}`;

            const storeObj: Message = {
                member_id,
                group,
                type,
                text,
                state,
                published_at: dayjs.utc(published_at).format(DATE_FORMAT),
                updated_at: dayjs.utc(updated_at).format(DATE_FORMAT),
            };

            const date = dayjs.utc(published_at).format(FILE_DATE_FORMAT);
            const filename: string = `${date}-${type}`;

            if (type !== "text") {
                let fileExtension: string = "";

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