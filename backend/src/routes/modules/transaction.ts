import express from "express";
import {
  getTransactions,
  postTransaction,
  patchTransactions,
  deleteTransaction,
} from "../../controllers/TransactionsHandle";

const router = express.Router();

router.get("/transaction", getTransactions);
router.post("/transaction", postTransaction);
router.patch("/transaction/:id", patchTransactions);
router.delete("/transaction/:id", deleteTransaction);

export default router;
