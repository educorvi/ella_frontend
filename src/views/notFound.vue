<template>
    <div class="text-center">
        <b-alert :model-value="true" variant="warning"
            >Die Seite konnte nicht gefunden werden.</b-alert
        >
        <router-link style="color: inherit" to="/"
            >Zurück zur Startseite
        </router-link>
    </div>
</template>

<script lang="ts" setup>
import { BAlert } from 'bootstrap-vue-next';
</script>

<style scoped></style>
