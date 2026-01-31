// 

const Complaint = require("../models/Complaint");

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("createdBy", "name email");

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, adminReply } = req.body;

    // Existing logic preserved
    const updateData = { status };

    // ✅ EXTRA LOGIC ONLY (added)
    if (status === "resolved") {
      if (!adminReply || adminReply.trim() === "") {
        return res.status(400).json({
          message: "Admin reply is required when resolving a complaint"
        });
      }

      updateData.adminReply = adminReply;
      updateData.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
