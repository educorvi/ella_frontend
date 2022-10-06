<template>
  <div>
    <div class="cust" v-bind:class="{active: isActive}">
      <b-row align-v="center" class="clickable" @click="action">
        <b-col cols="1">
          <div class="pl-2 sidebarSymbolParent">
            <div class="sidebarSymbol" v-if="service.type === 'group'" v-bind:class="{open: cVisible}"
                 style="width: min-content; height: min-content">
              <svg height="10" width="6" id="sidebar_triangle">
                <polygon points="0,10 0,0 6,5" class="triangle"/>
                -
              </svg>
            </div>
          </div>

        </b-col>
        <b-col>
          <div class="w-100" v-bind:class="{blend: isActive&&!isLightColor}">
            <h6 class="mb-0">{{ service.title }}</h6>
            <p class="text-muted mb-0" v-if="service.description">{{ service.description }}</p>
          </div>
        </b-col>
      </b-row>
      <b-collapse v-model="cVisible" v-if="service.type === 'group'" accordion="sidebar">
        <div>
          <side-bar-service v-for="(subService, index) in service['services']"
                            :key="subService.title" :service="subService"
                            :no-divider="index === service['services'].length-1"></side-bar-service>
        </div>
      </b-collapse>
    </div>
    <!--    <hr class="m-0" v-if="!noDivider">-->
  </div>
</template>

<script>
import {isLightColor} from "../../utilities/globals.mjs";
import {THEME_COLOR} from "../../../config";

/**
 * @module SidebarService
 * @description A single service for the sidebar
 * @category Components
 * @subcategory Navigation
 *
 * @vue-prop {Object} service The service for which a sidebar entry is wanted
 * @vue-prop {Boolean} noDivider Hide the divider at the end
 *
 * @vue-computed {Boolean} isActive Is this service currently visited by the user
 */
export default {
  name: "sideBarService",
  props: {
    service: {
      type: Object,
      required: true
    },
    //If set true, Divider won't be shown
    noDivider: {
      type: Boolean
    }
  },
  data() {
    return {
      cVisible: false
    }
  },
  computed: {
    isActive() {
      return this.$route.name === 'Service' && this.$route.params.service === this.service.name;
    },
    isLightColor() {
      return isLightColor(THEME_COLOR);
    }
  },
  methods: {
    action() {
      if (this.service.type === 'group') {
        this.cVisible = !this.cVisible;
      } else {
        this.$router.push('/services/' + this.service.name);
      }
    }
  },
  created() {
    this.cVisible = this.service['services']?.map(s => s.name).includes(this.$route.params.service) || false;
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles";

.cust {
  text-align: left;
  @if ($enable-rounded) {
    border-radius: $border-radius;
  }

  @extend .p-2;

  &.active {
  background-color: $primary;
}

  h6 {
    font-weight: bold;
  }
}

.blend {
  color: white;

  .text-muted {
    color: white !important;
  }
}

.triangle {
  fill: black;
}

.sidebarSymbol {
  @extend .mt-n1;
  &.open {
    transform: rotate(90deg);
  }

  transition: all 0.2s ease-in-out;
}
</style>
