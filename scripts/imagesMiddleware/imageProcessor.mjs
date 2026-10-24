import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

// Optional slugify fallback
let slugify = (text) => String(text).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
try {
  const slugMod = await import('slugify')
  slugify = slugMod.default || slugMod
} catch (e) {}

// Optional config fallback
let config = {}
try {
  const confMod = await import('../config/default.mjs')
  config = confMod.default || {}
} catch (e) {}

// Optional Cloudinary fallback
let uploadToCloudinary = null
let isCloudinaryConfigured = () => false
try {
  const cloudMod = await import('./cloudinaryStorage.mjs')
  uploadToCloudinary = cloudMod.uploadToCloudinary
  isCloudinaryConfigured = cloudMod.isCloudinaryConfigured
} catch (e) {}

/**
 * Middleware для обробки та конвертації зображень у WebP формат
 * з підтримкою збереження у хмару Cloudinary
 * 
 * @param {Object} options - Налаштування обробки
 * @param {number} options.quality - Якість WebP (1-100, за замовчуванням 80)
 * @param {boolean} options.deleteOriginal - Видаляти оригінальні файли (за замовчуванням true)
 * @param {string} options.destPath - Шлях для збереження (за замовчуванням використовує той самий каталог)
 * @param {Object} options.resize - Опції зміни розміру {width, height, fit}
 * @param {boolean} options.preserveMetadata - Зберігати метадані (за замовчуванням false)
 * @param {string} options.namingField - Поле з req.body (наприклад 'title'), за яким іменувати файл
 * @param {boolean} options.useCloudinary - Прапорець використання Cloudinary (за замовчуванням з конфігу)
 * @param {string} options.cloudinaryFolder - Папка у Cloudinary (за замовчуванням 'visa_ideal/jobs')
 * 
 * @returns {Function} Express middleware
 */
export function processImages(options = {}) {
  const {
    quality = 80,
    deleteOriginal = true,
    destPath = null,
    resize = null,
    preserveMetadata = false,
    namingField = null,
    useCloudinary = undefined,
    cloudinaryFolder = 'visa_ideal/jobs',
  } = options

  return async (req, res, next) => {
    try {
      // Перевіряємо чи є завантажені файли
      if (!req.file && !req.files) {
        return next()
      }

      // Якщо вказано поле для найменування (наприклад 'title'), беремо його з req.body
      const fieldKey = namingField || (options.useTitleAsFilename ? 'title' : null)
      const customTitle = fieldKey ? req.body?.[fieldKey] : null

      // Обробляємо один файл або масив файлів
      const files = req.file ? [req.file] : req.files
      const processedFiles = []

      for (const file of files) {
        try {
          const processed = await processImage(file, {
            quality,
            deleteOriginal,
            destPath,
            resize,
            preserveMetadata,
            customTitle,
            useCloudinary,
            cloudinaryFolder,
          })
          processedFiles.push(processed)
        } catch (err) {
          console.error(`Error processing file ${file.originalname}:`, err)
          // Продовжуємо обробку інших файлів
        }
      }

      // Оновлюємо req.file або req.files з обробленими файлами
      if (req.file) {
        req.file = processedFiles[0]
      } else {
        req.files = processedFiles
      }

      next()
    } catch (error) {
      console.error('Image processing middleware error:', error)
      next(error)
    }
  }
}

/**
 * Обробка одного зображення
 * @private
 */
