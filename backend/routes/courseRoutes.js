const express = require('express');
const router = express.Router();
const { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse, addLesson, addMaterial, getMyCourses, approveCourse } = require('../controllers/courseController');
const { protect, requireRole } = require('../middleware/auth');
const { uploadFields, uploadVideo, uploadDocument } = require('../middleware/upload');

router.get('/', getAllCourses);
router.get('/my-courses', protect, requireRole('TEACHER', 'ADMIN'), getMyCourses);
router.get('/:id', getCourse);

router.post('/', protect, requireRole('TEACHER', 'ADMIN'),
    uploadFields.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'previewVideo', maxCount: 1 }]),
    createCourse
);

router.put('/:id', protect, requireRole('TEACHER', 'ADMIN'),
    uploadFields.fields([{ name: 'thumbnail', maxCount: 1 }]),
    updateCourse
);

router.delete('/:id', protect, requireRole('TEACHER', 'ADMIN'), deleteCourse);
router.post('/:id/lessons', protect, requireRole('TEACHER', 'ADMIN'), uploadVideo.single('video'), addLesson);
router.post('/:id/materials', protect, requireRole('TEACHER', 'ADMIN'), uploadDocument.single('material'), addMaterial);
router.patch('/:id/approve', protect, requireRole('ADMIN'), approveCourse);

module.exports = router;
