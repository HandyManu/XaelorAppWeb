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

// Función auxiliar para extraer public_id de URL de Cloudinary
const extractPublicIdFromUrl = (url) => {
  try {
    // Ejemplo: https://res.cloudinary.com/demo/image/upload/v1234567890/watches/abc123.jpg
    // Debe retornar: watches/abc123
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
      // Tomar todo después de 'upload' y antes de la extensión
      const pathParts = parts.slice(uploadIndex + 2);
      const fileName = pathParts.join('/');
      // Remover la extensión y versión si existe
      return fileName.replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');
    }
    return null;
  } catch (error) {
    console.error('Error extrayendo public_id:', error);
    return null;
  }
};

// SELECT
WatchesController.getWatches = async (req, res) => {
  const Watches = await WatchesModel.find().populate("brandId");
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

    // VALIDACIÓN: Debe haber al menos una foto
    if (!photos.length) {
      return res.status(400).json({ message: "Debes subir al menos una imagen." });
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
  try {
    // Obtener el reloj antes de eliminarlo para borrar las fotos de Cloudinary
    const watch = await WatchesModel.findById(req.params.id);

    if (watch && watch.photos && watch.photos.length > 0) {
      // Eliminar todas las fotos de Cloudinary
      for (const photoUrl of watch.photos) {
        try {
          const publicId = extractPublicIdFromUrl(photoUrl);
          if (publicId) {
            await cloudinary.uploader.destroy(`watches/${publicId}`);
            console.log('Foto eliminada de Cloudinary:', publicId);
          }
        } catch (error) {
          console.error('Error eliminando foto de Cloudinary:', error);
        }
      }
    }

    await WatchesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Watches deleted" });
  } catch (error) {
    console.error("Error deleting watch: " + error);
    res.status(500).json({ message: "Error deleting watch" });
  }
};

// UPDATE
WatchesController.updateWatches = async (req, res) => {
  try {
    const { model, brandId, price, category, description, availability, existingPhotos } = req.body;

    // Buscar el reloj existente
    const currentWatch = await WatchesModel.findById(req.params.id);
    if (!currentWatch) {
      return res.status(404).json({ message: 'Reloj no encontrado' });
    }

    // Parsear las fotos existentes que queremos mantener
    let photosToKeep = [];
    if (existingPhotos) {
      try {
        photosToKeep = JSON.parse(existingPhotos);
        console.log('Fotos a mantener:', photosToKeep);
      } catch (error) {
        console.error('Error parsing existingPhotos:', error);
        photosToKeep = [];
      }
    }

    // Identificar qué fotos eliminar de Cloudinary
    const photosToDelete = currentWatch.photos.filter(
      photo => !photosToKeep.includes(photo)
    );

    console.log('Fotos a eliminar:', photosToDelete);

    // Eliminar fotos de Cloudinary que ya no se necesitan
    for (const photoUrl of photosToDelete) {
      try {
        const publicId = extractPublicIdFromUrl(photoUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(`watches/${publicId}`);
          console.log('Foto eliminada de Cloudinary:', publicId);
        }
      } catch (error) {
        console.error('Error eliminando foto de Cloudinary:', error);
      }
    }

    // Subir nuevas fotos a Cloudinary
    const newPhotoUrls = [];
    if (req.files && req.files.length > 0) {
      console.log('Subiendo nuevas fotos:', req.files.length);
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "watches",
            allowed_formats: ["jpg", "png", "jpeg"]
          });
          newPhotoUrls.push(result.secure_url);
          console.log('Nueva foto subida:', result.secure_url);
        } catch (error) {
          console.error('Error subiendo foto:', error);
        }
      }
    }

    // Combinar fotos existentes que queremos mantener + nuevas fotos
    const finalPhotos = [...photosToKeep, ...newPhotoUrls];

    // VALIDACIÓN: Debe haber al menos una foto
    if (!finalPhotos.length) {
      return res.status(400).json({ message: "Debes mantener o subir al menos una imagen." });
    }

    console.log('Resultado final:', {
      fotosAnteriores: currentWatch.photos.length,
      fotosAMantener: photosToKeep.length,
      fotosNuevas: newPhotoUrls.length,
      fotosFinales: finalPhotos.length,
      fotosEliminadas: photosToDelete.length
    });

    const updateWatches = await WatchesModel.findByIdAndUpdate(
      req.params.id,
      {
        model,
        brandId,
        price,
        category,
        description,
        photos: finalPhotos, // ESTO ES CLAVE: Solo las fotos que queremos mantener + nuevas
        availability
      },
      { new: true }
    ).populate('brandId');

    res.json(updateWatches); // Devolver el reloj actualizado, no solo un mensaje
  } catch (error) {
    console.error("Error updating watch: " + error);
    res.status(500).json({ message: "Error updating watch", error: error.message });
  }
};

// GET por ID
WatchesController.getWatchById = async (req, res) => {
  try {
    const watch = await WatchesModel.findById(req.params.id).populate("brandId");
    if (!watch) {
      return res.status(404).json({ message: "Reloj no encontrado" });
    }
    res.json(watch);
  } catch (error) {
    console.error("Error obteniendo reloj por ID:", error);
    res.status(500).json({ message: "Error obteniendo reloj por ID" });
  }
};

export default WatchesController;