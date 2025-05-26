//CRUD Methods

const customersCtrl = {};
import customersMdl from "../models/customersMdl.js"
import bcryptjs from "bcryptjs";

//* GET
customersCtrl.getCustomers = async (req, res) => {
   try {
      const customers = await customersMdl.find().populate("membership.membershipId");
      res.json(customers);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

//* POST
customersCtrl.postCustomer = async (req, res) => {
   const customer = new customersMdl(req.body);
   try {
      const newCustomer = await customer.save();
      res.status(201).json(newCustomer);
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
};

//* PUT
customersCtrl.putCustomer = async (req, res) => {
   try {
      const customer = await customersMdl.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!customer) return res.status(404).json({ message: "Customer not found" });
      res.json(customer);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

//* DELETE
customersCtrl.deleteCustomer = async (req, res) => {
   try {
      const customer = await customersMdl.findByIdAndDelete(req.params.id);
      if (!customer) return res.status(404).json({ message: "Customer not found" });
      res.json({ message: "Customer deleted successfully" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

export default customersCtrl;