<template>
  <div :id="player_id">
    <h5>{{ song.title }}</h5>
    <div class="audiocontrols">
      <div :class="'play-pause-button paused '+(ready?'clickable':'')" @click="()=>wavesurfer.playPause()">
        <b-icon-play-circle class="mediaicon playcircle" :variant="ready?'primary':'lightgrey'"
                            animation="pulse"></b-icon-play-circle>
        <b-icon-pause-circle class="mediaicon pausecircle" variant="primary"
                             animation="pulse"></b-icon-pause-circle>
      </div>
      <div style="width: 85%">
        <div id="waveform" v-show="loaded === 100"></div>
        <b-progress :value="loaded" :max="100" animated v-if="loaded < 100"></b-progress>
      </div>
    </div>
  </div>
</template>

<script>
import WaveSurfer from "wavesurfer.js";
import {getCSSVariable} from "@/utilities/globals.mjs";

export default {
  name: "SingleFileAudioPlayer",
  props: {
    song: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ready: false,
      loaded: 0,
      wavesurfer: null,
      player_id: 'player_' + (Math.random() + 1).toString(36).substring(7)
    };
  },
  mounted() {
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: "lightgrey",
      progressColor: getCSSVariable("primary"),
      responsive: false,
      barWidth: 4,
      normalize: true,
      height: 80,
      cursorWidth: 3
    });
    this.wavesurfer.load(this.song.url);
    this.wavesurfer.on('loading', (p) => {
      this.loaded = p;
    });
    this.wavesurfer.on('ready', () => {
      this.ready = true;
    });

    const playPauseButton = document.getElementById(this.player_id).getElementsByClassName("play-pause-button")[0];
    this.wavesurfer.on('play', () => {
      playPauseButton.classList.remove("paused");
      playPauseButton.classList.add("playing");
    });
    this.wavesurfer.on('pause', () => {
      playPauseButton.classList.add("paused");
      playPauseButton.classList.remove("playing");
    });
  }
}
</script>

<style lang="scss">
wave {
  canvas {
    max-width: unset;
  }
}

.audiocontrols {
  height: 85px;
  display: flex;
  width: 100%;
  align-items: center
}

.mediaicon {
  width: 80%;
  height: auto;
}

.play-pause-button {
  width: 15%;
  min-width: 80px;
  height: fit-content;
}

.play-pause-button.paused {
  .pausecircle {
    display: none;
  }

  .playcircle {
    display: block;
  }
}

.play-pause-button.playing {
  .pausecircle {
    display: block;
  }

  .playcircle {
    display: none;
  }
}
</style>
