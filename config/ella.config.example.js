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
export const API_ROOT_URL = "https://ella.uv-kooperation.de";

/**
 * Die ID der Ella App
 * @type string
 */
export const INSTANCE_ID = "generictest";

/**
 * Der Titel der Anwendung.
 * Wird für die PWA und für die Tabübersicht des Browsers genutzt
 * @type string
 */
export const TITLE = "Generic Test";

/**
 * Hauptfarbe der Anwendung, ersetzt unter anderem die Bootstraps $primary Variable
 * @type string
 */
export const THEME_COLOR = "#002d75"

/**
 * Wählt die Variante der Navigationsleiste.
 * @type {NAVBAR_VARIANTS}
 */
export const NAVBAR_STYLE = NAVBAR_VARIANTS.NAME

/**
 * Deaktiviert die Speichern und Laden Funktionalität für Formulare
 * @type {boolean}
 * @default false
 */
export const DISABLE_FORM_SAVING = false

/**
 * Der Titel der Sidebar. Wenn ein leerer String gewählt wird, wird der Titel aus Name und Beschreibung der Ella-App generiert
 * @type {string}
 */
export const SIDEBAR_TITLE = ""


