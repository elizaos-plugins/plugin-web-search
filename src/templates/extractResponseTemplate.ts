/**
 * Template pour formater la réponse d'extraction de contenu web.
 * Ce template est utilisé par le LLM pour présenter les résultats d'extraction
 * de manière claire et lisible.
 */
export const extractResponseTemplate = `
Format web content extraction results in a clear and readable way.

Here are the extraction results to format:
{{extractionResults}}

Response time: {{responseTime}} seconds

Formatting rules:
1. Present a concise summary of the content of each URL
2. Organize information in a structured and easy-to-read way
3. Highlight key points of the content
4. If images were found, mention it
5. If some URLs could not be extracted, explain why
6. Use a professional and informative tone

Respond with the formatted content, without adding an introduction or conclusion.
`; 