const express = require("express");
const { getUsersFromSideBar, getMessages, sendMessages } = require("../controllers/dashboard/messagesController");
const { routeAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(routeAuth);

router.get("/users", getUsersFromSideBar);
router.get("/:id", getMessages);
router.post("/send/:id", upload.single("image"), sendMessages);


module.exports = router;