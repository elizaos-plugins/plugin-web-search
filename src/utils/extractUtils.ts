import { encodingForModel, type TiktokenModel } from "js-tiktoken";
import type { ExtractOptions, SuccessfulExtractResult, FailedExtractResult, ExtractResponse } from "../types";
import { elizaLogger } from "@elizaos/core";

export const DEFAULT_MAX_EXTRACT_TOKENS = 8000;
export const DEFAULT_MODEL_ENCODING = "gpt-3.5-turbo";

/**
 * Calculate the total number of tokens in a string
 */
export function getTotalTokensFromString(
    str: string,
    encodingName: TiktokenModel = DEFAULT_MODEL_ENCODING
) {
    const encoding = encodingForModel(encodingName);
    return encoding.encode(str).length;
}

/**
 * Limit a string to a maximum number of tokens
 */
export function MaxTokens(
    data: string,
    maxTokens: number = DEFAULT_MAX_EXTRACT_TOKENS
): string {
    if (getTotalTokensFromString(data) >= maxTokens) {
        return data.slice(0, maxTokens);
    }
    return data;
}

/**
 * Validate extracted URLs
 */
export function validateUrls(urls: string[]): string[] {
    if (!urls || !Array.isArray(urls)) {
        return [];
    }

    return urls.filter(url => {
        try {
            // Vérifier si l'URL est valide
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    });
}

/**
 * Validate extraction parameters
 */
export function isValidExtractParams(params: any): params is ExtractOptions {
    if (typeof params !== 'object' || params === null) {
        return false;
    }
    
    // Vérifier si l'objet a au moins une des propriétés attendues
    const hasExpectedProperties = 'includeImages' in params || 'extractDepth' in params || 'urls' in params;
    if (!hasExpectedProperties) {
        return false;
    }
    
    // Vérifier includeImages si présent
    if ('includeImages' in params) {
        // Accepter les booléens et les chaînes 'true'/'false'
        if (typeof params.includeImages !== 'boolean') {
            // Si c'est une chaîne, on accepte 'true' ou 'false'
            if (typeof params.includeImages === 'string') {
                const lowerValue = params.includeImages.toLowerCase();
                if (lowerValue !== 'true' && lowerValue !== 'false') {
                    return false;
                }
                // On accepte la chaîne, elle sera convertie plus tard
            } else {
                return false;
            }
        }
    }
    
    // Vérifier extractDepth si présent
    if ('extractDepth' in params) {
        if (typeof params.extractDepth !== 'string') {
            return false;
        }
        
        const validDepths = ['basic', 'advanced'];
        if (!validDepths.includes(params.extractDepth.toLowerCase())) {
            return false;
        }
    }
    
    // Vérifier urls si présent
    if ('urls' in params) {
        if (!Array.isArray(params.urls)) {
            return false;
        }
        
        // Vérifier que tous les éléments sont des chaînes
        if (params.urls.some(url => typeof url !== 'string')) {
            return false;
        }
    }
    
    return true;
}

/**
 * Formater le contenu extrait pour le rendre plus lisible
 */
export function formatExtractedContent(content: string): string {
    if (!content) return '';
    
    // Supprimer les espaces et sauts de ligne excessifs
    let formatted = content.replace(/\s+/g, ' ');
    
    // Limiter la taille du contenu
    return MaxTokens(formatted);
}

/**
 * Créer une réponse d'extraction vide
 */
export function createEmptyExtractResponse(): ExtractResponse {
    return {
        results: [],
        failed_results: [],
        response_time: 0
    };
}

/**
 * Fusionner plusieurs réponses d'extraction en une seule
 */
export function mergeExtractResponses(responses: ExtractResponse[]): ExtractResponse {
    if (!responses || responses.length === 0) {
        return createEmptyExtractResponse();
    }
    
    const merged: ExtractResponse = {
        results: [],
        failed_results: [],
        response_time: 0
    };
    
    for (const response of responses) {
        if (response.results) {
            merged.results = [...merged.results, ...response.results];
        }
        
        if (response.failed_results) {
            merged.failed_results = [...merged.failed_results, ...response.failed_results];
        }
        
        merged.response_time += response.response_time || 0;
    }
    
    return merged;
} 