const express = require("express");
const { createUser, login, logOut, checkAuth } = require("../controllers/user/login");
const googlLogin = require("../controllers/user/googleLogin");
const { routeAuth } = require("../middleware/authMiddleware");
const { updateProfile } = require("../controllers/user/profile");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/createUser", createUser);
router.post("/login", login);
router.post("/logout", logOut);
router.post('/google-login', googlLogin);
router.get("/check", routeAuth, checkAuth);

router.put('/profile', routeAuth, upload.single("image"), updateProfile)

module.exports = router;