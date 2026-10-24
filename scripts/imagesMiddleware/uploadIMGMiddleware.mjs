import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { processImages } from './imageProcessor.mjs'

/**
 * Створює uploader з налаштуваннями
 * @private
 */

function createUploader(destPath = 'public/images') {
  const uploadDir = path.join(process.cwd(), destPath)

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),

  filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      const base = path.basename(file.originalname, ext)
      
      // 1. Очищення імені:
      const cleanBase = base
        .replace(/[^\w\s-]/gi, '') // Видаляє все, крім латиниці, цифр, пробілів та дефісів
        .replace(/\s+/g, '_')      // Замінює пробіли на підкреслення

      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
      
      // Якщо після очищення ім'я стало порожнім (була тільки кирилиця), даємо дефолтне ім'я
      const finalBase = cleanBase || 'uploaded_file'
      
      cb(null, finalBase + '-' + unique + ext)
    }
  })

  function fileFilter(req, file, cb) {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const ext = path.extname(file.originalname).toLowerCase()
    const forbiddenExts = ['.svg', '.html', '.htm', '.xml', '.php', '.phtml', '.js', '.exe']

    // Захист від Stored XSS через SVG та файли з кодом (SEC-02)
    if (forbiddenExts.includes(ext) || file.mimetype === 'image/svg+xml') {
      return cb(new Error('SVG and script files are not allowed for security reasons (Stored XSS prevention)'), false)
    }

    if (allowedMime.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only safe image files (JPEG, PNG, WEBP, GIF) are allowed'), false)
    }
  }

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  })
}

/**
 * Middleware для завантаження одного зображення
 * 
 * @param {string} fieldName - Ім'я поля форми
 * @param {string} dest - Шлях для збереження (за замовчуванням 'public/uploads')
 * @returns {Function} Express middleware
 */
export function uploadSingle(fieldName, dest = 'public/images') {
  return createUploader(dest).single(fieldName)
}

/**
 * Middleware для завантаження множинних зображень
 * 
 * @param {string} fieldName - Ім'я поля форми
 * @param {number} maxCount - Максимальна кількість файлів (за замовчуванням 10)
 * @param {string} dest - Шлях для збереження (за замовчуванням 'public/uploads')
 * @returns {Function} Express middleware
 */
export function uploadMultiple(fieldName, maxCount = 10, dest = 'public/images') {
  return createUploader(dest).array(fieldName, maxCount)
}

import * as cloudinaryStorage from './cloudinaryStorage.mjs'

export { cloudinaryStorage }
export {
  isCloudinaryConfigured,
  getCloudinaryClient,
  uploadToCloudinary,
  deleteFromCloudinary,
} from './cloudinaryStorage.mjs'

/**
 * Комбінований middleware: завантаження + обробка одного зображення
 * 
 * @param {string} fieldName - Ім'я поля форми
 * @param {Object} options - Налаштування
 * @param {string} options.dest - Шлях для завантаження (за замовчуванням 'public/images')
 * @param {number} options.quality - Якість WebP (1-100, за замовчуванням 80)
 * @param {boolean} options.deleteOriginal - Видаляти оригінал (за замовчуванням true)
 * @param {string} options.processedDest - Окремий шлях для оброблених файлів
 * @param {Object} options.resize - Опції зміни розміру {width, height, fit}
 * @param {boolean} options.useCloudinary - Прапорець завантаження у Cloudinary (за замовчуванням з конфігу)
 * @param {string} options.cloudinaryFolder - Папка у Cloudinary (наприклад 'visa_ideal/jobs')
 * @returns {Array<Function>} Масив middleware функцій
 */
export function uploadAndProcessSingle(fieldName, options = {}) {
  const {
    dest = 'public/images',
    quality = 80,
    deleteOriginal = true,
    processedDest = null,
    resize = null,
    preserveMetadata = false,
    namingField = null,
    useTitleAsFilename = false,
    useCloudinary = undefined,
    cloudinaryFolder = 'visa_ideal/jobs',
  } = options

  return [
    uploadSingle(fieldName, dest),
    processImages({
      quality,
      deleteOriginal,
      destPath: processedDest,
      resize,
      preserveMetadata,
      namingField: useTitleAsFilename ? 'title' : namingField,
      useTitleAsFilename,
      useCloudinary,
      cloudinaryFolder,
    })
  ]
}

