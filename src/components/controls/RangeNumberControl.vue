<template>
    <div>
      <label>{{ schema.label }}</label>
      <div style="display:flex; gap:8px">
        <a-input-number v-model:value="low" :placeholder="schema.placeholderLow" style="width:100%" />
        <span style="align-self:center">—</span>
        <a-input-number v-model:value="high" :placeholder="schema.placeholderHigh" style="width:100%" />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue'
  export default {
    name: 'RangeNumberControl',
    props: ['schema', 'modelValue'],
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const low = ref(props.modelValue?.[0] ?? null)
      const high = ref(props.modelValue?.[1] ?? null)
      watch([low, high], () => {
        emit('update:modelValue', [low.value, high.value])
      })
      return { low, high }
    }
  }
  </script>