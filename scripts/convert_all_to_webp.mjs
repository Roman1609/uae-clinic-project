#!/usr/bin/env node

/**
 * Script to batch convert all hero-frames to WebP using imagesMiddleware/imageProcessor.mjs
 */

import fs from 'fs'
import path from 'path'
import { convertToWebP } from './imagesMiddleware/imageProcessor.mjs'

const HERO_FRAMES_DIR = path.resolve(process.cwd(), 'public', 'hero-frames')

async function run() {
  console.log('🚀 Starting conversion of hero-frames to WebP...')
  console.log(`📂 Target directory: ${HERO_FRAMES_DIR}`)

  if (!fs.existsSync(HERO_FRAMES_DIR)) {
    console.error(`❌ Directory not found: ${HERO_FRAMES_DIR}`)
    process.exit(1)
  }

  const allFiles = fs.readdirSync(HERO_FRAMES_DIR)
  const jpgFiles = allFiles
    .filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'))
    .sort()

  console.log(`📊 Found ${jpgFiles.length} JPG frames to convert.`)

  let originalTotalBytes = 0
  let webpTotalBytes = 0
  let convertedCount = 0

  for (let i = 0; i < jpgFiles.length; i++) {
    const filename = jpgFiles[i]
    const inputPath = path.join(HERO_FRAMES_DIR, filename)
    const baseName = path.parse(filename).name
    const outputPath = path.join(HERO_FRAMES_DIR, `${baseName}.webp`)

    const origStat = fs.statSync(inputPath)
    originalTotalBytes += origStat.size

    await convertToWebP(inputPath, outputPath, { quality: 75 })
    const webpStat = fs.statSync(outputPath)
    webpTotalBytes += webpStat.size

    // Clean up original JPG
    fs.unlinkSync(inputPath)

    convertedCount++
    if (convertedCount % 20 === 0 || convertedCount === jpgFiles.length) {
      process.stdout.write(`⏳ Converted & replaced ${convertedCount}/${jpgFiles.length} frames...\r`)
    }
  }

  console.log('\n\n✅ Conversion completed successfully!')
  console.log(`📦 Original JPG size: ${(originalTotalBytes / (1024 * 1024)).toFixed(2)} MB`)
  console.log(`⚡ New WebP size:      ${(webpTotalBytes / (1024 * 1024)).toFixed(2)} MB`)
  const savedPct = Math.round((1 - webpTotalBytes / originalTotalBytes) * 100)
  console.log(`🎉 Bandwidth saved:   ${savedPct}% reduction!`)
}

run().catch(err => {
  console.error('❌ Error during conversion:', err)
  process.exit(1)
})
