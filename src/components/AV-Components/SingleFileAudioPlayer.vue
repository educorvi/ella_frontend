<template>
    <b-card class="m-3" no-body :class="error ? 'playerError' : ''">
        <b-card-img
            v-if="song.imageurl"
            :src="song.imageurl"
            :alt="song.imagecaption"
        ></b-card-img>
        <b-card-body>
            <div :id="player_id">
                <p style="font-size: large; font-weight: bold">
                    {{ song.title }}
                </p>
                <div class="audiocontrols">
                    <button
                        aria-label="Wiedergabebutton"
                        :aria-pressed="playing"
                        class="play-pause-button clickable"
                        style="background: transparent; border: none"
                    >
                        <IBiPlayCircle
                            @click="
                                () => {
                                    if (ready) wavesurfer?.play();
                                }
                            "
                            v-if="!playing"
                            class="mediaicon playcircle"
                            :variant="ready ? 'primary' : 'lightgrey'"
                            animation="pulse"
                        ></IBiPlayCircle>
                        <IBiPauseCircle
                            @click="pause"
                            v-else
                            class="mediaicon pausecircle"
                            :variant="ready ? 'primary' : 'lightgrey'"
                            animation="pulse"
                        ></IBiPauseCircle>
                    </button>
                    <div style="width: 85%">
                        <div class="two_layers" v-show="ready">
                            <div
                                class="layer1"
                                style="z-index: 100; background: transparent"
                            >
                                <input
                                    :aria-label="`Fortschrittseingabe für die Audiodatei ${song.title}`"
                                    :id="player_id + '_progressRange'"
                                    type="range"
                                    step=".1"
                                    value="0"
                                    style="
                                        height: 80px !important;
                                        width: 100%;
                                        padding: 0 !important;
                                    "
                                    @input="changeTime"
                                />
                            </div>
                            <div aria-hidden="true" class="layer2">
                                <div id="wf_container">
                                    <div
                                        :id="'waveform_' + player_id"
                                        style="height: 80px"
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <b-progress
                            :aria-label="`Ladefortschritt der Datei ${song.title}`"
                            :value="loaded"
                            :max="100"
                            animated
                            v-if="!ready"
                        ></b-progress>
                    </div>
                </div>
                <b-collapse class="audio_subtitle" v-model="playing">
                    <hr />
                    <p>{{ current_subtitle?.subtitle }}</p>
                </b-collapse>
            </div>
            <slot></slot>
        </b-card-body>
    </b-card>
</template>

<script lang="ts" setup>
import {
    ref,
    watch,
    onMounted,
    onBeforeUnmount,
    computed,
    type ComputedRef,
} from 'vue';
import WaveSurfer from 'wavesurfer.js';
import { getCSSVariable } from '@/lib/global';
import type { MediaFile } from '@/api-client';

const props = defineProps<{ song: MediaFile }>();

const emit = defineEmits<{
    (e: 'play'): void;
    (e: 'pause'): void;
    (e: 'finish'): void;
}>();

/* ------------------------------------------------------------------ */
/* 2.  Reactive state                                                 */
/* ------------------------------------------------------------------ */
const autoplay = ref(false);
const ready = ref(false);
const loaded = ref(0);
const wavesurfer = ref<WaveSurfer | null>(null);
const player_id = 'player_' + (Math.random() + 1).toString(36).substring(7);

interface SubtitleBlock {
    id: number;
    subtitle: string;
    startTime: number;
    stopTime: number;
}

const subtitles = ref<SubtitleBlock[] | null>(null);
const current_subtitle = ref<SubtitleBlock | null>(null);
const playing = ref(false);
const error = ref(false);

/* ------------------------------------------------------------------ */
/* 3.  Helpers                                                        */
/* ------------------------------------------------------------------ */
function toMilliseconds(time: string): number {
    const [h, m, rest] = time.split(':');
    const [s, ms] = rest.split(',');
    return ((+h * 60 + +m) * 60 + +s) * 1000 + +ms;
}

function parseSubtitles(transcript?: string): SubtitleBlock[] | null {
    if (!transcript) return null;
    return transcript.split('\n\n').map((block) => {
        const [id, times, subtitle] = block.split('\n');
        const [start, stop] = times.split(' --> ');
        return {
            id: +id,
            subtitle,
            startTime: toMilliseconds(start),
            stopTime: toMilliseconds(stop),
        };
    });
}

