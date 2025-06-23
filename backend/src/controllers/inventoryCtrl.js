import inventoryModel from '../models/inventoryMdl.js';

const inventoryCtrl = {}

//GET
inventoryCtrl.getInventory = async (req, res) => {
    try {
        const inventory = await inventoryModel.find().populate('watchId').populate("branchId");
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//POST - Crear inventario inicial o agregar movimiento si ya existe
inventoryCtrl.createInventory = async (req, res) => {
    try {
        const { watchId, branchId, initialStock, notes } = req.body;
        
        // Verificar si ya existe un inventario para este reloj en esta sucursal
        const existingInventory = await inventoryModel.findOne({ watchId, branchId });
        if (existingInventory) {
            // Si ya existe, agregar un movimiento 'add' en lugar de crear uno nuevo
            const newMovement = {
                type: 'add',
                quantity: initialStock,
                notes: notes || 'Stock agregado a inventario existente',
                date: new Date()
            };
            
            existingInventory.movements.push(newMovement);
            existingInventory.stock += initialStock;
            
            await existingInventory.save();
            return res.json({ 
                message: 'Inventario existente, se agregó movimiento en su lugar',
                isExisting: true 
            });
        }
        
        // Si no existe, crear nuevo inventario
        const newInventory = new inventoryModel({
            watchId,
            branchId,
            stock: initialStock,
            movements: [{
                type: 'initial',
                quantity: initialStock,
                notes: notes || 'Stock inicial',
                date: new Date()
            }]
        });
        
        await newInventory.save();
        res.json({ 
            message: 'New Inventory Added',
            isExisting: false 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//PUT - Actualizar inventario básico
inventoryCtrl.updateInventory = async (req, res) => {
    try {
        await inventoryModel.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Inventory Updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//PUT - Agregar movimiento al inventario
inventoryCtrl.addMovement = async (req, res) => {
    try {
        const { movementType, quantity, notes } = req.body;
        const inventoryId = req.params.id;
        
        const inventory = await inventoryModel.findById(inventoryId);
        if (!inventory) {
            return res.status(404).json({ message: 'Inventario no encontrado' });
        }
        
        // Calcular nuevo stock
        let newStock = inventory.stock;
        if (movementType === 'add') {
            newStock += quantity;
        } else if (movementType === 'subtract') {
            newStock -= quantity;
            if (newStock < 0) {
                return res.status(400).json({ message: 'Stock insuficiente para realizar esta operación' });
            }
        }
        
        // Agregar movimiento
        const newMovement = {
            type: movementType,
            quantity,
            notes: notes || '',
            date: new Date()
        };
        
        inventory.movements.push(newMovement);
        inventory.stock = newStock;
        
        await inventory.save();
        res.json({ message: 'Movimiento agregado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//DELETE
inventoryCtrl.deleteInventory = async (req, res) => {
    try {
        await inventoryModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Inventory Deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default inventoryCtrl;