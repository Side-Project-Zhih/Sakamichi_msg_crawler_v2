"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("stream/promises");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
class Downloader {
    async download(downloadItems, batchSize = 50) {
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
    async store(downloadItem) {
        const { link, fileExtension, filename, type, dir } = downloadItem;
        const res = await axios_1.default.get(link, {
            responseType: "stream",
        });
        const filePath = `${process.cwd()}/public/${dir}/${filename}.${fileExtension}`;
        await (0, promises_1.pipeline)(res.data, fs_1.default.createWriteStream(filePath));
    }
}
exports.default = Downloader;
//# sourceMappingURL=Downloader.js.map