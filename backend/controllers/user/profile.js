const { resMsg, } = require("../../middleware/authMiddleware");
const UserInfo = require("../../models/UserInfo");

const updateProfile = async (req, res) => {
    try {
        const UserId = req.user._id;
        if (!UserId) {
            return resMsg(res, "Data not Found", null, null, 500, "api/profile");
        }
        const { firstName, lastName, location, department, skills } = req.body;

        const image = req.file ? req.file.path : null;

        const updateUserData = await UserInfo.findByIdAndUpdate(UserId, { profilePicImageLink: image, firstName, lastName, location, department, skills }, { new: true })

        resMsg(res, "Successfully Update the profile.", updateUserData, null, 200, "api/profile");
    } catch (error) {
        console.log(error);
        resMsg(res, "Something went wrong.", null, null, 500, "api/profile");
    }
}

module.exports = { updateProfile }