type TDownloadItem = {
  link: string;
  date: string;
  dir: string;
  fileExtension: string;
  type: string;
};

type TRequestHeader = {
  Connection: "keep-alive";
  Accept: "application/json";
  "X-Talk-App-ID": "jp.co.sonymusic.communication.sakurazaka 2.2";
  Authorization?: string;
};

type TMember = {};

type TMessage = {};

export { TDownloadItem, TRequestHeader, TMember, TMessage };
