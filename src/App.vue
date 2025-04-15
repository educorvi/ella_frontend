<template>
    <header>
        <ella-navbar />
    </header>
    <main class="p-2" id="content">
        <div class="main" v-if="store.data">
            <router-view />
        </div>
        <custom-spinner v-else></custom-spinner>
    </main>

    <Sidebar />
</template>
<script setup lang="ts">
import EllaNavbar from '@/components/nav/EllaNavbar.vue';
import Sidebar from '@/components/nav/Sidebar.vue';
import { useApplicationStore } from '@/stores/store.ts';
import CustomSpinner from '@/components/CustomSpinner.vue';
import { onMounted, watch } from 'vue';
import { readEllaRootEllaIdGet } from '@/api-client';
import { apiClient } from '@/lib/global.ts';
import { INSTANCE_ID, TITLE, THEME_COLOR } from '@/config/ella.config.ts';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const store = useApplicationStore();
const { sidebar } = storeToRefs(store);

onMounted(() => {
    readEllaRootEllaIdGet({
        client: apiClient,
        path: {
            ella_id: INSTANCE_ID,
        },
    }).then((res) => {
        store.data = res.data;
        document.title = TITLE;
        const metaThemeColor = document.querySelector('meta[name=theme-color]');
        metaThemeColor?.setAttribute('content', THEME_COLOR);
    });
});

const route = useRoute();

watch(
    () => route.fullPath,
    async () => {
        store.sidebar = false;
    }
);
</script>
<style scoped lang="scss">
#content {
    width: 100%;
    display: flex;
    justify-content: center;
}

.main {
    display: block;
}
</style>
