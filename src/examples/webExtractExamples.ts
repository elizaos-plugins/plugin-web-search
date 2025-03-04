/**
 * Examples of web extraction usage for the agent
 * These examples help the agent understand how to extract information from specific web pages
 */
export const webExtractExamples = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "What are the main features of the latest iPhone? Here's the page: https://www.apple.com/iphone/",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here are the main features of the latest iPhone that I extracted from the page:",
                action: "WEB_EXTRACT",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "I'm interested in the Tesla Model 3 specs. Can you look at this page and tell me about them? https://www.tesla.com/model3/specs",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here are the technical specifications of the Tesla Model 3 that I extracted:",
                action: "WEB_EXTRACT",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "I want to make this lasagna recipe. What ingredients do I need and what are the steps? https://www.allrecipes.com/recipe/24074/alysias-basic-meat-lasagna/",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here are the ingredients and steps from the lasagna recipe that I extracted:",
                action: "WEB_EXTRACT",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "I need to understand the main points of this scientific article for my research. Can you help? https://www.nature.com/articles/s41586-020-2649-2",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here are the main conclusions from the scientific article that I extracted:",
                action: "WEB_EXTRACT",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "I'm looking for events to attend this weekend. Can you check these sites and tell me what's happening? https://www.eventbrite.com/ and https://www.meetup.com/",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here's the information about upcoming events that I extracted from both sites:",
                action: "WEB_EXTRACT",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "I want to buy a PlayStation 5 but I'm not sure where to get it. Can you compare the prices on these sites? https://www.amazon.com/PlayStation-5-Console-CFI-1215A01X/dp/B0BCNKKZ91 and https://www.bestbuy.com/site/sony-playstation-5-console/6523167.p",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here's a comparison of PlayStation 5 prices from the websites you provided:",
                action: "WEB_EXTRACT",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What's the weather going to be like in New York for the next few days? Check this link: https://weather.com/weather/tenday/l/New+York+NY",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here's the weather forecast for New York that I extracted:",
                action: "WEB_EXTRACT",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "I'm trying to decide which programming language to learn. Can you help me understand the differences between Python and Java by looking at their docs? https://docs.python.org/3/ and https://docs.oracle.com/en/java/",
            },
        },
        {
            user: "{{agentName}}",
            content: {
                text: "Here are the main differences between Python and Java based on their documentation:",
                action: "WEB_EXTRACT",
            },
        },
    ],
];
