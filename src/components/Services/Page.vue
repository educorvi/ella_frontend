<template>
    <div>
        <span v-html="service.text" />
        <ActionButtonGroup
            v-if="service['formactions']"
            :save-button="false"
            :selected="selectFormaction"
            :service="service"
            :stacked="true"
        />
    </div>
</template>

<script lang="ts" setup>
import type { ServiceDescription } from '@/api-client';
import { useRouter } from 'vue-router';
import ActionButtonGroup from '@/components/Services/ActionButtonGroup.vue';

const props = defineProps<{
    service: ServiceDescription;
}>();

const router = useRouter();

function selectFormaction(index: number) {
    if (props.service.formactions?.[index]?.method === 'REDIRECT') {
        router.push('/services/' + props.service.formactions[index].name);
    }
}
</script>

<style scoped></style>
