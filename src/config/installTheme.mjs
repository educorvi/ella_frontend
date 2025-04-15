import { selectReleaseAndInstall } from './createSettingsLib.mjs';
import {
    downloadTheme,
    downloadThemeRelease,
    initTheme,
    installTheme,
    updateTheme,
} from './installThemeLib.mjs';

(async () => {
    switch (process.argv[2]) {
        case 'install':
            downloadTheme(process.argv[3])
                .then(installTheme)
                .catch((err) => console.error(err.message));
            break;
        case 'select':
            if (process.argv[3]) {
                downloadThemeRelease('ef_theme-' + process.argv[3])
                    .catch((err) => {
                        console.error(err);
                        process.exit(-1);
                    })
                    .then(() => process.exit(0));
            } else {
                selectReleaseAndInstall()
                    .catch((err) => {
                        console.error(err);
                        process.exit(-1);
                    })
                    .then(() => process.exit(0));
            }
            break;
        case 'update':
            updateTheme();
            break;
        case 'init':
            initTheme();
            break;
        default:
            console.error('Specify an action');
    }
})();
