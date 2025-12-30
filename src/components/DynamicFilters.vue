<template>
    <a-card>
      <div style="display:flex; flex-direction:column; gap:12px">
        <div v-for="f in schema" :key="f.field">
          <component :is="renderControl(f)" :schema="f" v-model="values[f.field]" @option-fetch="fetchOptions"/>
        </div>
  
        <div style="display:flex; gap:8px; margin-top:8px">
          <a-button type="primary" @click="apply">应用</a-button>
          <a-button @click="reset">重置</a-button>
          <a-dropdown>
            <a-button>
              模板 <a-icon-down />
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item key="save" @click="saveTemplate">保存当前筛选为模板</a-menu-item>
              <a-menu-item key="load" @click="loadTemplate">加载模板</a-menu-item>
              <a-menu-item key="clear" @click="clearTemplates">清空模板</a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
    </a-card>
  </template>
  
  <script>
  import { ref, watch, defineComponent, toRaw } from 'vue'
  import debounce from 'lodash/debounce'
  import TextControl from './controls/TextControl.vue'
  import SelectControl from './controls/SelectControl.vue'
  import MultiSelectControl from './controls/MultiSelectControl.vue'
  import RangeNumberControl from './controls/RangeNumberControl.vue'
  import DateRangeControl from './controls/DateRangeControl.vue'
  import TagsControl from './controls/TagsControl.vue'
  import GeoControl from './controls/GeoControl.vue'
  import axios from 'axios'
  
  export default defineComponent({
    name: 'DynamicFilters',
    components: {
      TextControl,
      SelectControl,
      MultiSelectControl,
      RangeNumberControl,
      DateRangeControl,
      TagsControl,
      GeoControl
    },
    props: {
      filterSchema: {
        type: Array,
        default: () => []
      },
      loading: Boolean
    },
    emits: ['search', 'reset'],
    setup(props, { emit, expose }) {
      const schema = ref(props.filterSchema)
      const values = ref({})
  
      // initialize values based on schema
      function initValues() {
        schema.value = props.filterSchema || []
        values.value = {}
        for (const f of schema.value) {
          values.value[f.field] = f.default ?? null
        }
      }
      initValues()
  
      watch(() => props.filterSchema, initValues)
  
      // expose a method to get current values
      function getValues() {
        return toRaw(values.value)
      }
      expose({ getValues })
  
      const debouncedSearch = debounce(() => {
        emit('search', getValues())
      }, 500)
  
      // whenever values change, call debounced search for live behavior
      watch(values, () => {
        debouncedSearch()
      }, { deep: true })
  
      function apply() {
        emit('search', getValues())
      }
  
      function reset() {
        initValues()
        emit('reset')
      }
  
      function saveTemplate() {
        const name = prompt('模板名称')
        if (!name) return
        const store = JSON.parse(localStorage.getItem('filter_templates_v1') || '{}')
        store[name] = getValues()
        localStorage.setItem('filter_templates_v1', JSON.stringify(store))
        alert('已保存')
      }
  
      function loadTemplate() {
        const store = JSON.parse(localStorage.getItem('filter_templates_v1') || '{}')
        const names = Object.keys(store)
        if (!names.length) return alert('无模板')
        const name = prompt('输入要加载的模板名称:\n' + names.join('\n'))
        if (!name || !store[name]) return
        values.value = JSON.parse(JSON.stringify(store[name]))
        emit('search', getValues())
      }
  
      function clearTemplates() {
        if (confirm('清空所有模板？')) {
          localStorage.removeItem('filter_templates_v1')
          alert('已清空')
        }
      }
  
      async function fetchOptions(field) {
        const res = await axios.get(`http://localhost:3000/options?field=${encodeURIComponent(field)}`)
        return res.data
      }
  
      function renderControl(f) {
        // map schema type to component name
        const map = {
          text: 'TextControl',
          select: 'SelectControl',
          multi_select: 'MultiSelectControl',
          range_number: 'RangeNumberControl',
          date_range: 'DateRangeControl',
          tags: 'TagsControl',
          geo: 'GeoControl'
        }
        return map[f.type] || 'TextControl'
      }
  
      return {
        schema,
        values,
        apply,
        reset,
        saveTemplate,
        loadTemplate,
        clearTemplates,
        fetchOptions
      }
    }
  })
  </script>