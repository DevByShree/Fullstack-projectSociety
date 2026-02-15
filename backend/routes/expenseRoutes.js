const express = require("express");
const router = express.Router();
const {
  addExpense,
  getExpenses,
  deleteExpense
} = require("../controllers/expenseController");

router.post("/", addExpense);     // Admin
router.get("/", getExpenses);     // Admin + Member
router.delete("/:id", deleteExpense); // Admin

module.exports = router;
