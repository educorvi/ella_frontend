<template>
  <div>
    <!--    <h2>{{ service.title }}</h2>-->
    <!--    <p class="text-muted">{{service.description}}</p>-->
    <span v-html="service.text"/>
    <ActionButtonGroup v-if="service['formactions']" :save-button="false" :selected="selectFormaction" :service="service"
                       :stacked="true"/>
  </div>
</template>

<script>
import serviceMixin from "@/components/Services/serviceMixin";
import ActionButtonGroup from "@/components/Services/ActionButtonGroup"

/**
 * @module Page
 * @description A page that displays html and may contain redirect buttons at the bottom
 * @category Components
 * @subcategory Services
 */

export default {
  name: "Page",
  mixins: [serviceMixin],
  components: [ActionButtonGroup],
  methods: {
    selectFormaction(index) {
      if (this.service["formactions"][this.indexOfAction].method === "REDIRECT") {
        this.$router.push("/services/" + this.service["formactions"][index].name)
      }
    }
  },
}
</script>

<style scoped>

</style>
