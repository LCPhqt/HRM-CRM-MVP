const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const {
  listCustomers,
  countCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  importCustomers,
  statsCustomers,
  listCustomerLogs,
  listDeletedCustomers,
  restoreCustomer,
  restoreMany,
  deleteCustomerHard,
  deleteManyHard
} = require("../controllers/customerController");

const router = express.Router();

router.use(requireAuth);

// Read: staff + admin
router.get("/", listCustomers);
router.get("/count", countCustomers);
router.get("/stats", statsCustomers);
router.get("/deleted", listDeletedCustomers);
router.post("/import", importCustomers);
router.post("/restore/bulk", restoreMany);
router.post("/:id/restore", restoreCustomer);
router.delete("/:id/hard", deleteCustomerHard);
router.post("/hard/bulk", deleteManyHard);
router.get("/:id/logs", listCustomerLogs);
router.get("/:id", getCustomer);

// Write: staff quản lý khách hàng của chính mình; admin quản lý tất cả
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;


