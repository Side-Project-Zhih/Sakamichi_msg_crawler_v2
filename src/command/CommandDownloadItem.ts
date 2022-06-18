import { ICommand } from "../interface/interface";
import { TdownloadItem } from "../type/type";
import { pipeline } from "stream/promises";
import fs from "fs";
import axios, { AxiosResponse } from "axios";
class CommandDownloadItem implements ICommand {
  constructor(private item: TdownloadItem) {}

  async execute() {
    const { link, fileExtension, date, type, dir } = this.item;
    const res: AxiosResponse = await axios.get(link, {
      responseType: "stream",
    });
    const filePath = `${process.cwd()}/public/${dir}/${date}-${type}.${fileExtension}`;
    return await pipeline(res.data, fs.createWriteStream(filePath));
  }
}

export { CommandDownloadItem };
