const inventoryController = {}

import InventoryModel from "../models/InventoryModel.js"

// SELECT
inventoryController.getInventory = async (req, res) => {
  const inventory = await InventoryModel.find().populate("watchId").populate("brandId")
  res.json(inventory)
}

// INSERT
inventoryController.insertInventory = async (req, res) => {
  const { watchId, brandId, stock } = req.body
  const newInventory = new InventoryModel({ watchId, brandId, stock })
  await newInventory.save()
  res.json({ message: "Inventory saved" })
}

// DELETE
inventoryController.deleteInventory = async (req, res) => {
  await InventoryModel.findByIdAndDelete(req.params.id)
  res.json({ message: "Inventory deleted" })
}

// UPDATE
inventoryController.updateInventory = async (req, res) => {
  const { watchId, brandId, stock } = req.body
  const updateInventory = await InventoryModel.findByIdAndUpdate(
    req.params.id,
    { watchId, brandId, stock },
    { new: true }
  )
  res.json({ message: "Inventory updated successfully" })
}

export default inventoryController