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
export const API_ROOT_URL: string = '%API_ROOT_URL%';

/**
 * Die ID der Ella App
 */
export const INSTANCE_ID: string = '%INSTANCE_ID%';

/**
 * Der Titel der Anwendung.
 * Wird für die PWA und für die Tabübersicht des Browsers genutzt
 */
export const TITLE: string = '%TITLE%';

/**
 * Hauptfarbe der Anwendung, ersetzt unter anderem die Bootstraps $primary Variable
 */
export const THEME_COLOR: string = '%THEME_COLOR%';

/**
 * Wählt die Variante der Navigationsleiste.
 */
export const NAVBAR_STYLE: NAVBAR_VARIANTS = '%NAVBAR_STYLE%';

/**
 * Deaktiviert die Speicher-/Ladefunktionalität für Formulare
 */
export const DISABLE_FORM_SAVING: boolean = DISABLE_FORM_SAVING_VALUE;

/**
 * Der Titel der Sidebar. Wenn ein leerer String gewählt wird, wird der Titel aus Name und Beschreibung der Ella-App generiert
 * @type {string}
 */
export const SIDEBAR_TITLE: string = '%SIDEBAR_TITLE%';

/**
 * Die URL des Matomo-Analytics-Servers.
 * @type {string | undefined}
 */
export const MATOMO_HOST: string | undefined = '%MATOMO_HOST%';

/**
 * Die ID der Matomo-Analytics-Site.
 * @type {string | undefined}
 */
export const MATOMO_SITE_ID: string | undefined = 'MATOMO_SITE_ID_VALUE';