/**
 * Комбінований middleware: завантаження + обробка множинних зображень
 * 
 * @param {string} fieldName - Ім'я поля форми
 * @param {Object} options - Налаштування
 * @param {number} options.maxCount - Максимальна кількість файлів (за замовчуванням 10)
 * @param {string} options.dest - Шлях для завантаження (за замовчуванням 'public/images')
 * @param {number} options.quality - Якість WebP (1-100, за замовчуванням 80)
 * @param {boolean} options.deleteOriginal - Видаляти оригінал (за замовчуванням true)
 * @param {string} options.processedDest - Окремий шлях для оброблених файлів
 * @param {Object} options.resize - Опції зміни розміру {width, height, fit}
 * @param {boolean} options.useCloudinary - Прапорець завантаження у Cloudinary
 * @param {string} options.cloudinaryFolder - Папка у Cloudinary
 * @returns {Array<Function>} Масив middleware функцій
 */
export function uploadAndProcessMultiple(fieldName, options = {}) {
  const {
    maxCount = 10,
    dest = 'public/images',
    quality = 80,
    deleteOriginal = true,
    processedDest = null,
    resize = null,
    preserveMetadata = false,
    namingField = null,
    useCloudinary = undefined,
    cloudinaryFolder = 'visa_ideal/gallery',
  } = options

  return [
    uploadMultiple(fieldName, maxCount, dest),
    processImages({
      quality,
      deleteOriginal,
      destPath: processedDest,
      resize,
      preserveMetadata,
      namingField,
      useCloudinary,
      cloudinaryFolder,
    })
  ]
}

/**
 * Спеціалізований middleware для гарантованого завантаження у Cloudinary (одне зображення)
 * Завжди вмикає useCloudinary: true
 */
export function uploadAndProcessToCloudinarySingle(fieldName, options = {}) {
  return uploadAndProcessSingle(fieldName, {
    ...options,
    useCloudinary: true,
  })
}

/**
 * Спеціалізований middleware для гарантованого завантаження у Cloudinary (множинні зображення)
 * Завжди вмикає useCloudinary: true
 */
export function uploadAndProcessToCloudinaryMultiple(fieldName, options = {}) {
  return uploadAndProcessMultiple(fieldName, {
    ...options,
    useCloudinary: true,
  })
}

/*
ПРИКЛАДИ ВИКОРИСТАННЯ:

1. Базове використання - завантаження без обробки
router.post('/upload', uploadSingle('image'), Controller.create)

2. Завантаження з вказанням шляху
router.post('/upload', uploadSingle('image', 'public/images/courses'), Controller.create)

3. Завантаження множинних файлів
router.post('/gallery', uploadMultiple('photos', 6, 'public/images/courses'), Controller.uploadGallery)

4. Завантаження + конвертація в WebP (оригінал видаляється)
router.post('/upload', 
  ...uploadAndProcessSingle('image', {
    dest: 'public/uploads/temp',
    quality: 85,
    deleteOriginal: true
  }), 
  Controller.create
)

5. Завантаження + конвертація з окремим каталогом для оброблених файлів
router.post('/upload',
  ...uploadAndProcessSingle('image', {
    dest: 'public/uploads/original',
    processedDest: 'public/uploads/webp',
    quality: 90,
    deleteOriginal: false  // Зберігаємо оригінал
  }),
  Controller.create
)

6. Завантаження + конвертація + зміна розміру
router.post('/upload',
  ...uploadAndProcessSingle('image', {
    dest: 'public/uploads',
    quality: 80,
    resize: { width: 1200, height: 800, fit: 'cover' }
  }),
  Controller.create
)

7. Множинні файли з обробкою
router.post('/gallery',
  ...uploadAndProcessMultiple('photos', {
    maxCount: 6,
    dest: 'public/images/courses',
    quality: 85,
    resize: { width: 1920, height: 1080, fit: 'inside' }
  }),
  Controller.uploadGallery
)

8. Використання окремих middleware (більше контролю)
import { processImages } from './middleware/imageProcessor.mjs'

router.post('/custom',
  uploadSingle('image', 'public/uploads'),
  processImages({ quality: 90, deleteOriginal: true }),
  Controller.create
)

У контролері доступ до обробленого файлу:
Controller.create = (req, res) => {
  console.log(req.file)
  {
    fieldname: 'image',
    originalname: 'photo.jpg',
    filename: 'photo-1234567890.webp',
    path: '/absolute/path/to/photo-1234567890.webp',
    size: 45678,
    mimetype: 'image/webp',
    processed: true
  }
}
*/