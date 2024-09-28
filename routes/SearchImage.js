import express from 'express';
import mongoose from 'mongoose'; // Ensure mongoose is imported
import Place from '../models/ImageSchema.js'; // Ensure the model name matches

const router = express.Router();

// Route for adding a place to the database
router.post('/upload', async (req, res) => {
  try {
    const { title, description, cityName, placeName, image } = req.body;

    // Check if all required fields are provided
    if (!title || !cityName || !placeName || !image) {
      return res.status(400).json({ message: 'Please provide title, cityName, placeName, and image' });
    }

    // Create a new place document
    const newPlace = new Place({
      title,
      description,
      cityName,
      placeName,
      image // Store the base64 image directly in the database
    });

    // Save the place to the database
    await newPlace.save();

    res.status(201).json({ message: 'Place added successfully', place: newPlace });
  } catch (error) {
    console.error('Error adding place:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for searching places based on cityName and placeName
router.get('/search', async (req, res) => {
  try {
    const { cityName, placeName } = req.query;

    // Prepare search criteria
    const searchCriteria = {};
    if (cityName || placeName) {
      searchCriteria.$text = { $search: `${cityName ? cityName : ''} ${placeName ? placeName : ''}` };
    }

    // Find places matching the search criteria
    const places = await Place.find(searchCriteria);

    res.json(places);
  } catch (error) {
    console.error('Error searching for places:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route for searching a place by ID
router.get('/:id', async (req, res) => {
  try {
    const placeId = req.params.id;

    // Find place by ID
    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json(place);
  } catch (error) {
    console.error('Error searching for place by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for getting all places
router.get('/', async (req, res) => {
  try {
    // Find 15 random places
    const places = await Place.aggregate([{ $sample: { size: 15 } }]);
    res.json(places);
  } catch (error) {
    console.error('Error getting random places:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for deleting a place by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log("Deleting item with ID:", id); // Log ID for debugging

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const result = await Place.findByIdAndDelete(id); // Use the correct model
    if (!result) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Error deleting item' });
  }
});

export default router;
