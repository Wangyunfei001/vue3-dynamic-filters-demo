<template>
    <div>
      <label>{{ schema.label }}</label>
      <div style="display:flex; gap:8px">
        <a-input-number v-model:value="lat" placeholder="纬度" style="width:33%" />
        <a-input-number v-model:value="lng" placeholder="经度" style="width:33%" />
        <a-input-number v-model:value="radius" placeholder="半径 (km)" style="width:33%" />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue'
  export default {
    name: 'GeoControl',
    props: ['schema', 'modelValue'],
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const lat = ref(props.modelValue?.lat ?? null)
      const lng = ref(props.modelValue?.lng ?? null)
      const radius = ref(props.modelValue?.radius ?? null)
      watch([lat, lng, radius], () => {
        emit('update:modelValue', { lat: lat.value, lng: lng.value, radius: radius.value })
      })
      return { lat, lng, radius }
    }
  }
  </script>