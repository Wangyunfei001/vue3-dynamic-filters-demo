# Vue3 动态筛选器 Demo

这是一个最小可运行的 demo：Vue 3 + Ant Design Vue 前端，Express mock server 后端；支持基于后端下发的 filter schema 动态渲染筛选器（文本模糊、多选、单选、范围、日期区间、标签、地理位置等），并带分页、模板保存等功能。

快速开始

1. 克隆或下载本项目到本地（或把下列文件保存到一个空目录）。
2. 安装依赖：

   ```bash
   npm install
   ```

3. 在一个终端启动 mock server：

   ```bash
   npm run server
   ```

   server 默认监听: <http://localhost:3000>
4. 在另一个终端启动前端：

   ```bash
   npm run dev
   ```

   前端默认 Vite 地址: <http://localhost:5173>

项目结构

- package.json
- vite.config.js
- index.html
- src/
  - main.js
  - App.vue
  - components/
    - DynamicFilters.vue
    - ResultsTable.vue
    - controls/
      - TextControl.vue
      - SelectControl.vue
      - MultiSelectControl.vue
      - RangeNumberControl.vue
      - DateRangeControl.vue
      - TagsControl.vue
      - GeoControl.vue
- server/
  - mockServer.js

说明与扩展建议

- filter schema 由后端 `/filters` 提供，options 可通过 `/options?field=xxx` 动态拉取。
- 搜索通过 `/search` 接口，后端示例已实现基本的过滤逻辑（字符串模糊、枚举、范围、日期、tag、geo）。
- 在生产环境：建议将模糊搜索交给全文检索（Elasticsearch / Meilisearch / PG full-text），地理过滤使用 DB 的 geo index（PostGIS / Mongo geonear / ES geo_distance）。
- 安全：后端需要严格校验和清洗过滤器输入，防止不合规的查询或注入风险。
