import {RawMember, RawMessage} from "../api/ApiController";
import dayjs from "dayjs";

import {Member} from "../type/Member";

const FILE_DATE_FORMAT = "YYYYMMDD-HHmmss";
export type DownloadItem = {
    link: string;
    filename: string;
    dir: string;
    fileExtension: string;
    type: string;
}
export default class DownloadDataModel {
    static transformMember(rawMembers: RawMember[], group: string): DownloadItem[] {
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

    static transformMemberImage(rawMembers: RawMember[], group: string, date: string): DownloadItem[] {
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

    static transformMessage(rawMessages: RawMessage[], member: Member): DownloadItem [] {
        const dir = `${member.group}/${member.name}`;
        return rawMessages.filter(rawMessage => rawMessage.type !== 'text').map((rawMessage) => {
                const {type, file, published_at} = rawMessage;
                const date = dayjs.utc(published_at).format(FILE_DATE_FORMAT);
                const filename = `${date}-${type}`;

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

                const downloadObj: DownloadItem = {
                    link: file,
                    filename,
                    dir,
                    fileExtension,
                    type,
                };
                return downloadObj;
            }
        );
    }
}