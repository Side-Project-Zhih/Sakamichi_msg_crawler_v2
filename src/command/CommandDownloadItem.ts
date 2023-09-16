import {ICommand} from "../interface/interface";
import {TDownloadItem} from "../type/type";
import {pipeline} from "stream/promises";
import fs from "fs";
import axios, {AxiosResponse} from "axios";

class CommandDownloadItem implements ICommand {
    constructor(private item: TDownloadItem) {
    }

    async execute() {
        const {link, fileExtension, filename, type, dir} = this.item;
        const res: AxiosResponse = await axios.get(link, {
            responseType: "stream",
        });
        const filePath = `${process.cwd()}/public/${dir}/${filename}.${fileExtension}`;
        return await pipeline(res.data, fs.createWriteStream(filePath));
    }
}

export {CommandDownloadItem};
