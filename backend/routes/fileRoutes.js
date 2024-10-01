const express = require('express');
const upload = require('../middlewares/upload');
const { manipulateImage } = require('../controllers/fileController');
const File = require('../models/fileModel');
const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newFile = new File({
      filePath: req.file.path,
      fileType: req.file.mimetype,
    });
    await newFile.save();

    res.json({
      filePath: req.file.path,
      fileType: req.file.mimetype,
    });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed', error });
  }
});

router.post('/manipulate', manipulateImage);

router.get('/all', async (req, res) => {
  try {
    const files = await File.find(); 
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve files', error });
  }
});


module.exports = router;
