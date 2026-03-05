const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const createStorage = (folder, resourceType = 'auto') =>
    new CloudinaryStorage({
        cloudinary,
        params: {
            folder: `edu_platform/${folder}`,
            resource_type: resourceType,
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'pdf'],
        },
    });

const imageStorage = createStorage('images', 'image');
const videoStorage = createStorage('videos', 'video');
const documentStorage = createStorage('documents', 'raw');

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/webp',
        'video/mp4', 'video/quicktime',
        'application/pdf',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, WEBP, MP4, MOV, PDF allowed.'), false);
    }
};

const uploadImage = multer({ storage: imageStorage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadVideo = multer({ storage: videoStorage, fileFilter, limits: { fileSize: 500 * 1024 * 1024 } });
const uploadDocument = multer({ storage: documentStorage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

const uploadFields = multer({
    storage: imageStorage,
    fileFilter,
    limits: { fileSize: 500 * 1024 * 1024 },
});

module.exports = { uploadImage, uploadVideo, uploadDocument, uploadFields };
