<template>
    <div>
      <label>{{ schema.label }}</label>
      <a-select mode="multiple" v-model:value="localValue" style="width:100%">
        <a-select-option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
      </a-select>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  export default {
    name: 'MultiSelectControl',
    props: ['schema', 'modelValue'],
    emits: ['update:modelValue','option-fetch'],
    setup(props, { emit }) {
      const options = ref(props.schema.options || [])
      onMounted(async () => {
        if (props.schema.remote) {
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