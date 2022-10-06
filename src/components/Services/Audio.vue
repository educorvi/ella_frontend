<template>
  <div>
    <div id="head">
      <h2 class="mt-3">{{ service.title }}</h2>
      <p class="text-muted">{{ service.description }}</p>
    </div>
    <span v-html="service.media.textbefore"/>
    <div v-for="(song, index) in service.media.mediafiles" :key="index+'_'+song.name">
      <b-card class="m-3">
        <single-file-audio-player :song="song"></single-file-audio-player>
      </b-card>
    </div>
    <span v-html="service.media.textafter"/>

  </div>
</template>

<script>
import serviceMixin from "@/components/Services/serviceMixin";
import SingleFileAudioPlayer from "@/components/AV-Components/SingleFileAudioPlayer";

export default {
  name: "Audio",
  components: {SingleFileAudioPlayer},
  mixins: [serviceMixin]
}
</script>

<style lang="scss" scoped>


</style>
