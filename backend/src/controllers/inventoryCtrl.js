const inventoryController = {};

import InventoryModel from "../models/inventoryMdl.js";

// SELECT
inventoryController.getInventory = async (req, res) => {
  const inventory = await InventoryModel.find();
  res.json(inventory);
};

// INSERT
inventoryController.insertInventory = async (req, res) => {
  const { watchId , branchId , rating } = req.body;
  const newInventory = new branchModel({ watchId , branchId , rating});
  await newInventory.save();
  res.json({ message: "Inventory saved" });
};

// DELETE
inventoryController.deleteBrands = async (req, res) => {
  await brandsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Brands deleted" });
};

// UPDATE
inventoryController.updateBrands = async (req, res) => {
  const { brandName } = req.body;
  const updateBrands = await brandsModel.findByIdAndUpdate(
    req.params.id,
    { brandName},
    { new: true }
  );
  res.json({ message: "Brands updated successfully" });
};


export default inventoryController;