<template>
  <div>
    <div id="head" class="mb-3">
      <h2 class="mt-3">{{ service.title }}</h2>
      <!--      <b-checkbox>Untertitel anzeigen</b-checkbox>-->
      <p class="text-muted m-0">{{ service.description }}</p>
    </div>
    <span v-html="service.media.textbefore"/>
    <div v-if="service.media.type === 'audio'">
      <div v-if="service.media.playlist">
        <playlist-player :songs="service.media.mediafiles"/>
      </div>
      <div v-else>
        <div v-for="(song, index) in service.media.mediafiles" :key="index+'_'+song.name">
          <single-file-audio-player @play="pauseCurrent(index)" :song="song" :ref="'player'+index"></single-file-audio-player>
        </div>
      </div>
    </div>
    <video-player v-else-if="service.media.type === 'video'" :videos="service.media.mediafiles"/>
    <b-jumbotron bg-variant="danger" text-variant="light" lead="Unbekannter Medientyp" v-else>
    </b-jumbotron>
    <span v-html="service.media.textafter"/>

  </div>
</template>

<script>
import serviceMixin from "/src/components/Services/serviceMixin.js";
import SingleFileAudioPlayer from "/src/components/AV-Components/SingleFileAudioPlayer.vue";
import VideoPlayer from "/src/components/AV-Components/VideoPlayer.vue";
import PlaylistPlayer from "../AV-Components/PlaylistPlayer.vue";

export default {
  name: "MediaService",
  components: {PlaylistPlayer, VideoPlayer, SingleFileAudioPlayer},
  mixins: [serviceMixin],
  data() {
    return {
      runningPlayer: null
    }
  },
  methods: {
    pauseCurrent(newIndex) {
      if (this.runningPlayer !== null && this.runningPlayer !== newIndex) {
        this.$refs["player"+this.runningPlayer][0].pause();
      }
      this.runningPlayer = newIndex;
    },
  }
}
</script>

<style lang="scss" scoped>


</style>
