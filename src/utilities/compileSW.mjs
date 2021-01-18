import fs from "fs";
import dotenv from "dotenv";
import replace from "replace-in-file";
import {normURLS} from "./globals.mjs";
import packageJson from "../../package.json";
import waitOn from "wait-on"

const opts = {resources: ["service-worker.js"]};

dotenv.config();

function throwError(property) {
    throw new Error(property + " must be defined!");
}

async function compile() {
    const file = './service-worker.js';
    await fs.copyFile('./src/utilities/sw.empty.js', file, (err => {
        if (err) {
            throw err;
        }
    }));
    const {VUE_APP_TITLE, VUE_APP_API_ROOT_URL} = process.env;

    await waitOn(opts);
    if (!VUE_APP_TITLE) throwError("VUE_APP_TITLE");
    await replace({files: file, from: /%TITLE%/g, to: VUE_APP_TITLE.toLowerCase().replace(/ /g, "_")});

    await waitOn(opts);
    if (!VUE_APP_API_ROOT_URL) throwError("VUE_APP_API_ROOT_URL");
    await replace({files: file, from: /%ROOT%/g, to: normURLS(VUE_APP_API_ROOT_URL)})


    await waitOn(opts);
    await replace({files: file, from: /%VERSION%/g, to: packageJson.version})

}

compile();
