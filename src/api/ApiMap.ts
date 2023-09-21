import HINATA_API_AND_SETTING from "./HinataApiSetting";
import NOGI_API_AND_SETTING from "./NogiApiSetting";

import {ApiAndSetting} from "./ApiAndSetting";
import SAKURA_API_AND_SETTING from "./SakuraApiSetting";

const API_MAP: { [key: string]: ApiAndSetting } = {
    hinata: HINATA_API_AND_SETTING,
    nogi: NOGI_API_AND_SETTING,
    sakura: SAKURA_API_AND_SETTING,
};

export default API_MAP;