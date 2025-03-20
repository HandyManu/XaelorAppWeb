
const brandsController = {};

import brandsModel from "../models/brandsMdl.js";

// SELECT
brandsController.getBrands = async (req, res) => {
  const brands = await brandsModel.find();
  res.json(brands);
};

// INSERT
brandsController.insertBrands = async (req, res) => {
  const { brandName } = req.body;
  const newBrands = new brandsModel({ brandName});
  await newBrands.save();
  res.json({ message: "Brands saved" });
};

// DELETE
brandsController.deleteBrands = async (req, res) => {
  await brandsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Brands deleted" });
};

// UPDATE
brandsController.updateBrands = async (req, res) => {
  const { brandName } = req.body;
  const updateBrands = await brandsModel.findByIdAndUpdate(
    req.params.id,
    { brandName},
    { new: true }
  );
  res.json({ message: "Brands updated successfully" });
};


export default brandsController;