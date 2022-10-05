<template>
  <div>
    <div id="head">
      <h2 class="mt-3">{{ service.title }}</h2>
      <p class="text-muted">{{ service.description }}</p>
    </div>
    <span v-html="service.media.textbefore"/>
    <div class="m-3 text-center">
      <!--      <img data-amplitude-song-info="cover_art_url" data-amplitude-main-song-info="true"/>-->
      <!--    <span data-amplitude-song-info="name" data-amplitude-main-song-info="true"></span>-->
      <!--    <progress class="amplitude-song-played-progress" data-amplitude-main-song-played-progress="true"-->
      <!--              id="song-played-progress"></progress>-->
      <div class="">

        <div class="meta-container" style="margin-bottom: 10px">
          <h5 style="margin: 0" data-amplitude-song-info="name" data-amplitude-main-song-info="true"
              class="song-name"></h5>
          <span data-amplitude-song-info="artist" data-amplitude-main-song-info="true"></span>
        </div>
        <b-row>
          <b-col cols="2">

          </b-col>
          <b-col>

          </b-col>
        </b-row>







        <div class="amplitude-play-pause" data-amplitude-main-play-pause="true"
             id="play-pause"></div>
        <div class="two_layers">
          <div class="layer1" style="z-index: 100; background: transparent; padding-top: 15px">
            <input type="range" class="amplitude-song-slider" step=".01" style="height: 80px; width: 100%"/>
          </div>
          <div class="layer2">
            <div id="wf_container">
              <div id="waveform" style="height: 80px"></div>
            </div>
          </div>
        </div>
        <div class="time-container" style="display: flex; padding-left: 5px; padding-right: 5px">
        <span class="current-time">
            <span class="amplitude-current-minutes" data-amplitude-main-current-minutes="true"></span>:<span
            class="amplitude-current-seconds" data-amplitude-main-current-seconds="true"></span>
        </span>
          <span class="duration" style="margin-left: auto">
            <span class="amplitude-duration-minutes" data-amplitude-main-duration-minutes="true"></span>:<span
              class="amplitude-duration-seconds" data-amplitude-main-duration-seconds="true"></span>
        </span>
        </div>

      </div>
    </div>
    <span v-html="service.media.textafter"/>

  </div>
</template>

<script>
import serviceMixin from "@/components/Services/serviceMixin";
import Amplitude from 'amplitudejs'
import WaveSurfer from 'wavesurfer.js'

export default {
  name: "Audio",
  mixins: [serviceMixin],
  mounted() {
    const songs = this.service.media.mediafiles.map(item => {
      return {
        name: item.title,
        url: item.url
      }
    });


    const wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: getComputedStyle(document.body).getPropertyValue("--primary"),
      // progressColor: getComputedStyle(document.body).getPropertyValue("--primary"),
      responsive: true,
      barWidth: 4,
      normalize: true,
      height: 80,
      interact: false,
      cursorWidth: 0
    });

    wavesurfer.on('ready', () => {
      document.getElementById("wf_container").classList.add("on");
    });

    wavesurfer.on('loading', () => {
      document.getElementById("wf_container").classList.remove("on");
    });

    Amplitude.init({
      songs,
      debug: true,
      callbacks: {
        song_change: function () {
          wavesurfer.load(Amplitude.getActiveSongMetadata().url)
        },
        initialized: function () {
          wavesurfer.load(Amplitude.getActiveSongMetadata().url)
        },
        timeupdate: function () {
          wavesurfer.seekTo(Amplitude.getSongPlayedPercentage() / 100 || 0);
        },
      }
    })
  }
}
</script>

<style lang="scss" scoped>

//#wf_container {
//  overflow: hidden;
//  position: relative;
//}
//
//#wf_container:before {
//  z-index: 1000;
//  position: absolute;
//  top: 0;
//  right: 0;
//  bottom: 0;
//  left: 0;
//  content: "";
//  transition: transform 1s ease-in-out;
//  background: white;
//  /*background: #eabe6e;*/
//}

//#wf_container.on:before {
//  transform: translateX(100%);
//}

//.two_layers {
//  display: grid;
//}
//
//.layer1, .layer2 {
//  grid-column: 1;
//  grid-row: 1;
//  width: 100%;
//}

div.amplitude-play-pause {
  width: 74px;
  height: 74px;
  cursor: pointer;
  margin: auto;
}

div.amplitude-play-pause.amplitude-paused {
  background: url('/img/icons/play.svg');
  background-size: cover;
}

div.amplitude-play-pause.amplitude-playing {
  background: url('/img/icons/pause.svg');
  background-size: cover;
}
</style>
