<template>
  <div class="w-100">
    <b-button-group :vertical="stacked" class="mb-5 mt-2 w-100">
      <b-button v-for="(action, index) in service['formactions']" :key="action.name" :disabled="doing[index]"
                :formnovalidate="action['method'] === 'SAVE'"
                :variant="action['cssclass']"
                type="submit" @click="selected(index)">
        <b-spinner v-if="doing[index]" class="m-0" style="width: 1.25rem; height: 1.25rem"/>
        <span v-else>{{ action.title }}</span></b-button>
      <!--      <b-button v-if="saveButton" type="submit" variant="primary" @click="selected('save')">Speichern</b-button>-->
    </b-button-group>

    <b-modal v-for="(action) in service['formactions']" :id="'modal_'+action.name" :key="'modal_'+action.name"
             hide-footer :title="action['modaltitle'] || 'Bitte zusätzliche Informationen angeben'">
      <p v-if="action['modaltext']">{{ action['modaltext'] }}</p>
      <json-form v-if="action.additional" :json="action.additional" :onSubmit="submitModal">
        <hr>
        <b-button-group class="w-100">
          <b-button @click="$bvModal.hide('modal_'+action.name)">Abbrechen</b-button>
          <b-button type="submit" variant="primary">Bestätigen</b-button>
        </b-button-group>
      </json-form>
    </b-modal>
  </div>
</template>
<script>
import jsonForm from "@educorvi/vue-json-form"

/**
 * @module ActionButtonGroup
 * @description Renders a Buttongroup depending on the formactions
 * @category Components
 * @subcategory Services
 *
 * @vue-prop {Object} service The service whose formactions need to be rendered
 * @vue-prop {Boolean} saveButton Should a save Button be rendered
 * @vue-prop {Function} save Function to be executed when the saveButton is pressed
 * @vue-prop {Array<Boolean>} doing An array of booleans indicating which actions are currently running and waiting for a response
 * @vue-prop {Function} selected A function that is executed when a button is pressed with the index of the pressed button as argument
 * @vue-prop {Boolean} stacked should the buttons be stacked
 */

export default {
  name: 'ActionButtonGroupService',
  components: {jsonForm},
  props: {
    service: {
      type: Object
    },
    saveButton: {
      type: Boolean
    },
    save: {
      type: Function
    },
    doing: {
      type: Array
    },
    selected: {
      type: Function
    },
    stacked: {
      type: Boolean
    }
  },
  methods: {
    submitModal(data) {
      this.$emit("submitModal", data);
      for (const action of this.service['formactions']) {
        this.$bvModal.hide('modal_' + action.name)
      }
    }
  },
}
</script>
