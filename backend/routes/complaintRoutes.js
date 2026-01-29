const express = require("express");
const {
  createComplaint,
  getUserComplaints,
  updateComplaint,
  deleteComplaint
} = require("../controllers/complaintController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createComplaint);
router.get("/", getUserComplaints);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

module.exports = router;