import { webSearch } from "./actions/webSearch";
import { webExtract } from "./actions/webExtract";

export const webSearchPlugin = {
    name: "webSearch",
    description: "Search the web and get news",
    actions: [webSearch, webExtract],
};
