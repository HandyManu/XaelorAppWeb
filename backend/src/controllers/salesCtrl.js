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
            .populate("customerId")
            .populate("selectedProducts.watchId");
        res.json(sales);
    
};

//GET SALES BY CUSTOMER ID
salesController.getSalesByCustomerId = async (req, res) => {
    try {
        const customerId = req.params.id; // Obtener el ID del cliente desde los parámetros de la ruta
        const sales = await salesModel.find({ customerId: customerId })
            .populate("employeeId")
            .populate("customerId")
            .populate("selectedProducts.watchId");
        
        if (!sales || sales.length === 0) {
            return res.status(404).json({ message: "No sales found for this customer." });
        }
        
        res.json(sales);
    } catch (error) {
        console.error("Error fetching sales by customer ID:", error);
        res.status(500).json({ message: "Error fetching sales" });
    }
};
//INSERT

salesController.insertSale = async (req, res) => {
    try {
        // Obtener el ID del usuario autenticado desde el token
        const userId = req.userId; // Esto debe ser configurado en el middleware de autenticación

        const { customerId, employeeId, address, reference, status, selectedPaymentMethod, total, selectedProducts } = req.body;

        // Crear la nueva venta con el ID del usuario
        const newSale = new salesModel({
            customerId: customerId, // Usar el ID del usuario autenticado
            employeeId,
            address,
            reference,
            status,
            selectedPaymentMethod,
            total,
            selectedProducts
        });

        await newSale.save();
        res.json({ message: "Sale saved", sale: newSale });
    } catch (error) {
        console.error("Error saving sale:", error);
        res.status(500).json({ message: "Error saving sale" });
    }
};

//UPDATE
salesController.updateSale = async (req, res) => {
    const { customerId, employeeId, address, reference, status, selectedPaymentMethod, total, selectedProducts } = req.body;
    const updateSale = await salesModel.findByIdAndUpdate(req.params.id,
        { customerId, employeeId, address, reference, status, selectedPaymentMethod, total, selectedProducts }, { new: true });
    res.json({ message: "Sale updated" });
}

//DELETE
salesController.deleteSale = async (req, res) => {
    await salesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Sale deleted" });
}

export default salesController;
