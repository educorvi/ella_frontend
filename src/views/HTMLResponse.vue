<template>
    <span v-html="customHTML" />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useApplicationStore } from '@/stores/store.ts';

const { customHTML } = storeToRefs(useApplicationStore());
</script>

<style scoped></style>
