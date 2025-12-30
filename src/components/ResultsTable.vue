<template>
    <a-card>
      <a-table :data-source="data" :loading="loading" :pagination="pagination" row-key="id" @change="onChange">
        <a-table-column title="ID" dataIndex="id" key="id" />
        <a-table-column title="名称" dataIndex="name" key="name" />
        <a-table-column title="国家" dataIndex="country" key="country" />
        <a-table-column title="分类" dataIndex="category" key="category" />
        <a-table-column title="价格" dataIndex="price" key="price" />
        <a-table-column title="创建时间" dataIndex="createdAt" key="createdAt" />
        <a-table-column title="标签" dataIndex="tags" key="tags" :customRender="renderTags" />
      </a-table>
    </a-card>
  </template>
  
  <script>
  export default {
    name: 'ResultsTable',
    props: {
      data: Array,
      total: Number,
      loading: Boolean,
      page: Number,
      pageSize: Number
    },
    emits: ['change'],
    computed: {
      pagination() {
        return {
          current: this.page,
          pageSize: this.pageSize,
          total: this.total,
          showSizeChanger: true
        }
      }
    },
    methods: {
      onChange(pagination) {
        this.$emit('change', pagination)
      },
      renderTags(text) {
        if (!text) return ''
        return text.join(', ')
      }
    }
  }
  </script>