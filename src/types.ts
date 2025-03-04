import type { Service } from "@elizaos/core";
import { tavily } from "@tavily/core";

export type TavilyClient = ReturnType<typeof tavily>;

// Web Search Service
export interface IWebSearchService extends Service {
    search(
        query: string,
        options?: SearchOptions,
    ): Promise<SearchResponse>;
}

export type SearchResult = {
    title: string;
    url: string;
    content: string;
    rawContent?: string;
    score: number;
    publishedDate?: string;
};

export type SearchImage = {
    url: string;
    description?: string;
};


export type SearchResponse = {
    answer?: string;
    query: string;
    responseTime: number;
    images: SearchImage[];
    results: SearchResult[];
};

/**
 * Options for web search
 * Used both for Tavily API options and parameters extracted by the LLM
 */
export interface SearchOptions {
    limit?: number;      // Number of results to return
    type?: "news" | "general";  // Type of search
    includeAnswer?: boolean;    // Include a generated answer
    searchDepth?: "basic" | "advanced";  // Search depth
    includeImages?: boolean;    // Include images
    days?: number;       // Number of days to consider (1 = current day, 2 = last 2 days)
}

// Web Extract Service
export interface IWebExtractService extends Service {
    extract(
        urls: string[],
        options?: ExtractOptions,
    ): Promise<ExtractResponse>;
}

/**
 * Options for web extraction
 */
export interface ExtractOptions {
    includeImages?: boolean; // Include images
    extractDepth?: "basic" | "advanced";
}

/**
 * Successful result from extraction
 */
export type SuccessfulExtractResult = {
    url: string;
    raw_content: string;
    images?: string[]; // Only available if includeImages is set to true
};

/**
 * Failed result from extraction
 */
export type FailedExtractResult = {
    url: string;
    error: string;
};

/**
 * Response from web extraction API
 */
export type ExtractResponse = {
    results: SuccessfulExtractResult[];
    failed_results: FailedExtractResult[];
    response_time: number;
};