<script setup lang="ts">
import { BOffcanvas } from 'bootstrap-vue-next';
import { storeToRefs } from 'pinia';
import { useApplicationStore } from '@/stores/store.ts';
import { SIDEBAR_TITLE } from '@/config/ella.config.ts';
import SidebarService from '@/components/nav/SidebarService.vue';
import CustomSpinner from '@/components/CustomSpinner.vue';

const { sidebar, data } = storeToRefs(useApplicationStore());
</script>

<template>
    <BOffcanvas v-model="sidebar" placement="end" id="sidebar">
        <template #header>
            <div
                style="
                    display: flex;
                    align-items: start;
                    justify-content: space-between;
                    width: 100%;
                "
            >
                <div>
                    <h6
                        v-if="SIDEBAR_TITLE"
                        style="font-weight: bold"
                        class="mb-0"
                    >
                        {{ SIDEBAR_TITLE }}
                    </h6>
                    <div v-else-if="data">
                        <h4 class="mb-1">{{ data.title }}</h4>
                        <p class="text-muted mb-0">{{ data.description }}</p>
                    </div>
                </div>
                <IBiX @click="sidebar = false" class="h4 clickable" />
            </div>
        </template>

        <div class="pt-2" v-if="data">
            <SidebarService
                v-for="(service, index) in data.services"
                :key="service.name"
                :service="service"
                :no-divider="index === (data.services?.length || 0) - 1"
            />
        </div>
        <custom-spinner v-else />
    </BOffcanvas>
</template>

<style lang="scss">
#sidebar {
    z-index: 20000;
}
</style>
