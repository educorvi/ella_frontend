<template>
  <div id="root" class="box" v-touch:swipe="swipeHandler">
    <nav-bar-comp id="top" class="topbar"/>
    <div id="app" class="main" v-if="mainData && !mainData.error">
      <div>
        <router-view/>
      </div>
    </div>
    <div v-else-if="!(mainData && mainData.error)" class="hider">
      <custom-spinner class="mt-2"/>
    </div>
    <div class="mt-5 w-75" v-else>
      <b-jumbotron bg-variant="danger" :text-variant="textVariant">
        <template #header>Fehler!</template>
        <template #lead>Bitte versuchen Sie es später erneut!</template>
        ({{ mainData.error }})
      </b-jumbotron>
    </div>

    <sidebar/>
  </div>
</template>

<script>
import NavBarComp from "@/components/Navigation/NavBarComp";
import {mapGetters} from "vuex";
import CustomSpinner from "@/components/CustomSpinner";
import Sidebar from "@/components/Navigation/Sidebar";
import {TITLE, THEME_COLOR} from "../config"
import {isLightColor, getCSSVariable} from "@/utilities/globals.mjs";


/**
 * @module App
 * @description The App's entry point
 * @vue-computed {String} textVariant Determines, if text should be light or dark based on the 'danger' color
 */
export default {
  name: 'App',
  components: {
    Sidebar,
    CustomSpinner,
    NavBarComp
  },
  mounted() {
    /**
     * This is used to enable File handling of .efa Files
     * If the Browser supports file handling API, then, if a User opens the file, the PWA will open and the file(s) it was opened with will be queued into the launchqueue.
     * The following reads the first file, and loads it into the referred service.
     */
    if ('launchQueue' in window) {
      window.launchQueue.setConsumer((launchParams) => {
        // Nothing to do when the queue is empty.
        if (!launchParams.files.length) {
          return;
        }
        const fileHandle = launchParams.files[0];
        fileHandle.getFile().then(res => {
          res.text().then(text => {
            this.$store.commit("load", JSON.parse(text));
            this.$router.push("/services/" + JSON.parse(text).name);
          })
        });
      });
    }
  },
  created() {
    //Loads the data from the ella-backend and sets title + theme color
    this.$store.commit("getMainData");
    document.title = TITLE;
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    metaThemeColor.setAttribute("content", THEME_COLOR);
  },
  computed: {
    textVariant() {
      return isLightColor(getCSSVariable("danger")) ? 'dark' : 'light';
    },
    ...mapGetters(["mainData"])
  },
  methods: {
    /**
     * Handles swipe events to open and close the sidebar
     * @param {String} evt The Swipe-Event
     */
    swipeHandler(evt) {
      // Opens sidebar while using slider for audio, so commented out for now
      // if (evt === "left") {
      //   this.$store.commit('sidebar', true);
      // }
      if (evt === "right") {
        this.$store.commit('sidebar', false);
      }

    }
  }
}
</script>

<style lang="scss">
@import "styles";

.main, .topbar {
  width: 100%;
}

#top {
  position: sticky;
  left: 0;
  top: 0;
}

.box {
  display: flex;
  flex-flow: column;
  align-items: center;
}

.hider {
  width: 100vw;
}
</style>
