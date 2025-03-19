const inventoryController = {};

import InventoryModel from "../models/inventoryMdl.js";

// SELECT
inventoryController.getInventory = async (req, res) => {
  const inventory = await InventoryModel.find();
  res.json(inventory);
};

// INSERT
inventoryController.insertInventory = async (req, res) => {
  const { watchId , brandId , rating } = req.body;
  const newInventory = new branchModel({ watchId , brandId , rating});
  await newInventory.save();
  res.json({ message: "Inventory saved" });
};s

// DELETE
inventoryController.deleteInventory = async (req, res) => {
  await brandsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Inventory deleted" });
};

// UPDATE
inventoryController.updateInventory = async (req, res) => {
  const { watchId , brandId , rating } = req.body;
  const updateInventory = await InventoryModel.findByIdAndUpdate(
    req.params.id,
    { watchId , brandId , rating},
    { new: true }
  );
  res.json({ message: "Inventory updated successfully" });
};


export default inventoryController;