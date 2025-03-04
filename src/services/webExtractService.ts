import {
    Service,
    type IAgentRuntime,
    ServiceType,
} from "@elizaos/core";
import { tavily } from "@tavily/core";
import type { 
    IWebExtractService, 
    ExtractOptions, 
    ExtractResponse,
    SuccessfulExtractResult,
    FailedExtractResult,
    TavilyClient
} from "../types";

export class WebExtractService extends Service implements IWebExtractService {
    public tavilyClient: TavilyClient;

    async initialize(_runtime: IAgentRuntime): Promise<void> {
        const apiKey = _runtime.getSetting("TAVILY_API_KEY") as string;
        if (!apiKey) {
            throw new Error("TAVILY_API_KEY is not set");
        }
        this.tavilyClient = tavily({ apiKey });
    }

    getInstance(): IWebExtractService {
        return WebExtractService.getInstance();
    }

    static get serviceType(): ServiceType {
        return ServiceType.WEB_SEARCH;
    }

    async extract(
        urls: string[],
        options?: ExtractOptions,
    ): Promise<ExtractResponse> {
        try {
            const tavilyOptions = {
                includeImages: options?.includeImages || false,
            };

            const tavilyResponse = await this.tavilyClient.extract(urls);
            
            const anyResponse = tavilyResponse as any;
            
            const successfulResults: SuccessfulExtractResult[] = (anyResponse.results || []).map((result: any) => ({
                url: result.url,
                raw_content: result.rawContent || result.content || "",
                images: result.images
            }));
            
            const failedResults: FailedExtractResult[] = (anyResponse.failedResults || []).map((result: any) => ({
                url: result.url,
                error: result.error || "Unknown error"
            }));
            
            const response: ExtractResponse = {
                results: successfulResults,
                failed_results: failedResults,
                response_time: anyResponse.responseTime || 0
            };
            
            return response;
        } catch (error) {
            throw error;
        }
    }
}
