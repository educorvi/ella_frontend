<template>
    <div class="m-2">
        <video id="video" class="video-js vjs-fluid" controls preload="auto">
            <p class="vjs-no-js">
                Bitte aktivieren Sie JavaScript in Ihrem Browser und/oder
                verwenden Sie einen Browser der
                <a
                    href="https://videojs.com/html5-video-support/"
                    target="_blank"
                    >HTML5 Videos unterstützt</a
                >
            </p>
        </video>
        <div v-if="videos.length > 1">
            <p style="font-size: large" class="mt-3 mb-1">
                <strong>Playlist</strong>
            </p>
            <b-button-group vertical class="w-100">
                <b-button
                    :pressed="currentIndex === index"
                    class="p-0 text-left"
                    variant="outline-primary"
                    v-for="(video, index) in videos"
                    @click="player?.playlist.currentItem(index)"
                    :key="'video' + index"
                >
                    <b-row>
                        <b-col cols="auto" class="pr-0">
                            <img
                                v-if="video.imageurl"
                                :src="video.imageurl"
                                style="
                                    width: 100px;
                                    height: 100%;
                                    object-fit: cover;
                                "
                                :alt="video.imagecaption"
                            />
                        </b-col>
                        <b-col>
                            <strong>{{ video.title }}</strong>
                            <p class="">{{ video.description }}</p>
                        </b-col>
                    </b-row>
                </b-button>
            </b-button-group>
        </div>
    </div>
</template>

<script lang="ts" setup>
import videojs from 'video.js';
import playlist from 'videojs-playlist';
import videoPlayerTranslation from '@/lib/videoPlayerTranslation.ts';
import 'video.js/src/css/video-js.scss';
import type { MediaContainer, MediaFile } from '@/api-client';
import { onMounted, type Ref, ref } from 'vue';
import type Player from 'video.js/dist/types/player';
const props = defineProps<{
    videos: MediaFile[];
}>();

const player = ref<any | null>(null);
const currentIndex = ref(0);

onMounted(() => {
    videojs.registerPlugin('playlist', playlist);
    videojs.addLanguage('de', videoPlayerTranslation);
    player.value = videojs('video', {
        language: 'de',
        playbackRates: [1, 1.5, 2],
    });
    player.value?.responsive(true);
    player.value?.playlist(
        props.videos.map((video) => {
            const retObj = {
                sources: [{ src: video.url }],
                poster: video.imageurl,
                textTracks: undefined as undefined | any[],
            };
            if (video.transcript) {
                retObj.textTracks = [
                    {
                        src: URL.createObjectURL(
                            new Blob([video.transcript], {
                                type: 'text/plain;charset=utf-8',
                            })
                        ),
                        kind: 'subtitles',
                        srclang: 'de',
                        label: 'Deutsch',
                    },
                ];
            }
            return retObj;
        })
    );
    player.value.on('playlistitem', () => {
        currentIndex.value = player.value?.playlist.currentItem();
    });
    player.value.playlist.autoadvance(2);
});
</script>

<style lang="scss">
#video {
    width: 100%;
}

.vjs-big-play-button {
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%);
}
</style>
