<template>
    <PrimeMultiSelect
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template
            v-for="(_, name) in $slots"
            #[name]="slotProps"
        >
            <slot :name="name" v-bind="slotProps || {}" />
        </template>
    </PrimeMultiSelect>
</template>

<script setup lang="ts">
import PrimeMultiSelect from 'primevue/multiselect'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

const theme = ref({
    root: `
        inline-flex relative
        p-fluid:w-full
        min-h-[42px]
        border border-surface-300 dark:border-surface-700
        rounded-md
        bg-surface-0 dark:bg-surface-950
        text-surface-900 dark:text-surface-0
        enabled:hover:border-surface-400 dark:enabled:hover:border-surface-600
        enabled:focus:border-primary
        transition-colors duration-200
        shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]
    `,

    labelContainer: `
        flex flex-auto overflow-hidden
    `,

    label: `
        flex items-center gap-1
        px-3 py-2
        overflow-hidden text-ellipsis whitespace-nowrap
        text-surface-700 dark:text-surface-200
    `,

    dropdown: `
        inline-flex items-center justify-center
        w-10
        text-surface-500
        rounded-r-md
        cursor-pointer
    `,

    overlay: `
        bg-surface-0 dark:bg-surface-900
        text-surface-900 dark:text-surface-0
        border border-surface-200 dark:border-surface-700
        rounded-md
        shadow-lg
        mt-1
        overflow-hidden
        z-[9999]
        min-w-[18rem]
    `,

    header: `
        flex items-center gap-2
        p-3
        border-b border-surface-200 dark:border-surface-700
    `,

    pcFilter: {
        root: `
            appearance-none rounded-md outline-hidden
            bg-surface-0 dark:bg-surface-950
            text-surface-900 dark:text-surface-0
            border border-surface-300 dark:border-surface-700
            enabled:focus:border-primary
            px-3 py-2
            w-full
        `
    },

    filterIcon: `
        hidden
    `,

    pcHeaderCheckbox: {
    root: `
        relative inline-flex items-center justify-center
        w-5 h-5
    `,
    input: `
    absolute
    inset-0
    opacity-0
    cursor-pointer
    z-10
`,
    box: `
        flex items-center justify-center
        w-5 h-5
        rounded
        border border-primary
        bg-surface-0
        text-transparent
        transition-colors duration-200
        p-checked:bg-primary
        p-checked:border-primary
        p-checked:text-primary-contrast
    `,
    icon: `
        text-xs
        text-primary-contrast
    `
},


    pcOptionCheckbox: {
    root: `
        relative inline-flex items-center justify-center
        w-5 h-5
    `,
    input: `
    absolute
    inset-0
    opacity-0
    cursor-pointer
    z-10
`,
    box: `
        flex items-center justify-center
        w-5 h-5
        rounded
        border border-primary
        bg-surface-0
        text-transparent
        transition-colors duration-200
        p-checked:bg-primary
        p-checked:border-primary
        p-checked:text-primary-contrast
    `,
    icon: `
        text-xs
        text-primary-contrast
    `
},

    listContainer: `
        max-h-56
        overflow-y-auto
    `,

    list: `
        py-1
    `,

    option: `
        flex items-center gap-3
        px-3 py-2
        cursor-pointer
        text-surface-700 dark:text-surface-100
        hover:bg-surface-100 dark:hover:bg-surface-800
        transition-colors duration-200
    `,

    optionLabel: `
        flex-1
    `,

    footer: `
        p-3
        border-t border-surface-200 dark:border-surface-700
        bg-surface-0 dark:bg-surface-900
    `
})
</script>

<style scoped>
:deep([data-pc-section="filtericon"]),
:deep([data-pc-section="filtericoncontainer"]) {
    display: none !important;
}

:deep([data-pc-name="checkbox"][data-p-checked="true"] [data-pc-section="box"]) {
    background: var(--p-primary-color);
    border-color: var(--p-primary-color);
    color: var(--p-primary-contrast-color);
}

:deep([data-pc-name="checkbox"][data-p-checked="false"] [data-pc-section="box"]) {
    background: white;
    border-color: var(--p-primary-color);
    color: transparent;
}
</style>