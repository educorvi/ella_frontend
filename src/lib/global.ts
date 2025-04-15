/**
 * Modul mit Anwendungsweit verwendeten Methoden
 */

import { createClient, createConfig } from '@hey-api/client-axios';
import { API_ROOT_URL } from '@/config/ella.config.ts';

/**
 * Normalises an URL by removing a trailing slash
 * @param url The URL
 * @returns The normalised URL
 */
export function normURLS(url: string): string {
    return url.replace(/\/$/, '');
}

/**
 * Returns current value of css variable for the body
 * @example
 * let bootstrapPrimary = getCSSVariable('primary');
 * @param variable The variable
 * @returns The value of the variable
 */
export function getCSSVariable(variable: string): string {
    return getComputedStyle(document.body).getPropertyValue('--' + variable);
}

/**
 * Options for Efa-Files
 */
export const fileOptions: {
    types: Array<{
        description: string;
        accept: Record<string, string[]>;
    }>;
} = {
    types: [
        {
            description: '.efa Files',
            accept: {
                'application/efa': ['.efa'],
            },
        },
    ],
};

/**
 * Use to check if a color is light or dark
 * @param color The color
 * @returns Returns `true` if the color is light
 */
export function isLightColor(color: string): boolean {
    let r: number, g: number, b: number, hsp: number;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
        const match = color.match(
            /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
        );

        if (!match) return false; // fallback in case of invalid format

        r = parseInt(match[1], 10);
        g = parseInt(match[2], 10);
        b = parseInt(match[3], 10);
    } else {
        const hex = color.slice(1).replace(color.length < 5 && /./g, '$&$&');

        const parsed = parseInt(hex, 16);

        r = parsed >> 16;
        g = (parsed >> 8) & 255;
        b = parsed & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    return hsp > 127.5;
}

export const apiClient = createClient(
    createConfig({
        baseURL: API_ROOT_URL,
    })
);
