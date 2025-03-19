//CRUD Methods

const membershipCtrl = {};
import membershipMdl from "../models/membershipsMdl.js"

//* GET
membershipCtrl.getMemberships = async (req, res) => {
   try {
      const memberships = await membershipMdl.find();
      res.json(memberships);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
};

//* POST
membershipCtrl.postMembership = async (req, res) => {
   const newMembership = new membershipMdl(req.body);
   try {
      const savedMembership = await newMembership.save();
      res.json(savedMembership);
   } catch (err) {
      res.status(400).json({ message: err.message });
   }
};

//! PUT ESTO AÚN ESTÁ EN PROCESO ES DE REVISARLO
membershipCtrl.putMembership = async (req, res) => {
   try {
      const membership = await membershipMdl.findByIdAndUpdate
         (req.params.id, req.body, { new: true });
      if (!membership) return res.status(404).json({ message: "Membership not found." });
      res.json(membership);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
}

//* DELETE