<template>
    <div>
        <div id="video-head" class="mb-3">
            <h2 class="mt-3">{{ service.title }}</h2>
            <!--      <b-checkbox>Untertitel anzeigen</b-checkbox>-->
            <p class="text-muted m-0">{{ service.description }}</p>
        </div>
        <span v-html="service.media?.textbefore" />
        <div v-if="service.media?.type === 'audio'">
            <div v-if="service.media?.playlist">
                <playlist-player :songs="service.media.mediafiles" />
            </div>
            <div v-else>
                <div
                    v-for="(song, index) in service.media.mediafiles"
                    :key="index + '_' + song.name"
                >
                    <single-file-audio-player
                        @play="pauseCurrent(index)"
                        :song="song"
                        :ref="'player' + index"
                    ></single-file-audio-player>
                </div>
            </div>
        </div>
        <video-player
            v-else-if="service.media.type === 'video'"
            :videos="service.media.mediafiles"
        />
        <b-alert variant="danger" v-else> Unbekannter Medientyp</b-alert>
        <span v-html="service.media.textafter" />
    </div>
</template>

<script lang="ts" setup>
import SingleFileAudioPlayer from '../AV-Components/SingleFileAudioPlayer.vue';
import VideoPlayer from '../AV-Components/VideoPlayer.vue';
import PlaylistPlayer from '../AV-Components/PlaylistPlayer.vue';
import { ref, useTemplateRef } from 'vue';
import type { ServiceDescription } from '@/api-client';

const props = defineProps<{
    service: ServiceDescription;
}>();

const runningPlayer = ref<number | null>(null);
const pauseCurrent = (newIndex: number) => {
    if (runningPlayer.value !== null && runningPlayer.value !== newIndex) {
        useTemplateRef('player' + runningPlayer.value).pause();
    }
    runningPlayer.value = newIndex;
};
</script>

<style lang="scss" scoped></style>
