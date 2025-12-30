<template>
    <div>
      <label>{{ schema.label }}</label>
      <!-- 使用 Ant Design Vue 的 RangePicker 风格；为简化示例直接使用 range -->
      <a-date-picker v-model:value="localValue" :picker="schema.picker || 'date'" :format="schema.format || 'YYYY-MM-DD'" range style="width:100%" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'DateRangeControl',
    props: ['schema', 'modelValue'],
    emits: ['update:modelValue'],
    computed: {
      localValue: {
        get() {
          return this.modelValue
        },
        set(v) {
          this.$emit('update:modelValue', v)
        }
      }
    }
  }
  </script>