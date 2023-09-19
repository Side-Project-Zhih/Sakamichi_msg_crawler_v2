import axios, {AxiosResponse} from "axios";

export type RawMessage = {
    id: number;
    group_id: number;
    member_id: number;
    state: string;
    type: string;
    text: string;
    file: string;
    published_at: string;
    updated_at: string;

}
export type RawMember = {
    id: string;
    name: string;
    state: string;
    thumbnail: string;
    phone_image: string;
    subscription: string;
}

type TRequestHeader = {
    Connection: string;
    Accept: string;
    "X-Talk-App-ID": string;
    Authorization?: string;
};

export default abstract class ApiController {
    abstract name: string;
    protected abstract GET_UPDATE_TOKEN: string;
    protected abstract GET_MEMBER_LIST: string;
    protected abstract GET_MESSAGE: string;
    protected abstract GET_PHONE_IMAGE: string;
    protected abstract refreshToken: string;

    async getAccessToken() {
        const payload = {refresh_token: this.refreshToken};
        const headers = this.getRequestHeader();
        const res: AxiosResponse = await axios.post(
            this.GET_UPDATE_TOKEN,
            payload,
            {
                headers,
            }
        );

        const {access_token} = res.data;
        return access_token;
    }

    async getPhoneImage(accessToken?: string) {
        if (!accessToken) accessToken = await this.getAccessToken();
        const headers = this.getRequestHeader(accessToken);
        const res: AxiosResponse = await axios.get(this.GET_PHONE_IMAGE, {
            headers,
        });
        return res.data as RawMember[];
    }

    async getMessages(memberId: string, queryParams: {
        count: string,
        order: "asc",
        created_from: string,
        create_to: string
    }, accessToken?: string) {
        if (!accessToken) accessToken = await this.getAccessToken();
        const headers = this.getRequestHeader(accessToken);
        const url = this.getMsgApi(memberId, queryParams);
        const res: AxiosResponse = await axios.get(url, {
            headers,
        });

        return res.data as { messages: RawMessage[], continuation?: string };
    }

    async getMemberList(accessToken?: string) {
        if (!accessToken) accessToken = await this.getAccessToken();
        const headers = this.getRequestHeader(accessToken);
        const res: AxiosResponse = await axios.get(this.GET_MEMBER_LIST, {
            headers,
        });
        // TODO check type
        const data = res.data as RawMember[];
        return data.filter(member => member.state === "open");
    }

    private getMsgApi(memberId: string, queryParams: { [prop: string]: string }) {
        let output = this.GET_MESSAGE + `/${memberId}/timeline?`;
        for (const key in queryParams) {
            output += `${key}=${queryParams[key]}&`;
        }
        return output;
    }

    private getRequestHeader(accessToken?: string) {
        const output: TRequestHeader = {
            Connection: "keep-alive",
            Accept: "application/json",
            "X-Talk-App-ID": "jp.co.sonymusic.communication.sakurazaka 2.3",
        };

        if (accessToken) {
            output.Authorization = `Bearer ${accessToken}`;
        }
        return output;
    }
}

