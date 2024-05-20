const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const File = require('../models/File');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();
const storage = new Storage();
const bucket = storage.bucket(process.env.GCLOUD_BUCKET);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post('/upload', upload.single('file'), async (req, res) => {
  const { file } = req;
  const { userId } = req.body;

  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const blob = bucket.file(`${userId}/${Date.now()}_${file.originalname}`);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    res.status(500).json({ success: false, message: err.message });
  });

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    const user = await User.findByPk(userId);
    await user.createFile({ name: file.originalname, url: publicUrl });
    res.status(200).json({ success: true, url: publicUrl });
  });

  blobStream.end(file.buffer);
});

router.get('/files/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId, { include: File });
    res.json({ success: true, files: user.Files });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
