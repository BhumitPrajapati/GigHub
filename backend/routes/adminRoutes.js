const express = require('express');
const { getAllUserLists, deleteUser } = require('../controllers/admin/userLists')

const router = express.Router();

router.get("/getAllUserLists", getAllUserLists)
router.delete("/deleteUser/:userId", deleteUser);

module.exports = router;
