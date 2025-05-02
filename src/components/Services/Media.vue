<template>
    <div v-if="service.media">
        <div id="video-head" class="mb-3">
            <h2 class="mt-3">{{ service.title }}</h2>
            <!--      <b-checkbox>Untertitel anzeigen</b-checkbox>-->
            <p class="text-muted m-0">{{ service.description }}</p>
        </div>
        <span v-html="service.media?.textbefore" />
        <div v-if="service.media?.type === 'audio'">
            <div v-if="service.media?.playlist">
                <playlist-player :songs="service.media.mediafiles || []" />
            </div>
            <div v-else>
                <single-file-audio-player
                    v-for="(song, index) in service.media.mediafiles"
                    @play="pauseCurrent(index)"
                    :song="song"
                    ref="players"
                ></single-file-audio-player>
            </div>
        </div>
        <video-player
            v-else-if="service.media.type === 'video'"
            :videos="service.media.mediafiles || []"
        />
        <b-alert variant="danger" v-else> Unbekannter Medientyp</b-alert>
        <span v-html="service.media.textafter" />
    </div>
</template>

<script lang="ts" setup>
import SingleFileAudioPlayer from '../AV-Components/SingleFileAudioPlayer.vue';
import VideoPlayer from '../AV-Components/VideoPlayer.vue';
import PlaylistPlayer from '../AV-Components/PlaylistPlayer.vue';
import { onMounted, ref, type ShallowRef, useTemplateRef } from 'vue';
import type { ServiceDescription } from '@/api-client';

const props = defineProps<{
    service: ServiceDescription;
}>();

const players = useTemplateRef<typeof SingleFileAudioPlayer>('players');

const runningPlayer = ref<number | null>(null);
const pauseCurrent = (newIndex: number) => {
    console.log(players?.value?.[newIndex], newIndex, runningPlayer.value);
    if (runningPlayer.value !== null && runningPlayer.value !== newIndex) {
        // @TODO does not work!
        players?.value?.[newIndex].pause();
    }
    runningPlayer.value = newIndex;
};
</script>

<style lang="scss" scoped></style>
