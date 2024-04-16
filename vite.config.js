import {defineConfig} from 'vite'
import vue from "@vitejs/plugin-vue2";
import {VitePWA} from "vite-plugin-pwa";
import {version} from "./package.json"
import {TITLE, THEME_COLOR, API_ROOT_URL} from "./config";

// https://vitejs.dev/config/
const commonConfig = {
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: THEME_COLOR ? '$primary: ' + THEME_COLOR + ";" : "",
            }
        }
    },
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: TITLE,
                short_name: TITLE,
                theme_color: THEME_COLOR,
                file_handlers: [
                    {
                        "action": "/#/",
                        "accept": {
                            "application/efa": [".efa"]
                        }
                    }
                ],
                icons: [
                    {
                        src: '/img/icons/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: '/img/icons/android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                runtimeCaching: [
                    {
                        // the last option is due to plone images ending on 'image'
                        urlPattern: new RegExp('.*(png|jpg|jpeg|image)'),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'image-cache',
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: new RegExp('.*(mp3|wav)'),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'audio-cache',
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: new RegExp('^' + API_ROOT_URL),
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'api-cache',
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        }
                    },
                ]
            }
        })]
}
export default defineConfig(({command}) => {
    if (command === "build") {
        commonConfig.define = {
            "ELLA_VERSION": version
        }
    }
    return commonConfig;
})
