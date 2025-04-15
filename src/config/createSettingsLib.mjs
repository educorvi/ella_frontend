import { replaceInFileSync as replace } from 'replace-in-file';
import fs from 'fs';
import termKit from 'terminal-kit';
import waitOn from 'wait-on';
import axios from 'axios';
import { rimraf } from 'rimraf';
import {
    downloadThemeRelease,
    getAllThemes,
    initTheme,
    installTheme,
} from './installThemeLib.mjs';

function normURLS(url) {
    return url.replace(/\/$/, '');
}

const term = termKit.createTerminal();

function selectReleaseAndInstall() {
    return new Promise((resolve, reject) => {
        term('\nWählen Sie ein Theme für die Anwendung\n');
        getAllThemes()
            .then((res) => {
                const themes = res.map((t) => t.name);
                themes.unshift('default');
                term.singleColumnMenu(themes, async function (error, response) {
                    // console.log(response);
                    rimraf.sync('src/theme/*');
                    if (
                        await downloadThemeRelease(
                            'ef_theme-' + response.selectedText
                        ).catch(reject)
                    )
                        await installTheme().catch(reject);
                    resolve();
                });
            })
            .catch(reject);
    });
}

export async function configure(file) {
    term.windowTitle('Configure Ella');
    const opts = { resources: [file] };

    term.dim('Datei wird kopiert...\n');
    fs.copyFileSync('src/config/ella.config.template.tts', file);

    let input;

    while (!input) {
        await waitOn(opts);
        term('\nBitte geben Sie die Root URL der API ein.\n');
        input = await term.inputField({ autoCompleteMenu: false }).promise;
        try {
            term.dim('\nWird überprüft... ');
            const res = await axios.get(input);
            if (res.status !== 200) {
                input = null;
            } else {
                term.green('Erfolg');
            }
        } catch (e) {
            input = null;
        }
        if (input === null) {
            term.red('\nSie haben eine ungültige URL angegeben\n');
        }
    }
    const url = input;
    replace({ files: file, from: /%API_ROOT_URL%/g, to: input });

    await waitOn(opts);
    input = null;
    while (!input) {
        term('\nBitte geben Sie die Instance ID der API ein.\n');
        input = await term.inputField({ autoCompleteMenu: false }).promise;
        try {
            term.dim('\nWird überprüft... ');
            const res = await axios.get(normURLS(url) + '/' + input);
            if (res.status !== 200) {
                input = null;
            } else {
                term.green('Erfolg');
            }
        } catch (e) {
            input = null;
        }
        if (input === null) {
            term.red(
                '\nDie angegebene Instanz konnte nicht aufgerufen werden\n'
            );
        }
    }

    replace({ files: file, from: /%INSTANCE_ID%/g, to: input });

    await waitOn(opts);
    term('\nBitte geben Sie den Titel der Anwendung ein. ');
    term.dim(
        ' (Wird für die PWA und für die Tabübersicht des Browsers genutzt)\n'
    );
    input = await term.inputField({ autoCompleteMenu: false }).promise;
    replace({ files: file, from: /%TITLE%/g, to: input });

    await waitOn(opts);
    term('\nBitte geben Sie die Theme Color in hexadezimaler Form ein.');
    term.dim(
        ' (Hauptfarbe der Anwendung, ersetzt unter anderem die Bootstraps $primary Variable. Bsp: #002d75)\n'
    );
    input = await term.inputField({ autoCompleteMenu: false }).promise;
    replace({ files: file, from: /%THEME_COLOR%/g, to: input });

    await waitOn(opts);
    term(
        '\nBitte geben Sie den Titel, der in der Sidebar angezeigt werden soll an. Leer lassen für einen generierten Titel.\n'
    );
    input = await term.inputField({ autoCompleteMenu: false }).promise;
    replace({ files: file, from: /%SIDEBAR_TITLE%/g, to: input });

    const items = [
        'Nur das Logo',
        'Nur der Name der Anwendung, abgerufen vom Backend',
        'Logo und Name',
    ];

    await waitOn(opts);
    term('\nWählen Sie die Variante der Navigationsleiste\n');
    let response = await term.singleColumnMenu(items).promise;
    switch (response.selectedIndex) {
        case 0:
            replace({
                files: file,
                from: /'%NAVBAR_STYLE%'/g,
                to: 'NAVBAR_VARIANTS.LOGO',
            });
            break;
        case 1:
            replace({
                files: file,
                from: /'%NAVBAR_STYLE%'/g,
                to: 'NAVBAR_VARIANTS.NAME',
            });
            break;
        case 2:
            replace({
                files: file,
                from: /'%NAVBAR_STYLE%'/g,
                to: 'NAVBAR_VARIANTS.LOGO_AND_NAME',
            });
            break;
    }

    await waitOn(opts);
    term('\nSoll die Speichern/Laden Funktion deaktiviert werden? [j|N]\n');
    let result = await term.yesOrNo({
        yes: ['j', 'J'],
        no: ['n', 'N', 'ENTER'],
    }).promise;
    if (result) {
        replace({ files: file, from: /DISABLE_FORM_SAVING_VALUE/g, to: true });
    } else {
        replace({ files: file, from: /DISABLE_FORM_SAVING_VALUE/g, to: false });
    }

    await waitOn(opts);
    term('\nBitte geben Sie die URL des Matomo-Analytics-Servers ein.\n');
    input = await term.inputField({ autoCompleteMenu: false }).promise;
    replace({ files: file, from: /%MATOMO_HOST%/g, to: input });

    // Prompt for Matomo Site ID
    await waitOn(opts);
    term('\nBitte geben Sie die ID der Matomo-Analytics-Site ein.\n');
    input = await term.inputField({ autoCompleteMenu: false }).promise;
    replace({ files: file, from: /MATOMO_SITE_ID_VALUE/g, to: input });

    await waitOn(opts);

    selectReleaseAndInstall()
        .then(() => process.exit(0))
        .catch(() => process.exit(-1));
}

export { selectReleaseAndInstall };
