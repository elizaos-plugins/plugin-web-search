import {
    type Action,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
    elizaLogger,
    composeContext,
    generateObjectDeprecated,
    ModelClass,
} from "@elizaos/core";
import { WebSearchService } from "../services/webSearchService";
import type { SearchResult } from "../types";
import { searchParamsTemplate } from "../templates/searchParamsTemplate";
import { 
    isValidSearchParams, 
    MaxTokens, 
    DEFAULT_MAX_WEB_SEARCH_TOKENS
} from "../utils/searchUtils";
import { webSearchExamples } from "../examples/webSearchExamples";

export const webSearch: Action = {
    name: "WEB_SEARCH",
    similes: [
        "SEARCH_WEB",
        "INTERNET_SEARCH",
        "LOOKUP",
        "QUERY_WEB",
        "FIND_ONLINE",
        "SEARCH_ENGINE",
        "WEB_LOOKUP",
        "ONLINE_SEARCH",
        "FIND_INFORMATION",
    ],
    suppressInitialMessage: true,
    description: "Perform a web search to find information related to the message.",
    validate: async (runtime: IAgentRuntime) => {
        return !!runtime.getSetting("TAVILY_API_KEY");
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: any,
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Composing state for message:", message);
        state = (await runtime.composeState(message)) as State;
        const userId = runtime.agentId;
        elizaLogger.log("User ID:", userId);
        elizaLogger.log("Original search query:", message.content.text);

        try {
            const recentMessagesData = state.recentMessagesData || [];
            
            // Find the last agent message (where agentId === message.agentId)
            // We use the agent's message as it often contains a more precise summary of the user's request
            const lastAgentMessage = recentMessagesData
                .filter(m => m.agentId === message.agentId)
                .pop();
                
            const lastAgentMessageText = lastAgentMessage.content.text;
            elizaLogger.log("Last agent message:", lastAgentMessageText);
            
            const searchParamsContext = composeContext({
                state: {
                    ...state,
                    message: lastAgentMessageText
                },
                template: searchParamsTemplate
            });

            const searchParams = await generateObjectDeprecated({
                runtime,
                context: searchParamsContext,
                modelClass: ModelClass.SMALL,
            });

            // Validate extracted parameters
            const isParamsValid = isValidSearchParams(searchParams);
            if (!isParamsValid) {
                elizaLogger.warn("Invalid search parameters, using defaults");
            }
            elizaLogger.log("Extracted search parameters:", searchParams);

            // Use the reformulated search query from the template
            const webSearchPrompt = searchParams.query;
            elizaLogger.log("Using reformulated search query:", webSearchPrompt);

            // The 'limit' parameter from searchParams is passed to the WebSearchService
            // where it's used as the 'maxResults' parameter in the Tavily API call
            const webSearchService = new WebSearchService();
            await webSearchService.initialize(runtime);
            
            // Create search options with proper type conversion
            const searchOptions = isParamsValid ? {
                limit: typeof searchParams.limit === 'string' 
                    ? parseInt(searchParams.limit, 10) 
                    : searchParams.limit,
                type: searchParams.type
            } : undefined;
            elizaLogger.log("Search options:", searchOptions);
            
            const searchResponse = await webSearchService.search(
                webSearchPrompt,
                searchOptions
            );

            if (searchResponse && searchResponse.results.length) {
                // Explicitly limit the number of results to display
                const limit = searchOptions?.limit || 1;
                
                // Take only the first 'limit' results
                const limitedResults = searchResponse.results.slice(0, limit);
                
                const responseList = searchResponse.answer
                    ? `${searchResponse.answer}${
                          Array.isArray(limitedResults) &&
                          limitedResults.length > 0
                              ? `\n\nFor more details, you can check out these resources:\n${limitedResults
                                    .map(
                                        (result: SearchResult, index: number) =>
                                            `${index + 1}. [${result.title}](${result.url})`
                                    )
                                    .join("\n")}`
                              : ""
                      }`
                    : "";
                
                callback({
                    text: MaxTokens(responseList, DEFAULT_MAX_WEB_SEARCH_TOKENS),
                });
            } else {
                elizaLogger.error("Search failed or returned no data");
            }
        } catch (error) {
            elizaLogger.error("Error in web search handler:", error);
        }
    },
    examples: webSearchExamples,
} as Action;