<template>
    <div>
      <label>{{ schema.label }}</label>
      <a-select mode="tags" v-model:value="localValue" style="width:100%" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'TagsControl',
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