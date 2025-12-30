const express = require('express')
const cors = require('cors')
const { faker } = require('@faker-js/faker')
const app = express()
app.use(cors())
app.use(express.json())

// Simple mock filter schema
app.get('/filters', (req, res) => {
  res.json([
    { field: 'q', label: '关键词', type: 'text', placeholder: '名称/描述 模糊搜索' },
    { field: 'country', label: '国家', type: 'select', remote: true },
    { field: 'category', label: '分类', type: 'multi_select', remote: true },
    { field: 'price', label: '价格区间', type: 'range_number' },
    { field: 'createdAt', label: '创建时间', type: 'date_range' },
    { field: 'tags', label: '标签', type: 'tags' },
    { field: 'location', label: '地理位置(经纬度+半径km)', type: 'geo' }
  ])
})

// options endpoint
app.get('/options', (req, res) => {
  const f = req.query.field
  if (f === 'country') {
    return res.json([
      { value: 'CN', label: 'China' },
      { value: 'US', label: 'United States' },
      { value: 'JP', label: 'Japan' }
    ])
  }
  if (f === 'category') {
    return res.json([
      { value: 'A', label: '类别 A' },
      { value: 'B', label: '类别 B' },
      { value: 'C', label: '类别 C' }
    ])
  }
  res.json([])
})

// utility: generate mock dataset
function generateData(n = 200) {
  const data = []
  const countries = ['CN','US','JP']
  const categories = ['A','B','C']
  const tagsPool = ['new','hot','sale','limited','online']
  for (let i=0;i<n;i++) {
    const lat = 20 + Math.random()*40  // rough
    const lng = 70 + Math.random()*80
    data.push({
      id: i+1,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      country: countries[Math.floor(Math.random()*countries.length)],
      category: categories[Math.floor(Math.random()*categories.length)],
      price: Math.round(Math.random()*1000),
      createdAt: faker.date.past(2).toISOString().slice(0,10),
      tags: Array.from(new Set([tagsPool[Math.floor(Math.random()*tagsPool.length)], tagsPool[Math.floor(Math.random()*tagsPool.length)]])),
      location: { lat, lng }
    })
  }
  return data
}
const DATA = generateData(300)

// haversine distance (km)
function haversine(a, b) {
  const toRad = d => d * Math.PI / 180
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const sinDLat = Math.sin(dLat/2)
  const sinDLon = Math.sin(dLon/2)
  const aSeg = sinDLat*sinDLat + sinDLon*sinDLon * Math.cos(lat1)*Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(aSeg), Math.sqrt(1-aSeg))
  return R * c
}

app.post('/search', (req, res) => {
  const { filters = {}, page = 1, pageSize = 10 } = req.body
  let arr = DATA.slice()

  // q: fuzzy on name or description
  if (filters.q) {
    const q = String(filters.q).toLowerCase()
    arr = arr.filter(item => (item.name+ ' ' + item.description).toLowerCase().includes(q))
  }
  // country (single)
  if (filters.country) {
    arr = arr.filter(item => item.country === filters.country)
  }
  // category multi
  if (filters.category && Array.isArray(filters.category) && filters.category.length) {
    arr = arr.filter(item => filters.category.includes(item.category))
  }
  // price range [low,high]
  if (filters.price && Array.isArray(filters.price)) {
    const [low, high] = filters.price
    if (low != null) arr = arr.filter(i => i.price >= low)
    if (high != null) arr = arr.filter(i => i.price <= high)
  }
  // date range: expect ["YYYY-MM-DD","YYYY-MM-DD"]
  if (filters.createdAt && Array.isArray(filters.createdAt)) {
    const [start, end] = filters.createdAt
    if (start) arr = arr.filter(i => i.createdAt >= start)
    if (end) arr = arr.filter(i => i.createdAt <= end)
  }
  // tags: any match
  if (filters.tags && Array.isArray(filters.tags) && filters.tags.length) {
    arr = arr.filter(i => i.tags.some(t => filters.tags.includes(t)))
  }
  // geo: {lat,lng,radius}
  if (filters.location && filters.location.lat != null && filters.location.lng != null && filters.location.radius != null) {
    const center = { lat: Number(filters.location.lat), lng: Number(filters.location.lng) }
    const r = Number(filters.location.radius)
    arr = arr.filter(i => {
      const dist = haversine(center, i.location)
      return dist <= r
    })
  }

  const total = arr.length
  const startIdx = (page - 1) * pageSize
  const pageData = arr.slice(startIdx, startIdx + pageSize)
  res.json({ data: pageData, total })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Mock server listening at http://localhost:' + port)
})