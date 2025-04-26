const express = require("express");
const { addList, getAllLists, getUserByLists, deleteList, updateList } = require("../controllers/dashboard/listings");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/addList", upload.single("image"), addList);
router.get("/getAllLists", getAllLists);
router.post("/getUserByLists/:userId?", getUserByLists);
router.delete("/deleteList/:id", deleteList);
router.put("/updateList/:id", upload.single("image"), updateList);

module.exports = router;