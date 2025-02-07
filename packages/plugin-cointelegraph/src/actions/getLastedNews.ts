import {
    elizaLogger,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
    type Action,
} from "@elizaos/core";
import feedparser from "feedparser-promised";
export interface NewsItem {
    title: string;
    link: string;
    description: string;
}
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export async function fetchCointelegraphRSS(): Promise<NewsItem[]> {
    try {
        const url = 'https://cointelegraph.com/rss';
        const response = await axios.get<string>(url);

        const parser = new XMLParser({ ignoreAttributes: false });
        const jsonData = parser.parse(response.data);

        const items = jsonData.rss.channel.item as any[];

        if (!items || !Array.isArray(items)) {
            throw new Error('Invalid RSS format');
        }

        const newsData: NewsItem[] = items.map(item => ({
            title: item.title,
            link: item.link,
            description: item.description
        }));

        return newsData;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return [];
    }
}
export const getLastedNews: Action = {
    name: "getLastedNews",
    description: "Fetch the latest news from Cointelegraph",
    similes: [
        "NEWS",
        "BREAKING NEWS",
        "CRYPTO NEWS",
        "LATESTED CRYPTO NEWS",
        "GET NEWS",
        "FETCH NEWS",
    ],
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        // Add any necessary validation logic here
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting CoinTelegraph getLastedNews handler...");

        // // Initialize or update state
        // let currentState = state;
        // if (!currentState) {
        //     currentState = (await runtime.composeState(message)) as State;
        // } else {
        //     currentState = await runtime.updateRecentMessageState(currentState);
        // }

        try {
            // Fetch the latest news
            const news: NewsItem[] = await fetchCointelegraphRSS();
            const newsContent = news.map((item: NewsItem) => `${item.title}: ${item.description} \n ${item.link}`).join("\n");

            elizaLogger.success("News fetched successfully!");

            if (callback) {
                callback({
                    text: newsContent,
                    content: news,
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error in getLastedNews handler:", error);
            if (callback) {
                callback({
                    text: `Failed to fetch the latest news: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    content: { error: error instanceof Error ? error.message : 'Unknown error' },
                });
            }
            return false;
        }
    },
    examples: [[
        {
            user: "{{user1}}",
            content: {
                text: "What's the latest crypto news?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me fetch the latest crypto news for you.",
                action: "getLastedNews",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Here are the latest news articles from Cointelegraph:\n1. Title 1: Link 1\n2. Title 2: Link 2\n3. Title 3: Link 3\n4. Title 4: Link 4\n5. Title 5: Link 5",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Tell me the latest news from Cointelegraph",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Fetching the latest news from Cointelegraph for you.",
                action: "getLastedNews",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Here are the latest news articles from Cointelegraph:\n1. Title 1: Link 1\n2. Title 2: Link 2\n3. Title 3: Link 3\n4. Title 4: Link 4\n5. Title 5: Link 5",
            },
        },
    ]]
}

export default getLastedNews;