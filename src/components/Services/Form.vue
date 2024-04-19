<template>
  <div>
    <div id="formHead">
      <h2 class="mt-3">{{ service.title }}</h2>
      <p class="text-muted">{{ service.description }}</p>
      <div v-if="!DISABLE_FORM_SAVING">
        <b-button @click="loadForm">Gespeichertes Formular laden</b-button>
        <b-collapse v-model="upload">
          <div style="max-width: 100%; overflow: hidden" class="m-2">
            <b-file v-model="uploadFile" accept=".efa" browse-text="Durchsuchen" class="w-100"
                    drop-placeholder="Datei ablegen"
                    placeholder="Keine Datei ausgewählt" style="max-width: 100%;"
                    @input="loadForm"></b-file>
          </div>
        </b-collapse>
        <p v-if="wrong" class="text-danger">Diese Datei ist für einen anderen Fragebogen</p>
      </div>
      <hr>
    </div>
    <json-form v-if="form" :json="form" :onSubmit="onSubmit" :filledData="filledFormData" :ui="service.ui" :disableValidation="true">
      <div style="width: 100%; display: flex; justify-content: center">
        <ActionButtonGroup :doing="doing" :save-button="!DISABLE_FORM_SAVING"
                           :selected="selected" :service="service"
                           @submitModal="submitModal"/>
      </div>
    </json-form>
    <b-modal v-model="showPdfViewer" centered hide-footer size="xl" title="PDF Dokument">
      <template #modal-header>
        <div>
          <h5 class="mb-0">PDF Dokument</h5>
        </div>
        <b-button-close @click="showPdfViewer=false"></b-button-close>
      </template>
      <div id="viewerContent" class="m-n3">
        <iframe :src="'/pdf/web/viewer.html?file='+pdfData"
                allowfullscreen style="height:75vh; width: 100%; max-width: 100% !important;">
          This browser does not support PDF!
        </iframe>
      </div>
    </b-modal>
  </div>
</template>

<script>
import jsonForm from "@educorvi/vue-json-form"
import serviceMixin from "/src/components/Services/serviceMixin.js";
import axios from "axios";
import {fileOptions, normURLS} from "/src/utilities/globals.mjs";
import {API_ROOT_URL, DISABLE_FORM_SAVING, INSTANCE_ID} from "../../../config";
import {saveAs} from "file-saver";
import {mapGetters} from "vuex";
import ActionButtonGroup from "/src/components/Services/ActionButtonGroup.vue";

/**
 * @module Form
 * @description Renders a form and enables actions for that form
 * @category Components
 * @subcategory Services
 */

