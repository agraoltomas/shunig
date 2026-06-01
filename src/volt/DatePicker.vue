<template>
    <PrimeDatePicker
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    />
</template>

<script setup lang="ts">
import PrimeDatePicker from 'primevue/datepicker'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

const inputBase = `
    appearance-none outline-hidden
    bg-surface-0 dark:bg-surface-950
    text-surface-900 dark:text-surface-0
    placeholder:text-surface-700 dark:placeholder:text-surface-400
    border border-surface-300 dark:border-surface-700
    enabled:hover:border-surface-400 dark:enabled:hover:border-surface-600
    enabled:focus:border-primary
    disabled:bg-surface-200 disabled:text-surface-800
    dark:disabled:bg-surface-600 dark:disabled:text-surface-400
    p-invalid:border-red-400 dark:p-invalid:border-red-300
    px-3 py-2 p-fluid:w-full
    rounded-l-md
    transition-colors duration-200
    shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]
`

const theme = ref({
    root: `
        inline-flex
        p-fluid:w-full
    `,

    pcInputText: {
        root: inputBase
    },

    input: inputBase,

    dropdown: `
        inline-flex cursor-pointer select-none items-center justify-center
    overflow-hidden relative
    px-3 py-2
    rounded-r-md
    disabled:pointer-events-none disabled:opacity-60
    transition-colors duration-200
    bg-primary
    enabled:hover:bg-primary-emphasis
    enabled:active:bg-primary-emphasis-alt
    text-primary-contrast
    border border-primary
    enabled:hover:border-primary-emphasis
    enabled:active:border-primary-emphasis-alt
    focus-visible:outline-1
    focus-visible:outline-offset-2
    focus-visible:outline-primary
    min-w-12
    `,

    panel: `
    bg-surface-0 dark:bg-surface-900
    text-surface-900 dark:text-surface-0
    border border-surface-200 dark:border-surface-700
    rounded-md
    shadow-lg
    p-0
    mt-1
    overflow-hidden
    z-[9999]
    w-80
    `,

    header: `
        flex items-center justify-between
        px-5 py-4
        border-b border-surface-200 dark:border-surface-700
    `,

    title: `
        flex items-center justify-center gap-2
        font-semibold
        text-surface-900 dark:text-surface-0
    `,

    table: `
        w-full table-fixed border-collapse
    `,

    tableHeaderCell: `
        text-center
        font-semibold
        text-surface-600 dark:text-surface-300
        py-2
    `,

    dayCell: `
        text-center
        p-1
    `,
    calendarcontainer: `
    flex justify-center
    px-4 py-3
`,
monthView: `
    grid grid-cols-3 gap-2
    px-4 py-4
`,

month: `
    inline-flex items-center justify-center
    h-10 rounded-md
    cursor-pointer
    text-surface-700 dark:text-surface-100
    hover:bg-surface-100 dark:hover:bg-surface-800
    transition-colors duration-200
`,

yearView: `
    grid grid-cols-2 gap-2
    px-4 py-4
`,

year: `
    inline-flex items-center justify-center
    h-10 rounded-md
    cursor-pointer
    text-surface-700 dark:text-surface-100
    hover:bg-surface-100 dark:hover:bg-surface-800
    transition-colors duration-200
`,

    day: `
        inline-flex items-center justify-center
        w-9 h-9
        rounded-full
        cursor-pointer
        text-surface-700 dark:text-surface-100
        hover:bg-surface-100 dark:hover:bg-surface-800
        transition-colors duration-200
    `
    
})
</script>

<style scoped>
:deep([data-pc-section="root"]) {
    width: 100%;
    position: relative;
}

:deep([data-pc-section="panel"]) {
    width: 20rem !important;
    min-width: 20rem !important;
    max-width: 20rem !important;
    line-height: 1.5;
    left: 50% !important;
    transform: translateX(-50%) !important;
}

:deep([data-pc-section="calendarcontainer"]) {
    padding: 0.75rem 1rem 1rem;
}

:deep([data-pc-section="table"]) {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

:deep([data-pc-section="tableheadercell"]),
:deep([data-pc-section="daycell"]) {
    width: 14.285%;
    text-align: center;
    vertical-align: middle;
}

:deep([data-pc-section="day"]) {
    margin: auto;
}

:deep([data-pc-section="day"][data-p-selected="true"]) {
    background: #16a34a;
    color: white;
}

:deep([data-pc-section="day"][data-p-today="true"]) {
    background: #e5e7eb;
}

:deep([data-pc-section="day"][data-p-other-month="true"]) {
    color: #9ca3af;
}

:deep([data-pc-section="previousbutton"]),
:deep([data-pc-section="nextbutton"]) {
    width: 2rem;
    height: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    color: #6b7280;
}

:deep([data-pc-section="previousbutton"]:hover),
:deep([data-pc-section="nextbutton"]:hover) {
    background: #f3f4f6;
}

:deep(input) {
    min-height: 42px;
}

:deep(button) {
    min-height: 42px;
}
:deep([data-pc-section="month"][data-p-selected="true"]),
:deep([data-pc-section="year"][data-p-selected="true"]) {
    background: var(--p-primary-color);
    color: var(--p-primary-contrast-color);
}

:deep([data-pc-section="month"]),
:deep([data-pc-section="year"]) {
    margin: auto;
}
</style>