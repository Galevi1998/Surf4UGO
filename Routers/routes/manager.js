const express = require("express");
const path = require("path");
const router = express.Router();
const cookieParser = require('cookie-parser');
const LogInCollection = require("../../mongodb");

// Middleware configuration
router.use(cookieParser());
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// GET route to display all accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await LogInCollection.find();
    res.render('manager', { accounts });
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
});

// GET route to delete an account
router.get('/delete/:accountId', async (req, res) => {
  const accountId = req.params.accountId;
  try {
    await LogInCollection.findByIdAndRemove(accountId);
    res.redirect('/manager');
  } catch (error) {
    console.error("Failed to delete account:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

// POST route to update an account's permission
router.post('/edit/:accountId', async (req, res) => {
  const accountId = req.params.accountId;
  const { permission } = req.body;
  try {
    await LogInCollection.findByIdAndUpdate(accountId, { permission });
    res.redirect('/manager');
  } catch (error) {
    console.error("Failed to update account:", error);
    res.status(500).json({ error: "Failed to update account" });
  }
});

module.exports = router;
