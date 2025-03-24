/*Este archivo tiene los métodos del CRUD
    (Select, insert, update, delete)
    */

//Creo un array de funciones 

const salesController = {};
import salesModel from "../models/salesMdl.js";
//TODO: 
//SELECT

salesController.getSales = async (req, res) => {
    
        const sales = await salesModel.find()
            .populate("employeeId")
            .populate("idCliente")
            .populate("selectedProducts.idWatch");
        res.json(sales);
    
};
//INSERT

salesController.insertSale = async (req, res) => {
    const { idCliente, employeeId, address, reference, status, selectedPaymentMethod, total, selectedProducts } = req.body;
    const newSale = new salesModel({ idCliente, employeeId, address, reference, status, selectedPaymentMethod, total, selectedProducts });
    await newSale.save();
    res.json({ message: "Sale saved" });
};

//UPDATE
salesController.updateSale = async (req, res) => {
    const { idCliente, employeeId, address, reference, status, selectedPaymentMethod, total, selectedProducts } = req.body;
    const updateSale = await salesModel.findByIdAndUpdate(req.params.id,
        { idCliente, employeeId, address, reference, status, selectedPaymentMethod, total, selectedProducts }, { new: true });
    res.json({ message: "Sale updated" });
}

//DELETE
salesController.deleteSale = async (req, res) => {
    await salesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Sale deleted" });
}

export default salesController;
