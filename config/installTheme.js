const axios = require('axios');
const fs = require('fs');
const extract = require('extract-zip')
const mkdirp = require('mkdirp')
const copyfiles = require('copyfiles')
const rimraf = require('rimraf')
const cf = require("create-file")

function getAllThemes() {
    return new Promise((resolve, reject) => {
        axios.get('https://api.github.com/users/educorvi/repos?per_page=10000').then(res => {
            if (res.status !== 200) reject("Could not get themes")
            const themes = res.data.filter(t => t.name.match(/^ef_theme/));
            if (!themes.length) reject("No Themes Found")
            resolve(themes.map(t => {
                return {id: t.name, name: t.name.replace(/ef_theme-/, "")}
            }));
        }).catch(reject);
    });
}

function downloadThemeRelease(id) {
    return new Promise((resolve, reject) => {
        if(id === 'ef_theme-default') resolve();
        axios.get(`https://api.github.com/repos/educorvi/${id}/releases`).then(res => {
            if (res.status !== 200) reject("Could not get releases")
            const release = res.data[0];
            if (!release) reject("No release found");
            console.log(`Downloading ${release.tag_name} from ${release["zipball_url"]}`);
            downloadTheme(release["zipball_url"]).then(resolve).catch(reject);
        }).catch(reject);
    });
}

function downloadTheme(url) {
    return new Promise((resolve, reject) => {
        mkdirp.sync(process.cwd() + "/temp");
        const writer = fs.createWriteStream("temp/theme.zip");
        axios.get(url, {
            responseType: "stream"
        }).then(response => {
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) {
                    resolve(true);
                }
            });
        }).catch(reject);

    });
}

function installTheme() {
    return new Promise((resolve, reject) => {
        (async function () {
            console.log("unzipping...")
            await extract("temp/theme.zip", {dir: process.cwd() + "/temp"})
            console.log("copying files...")
            copyfiles(["temp/*-ef_theme-*/*", "src/theme/"], 2, err => {
                if (err) reject(err);
                console.log("cleaning up...")
                rimraf.sync('temp');
                resolve();
            });
        })();
    });
}

function initTheme() {
    cf('src/theme/theme.scss', '//Hier das Theme einfuegen\n', function (err) {
        if (err) {
            console.error(err);
            return -1;
        }
    });
    cf('src/theme/variables.scss', '//Hier die Variablen einfuegen\n', function (err) {
        if (err) {
            console.error(err);
            return -1;
        }
    });
}


function updateTheme() {
    const id = JSON.parse(fs.readFileSync("src/theme/theme.json")).id;
    console.log("delete old version...");
    rimraf.sync("src/theme/*");
    console.log("downloading new version...");
    downloadThemeRelease(id).then(installTheme).catch(err => console.error(err.message));
}

if (require.main === module) {
    switch (process.argv[2]) {
        case "install":
            downloadTheme(process.argv[3]).then(installTheme).catch(err => console.error(err.message));
            break;
        case "update":
            updateTheme();
            break;
        case "init":
            initTheme();
            break;
        default:
            console.error("Specify an action");
    }

}
module.exports = {getAllThemes, downloadThemeRelease, installTheme}