<template>
  <div :id="player_id">
    <h5>{{ song.title }}</h5>
    <div class="audiocontrols">
      <button class="play-pause-button paused clickable" @click="()=>wavesurfer.playPause()" style="background: transparent; border: none">
        <b-icon-play-circle class="mediaicon playcircle" :variant="ready?'primary':'lightgrey'"
                            animation="pulse"></b-icon-play-circle>
        <b-icon-pause-circle class="mediaicon pausecircle" variant="primary"
                             animation="pulse"></b-icon-pause-circle>
      </button>
      <div style="width: 85%">
        <div class="two_layers" v-show="loaded === 100">
          <div class="layer1" style="z-index: 100; background: transparent">
            <input :id="player_id+'_progressRange'" type="range" step=".1" value="0" style="height: 80px; width: 100%" @input="changeTime"/>
          </div>
          <div class="layer2">
            <div id="wf_container">
              <div id="waveform" style="height: 80px"></div>
            </div>
          </div>
        </div>
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
      responsive: true,
      interact: false,
      barWidth: 4,
      normalize: true,
      height: 80,
      cursorWidth: 0
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


    this.wavesurfer.on('audioprocess', (time) => {
      document.getElementById(this.player_id + '_progressRange').value = time*100 / this.wavesurfer.getDuration();
    });
  },
  methods: {
    changeTime(rangeInputEvent) {
      this.wavesurfer.seekTo(rangeInputEvent.target.value/100)
    },
  }
}
</script>

<style lang="scss">
wave {
  canvas {
    max-width: unset;
  }
}
</style>

<style lang="scss" scoped>
@import "src/styles";


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

.two_layers{
  display: grid;

  .layer1, .layer2{
    grid-column: 1;
    grid-row: 1;
  }
}

@mixin thumb(){
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
  border: 1px solid #000000;
  height: 70px;
  width: 16px;
  @if($enable-rounded){
    border-radius: $border-radius;
  }
  @else{
    border-radius: 0;
  }

  background: #ffffff;
  cursor: pointer;
}


input[type=range] {
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
    outline-color: $primary; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
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

