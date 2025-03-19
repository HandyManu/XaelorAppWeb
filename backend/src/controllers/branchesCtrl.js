/*Este archivo tiene los métodos del CRUD
    (Select, insert, update, delete)
    */

//Creo un array de funciones 

const branchesController = {};
import branchesModel from "../models/branchesMdl.js";

//SELECT
branchesController.getBranch = async (req, res) => {
    const branches = await branchesModel.find();
    res.json(branches);
}
//INSERT
branchesController.insertBranch = async (req, res) => {
    const { branch_name, country, address, phone_number, business_hours } = req.body;
    const newBranch = new branchesModel({ branch_name, country, address, phone_number, business_hours });
    await newBranch.save();
    res.json({ message: "Branch saved" });
}

//UPDATE
branchesController.updateBranch = async (req, res) => {
    const { branch_name, country, address, phone_number, business_hours } = req.body;
    const updateBranch = await branchesModel.findByIdAndUpdate(req.params.id,
        { branch_name, country, address, phone_number, business_hours }, { new: true });
    res.json({ message: "Branch updated" });
}

//DELETE
branchesController.deleteBranch = async (req, res) => {
    await branchesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Branch deleted" });
}

export default branchesController;

