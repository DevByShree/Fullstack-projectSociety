const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  category: String,
  description: String,
  date: String
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
