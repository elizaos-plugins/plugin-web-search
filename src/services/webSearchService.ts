import {
    Service,
    type IAgentRuntime,
    ServiceType,
} from "@elizaos/core";
import { tavily } from "@tavily/core";
import type { 
    IWebSearchService, 
    SearchOptions, 
    SearchResponse,
    TavilyClient
} from "../types";

export class WebSearchService extends Service implements IWebSearchService {
    public tavilyClient: TavilyClient

    async initialize(_runtime: IAgentRuntime): Promise<void> {
        const apiKey = _runtime.getSetting("TAVILY_API_KEY") as string;
        if (!apiKey) {
            throw new Error("TAVILY_API_KEY is not set");
        }
        this.tavilyClient = tavily({ apiKey });
    }

    getInstance(): IWebSearchService {
        return WebSearchService.getInstance();
    }

    static get serviceType(): ServiceType {
        return ServiceType.WEB_SEARCH;
    }

    async search(
        query: string,
        options?: SearchOptions,
    ): Promise<SearchResponse> {
        try {
            let maxResults = 1;
            
            if (options && options.limit !== undefined) {
                maxResults = typeof options.limit === 'string' 
                    ? parseInt(options.limit, 10) 
                    : options.limit;
            }
            
            const tavilyOptions = {
                includeAnswer: options?.includeAnswer ?? true,
                maxResults: maxResults,
                topic: options?.type || "general",
                searchDepth: options?.searchDepth || "basic",
                includeImages: options?.includeImages || false,
                days: options?.days || 3,
            };
            
            const response = await this.tavilyClient.search(query, tavilyOptions);
            
            return response;
        } catch (error) {
            throw error;
        }
    }
}
