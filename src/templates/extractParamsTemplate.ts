/**
 * Template to extract URLs and options for web extraction.
 * This template is used by the LLM to analyze the query and extract:
 * 1. The URLs to extract content from
 * 2. Whether to include images (default: false)
 * 3. The extraction depth (basic or advanced, default: basic)
 */
export const extractParamsTemplate = `
Analyze the following message and extract these parameters:
1. The URLs to extract content from (up to 20 URLs)
2. Whether to include images (default: false)
3. The extraction depth (basic or advanced, default: basic)

Return a JSON object with these parameters. The JSON MUST be valid and properly formatted.

Example response:
\`\`\`json
{
    "urls": [
        "https://en.wikipedia.org/wiki/Artificial_intelligence",
        "https://en.wikipedia.org/wiki/Machine_learning"
    ],
    "includeImages": true,
    "extractDepth": "advanced"
}
\`\`\`

IMPORTANT FORMATTING RULES:
- "includeImages" MUST be a boolean value (true or false without quotes), NOT a string
- "extractDepth" MUST be a string ("basic" or "advanced" with quotes)
- "urls" MUST be an array of strings, even if empty

If no image preference is specified, set "includeImages" to false (without quotes).
If no extraction depth is specified, set "extractDepth" to "basic" (with quotes).

IMPORTANT CONTENT RULES:
- Extract ALL URLs mentioned in the message
- URLs must be valid and complete (starting with http:// or https://)
- Maximum 20 URLs can be processed at once
- Do not add URLs that weren't mentioned
- If a URL is incomplete (e.g., "wikipedia.org/wiki/Python"), add the appropriate prefix (e.g., "https://en.wikipedia.org/wiki/Python")

Here are some examples of how to interpret queries:
- "Extract content from https://en.wikipedia.org/wiki/Artificial_intelligence" → {"urls": ["https://en.wikipedia.org/wiki/Artificial_intelligence"], "includeImages": false, "extractDepth": "basic"}
- "Get information from these pages: https://example.com and https://example.org with images" → {"urls": ["https://example.com", "https://example.org"], "includeImages": true, "extractDepth": "basic"}
- "Extract detailed content from https://docs.python.org/3/" → {"urls": ["https://docs.python.org/3/"], "includeImages": false, "extractDepth": "advanced"}

Message to analyze: {{message}}

Extract the URLs and options from the message above. Respond ONLY with a valid JSON object, nothing else.
`; 