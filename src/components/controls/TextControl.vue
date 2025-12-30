<template>
    <div>
      <label>{{ schema.label }}</label>
      <a-input v-model:value="localValue" :placeholder="schema.placeholder" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'TextControl',
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