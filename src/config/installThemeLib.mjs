import axios from 'axios';
import fs from 'fs';
import extract from 'extract-zip';
import { mkdirp } from 'mkdirp';
import copyfiles from 'copyfiles';
import { rimraf } from 'rimraf';
import cf from 'create-file';
import termKit from 'terminal-kit';

function getAllThemes() {
    return new Promise((resolve, reject) => {
        axios
            .get('https://api.github.com/users/educorvi/repos?per_page=10000')
            .then((res) => {
                if (res.status !== 200) reject('Could not get themes');
                const themes = res.data.filter((t) =>
                    t.name.match(/^ef_theme/)
                );
                if (!themes.length) reject('No Themes Found');
                resolve(
                    themes.map((t) => {
                        return {
                            id: t.name,
                            name: t.name.replace(/ef_theme-/, ''),
                        };
                    })
                );
            })
            .catch(reject);
    });
}

function downloadThemeRelease(id) {
    return new Promise((resolve, reject) => {
        if (id === 'ef_theme-default') resolve(false);
        axios
            .get(`https://api.github.com/repos/educorvi/${id}/releases`)
            .then((res) => {
                if (res.status !== 200) reject('Could not get releases');
                const release = res.data[0];
                if (!release) reject('No release found');
                console.log(
                    `Downloading ${release.tag_name} from ${release['zipball_url']}`
                );
                downloadTheme(release['zipball_url'])
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
}

function downloadTheme(url) {
    return new Promise((resolve, reject) => {
        mkdirp.sync(process.cwd() + '/temp');
        const writer = fs.createWriteStream('temp/theme.zip');
        axios
            .get(url, {
                responseType: 'stream',
            })
            .then((response) => {
                response.data.pipe(writer);
                let error = null;
                writer.on('error', (err) => {
                    error = err;
                    writer.close();
                    reject(err);
                });
                writer.on('close', () => {
                    if (!error) {
                        resolve(true);
                    }
                });
            })
            .catch(reject);
    });
}

function installTheme() {
    return new Promise((resolve, reject) => {
        (async function () {
            console.log('unzipping...');
            await extract('temp/theme.zip', { dir: process.cwd() + '/temp' });
            console.log('copying files...');
            copyfiles(['temp/*-ef_theme-*/**/*', 'src/theme/'], 2, (err) => {
                if (err) reject(err);
                console.log('cleaning up...');
                rimraf.sync('temp');
                resolve();
            });
        })();
    });
}

function initTheme() {
    console.log('initializing theme');
    return Promise.all([
        new Promise((resolve, reject) => {
            cf(
                'src/theme/theme.scss',
                '//Hier das Theme einfuegen\n',
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('created theme.scss');
                        resolve();
                    }
                }
            );
        }),
        new Promise((resolve, reject) => {
            cf(
                'src/theme/variables.scss',
                '//Hier die Variablen einfuegen\n',
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('created variables.scss');
                        resolve();
                    }
                }
            );
        }),
    ]);
}

function updateTheme() {
    if (!fs.existsSync('src/theme/theme.json')) {
        console.log('No theme.json file found');
        return;
    }
    const id = JSON.parse(fs.readFileSync('src/theme/theme.json')).id;
    console.log('delete old version...');
    rimraf.sync('src/theme/*');
    console.log('downloading new version...');
    downloadThemeRelease(id)
        .then(installTheme)
        .catch((err) => console.error(err.message));
}

export {
    getAllThemes,
    downloadThemeRelease,
    installTheme,
    initTheme,
    downloadTheme,
    updateTheme,
};
