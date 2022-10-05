<template>
  <component :service="service" :is="component"/>
</template>

<script>
import {mapGetters} from "vuex";

/**
 * @module Service
 * @category Views
 * @description The Service view. Needs the service name as parameter in the url (/service/nameOfService).
 * @vue-computed {Object} component Determines the component needed for the given service
 * @vue-computed {Object} service Searches recursively (because of groups) for the service, whose name is given by the parameter
 */
export default {
  name: "Service",
  computed: {
    component() {
      if (!this.service) {
        return () => import("./notFound");
      }
      switch (this.service.type) {
        case 'page':
          return () => import(/* webpackChunkName: "Page" */ "../components/Services/Page");
        case 'service':
          return () => import(/* webpackChunkName: "Form" */ "../components/Services/Form");
        case 'group':
          return () => import(/* webpackChunkName: "Group" */ "../components/Services/Group");
        case 'audio':
          return () => import(/* webpackChunkName: "Group" */ "../components/Services/Audio");
        default:
          return () => import(/* webpackChunkName: "notFound" */ "./notFound");
      }
    },
    service() {
      function searchRecursively(searchIn, searchFor) {
        for (const s of searchIn.services) {
          if (s.name === searchFor) return s;
          if (s.type === 'group') {
            const r = searchRecursively(s, searchFor);
            if (r !== null) {
              return r;
            }
          }
        }
        return null;
      }

      return searchRecursively(this.mainData, this.$route.params.service);
    },
    ...mapGetters(["mainData"])
  },
}
</script>

<style scoped>

</style>
