"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandDownloadItem = void 0;
const promises_1 = require("stream/promises");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
class CommandDownloadItem {
    constructor(item) {
        this.item = item;
    }
    async execute() {
        const { link, fileExtension, filename, type, dir } = this.item;
        const res = await axios_1.default.get(link, {
            responseType: "stream",
        });
        const filePath = `${process.cwd()}/public/${dir}/${filename}.${fileExtension}`;
        return await (0, promises_1.pipeline)(res.data, fs_1.default.createWriteStream(filePath));
    }
}
exports.CommandDownloadItem = CommandDownloadItem;
//# sourceMappingURL=CommandDownloadItem.js.map