import axios, { AxiosResponse } from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

import { Invoker } from "../invoker/Invoker";
import { Api } from "../api/Api";
import { IDatabase } from "../interface/interface";
import { TMessage, TResMessage, TDownloadItem } from "../type/type";
import { CommandDownloadItem } from "../command/CommandDownloadItem";
import mkdirp from "mkdirp";

const FILE_DATE_FORMAT = "YYYYMMDD-HHmmss";
const DATE_FORMAT = "YYYYMMDDHHmmss";

abstract class AbstractGroupFactory {
  protected abstract api: Api;
  protected abstract accessToken?: string;
  protected abstract group: string;
  constructor(protected db: IDatabase) {}

  async getMultiMemberMsg(
    members: Array<string>,
    startDate: string | void,
    endDate: string | void
  ) {
    try {
      const group = this.group;
      await this.db.init();

      const isPass = await this.db.checkMemberList(group);
      if (!isPass) {
        await this.getAuth();
        const api = this.api.GET_MEMBER_LIST;
        const headers = this.api.getRequestHeader(this.accessToken);
        const res: AxiosResponse = await axios.get(api, { headers });
        let data = res.data as { [prop: number | string]: string }[];

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
          ? dayjs.utc(member.last_updated).toISOString()
          : dayjs.utc("20120101").toISOString();

        // startDate = dayjs.utc("20120101").toISOString();
        endDate = dayjs.utc(new Date()).toISOString();

        const dir = `${group}/${member.name}`;
        const event = `${dir} DOWNLOAD COST TIME`;

        await mkdirp(`${process.cwd()}/public/${dir}`);

        console.log(`${dir} DOWNLOAD START`);
        //============================================================================
        console.time(event);

        const downLoadInvoker = new Invoker();
        const storeMessages: Array<TMessage> = [];

        await this.getAuth();
        const messages = await this.fetchMsg(memberId, startDate, endDate, []);

        for (const message of messages) {
          const { type, text, file, published_at, updated_at, state } = message;
          const dateObject = dayjs.utc(published_at);
          const year = dateObject.format("YYYY");
          const month = dateObject.format("MM");
          const day = dateObject.format("DD");

          const storeObj: TMessage = {
            member_id: memberId,
            group,
            type,
            text,
            state,
            published_at: dayjs.utc(published_at).format(DATE_FORMAT),
            updated_at: dayjs.utc(updated_at).format(DATE_FORMAT),
            year,
            month,
            day,
          };

          const date = dayjs.utc(published_at).format(FILE_DATE_FORMAT);

          if (type !== "text") {
            let fileExtension: string = "";
            const filename: string = `${date}-${type}`;

            const downloadObj: TDownloadItem = {
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
            downLoadInvoker.setCommand(new CommandDownloadItem(downloadObj));
          }

          storeMessages.push(storeObj);
        }

        if (storeMessages.length > 0) {
          await this.db.bulkStoreMsg(storeMessages);
        }

        await downLoadInvoker.execute();

        const last_updated = dayjs.utc(endDate).format(DATE_FORMAT);
        await this.db.updateMemberLastUpdate(group, memberId, last_updated);
        console.timeEnd(event);
        //============================================================================
        console.log(`${dir} DOWNLOAD FINISHED`);
      }
    } catch (error) {
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
        const res: AxiosResponse = await axios.get(apiUrl, { headers });
        let data = res.data as { [prop: number | string]: string }[];

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
    } catch (error) {
      console.error(error);
    }
  }

  async getSpecTimeMsg(
    group: string,
    member: string,
    starDate: string,
    endDate: string
  ) {}

  async downloadSpecTimeItems(starDate: "string", endDate: string) {}

  getInvoker() {
    return new Invoker(this);
  }

  protected async getMemberInfo(members: Array<string>) {
    const group = this.group;

    const memberInfo = await this.db.getMembersInfo(group, members);
    return memberInfo;
  }

  protected abstract getAuth(): Promise<string>;
  protected abstract fetchMsg(
    memberId: string,
    starDate: string,
    endDate: string,
    msgContainer: Array<TResMessage>
  ): Promise<Array<TResMessage>>;
}

export { AbstractGroupFactory };
