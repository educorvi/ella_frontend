<template>
  <div>
    <single-file-audio-player :song="songs[playing]" ref="player" @finish="next">
      <hr>
      <b-button-group vertical class="w-100">
        <b-button v-for="(song, index) in songs" :key="`pl_${song.title}_${index}`" variant="outline-primary" :pressed="playing===index" @click="playing=index">
          {{song.title}}
        </b-button>
      </b-button-group>
    </single-file-audio-player>
  </div>
</template>

<script>
import SingleFileAudioPlayer from "./SingleFileAudioPlayer.vue";
export default {
  name: "PlaylistPlayer",
  components: {SingleFileAudioPlayer},
  props: {
    songs: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      playing: 0
    }
  },
  methods: {
    next() {
      if (this.playing === this.songs.length - 1) {
        this.$refs["player"][0].pause();
        this.playing = 0;
      } else {
        this.playing++;
      }
    },
  }
}
</script>

<style scoped>

</style>
