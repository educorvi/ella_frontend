import { defineStore } from 'pinia';
import type { Welcome } from '@/api-client';
import { type Ref, ref } from 'vue';

export const useApplicationStore = defineStore('application', () => {
    /**
     * The main application data
     */
    const data: Ref<Welcome | null> = ref(null);

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
