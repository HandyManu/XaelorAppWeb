//CRUD Methods

const membershipCtrl = {};
import membershipMdl from "../models/membershipsMdl.js"

//* GET
membershipCtrl.getMemberships = async (req, res) => {
   try {
      const memberships = await membershipMdl.find();
      res.json(memberships);
   } catch (err) {
      console.error('Error en getMemberships:', err);
      res.status(500).json({ message: err.message });
   }
};

//* POST
membershipCtrl.postMembership = async (req, res) => {
   try {
      const { membershipTier, price, benefits, discount } = req.body;
      
      // Verificar si ya existe una membresía con este tier
      const existingMembership = await membershipMdl.findOne({ membershipTier });
      if (existingMembership) {
         return res.status(400).json({ message: 'Ya existe una membresía con este tier' });
      }

      const newMembership = new membershipMdl({
         membershipTier,
         price,
         benefits,
         discount
      });
      
      const savedMembership = await newMembership.save();
      res.json({ message: "Membership created successfully", membership: savedMembership });
   } catch (err) {
      console.error('Error al crear membresía:', err);
      
      // Manejar errores de validación de Mongoose
      if (err.name === 'ValidationError') {
         const errorMessages = Object.values(err.errors).map(error => error.message);
         return res.status(400).json({ message: errorMessages.join(', ') });
      }
      
      // Manejar errores de duplicación
      if (err.code === 11000) {
         return res.status(400).json({ message: 'Ya existe una membresía con este tier' });
      }
      
      res.status(500).json({ message: err.message });
   }
};

//* PUT
membershipCtrl.putMembership = async (req, res) => {
   try {
      const membershipId = req.params.id;
      const { membershipTier, price, benefits, discount } = req.body;

      // Verificar si la membresía existe
      const existingMembership = await membershipMdl.findById(membershipId);
      if (!existingMembership) {
         return res.status(404).json({ message: "Membresía no encontrada" });
      }

      // Verificar duplicados de tier (excluyendo la membresía actual)
      if (membershipTier !== existingMembership.membershipTier) {
         const tierExists = await membershipMdl.findOne({ 
            membershipTier, 
            _id: { $ne: membershipId } 
         });
         if (tierExists) {
            return res.status(400).json({ message: 'Ya existe una membresía con este tier' });
         }
      }

      const updatedMembership = await membershipMdl.findByIdAndUpdate(
         membershipId, 
         { membershipTier, price, benefits, discount }, 
         { new: true, runValidators: true }
      );
      
      res.json({ message: "Membership updated successfully", membership: updatedMembership });
   } catch (err) {
      console.error('Error al actualizar membresía:', err);
      
      // Manejar errores de validación de Mongoose
      if (err.name === 'ValidationError') {
         const errorMessages = Object.values(err.errors).map(error => error.message);
         return res.status(400).json({ message: errorMessages.join(', ') });
      }
      
      // Manejar errores de duplicación
      if (err.code === 11000) {
         return res.status(400).json({ message: 'Ya existe una membresía con este tier' });
      }
      
      res.status(500).json({ message: err.message });
   }
}

//* DELETE
membershipCtrl.deleteMembership = async (req, res) => {
   try {
      const membership = await membershipMdl.findById(req.params.id);
      
      if (!membership) {
         return res.status(404).json({ message: 'Membresía no encontrada' });
      }

      // TODO: Verificar si hay clientes con esta membresía antes de eliminar
      // const customersWithMembership = await customerModel.find({ 'membership.membershipId': req.params.id });
      // if (customersWithMembership.length > 0) {
      //    return res.status(409).json({ message: 'No se puede eliminar la membresía porque tiene clientes asociados' });
      // }

      await membershipMdl.findByIdAndDelete(req.params.id);
      res.json({ message: "Membership deleted successfully" });
   } catch (error) {
      console.error('Error al eliminar membresía:', error);
      res.status(500).json({ message: error.message });
   }
};

export default membershipCtrl;