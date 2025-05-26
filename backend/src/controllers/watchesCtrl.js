const WatchesController = {};

import WatchesModel from "../models/watchesMdl.js";
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config.js';

// Configurar cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret
});

// SELECT
WatchesController.getWatches = async (req, res) => {
  const Watches = await WatchesModel.find(). populate("brandId");
  res.json(Watches);
};

// INSERT
WatchesController.insertWatches = async (req, res) => {
  try {
    const { model, brandId, price, category, description, availability } = req.body;
    let photos = [];

    // Si se suben archivos, subirlos a Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "watches",
          allowed_formats: ["jpg", "png", "jpeg"]
        });
        photos.push(result.secure_url);
      }
    }

    const newWatch = new WatchesModel({
      model,
      brandId,
      price,
      category,
      description,
      photos,
      availability
    });
    await newWatch.save();
    res.json({ message: "Watches saved" });
  } catch (error) {
    console.error("Error saving watch: " + error);
    res.status(500).json({ message: "Error saving watch" });
  }
};

// DELETE
WatchesController.deleteWatches = async (req, res) => {
  await WatchesModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Watches deleted" });
};

// UPDATE
WatchesController.updateWatches = async (req, res) => {
  try {
    const { model, brandId, price, category, description, availability } = req.body;
    let photos = [];

    // Si se suben archivos, subirlos a Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "watches",
          allowed_formats: ["jpg", "png", "jpeg"]
        });
        photos.push(result.secure_url);
      }
    } else {
      // Si no se suben nuevas fotos, mantener las existentes
      const currentWatch = await WatchesModel.findById(req.params.id);
      if (currentWatch) {
        photos = currentWatch.photos;
      }
    }

    const updateWatches = await WatchesModel.findByIdAndUpdate(
      req.params.id,
      { model, brandId, price, category, description, photos, availability },
      { new: true }
    );
    res.json({ message: "Watches updated successfully" });
  } catch (error) {
    console.error("Error updating watch: " + error);
    res.status(500).json({ message: "Error updating watch" });
  }
};


export default WatchesController;