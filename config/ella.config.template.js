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
export const NAVBAR_VARIANTS = {

    /** Es wird nur das Logo angezeigt */
    LOGO: "logo",

    /** Es wird nur der Name der Ella-App angezeigt */
    NAME: "name",

    /** Es werden Logo und Name angezeigt */
    LOGO_AND_NAME: "logoAndName"
}


/**
 * Konfiguration
 */

/**
 * Die URL unter der die Wurzel der Ella API liegt
 * @type string
 */
export const API_ROOT_URL = "%API_ROOT_URL%";

/**
 * Die ID der Ella App
 * @type string
 */
export const INSTANCE_ID = "%INSTANCE_ID%";

/**
 * Der Titel der Anwendung.
 * Wird für die PWA und für die Tabübersicht des Browsers genutzt
 * @type string
 */
export const TITLE = "%TITLE%";

/**
 * Hauptfarbe der Anwendung, ersetzt unter anderem die Bootstraps $primary Variable
 * @type string
 */
export const THEME_COLOR = "%THEME_COLOR%"

/**
 * Wählt die Variante der Navigationsleiste.
 * @type {NAVBAR_VARIANTS}
 */
export const NAVBAR_STYLE = "%NAVBAR_STYLE%"

/**
 * Deaktiviert die Speichern und Laden Funktionalität für Formulare
 * @type {boolean}
 * @default false
 */
export const DISABLE_FORM_SAVING = DISABLE_FORM_SAVING_VALUE

/**
 * Der Titel der Sidebar. Wenn ein leerer String gewählt wird, wird der Titel aus Name und Beschreibung der Ella-App generiert
 * @type {string}
 */
export const SIDEBAR_TITLE = "%SIDEBAR_TITLE%"

/**
 * Die URL des Matomo-Analytics-Servers.
 * @type {string | undefined}
 */
export const MATOMO_HOST = "%MATOMO_HOST%";

/**
 * Die ID der Matomo-Analytics-Site.
 * @type {string | undefined}
 */
export const MATOMO_SITE_ID = "MATOMO_SITE_ID_VALUE";
