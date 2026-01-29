const Complaint = require("../models/Complaint");

exports.createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if complaint exists and belongs to user
    const complaint = await Complaint.findOne({ 
      _id: id, 
      createdBy: req.user.id 
    });

    if (!complaint) {
      return res.status(404).json({ 
        message: "Complaint not found or you don't have permission to edit it" 
      });
    }

    // Only allow updating title and description, not status
    const { title, description } = req.body;
    
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }
    );

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if complaint exists and belongs to user
    const complaint = await Complaint.findOne({ 
      _id: id, 
      createdBy: req.user.id 
    });

    if (!complaint) {
      return res.status(404).json({ 
        message: "Complaint not found or you don't have permission to delete it" 
      });
    }

    await Complaint.findByIdAndDelete(id);
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};