import {
    elizaLogger,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
    type Action,
    VerifiableInferenceOptions
} from "@elizaos/core";
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import * as cheerio from 'cheerio';
import { Content } from "@elizaos/core";
import { OpacityAdapter } from "@elizaos/adapter-opacity";

export interface NewsItem {
    title: string;
    link: string;
    image: string;
    description: string;
}

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

        const newsData: NewsItem[] = items.map(item => {
            const $ = cheerio.load(item.description);
            const lastParagraph = $('p').last().text().replace(/'/g, '').trim();
            const imageUrl = $('img').attr('src')?.replace(/'/g, '').trim() || '';

            return {
                title: item.title.replace(/'/g, '').trim(),
                link: item.link.replace(/'/g, '').trim(),
                image: imageUrl,
                description: lastParagraph
            };
        });

        return newsData;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return [];
    }
}
export default {
    name: "NEWS",
    description: "Fetch the latest news from Cointelegraph",
    similes: [
        "NEWS",
        "BREAKING_NEWS",
        "CRYPTO_NEWS",
        "LATESTED_CRYPTO NEWS",
        "GET_NEWS",
        "FETCH_NEWS",
        "NEWS_FEED",
        "NEWS_ARTICLES",
        "NEWS_SUMMARY",
        "MORNING_NEWS",
        "CRYPTO_ARTICLES",
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

        try {
            
            // Fetch the latest news
            const news: NewsItem[] = await fetchCointelegraphRSS();
            console.log('news example', news[0]);
            const newsContent = news.map((item: NewsItem, index: number) => `${index + 1}. [${item.title}](${item.link}): ${item.description} \n ${item.image}`).join("\n");
            const responseText = `Here are the latest news articles from Cointelegraph:\n${newsContent}`;
            elizaLogger.success("News fetched successfully!");

            const newMemory: Memory = {
                userId: message.userId,
                agentId: message.agentId,
                roomId: message.roomId,
                content: {
                    text: responseText,
                    action: "NEWS",
                    source:message.content.source

                } as Content
        };

        await runtime.messageManager.createMemory(newMemory);

            if (callback) {
                callback({
                    text: responseText,
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
                action: "NEWS",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Here are the latest news articles from Cointelegraph:\n1. Summarise description 1: Image 1\n2. Summarise description 2: Image 2\n3. Summarise description 3: Image 3"
            },
        },
    ]]
} as Action;

//export default getLastedNews;