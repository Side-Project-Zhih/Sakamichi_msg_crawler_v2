"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
class Api {
    getRequestHeader(accessToken) {
        const output = {
            Connection: "keep-alive",
            Accept: "application/json",
            "X-Talk-App-ID": "jp.co.sonymusic.communication.sakurazaka 2.3",
        };
        if (accessToken) {
            output.Authorization = `Bearer ${accessToken}`;
        }
        return output;
    }
    getMsgApi(memberId, queryParams) {
        let output = this.GET_MESSAGE + `/${memberId}/timeline?`;
        for (const key in queryParams) {
            output += `${key}=${queryParams[key]}&`;
        }
        return output;
    }
}
exports.Api = Api;
//# sourceMappingURL=ApiController.js.map