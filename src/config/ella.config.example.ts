/* eslint-disable */

/**
 * Einstellungen der Ella App
 * @module config
 */

/**
 * Enum der Auswahlmöglichkeiten für {@link NAVBAR_STYLE}
 * @enum {string}
 * @readonly
 */
export enum NAVBAR_VARIANTS {
    /** Es wird nur das Logo angezeigt */
    LOGO,

    /** Es wird nur der Name der Ella-App angezeigt */
    NAME,

    /** Es werden Logo und Name angezeigt */
    LOGO_AND_NAME,
}

/**
 * Konfiguration
 */

/**
 * Die URL unter der die Wurzel der Ella API liegt
 */
export const API_ROOT_URL: string = 'https://ella.uv-kooperation.de';

/**
 * Die ID der Ella App
 */
export const INSTANCE_ID: string = 'generictest';

/**
 * Der Titel der Anwendung.
 * Wird für die PWA und für die Tabübersicht des Browsers genutzt
 */
export const TITLE: string = 'Generic Test';

/**
 * Hauptfarbe der Anwendung, ersetzt unter anderem die Bootstraps $primary Variable
 */
export const THEME_COLOR: string = '#002d75';

/**
 * Wählt die Variante der Navigationsleiste.
 */
export const NAVBAR_STYLE: NAVBAR_VARIANTS = NAVBAR_VARIANTS.NAME;

/**
 * Deaktiviert die Speicher-/Ladefunktionalität für Formulare
 */
export const DISABLE_FORM_SAVING: boolean = false;

/**
 * Der Titel der Sidebar. Wenn ein leerer String gewählt wird, wird der Titel aus Name und Beschreibung der Ella-App generiert
 * @type {string}
 */
export const SIDEBAR_TITLE: string = '';

/**
 * Die URL des Matomo-Analytics-Servers.
 * @type {string | undefined}
 */
export const MATOMO_HOST: string | undefined = '';

/**
 * Die ID der Matomo-Analytics-Site.
 * @type {string | undefined}
 */
export const MATOMO_SITE_ID: string | undefined = '';
