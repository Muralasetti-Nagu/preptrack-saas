const express = require("express");
const router = express.Router();

const {
    addProblem,
    getProblems,
    deleteProblem,
    updateProblem
} = require("../controllers/problemController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, addProblem);
router.get("/", protect, getProblems);
router.put("/:id", protect, updateProblem);
router.delete("/:id", protect, deleteProblem);

module.exports = router;