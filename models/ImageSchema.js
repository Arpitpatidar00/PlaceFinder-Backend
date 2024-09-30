import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  cityName: {
    type: String,
    required: true
  },
  placeName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String, // Assuming you're storing the image path as a string
    required: true
  },
  description: {
    type: String
  }
});

// Create a text index for searching
placeSchema.index({ cityName: 'text', placeName: 'text' });

const Place = mongoose.model('Place', placeSchema);

export default Place;
