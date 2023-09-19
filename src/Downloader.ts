import {pipeline} from "stream/promises";
import axios, {AxiosResponse} from "axios";
import fs from "fs";
import {DownloadItem} from "./DataModel/DownloadDataModel";

export default class Downloader {
     async download(downloadItems: DownloadItem[], batchSize = 50) {
        const times = Math.ceil(downloadItems.length / batchSize);
        for (let i = 0; i < times; i++) {
            const startIndex = i * batchSize;
            const endIndex = (i + 1) * batchSize;
            const runList = downloadItems
                .slice(startIndex, endIndex)
                .map((mission) => this.store(mission));

            await Promise.allSettled(runList);
        }
    }

    private  async store(downloadItem: DownloadItem) {
        const {link, fileExtension, filename, type, dir} = downloadItem;
        const res: AxiosResponse = await axios.get(link, {
            responseType: "stream",
        });
        const filePath = `${process.cwd()}/public/${dir}/${filename}.${fileExtension}`;
        await pipeline(res.data, fs.createWriteStream(filePath));
    }

}