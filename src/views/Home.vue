<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useApplicationStore } from '@/stores/store.ts';

const { data } = storeToRefs(useApplicationStore());
</script>

<template>
    <span v-html="data?.bodytext"></span>
</template>
