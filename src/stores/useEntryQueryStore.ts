import { defineStore } from 'pinia'
import type { LocationQuery } from 'vue-router'

type QueryMap = Record<string, string>

function normalizeQuery(query: LocationQuery): QueryMap {
    const normalized: QueryMap = {}

    for (const [key, value] of Object.entries(query)) {
        if (value == null) continue
        normalized[key] = Array.isArray(value) ? String(value[0] ?? '') : String(value)
    }

    return normalized
}

export const useEntryQueryStore = defineStore('entryQuery', {
    state: () => ({
        query: {} as QueryMap,
    }),
    actions: {
        setFromRouteQuery(query: LocationQuery) {
            this.query = normalizeQuery(query)
        },
        setValue(key: string, value: string) {
            this.query[key] = value
        },
        clear() {
            this.query = {}
        },
    },
})