async function processImage(file, options = {}) {
  const {
    quality,
    deleteOriginal,
    destPath,
    resize,
    preserveMetadata,
    customTitle,
    useCloudinary,
    cloudinaryFolder = 'visa_ideal/jobs',
  } = options

  // Визначаємо шлях для збереження
  const outputDir = destPath 
    ? path.join(process.cwd(), destPath)
    : path.dirname(file.path)

  // Створюємо директорію якщо не існує
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Генеруємо ім'я файлу з назви вакансії або оригінального імені + .webp
  let baseName = path.parse(file.filename).name
  if (customTitle && typeof customTitle === 'string' && customTitle.trim()) {
    const slugified = slugify(customTitle.trim(), {
      lower: true,
      strict: true,
      trim: true,
    })
    if (slugified) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4)
      baseName = `${slugified}-${uniqueSuffix}`
    }
  }

  const filename = baseName + '.webp'
  const outputPath = path.join(outputDir, filename)

  // Створюємо Sharp pipeline
  let pipeline = sharp(file.path)

  // Додаємо зміну розміру якщо потрібно
  if (resize) {
    pipeline = pipeline.resize({
      width: resize.width,
      height: resize.height,
      fit: resize.fit || 'cover'
    })
  }

  // Зберігаємо метадані якщо потрібно
  if (preserveMetadata) {
    pipeline = pipeline.withMetadata()
  }

  // Конвертуємо в WebP
  await pipeline
    .webp({ quality })
    .toFile(outputPath)

  // Видаляємо оригінальний файл якщо потрібно
  if (deleteOriginal) {
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting original file:', err)
    })
  }

  // Синхронізуємо новий WebP файл із frontend/public для Next.js
  try {
    const rootDir = process.cwd().endsWith('backend') ? path.resolve(process.cwd(), '..') : process.cwd()
    const relativeOutputPath = path.relative(path.join(rootDir, 'backend', 'public'), outputPath)
    const frontendDest = path.join(rootDir, 'frontend', 'public', relativeOutputPath)
    const frontendDir = path.dirname(frontendDest)
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true })
    }
    fs.copyFileSync(outputPath, frontendDest)
  } catch (syncErr) {
    console.warn('Sync to frontend/public warning:', syncErr.message)
  }

  // Опціональне завантаження у Cloudinary (за прапорцем або автоматично при наявності ключів)
  let cloudinaryResult = null
  const shouldUploadCloudinary = useCloudinary !== undefined
    ? Boolean(useCloudinary)
    : Boolean(config.useCloudinary)

  if (shouldUploadCloudinary && isCloudinaryConfigured()) {
    try {
      const cloudRes = await uploadToCloudinary(outputPath, {
        folder: cloudinaryFolder,
        publicId: baseName,
      })
      if (cloudRes && cloudRes.success) {
        cloudinaryResult = cloudRes
        console.log(`[Cloudinary] ✓ Image uploaded successfully: ${cloudRes.secure_url}`)
      } else {
        console.warn(`[Cloudinary] Upload failed, falling back to local file: ${cloudRes?.error?.message || 'Unknown error'}`)
      }
    } catch (cErr) {
      console.warn(`[Cloudinary] Upload exception, falling back to local file:`, cErr.message)
    }
  }

  // Отримуємо інформацію про новий файл
  const stats = fs.statSync(outputPath)

  // Повертаємо оновлений об'єкт файлу
  return {
    ...file,
    filename: filename,
    path: cloudinaryResult ? cloudinaryResult.secure_url : outputPath,
    secure_url: cloudinaryResult ? cloudinaryResult.secure_url : undefined,
    url: cloudinaryResult ? cloudinaryResult.secure_url : undefined,
    public_id: cloudinaryResult ? cloudinaryResult.public_id : undefined,
    cloudinary: cloudinaryResult ? cloudinaryResult.raw : null,
    size: stats.size,
    mimetype: 'image/webp',
    originalPath: file.path,
    processed: true,
  }
}

/**
 * Middleware для обробки одного зображення
 */
export function processSingleImage(options = {}) {
  return processImages(options)
}

/**
 * Middleware для обробки множинних зображень
 */
export function processMultipleImages(options = {}) {
  return processImages(options)
}

/**
 * Утилітна функція для ручної обробки зображення
 * 
 * @param {string} inputPath - Шлях до вхідного файлу
 * @param {string} outputPath - Шлях для збереження
 * @param {Object} options - Опції обробки
 * @returns {Promise<Object>} Інформація про оброблений файл
 */
export async function convertToWebP(inputPath, outputPath, options = {}) {
  const { quality = 80, resize = null, preserveMetadata = false } = options

  let pipeline = sharp(inputPath)

  if (resize) {
    pipeline = pipeline.resize({
      width: resize.width,
      height: resize.height,
      fit: resize.fit || 'cover'
    })
  }

  if (preserveMetadata) {
    pipeline = pipeline.withMetadata()
  }

  await pipeline.webp({ quality }).toFile(outputPath)

  const stats = fs.statSync(outputPath)

  return {
    path: outputPath,
    size: stats.size,
    mimetype: 'image/webp'
  }
}
