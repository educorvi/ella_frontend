import fs from 'fs';
import { initTheme } from './installThemeLib.mjs';
import termKit from 'terminal-kit';
import { configure } from './createSettingsLib.mjs';

const term = termKit.createTerminal();

const file = 'src/config/ella.config.ts';

(async () => {
    if (process.env.CI) {
        console.log('copy example settings...');
        fs.copyFileSync('src/config/ella.config.example.js', file);
        initTheme().then(() => process.exit(0));
    } else {
        if (process.argv[2] === '--override') {
            fs.unlinkSync(file);
            await configure(file);
        } else if (!fs.existsSync(file)) {
            term.inverse(
                'Es wurde kein config file gefunden! Konfiguration starten? [J|n]\n'
            );

            term.yesOrNo(
                { yes: ['j', 'ENTER', 'J'], no: ['n', 'N'] },
                async function (error, result) {
                    if (result) {
                        term('Die Konfiguration wird gestartet\n');
                        await configure(file);
                    } else {
                        term('Die Konfiguration wird übersprungen.\n');
                        term.red(
                            'Denken Sie daran, die config Datei wie im README beschrieben zu erstellen, da Ella sonst nicht funktionieren wird!\n'
                        );
                        process.exit(0);
                    }
                }
            );
        }
    }
})();
