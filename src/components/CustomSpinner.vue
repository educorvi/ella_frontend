<template>
    <div class="d-flex justify-content-center mt-3 mb-3">
        <b-spinner :variant="variant || 'primary'" label="Loading..." />
    </div>
</template>
<script lang="ts" setup>
import type { BaseColorVariant } from 'bootstrap-vue-next';

defineProps<{
    variant?: keyof BaseColorVariant;
}>();
</script>
