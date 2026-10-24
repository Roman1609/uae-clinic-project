let cloudinary = null
try {
  const mod = await import('cloudinary')
  cloudinary = mod.v2 || mod.default?.v2 || mod.default || mod
} catch (e) {}

import path from 'path'
import config from '../config/default.mjs'

let isConfigured = false

/**
 * Перевіряє, чи присутні всі необхідні змінні середовища для Cloudinary
 * 
 * @returns {boolean}
 */
export function isCloudinaryConfigured() {
  const cloudName = config.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = config.cloudinaryApiKey || process.env.CLOUDINARY_API_KEY
  const apiSecret = config.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET

  return Boolean(cloudName && apiKey && apiSecret)
}

/**
 * Ініціалізує та повертає налаштований екземпляр Cloudinary SDK
 * 
 * @returns {typeof cloudinary}
 */
export function getCloudinaryClient() {
  if (isConfigured) return cloudinary

  const cloudName = (config.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME || '').trim()
  const apiKey = (config.cloudinaryApiKey || process.env.CLOUDINARY_API_KEY || '').trim()
  const apiSecret = (config.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET || '').trim()

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    })
    isConfigured = true
  }

  return cloudinary
}

/**
 * Завантажує локальний файл у хмару Cloudinary
 * 
 * @param {string} filePath - Абсолютний або відносний шлях до файлу на диску
 * @param {Object} options - Налаштування завантаження
 * @param {string} options.folder - Папка в Cloudinary (наприклад, 'visa_ideal/jobs')
 * @param {string} options.publicId - Бажаний унікальний ідентифікатор файлу
 * @param {Array<string>} options.tags - Теги для класифікації у Cloudinary
 * @param {boolean} options.overwrite - Перезаписувати існуючий файл з таким public_id
 * @param {Object|Array} options.transformation - Опції трансформації Cloudinary (quality, resize тощо)
 * 
 * @returns {Promise<{success: boolean, secure_url?: string, url?: string, public_id?: string, format?: string, width?: number, height?: number, error?: any}>}
 */
export async function uploadToCloudinary(filePath, options = {}) {
  if (!isCloudinaryConfigured()) {
    return {
      success: false,
      error: new Error('Cloudinary credentials are not configured in environment variables.'),
    }
  }

  const client = getCloudinaryClient()

  const {
    folder = 'visa_ideal/jobs',
    publicId = null,
    tags = ['visa_ideal'],
    overwrite = true,
    transformation = null,
  } = options

  const uploadOptions = {
    folder,
    overwrite,
    resource_type: 'auto',
    tags,
  }

  if (publicId) {
    uploadOptions.public_id = publicId
  }

  if (transformation) {
    uploadOptions.transformation = transformation
  }

  try {
    const result = await client.uploader.upload(filePath, uploadOptions)
    return {
      success: true,
      secure_url: result.secure_url,
      url: result.url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      raw: result,
    }
  } catch (err) {
    console.error('[Cloudinary] Upload failed:', err.message || err)
    return {
      success: false,
      error: err,
    }
  }
}

/**
 * Видаляє файл із Cloudinary за його public_id або повним URL
 * 
 * @param {string} publicIdOrUrl - Public ID або повний URL (https://res.cloudinary.com/...)
 * @returns {Promise<boolean>}
 */
export async function deleteFromCloudinary(publicIdOrUrl) {
  if (!publicIdOrUrl || typeof publicIdOrUrl !== 'string' || !isCloudinaryConfigured()) {
    return false
  }

  const client = getCloudinaryClient()

  try {
    let publicId = publicIdOrUrl

    // Якщо передано повний URL, витягуємо public_id
    if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://')) {
      const parts = publicIdOrUrl.split('/upload/')
      if (parts.length > 1) {
        // Видаляємо версію типу v1789815587/ якщо вона є
        const afterUpload = parts[1].replace(/^v\d+\//, '')
        // Відрізаємо розширення файлу (.webp, .jpg тощо)
        const parsed = path.parse(afterUpload)
        publicId = parsed.dir ? `${parsed.dir}/${parsed.name}` : parsed.name
      }
    }

    const res = await client.uploader.destroy(publicId)
    return res.result === 'ok'
  } catch (err) {
    console.warn('[Cloudinary] Delete warning:', err.message)
    return false
  }
}

export default {
  isCloudinaryConfigured,
  getCloudinaryClient,
  uploadToCloudinary,
  deleteFromCloudinary,
}
