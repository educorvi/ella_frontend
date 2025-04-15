<template>
    <b-navbar
        :toggleable="true"
        id="navbar"
        v-b-color-mode="isLightColor ? 'light' : 'dark'"
        class="navbarCustom"
        variant="primary"
        sticky="top"
    >
        <b-navbar-brand to="/">
            <img
                v-if="showImage"
                id="logo"
                alt="Logo"
                src="/src/assets/HeadLogo.png"
            />
            <span v-if="store.data && showText" class="title-text">{{
                store.data.title || title
            }}</span>
        </b-navbar-brand>
        <b-navbar-nav class="ml-auto" id="sidebarButton">
            <b-button
                variant="primary"
                id="menueicon"
                @click="() => (store.sidebar = true)"
            >
                <IBiList />
                <p>Menü</p>
            </b-button>
        </b-navbar-nav>
    </b-navbar>
</template>

<script setup lang="ts">
import {
    NAVBAR_STYLE,
    NAVBAR_VARIANTS,
    THEME_COLOR,
    TITLE,
} from '@/config/ella.config.ts';
import { computed } from 'vue';
import { isLightColor as checkIfLightColor } from '@/lib/global.ts';
import { storeToRefs } from 'pinia';
import { useApplicationStore } from '@/stores/store.ts';
import { BButton } from 'bootstrap-vue-next';

const store = useApplicationStore();

let isLightColor = computed(() => {
    return checkIfLightColor(THEME_COLOR);
});

let showImage = computed(() => {
    return NAVBAR_STYLE !== NAVBAR_VARIANTS.NAME;
});
let showText = computed(() => {
    return NAVBAR_STYLE !== NAVBAR_VARIANTS.LOGO;
});
let title = computed(() => {
    return TITLE;
});
</script>

<style lang="scss" scoped>
//.navbarCustom {
//    box-shadow: 0 2px 1px rgba(0, 0, 0, 0.1);
//}
//
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
        //margin-left: -5px;
        //display: none;
    }
}
#sidebarButton {
    color: var(--bs-navbar-brand-color) !important;
}
</style>
