import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';
import type { Welcome } from '@/api-client';

export const useApplicationStore = defineStore('application', () => {
    /**
     * The main application data
     */
    const data: Ref<Welcome | undefined> = ref(undefined);

    /**
     * Sidebar opened
     */
    const sidebar: Ref<boolean> = ref(false);

    /**
     * Is the page loading?
     */
    const loading: Ref<boolean> = ref(false);

    /**
     * If HTML is returned from a request and should be rendered it's saved here and the html route is opened
     */
    const customHTML: Ref<string> = ref('');

    return {
        data,
        sidebar,
        loading,
        customHTML,
    };
});
