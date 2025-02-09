import type { Plugin } from "@elizaos/core";
import getPrice from "./actions/getPrice";
import getNews from "./actions/getNews";

export const coinmarketcapPlugin: Plugin = {
    name: "coinmarketcap",
    description: "CoinMarketCap Plugin for Eliza",
    actions: [getPrice,getNews],
    evaluators: [],
    providers: [],
};

export default coinmarketcapPlugin;