/* ------------------------------------------------------------------ */
/* 4.  Lifecycle: mount + unmount                                     */
/* ------------------------------------------------------------------ */
onMounted(() => {
    subtitles.value = parseSubtitles(props.song.transcript);

    wavesurfer.value = WaveSurfer.create({
        container: '#waveform_' + player_id,
        waveColor: 'lightgrey',
        progressColor: getCSSVariable('bs-primary'),
        interact: false,
        barWidth: 4,
        normalize: true,
        height: 80,
        cursorWidth: 0,
        backend: 'MediaElement',
    });

    wavesurfer.value.load(props.song.url);

    wavesurfer.value.on('loading', (p: number) => {
        loaded.value = p;
    });

    wavesurfer.value.on('ready', () => {
        ready.value = true;
        if (autoplay.value) wavesurfer.value?.play();
    });

    wavesurfer.value.on('play', () => {
        emit('play');
        playing.value = true;
        autoplay.value = true;
    });

    wavesurfer.value.on('pause', () => {
        emit('pause');
        playing.value = false;
        current_subtitle.value = null;
    });

    wavesurfer.value.on('finish', () => emit('finish'));

    wavesurfer.value.on('error', (e: unknown) => {
        console.error(e);
        Object.assign(error, { value: true });
        Object.assign(ready, { value: false });
        Object.assign(playing, { value: false });
        current_subtitle.value = {
            id: -1,
            subtitle:
                'Fehler beim Laden der Audiodatei. Bitte laden Sie die Seite neu.',
            startTime: 0,
            stopTime: 0,
        };
    });

    wavesurfer.value.on('audioprocess', (time: number) => {
        // range‑slider progress
        const range = document.getElementById(
            player_id + '_progressRange'
        ) as HTMLInputElement | null;

        if (range && wavesurfer.value) {
            range.value = (
                (time * 100) /
                wavesurfer.value.getDuration()
            ).toString();
        }

        // subtitle update
        if (subtitles.value && ready.value) {
            const next = subtitles.value.find((b) => b.stopTime > time * 1000);
            if (next) current_subtitle.value = next;
        }
    });
});

onBeforeUnmount(() => wavesurfer.value?.destroy());

/* ------------------------------------------------------------------ */
/* 5.  Component methods (template‑used)                              */
/* ------------------------------------------------------------------ */
function changeTime(evt: Event) {
    const target = evt.target as HTMLInputElement;
    wavesurfer.value?.seekTo(+target.value / 100);
}

function pause() {
    autoplay.value = false;
    wavesurfer.value?.pause();
}

defineExpose({ pause });

/* ------------------------------------------------------------------ */
/* 6.  React to song prop changes                                     */
/* ------------------------------------------------------------------ */
watch(
    () => props.song,
    (next) => {
        const progessSlider = document.getElementById(
            player_id + '_progressRange'
        ) as HTMLInputElement | null;
        if (progessSlider) {
            progessSlider.value = '0';
        }
        loaded.value = 0;
        ready.value = false;
        subtitles.value = parseSubtitles(next.transcript);
        wavesurfer.value?.load(next.url);
    }
);
</script>

<style lang="scss">
wave {
    canvas {
        max-width: unset;
    }
}
</style>

<style lang="scss" scoped>
@import '../../assets/main';

.playerError {
    border-color: red;

    .audio_subtitle {
        color: red;
        font-weight: bold;
    }
}

.audiocontrols {
    height: 85px;
    display: flex;
    width: 100%;
    align-items: center;
}

.audio_subtitle {
    width: 100%;
    text-align: center;

    p {
        margin: 0;
        //font-size: large;
    }
}

.mediaicon {
    width: 80%;
    height: auto;

    &[variant='lightgrey'] {
        color: lightgrey;
    }

    &[variant='primary'] {
        color: $primary;
    }
}

.play-pause-button {
    width: 15%;
    min-width: 80px;
    height: fit-content;
}

.two_layers {
    display: grid;

    .layer1,
    .layer2 {
        grid-column: 1;
        grid-row: 1;
    }
}

@mixin thumb() {
    box-shadow:
        1px 1px 1px #000000,
        0 0 1px #0d0d0d; /* Add cool effects to your sliders! */
    border: 1px solid #000000;
    height: 80px;
    width: 16px;
    @if ($enable-rounded) {
        border-radius: $border-radius;
    } @else {
        border-radius: 0;
    }

    background: #ffffff;
    cursor: pointer;
}

input[type='range'] {
    appearance: none;
    -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
    width: 100%; /* Specific width is required for Firefox. */
    background: transparent; /* Otherwise white in Chrome */
    margin: 0;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        //margin-top: -32px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
        @include thumb;
    }

    &::-moz-range-thumb {
        @include thumb;
    }

    &::-ms-thumb {
        @include thumb;
    }

    &:focus {
        outline-color: $primary;
    }

    &::-ms-track {
        width: 100%;
        cursor: pointer;

        /* Hides the slider so custom styles can be added */
        background: transparent;
        border-color: transparent;
        color: transparent;
    }
}
</style>
