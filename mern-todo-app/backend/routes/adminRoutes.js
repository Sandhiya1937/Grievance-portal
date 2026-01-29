const express = require("express");
const {
  getAllComplaints,
  updateStatus
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/complaints", getAllComplaints);
router.put("/complaints/:id", updateStatus);

module.exports = router;