export default {
  name: "FormService",
  data() {
    return {
      indexOfAction: 0,
      doing: [],
      form: null,
      wrong: false,
      upload: false,
      uploadFile: null,
      filledFormData: null,
      showPdfViewer: false,
      pdfData: null
    }
  },
  mixins: [serviceMixin],
  components: {ActionButtonGroup, jsonForm},
  created() {
    // Set data in load as default in json schema to load files if there is a file loaded
    if (!this.load) {
      this.form = this.service.form;
    } else {
      this.fill(this.load);
    }
  },
  computed: {
    ...mapGetters(["load"]),
    DISABLE_FORM_SAVING() {
      return DISABLE_FORM_SAVING;
    },
  },
  methods: {
    /**
     * Executed when a formaction is pressed
     * @param index The index of the formaction
     */
    selected(index) {
      this.indexOfAction = index;
    },
    /**
     * Add the loaded data to json schema to load files
     * @param data parsed data
     */
    fill(data) {
      if (data.name !== this.service.name) {
        this.wrong = true;
        return;
      } else {
        this.wrong = false;
      }
      this.form = null;
      this.$nextTick().then(() => {
        let form = JSON.parse(JSON.stringify(this.service.form));
        this.filledFormData = data.data;
        this.$store.commit("load", null);
        this.form = form;
      });
    },
    /**
     * Loads and parses data from saved file
     * @param file The file to load
     */
    loadForm(file) {
      if (file instanceof File) {
        this.upload = false;
        file.text().then(contents => this.fill(JSON.parse(contents)));
        return;
      }

      async function load() {
        const fileHandle = await window.showOpenFilePicker(fileOptions);
        const file = await fileHandle[0].getFile();
        const contents = await file.text();
        this.fill(JSON.parse(contents));
      }

      if (window.showOpenFilePicker !== undefined) {
        load.call(this);
      } else {
        this.upload = true;
      }

    },

    /**
     * Send data to ellaroot
     * @param data The data
     * @param additional Additional data
     */
    sendData(data, additional) {

      /**
       * convert base64 encoded to data uri
       * @param {string} type mimetype of the data
       * @param {string} base64data the data
       * @returns {string}
       */
      function convertToBase64Link(type, base64data) {
        return `data:${type};base64,${encodeURIComponent(base64data)}`
      }

      /**
       * Make the browser download a file
       * @param contentType mimeType
       * @param base64Data data
       * @param fileName filename
       */
      function downloadBase64File(contentType, base64Data, fileName) {
        const linkSource = convertToBase64Link(contentType, base64Data);
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      }

      this.$set(this.doing, this.indexOfAction, true)
      //make request to server
      axios({
        method: this.service["formactions"][this.indexOfAction].method.toLowerCase(),
        url: normURLS(API_ROOT_URL) + '/' + INSTANCE_ID + "/" + this.service.name + "/" + this.service["formactions"][this.indexOfAction].name,
        data: {
          form: data,
          additional
        }
      }).then(res => {
        // interpret answer
        switch (res.data.type) {
          case 'email':
            window.location.href = `mailto:?subject=Formular%20teilen&body=${res.data.content}`;
            break;
          case 'share':
            // eslint-disable-next-line no-case-declarations
            const shareObject = {
              title: 'Formular teilen',
              text: res.data.content,
            };
            if (navigator.canShare && navigator.canShare(shareObject)) {
              navigator.share(shareObject)
                  .then(() => console.log('Share was successful.'))
                  .catch((error) => console.log('Sharing failed', error));
            } else {
              console.log(`Your system doesn't support sharing files.`);
              window.location.href = `mailto:?subject=Formular%20teilen&body=${res.data.content}`;
            }
            break;
          case 'link':
            window.location.href = res.data.content;
            break;

          case 'file':
            if (res.data.mimeType === "text/html") {
              this.$store.commit("customHTML", res.data.content);
              this.$router.push('/html');
            }
            if (res.data.mimeType === "application/pdf") {

              // create blob from base64
              const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
                const byteCharacters = atob(b64Data);
                const byteArrays = [];

                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                  const slice = byteCharacters.slice(offset, offset + sliceSize);

                  const byteNumbers = new Array(slice.length);
                  for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                  }

                  const byteArray = new Uint8Array(byteNumbers);
                  byteArrays.push(byteArray);
                }

                return new Blob(byteArrays, {type: contentType});
              };

              const blob = new Blob([b64toBlob(res.data.content)], {type: 'application/pdf'});

              // load pdf and open modal
              this.pdfData = URL.createObjectURL(blob);
              this.showPdfViewer = true;

            } else {
              downloadBase64File(res.data.mimeType, res.data.content, res.data.fileName);
            }

            break;
        }
      }).catch(err => {
        this.$bvToast.toast("Es gab einen Fehler beim Ausführen dieser Aktion! Bitte versuchen Sie es später erneut.", {
          title: "Fehler",
          variant: "danger"
        });
        console.error(err);
      }).finally(() => this.$set(this.doing, this.indexOfAction, false));
    },
    submitModal(modalData) {
      this.sendData(this.filledFormData, modalData);
    },
    /**
     * on form submit
     * @param data the form data
     */
    onSubmit(data) {
      const toSave = {data, name: this.service.name}
      this.filledFormData = data;

      //Funktion zum Speichern mit Filepicker
      async function save() {
        const handle = await window.showSaveFilePicker(fileOptions);
        const writable = await handle.createWritable();
        // Write the contents of the file to the stream.
        await writable.write(JSON.stringify(toSave));
        // Close the file and write the contents to disk.
        await writable.close();
      }



      const method = this.service["formactions"][this.indexOfAction]?.method;
      if (method === 'SAVE') {
        // Speichern
        if (window.showSaveFilePicker !== undefined) {
          save();
        } else {
          saveAs(new Blob([JSON.stringify(toSave)], {type: "application/efa"}), this.service.title.replace(/ /g, "_") + ".efa");
        }
      } else if (method === "REDIRECT") {
        //Redirect
        this.$router.push("/services/" + this.service["formactions"][this.indexOfAction].name);
      } else {
        //Button action
        if (this.service["formactions"][this.indexOfAction].additional || this.service["formactions"][this.indexOfAction]['modaltext']) {
          //Wenn Modal angezeigt werden soll, wird hier das Modal geöffnet
          this.$root.$bvModal.show('modal_' + this.service["formactions"][this.indexOfAction].name);
        } else {
          //Request an das Backend
          this.sendData(data);
        }
      }
    }


  }
}
</script>

<style lang="scss">
@import "../../styles";

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
