import fs from "fs";
import dotenv from "dotenv";
import replace from "replace-in-file";
import {normURLS} from "./globals.mjs";

dotenv.config();

function throwError(property) {
    throw new Error(property + " must be defined!");
}
async function compile() {
    const file = './sw.js';
    await fs.copyFile('./src/utilities/sw.empty.js', file, (err => {
        if (err) {
            throw err;
        }
    }));
    const {VUE_APP_TITLE, API_ROOT_URL} = process.env;

    if (!VUE_APP_TITLE) throwError("VUE_APP_TITLE");
    await replace({files: file, from: /%TITLE%/g, to: VUE_APP_TITLE.toLowerCase()});
    if (!API_ROOT_URL) throwError("API_ROOT_URL");
    await replace({files: file, from: /%ROOT%/g, to: normURLS(API_ROOT_URL)})

}

compile();
