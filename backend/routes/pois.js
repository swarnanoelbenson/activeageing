const express = require('express')
const router  = express.Router()

router.get('/', async (req, res) => {
  const { south, west, north, east } = req.query
  if (!south || !west || !north || !east) {
    return res.status(400).json({ error: 'Missing bounding box params' })
  }

  const q = `[out:json][timeout:30];(
    node["amenity"="bench"](${south},${west},${north},${east});
    node["amenity"="seat"](${south},${west},${north},${east});
    node["amenity"="drinking_water"](${south},${west},${north},${east});
    node["amenity"="fountain"]["drinking_water"="yes"](${south},${west},${north},${east});
    node["amenity"="toilets"](${south},${west},${north},${east});
    node["amenity"="shelter"](${south},${west},${north},${east});
    node["leisure"="picnic_table"](${south},${west},${north},${east});
    node["tourism"="attraction"](${south},${west},${north},${east});
    node["tourism"="viewpoint"](${south},${west},${north},${east});
    node["historic"](${south},${west},${north},${east});
  );out body;`

  try {
    const response = await fetch(
      'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(q),
      { headers: { 'User-Agent': 'ActiveAgeing/1.0' } }
    )
    const data = await response.json()
    res.json({ elements: data.elements ?? [] })
  } catch (err) {
    console.error('Overpass fetch failed:', err.message)
    res.status(502).json({ error: 'POI fetch failed', elements: [] })
  }
})

module.exports = router
