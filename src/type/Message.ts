type Message = {
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
export {Message};