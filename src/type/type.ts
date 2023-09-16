type TDownloadItem = {
    link: string;
    filename: string;
    dir: string;
    fileExtension: string;
    type: string;
};

type TRequestHeader = {
    Connection: "keep-alive";
    Accept: "application/json";
    "X-Talk-App-ID": "jp.co.sonymusic.communication.sakurazaka 2.3";
    Authorization?: string;
};

type TMember = {
    member_id: string;
    name: string;
    group: string;
    last_updated?: string;
    thumbnail?: string;
    phone_image?: string;
};

type TResMessage = {
    id: number;
    group_id: number;
    member_id: number;
    state: string;
    type: string;
    text: string;
    file: string;
    published_at: string;
    updated_at: string;
};

type TMessage = {
    id?: string;
    group: string;
    member_id: string;
    type: string;
    text: string;
    dir?: string;
    file?: string;
    published_at: string;
    updated_at: string;
    state: string;
    year?: string;
    month?: string;
    day?: string;
};

export {TDownloadItem, TRequestHeader, TMember, TResMessage, TMessage};
