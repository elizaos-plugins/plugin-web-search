/**
 * Examples of web search usage for the agent
 * These examples help the agent understand how to use the web search action
 */
export const webSearchExamples = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Find the latest news about SpaceX launches.",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here is the latest news about SpaceX launches:",
                action: "WEB_SEARCH",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you find 3 details about the iPhone 16 release?",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here are the details I found about the iPhone 16 release:",
                action: "WEB_SEARCH",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What is the schedule for the next FIFA World Cup?",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here is the schedule for the next FIFA World Cup:",
                action: "WEB_SEARCH",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "Check the latest stock price of Tesla." },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here is the latest stock price of Tesla I found:",
                action: "WEB_SEARCH",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Find 5 trending movies in the US.",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here are the current trending movies in the US:",
                action: "WEB_SEARCH",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What is the latest score in the NBA finals?",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here is the latest score from the NBA finals:",
                action: "WEB_SEARCH",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: { text: "When is the next Apple keynote event?" },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here is the information about the next Apple keynote event:",
                action: "WEB_SEARCH",
            },
        },
    ],
]; 