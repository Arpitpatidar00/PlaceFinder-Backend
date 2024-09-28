
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import multer from 'multer';
import { Router } from 'express';
import Video from '../models/Video.js';

const router = Router();
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
  gfs = new GridFSBucket(conn.db, {
    bucketName: 'videos',
  });
  console.log('Connected to MongoDB, GridFS initialized.');
});

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('video'), async (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }

  const videoId = new mongoose.Types.ObjectId();
  const uploadStream = gfs.openUploadStreamWithId(videoId, file.originalname, {
    contentType: file.mimetype,
  });

  uploadStream.end(file.buffer);

  uploadStream.on('finish', async () => {
    try {
      const video = new Video({
        _id: videoId,
        title,
        description,
        contentType: file.mimetype,
        filename: file.originalname,
      });

      await video.save();
      res.status(200).json({ success: true, message: 'Video uploaded successfully', video });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to save video metadata', error });
    }
  });

  uploadStream.on('error', (error) => {
    res.status(500).json({ success: false, message: 'Failed to upload video', error });
  });
});

router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error('Error retrieving videos:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve videos' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    await gfs.delete(video._id);
    await Video.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ success: false, message: 'Failed to delete video' });
  }
});

export default router;
