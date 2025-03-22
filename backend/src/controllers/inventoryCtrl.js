
import inventoryModel from '../models/inventoryMdl.js';

const inventoryCtrl = {}

//GET
inventoryCtrl.getInventory = async (req, res) => {
    const inventory = await inventoryModel.find().populate("Watches").populate("branches");
    res.json(inventory);
}
//POST
inventoryCtrl.createInventory = async (req, res) => {
    const newInventory = new inventoryModel(req.body);
    await newInventory.save();
    res.json({message: 'New Inventory Added'});
}
//PUT
inventoryCtrl.updateInventory = async (req, res) => {
    await inventoryModel.findByIdAndUpdate(req.params.id, req.body);
    res.json({message: 'Inventory Updated'});
}

//DELETE

inventoryCtrl.deleteInventory = async (req, res) => {
    await inventoryModel.findByIdAndDelete(req.params.id);
    res.json({message: 'Inventory Deleted'});
}

export default inventoryCtrl;