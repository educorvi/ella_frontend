<template>
  <b-navbar toggleable="true" id="navbar" :type="isLightColor?'light':'dark'" class="navbarCustom" variant="primary">
    <router-link to="/">
      <b-navbar-brand>
        <img v-if="img" id="logo" alt="Logo" src="@/assets/HeadLogo.png"/>
        <span v-if="mainData && txt" class="title-text">{{ mainData.title || title }}</span>
      </b-navbar-brand>
    </router-link>
    <b-navbar-nav class="ml-auto">
      <div id="menueicon" @click="$store.commit('sidebar', true)">
        <b-navbar-toggle target=""></b-navbar-toggle>
        <p>Menü</p>
      </div>

      <!--      <b-button id="sidebarbutton" class="float-right" variant="light" @click="$store.commit('sidebar', true)">-->
      <!--        <b-icon-justify/>-->
      <!--      </b-button>-->
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import {isLightColor} from "@/utilities/globals.mjs";
import {NAVBAR_STYLE, NAVBAR_VARIANTS, THEME_COLOR, TITLE} from "../../../config";
import {mapGetters} from "vuex";

/**
 * @module navigation/Navbar
 * @description The navbar
 * @category Components
 * @subcategory Navigation
 *
 * @vue-computed {boolean} img Should the image be shown
 * @vue-computed {boolean} txt Should the title be shown as text
 */
export default {
  name: "NavBarComp",
  computed: {
    isLightColor() {
      return isLightColor(THEME_COLOR);
    },
    img() {
      return NAVBAR_STYLE !== NAVBAR_VARIANTS.NAME;
    },
    txt() {
      return NAVBAR_STYLE !== NAVBAR_VARIANTS.LOGO;
    },
    title() {
      return TITLE;
    },
    ...mapGetters(["mainData"]),

  }
}
</script>

<style lang="scss" scoped>
.navbarCustom {
  box-shadow: 0 2px 1px rgba(0, 0, 0, 0.1);
}

#logo {
  height: 40px;
  margin-right: 25px;
}

#menueicon {
  display: flex;
  align-items: center;
  cursor: pointer;

  p {
    margin: 0;
    margin-left: -5px;
    display: none;
  }
}
</style>
