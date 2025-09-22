<template>
    <div>
        <div id="formHead">
            <h2 class="mt-3">{{ service.title }}</h2>
            <p class="text-muted">{{ service.description }}</p>
            <!--            <div v-if="!DISABLE_FORM_SAVING">-->
            <!--                <BButton @click="loadForm"-->
            <!--                    >Gespeichertes Formular laden</BButton-->
            <!--                >-->
            <!--                <b-collapse v-model="upload">-->
            <!--                    <div style="max-width: 100%; overflow: hidden" class="m-2">-->
            <!--                        <b-file-->
            <!--                            v-model="uploadFile"-->
            <!--                            accept=".efa"-->
            <!--                            browse-text="Durchsuchen"-->
            <!--                            class="w-100"-->
            <!--                            drop-placeholder="Datei ablegen"-->
            <!--                            placeholder="Keine Datei ausgewählt"-->
            <!--                            style="max-width: 100%"-->
            <!--                            @input="loadForm"-->
            <!--                        ></b-file>-->
            <!--                    </div>-->
            <!--                </b-collapse>-->
            <!--                <p v-if="wrong" class="text-danger">-->
            <!--                    Diese Datei ist für einen anderen Fragebogen-->
            <!--                </p>-->
            <!--            </div>-->
            <hr />
        </div>
        <VueJsonForm
            v-if="service.form"
            :json-schema="service.form"
            :on-submit-form="onSubmit"
            :mapper-functions="mapperFunctions"
        >
        </VueJsonForm>
        <!--        <BModal-->
        <!--            v-model="showPdfViewer"-->
        <!--            centered-->
        <!--            hide-footer-->
        <!--            size="xl"-->
        <!--            title="PDF Dokument"-->
        <!--        >-->
        <!--            <template #modal-header>-->
        <!--                <div>-->
        <!--                    <h5 class="mb-0">PDF Dokument</h5>-->
        <!--                </div>-->
        <!--                <b-button-close @click="showPdfViewer = false"></b-button-close>-->
        <!--            </template>-->
        <!--            <div id="viewerContent" class="m-n3">-->
        <!--                <iframe-->
        <!--                    :src="'/pdf/web/viewer.html?file=' + pdfData"-->
        <!--                    allowfullscreen-->
        <!--                    style="-->
        <!--                        height: 75vh;-->
        <!--                        width: 100%;-->
        <!--                        max-width: 100% !important;-->
        <!--                    "-->
        <!--                >-->
        <!--                    This browser does not support PDF!-->
        <!--                </iframe>-->
        <!--            </div>-->
        <!--        </BModal>-->
    </div>
</template>

<script lang="ts" setup>
import {
    type Control,
    type CoreSchemaMetaSchema,
    type MapperFunction,
    type SubmitOptions,
    VueJsonForm,
} from '@educorvi/vue-json-form';
import { BModal } from 'bootstrap-vue-next';
import { DISABLE_FORM_SAVING } from '@/config/ella.config.ts';
import type { ServiceDescription } from '@/api-client';

const props = defineProps<{
    service: ServiceDescription;
}>();

async function onSubmit(
    data: Record<string, any>,
    submitOptions: SubmitOptions,
    evt: SubmitEvent
) {
    console.log(data);
}

const mapperFunctions: MapperFunction[] = [
    // (jsonElement: CoreSchemaMetaSchema, uiElement: Control) => {
    //     uiElement.scope = uiElement.scope.replace('#', '');
    //     return { jsonElement, uiElement };
    // },
];
</script>

<style lang="scss">
@import '../../assets/main';

iframe {
    width: 100%;
    height: 100%;
    border: 0;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
}

form > .container-fluid {
    padding: 0;
}
</style>
