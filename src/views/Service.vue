<template>
    <component :service="service" :is="component" />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useApplicationStore } from '@/stores/store.ts';
import type { ServiceDescription } from '@/api-client';
import { hasServices } from '@/lib/types/types.ts';

function searchRecursively(
    searchIn: { services: ServiceDescription[] },
    searchFor: string
): ServiceDescription | null {
    for (const s of searchIn.services) {
        if (s.name === searchFor) return s;
        if (hasServices(s)) {
            const r = searchRecursively(s, searchFor);
            if (r !== null) {
                return r;
            }
        }
    }
    return null;
}

const route = useRoute();
const store = useApplicationStore();

const service = computed(() => {
    let serviceName = route.params.service;
    if (Array.isArray(serviceName)) {
        serviceName = serviceName[0];
    }
    if (!store.data || !hasServices(store.data)) return null;
    return searchRecursively(store.data, serviceName);
});

const component = computed(() => {
    if (!service.value) {
        return () => import('./notFound.vue');
    }
    switch (service.value.type) {
        case 'page':
            return defineAsyncComponent(
                () => import('../components/Services/Page.vue')
            );
        // case 'service':
        //     return () => import('../components/Services/Form.vue');
        case 'media':
            return defineAsyncComponent(
                () => import('../components/Services/Media.vue')
            );
        default:
            return defineAsyncComponent(() => import('./notFound.vue'));
    }
});
</script>

<style scoped></style>
