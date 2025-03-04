/**
 * Template to extract search parameters from user query.
 * This template is used by the LLM to analyze the query and extract:
 * 1. The number of results desired (default: 1)
 * 2. The type of search (news or general, default: general)
 * 3. A reformulated search query for better results
 */
export const searchParamsTemplate = `
Analyze the following message and extract these parameters:
1. The number of results desired (default: 1)
2. The type of search (news or general, default: general)
3. A reformulated search query that will yield the best search results

Return a JSON object with these parameters:

Example response:
\`\`\`json
{
    "limit": 3,
    "type": "news",
    "query": "SpaceX recent rocket launches and achievements"
}
\`\`\`

If no number of results is specified, set "limit" to 1.
If no type is specified, set "type" to "general".
Always include a reformulated "query" that is clear, specific, and optimized for search engines.

IMPORTANT: Your reformulated query should:
- Stay faithful to the original request
- NOT add specific topics or technologies that weren't mentioned
- NOT assume specific use cases unless clearly stated
- Focus on the main subject of the query
- Be concise and clear

Here are some examples of how to interpret queries:
- "Find me 5 articles about AI" → limit: 5, type: "general", query: "artificial intelligence latest developments"
- "What are the latest news about SpaceX?" → limit: 1, type: "news", query: "SpaceX recent news"
- "Give me multiple sources about climate change" → limit: 5, type: "general", query: "climate change information"
- "Find detailed information about quantum computing" → limit: 3, type: "general", query: "quantum computing overview"
- "Show me recent developments in blockchain" → limit: 3, type: "news", query: "blockchain recent developments"
- "Can you look up information about Cursor?" → limit: 1, type: "general", query: "Cursor software information"

Message to analyze: {{message}}

Extract the search parameters from the message above. Reformulate the query for better search results. Respond with a JSON markdown block.
`; 