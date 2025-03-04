import { 
    type Action, 
    type IAgentRuntime, 
    type Memory, 
    type State, 
    type HandlerCallback,
    elizaLogger,
    composeContext,
    generateObjectDeprecated,
    generateText,
    ModelClass
} from "@elizaos/core";
import { isValidExtractParams, validateUrls, formatExtractedContent, MaxTokens } from "../utils/extractUtils";
import { extractParamsTemplate } from "../templates/extractParamsTemplate";
import { extractResponseTemplate } from "../templates/extractResponseTemplate";
import { webExtractExamples } from "../examples/webExtractExamples";
import { WebExtractService } from "../services/webExtractService";
import type { SuccessfulExtractResult, FailedExtractResult } from "../types";

export const webExtract: Action = {
    name: "WEB_EXTRACT",
    similes: [
        "EXTRACT_FROM_WEB",
        "EXTRACT_FROM_URL",
        "EXTRACT_FROM_PAGE",
        "EXTRACT_FROM_HTML",
        "EXTRACT_FROM_WEB_PAGE",
        "LOOKUP_URL",
        "LOOKUP_WEB_PAGE",
        "LOOKUP_WEB_URL",
        "LOOKUP_WEB_PAGE_URL",
        "WEB_EXTRACT_INFORMATION",
        "WEB_EXTRACT_FROM_URL",
        "WEB_EXTRACT_FROM_PAGE",
        "URL_EXTRACT",
    ],
    suppressInitialMessage: true,
    description: "Perform a web urls information extraction",
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
        state = (await runtime.composeState(message)) as State;

        try {
            // Utiliser le template pour extraire les URLs et les options
            const extractParamsContext = composeContext({
                state: {
                    ...state,
                    message: message.content.text
                },
                template: extractParamsTemplate
            });

            const extractParams = await generateObjectDeprecated({
                runtime,
                context: extractParamsContext,
                modelClass: ModelClass.SMALL,
            });
            
            // Corriger les paramètres si nécessaire
            if (extractParams) {
                // Corriger includeImages si c'est une chaîne
                if (typeof extractParams.includeImages === 'string') {
                    const lowerValue = String(extractParams.includeImages).toLowerCase();
                    if (lowerValue === 'true') {
                        extractParams.includeImages = true;
                    } else if (lowerValue === 'false') {
                        extractParams.includeImages = false;
                    } else {
                        extractParams.includeImages = false; // Valeur par défaut
                    }
                } else if (extractParams.includeImages === undefined) {
                    extractParams.includeImages = false; // Valeur par défaut
                }
                
                // Corriger extractDepth si nécessaire
                if (typeof extractParams.extractDepth === 'string') {
                    const lowerValue = extractParams.extractDepth.toLowerCase();
                    if (lowerValue === 'basic' || lowerValue === 'advanced') {
                        extractParams.extractDepth = lowerValue as "basic" | "advanced";
                    } else {
                        extractParams.extractDepth = "basic";
                    }
                } else if (extractParams.extractDepth === undefined) {
                    extractParams.extractDepth = "basic"; // Valeur par défaut
                }
                
                // S'assurer que urls est un tableau
                if (!Array.isArray(extractParams.urls)) {
                    extractParams.urls = [];
                }
            }

            // Valider les paramètres d'extraction
            const isParamsValid = isValidExtractParams(extractParams);
            
            // Valider les URLs extraites par le template
            const urls = validateUrls(extractParams.urls || []);
            
            if (urls.length === 0) {
                callback({
                    text: "Je n'ai pas trouvé d'URLs valides dans votre message. Veuillez fournir des URLs valides commençant par http:// ou https://."
                });
                return;
            }

            const webExtractService = new WebExtractService();
            await webExtractService.initialize(runtime);
            
            const extractOptions = isParamsValid ? {
                includeImages: extractParams.includeImages !== undefined ? extractParams.includeImages : false,
                extractDepth: (extractParams.extractDepth as "basic" | "advanced") || "basic"
            } : {
                includeImages: false,
                extractDepth: "basic" as const
            };

            const extractResponse = await webExtractService.extract(urls, extractOptions);
            
            if (extractResponse && extractResponse.results.length) {
                // Préparer les données pour le template de formatage
                let extractionResultsText = "";
                
                // Ajouter les résultats réussis
                extractResponse.results.forEach((result: SuccessfulExtractResult, index: number) => {
                    extractionResultsText += `URL ${index + 1}: ${result.url}\n`;
                    extractionResultsText += `Contenu: ${result.raw_content}\n`;
                    
                    // Ajouter les images si disponibles
                    if (result.images && result.images.length > 0) {
                        extractionResultsText += `Images: ${result.images.length} image(s) trouvée(s)\n`;
                    }
                    
                    extractionResultsText += "\n---\n\n";
                });
                
                // Ajouter les résultats échoués
                if (extractResponse.failed_results && extractResponse.failed_results.length > 0) {
                    extractionResultsText += "URLs non extraites:\n";
                    
                    extractResponse.failed_results.forEach((result: FailedExtractResult, index: number) => {
                        extractionResultsText += `URL ${index + 1}: ${result.url} - Erreur: ${result.error}\n`;
                    });
                    
                    extractionResultsText += "\n---\n\n";
                }
                
                // Utiliser le template pour formater la réponse
                const responseContext = composeContext({
                    state: {
                        ...state,
                        extractionResults: extractionResultsText,
                        responseTime: extractResponse.response_time
                    },
                    template: extractResponseTemplate
                });
                
                const formattedResponse = await generateText({
                    runtime,
                    context: responseContext,
                    modelClass: ModelClass.MEDIUM,
                });
                
                callback({
                    text: formattedResponse
                });
            } else {
                callback({
                    text: "Je n'ai pas pu extraire le contenu des URLs fournies. Veuillez vérifier que les URLs sont accessibles et réessayer."
                });
            }
        } catch (error) {
            elizaLogger.error("Error in web extract handler:", error);
            callback({
                text: `Une erreur s'est produite lors de l'extraction des URLs: ${error.message || "Erreur inconnue"}`
            });
        }
    },
    examples: webExtractExamples
} as Action;