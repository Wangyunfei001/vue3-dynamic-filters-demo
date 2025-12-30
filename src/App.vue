<template>
    <a-layout style="min-height:100vh">
      <a-layout-header style="color:#fff; font-size:18px">
        Vue3 动态筛选器 Demo
      </a-layout-header>
      <a-layout-content style="padding:24px">
        <a-row :gutter="16">
          <a-col :span="8">
            <dynamic-filters
              :filter-schema="filterSchema"
              :loading="filtersLoading"
              @search="handleSearch"
              @reset="handleReset"
              ref="filterRef"
            />
          </a-col>
          <a-col :span="16">
            <results-table
              :data="results.data"
              :total="results.total"
              :loading="resultsLoading"
              :page="page"
              :pageSize="pageSize"
              @change="handleTableChange"
            />
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import DynamicFilters from './components/DynamicFilters.vue'
  import ResultsTable from './components/ResultsTable.vue'
  
  const filterSchema = ref([])
  const filtersLoading = ref(false)
  const results = ref({ data: [], total: 0 })
  const resultsLoading = ref(false)
  const page = ref(1)
  const pageSize = ref(10)
  const filterRef = ref(null)
  
  async function fetchFilterSchema() {
    filtersLoading.value = true
    try {
      const res = await axios.get('http://localhost:3000/filters')
      filterSchema.value = res.data
    } finally {
      filtersLoading.value = false
    }
  }
  
  async function doSearch(payload = {}) {
    // payload will include filters, page, pageSize, sort...
    resultsLoading.value = true
    try {
      const res = await axios.post('http://localhost:3000/search', payload)
      results.value = res.data
    } finally {
      resultsLoading.value = false
    }
  }
  
  function handleSearch(filterValues) {
    page.value = 1
    doSearch({ filters: filterValues, page: page.value, pageSize: pageSize.value })
  }
  
  function handleReset() {
    page.value = 1
    results.value = { data: [], total: 0 }
  }
  
  function handleTableChange(pagination) {
    page.value = pagination.current
    pageSize.value = pagination.pageSize
    // get current filters from child
    const currentFilters = filterRef.value?.getValues() || {}
    doSearch({ filters: currentFilters, page: page.value, pageSize: pageSize.value })
  }
  
  onMounted(async () => {
    await fetchFilterSchema()
    // initial empty search
    doSearch({ filters: {}, page: page.value, pageSize: pageSize.value })
  })
  </script>