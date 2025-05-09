const WatchesController = {};

import WatchesModel from "../models/watchesMdl.js";

// SELECT
WatchesController.getWatches = async (req, res) => {
  const Watches = await WatchesModel.find(). populate("brandId");
  res.json(Watches);
};

// INSERT
WatchesController.insertWatches = async (req, res) => {
  const { model , brandId , price , category , description , photos , availability } = req.body;
  const newWatch = new WatchesModel({ model , brandId , price , category , description , photos , availability});
  await newWatch.save();
  res.json({ message: " Watches saved " });
};

// DELETE
WatchesController.deleteWatches = async (req, res) => {
  await WatchesModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Watches deleted" });
};

// UPDATE
WatchesController.updateWatches = async (req, res) => {
  const { model , brandId , price , category , description , photos , availability } = req.body;
  const updateWatches = await WatchesModel.findByIdAndUpdate(
    req.params.id,
    { model , brandId , price , category , description , photos , availability },
    { new: true }
  );
  res.json({ message: "watches updated successfully" });
};


export default WatchesController; 