<template>
    <div>
      <label>{{ schema.label }}</label>
      <a-select v-model:value="localValue" style="width:100%">
        <a-select-option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
      </a-select>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  export default {
    name: 'SelectControl',
    props: ['schema', 'modelValue'],
    emits: ['update:modelValue','option-fetch'],
    setup(props, { emit }) {
      const options = ref(props.schema.options || [])
      onMounted(async () => {
        if (props.schema.optionsEndpoint) {
          const res = await fetch(props.schema.optionsEndpoint)
          options.value = await res.json()
        } else if (props.schema.remote) {
          // parent listens to "option-fetch" and should return a Promise with data
          const data = await emit('option-fetch', props.schema.field)
          if (data) options.value = data
        }
      })
      return { options }
    },
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