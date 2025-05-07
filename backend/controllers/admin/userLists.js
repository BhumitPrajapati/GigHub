const { isNullUndefineOrEmpthy, resMsg } = require("../../middleware/authMiddleware");
const UserInfo = require("../../models/UserInfo");
const userListing = require("../../models/Listing")

const getAllUserLists = async (req, res) => {
    try {
        const { _id } = req.query;
        if (_id) {
            const result = await UserInfo.findById(_id);
            if (!result) {
                return resMsg(res, "User not found", null, null, 404, "/admin/getUserLists");
            }
            return resMsg(res, "Successfuly fetch the data", result, null, 201, "/getAllUserLists");
        }
        // console.log(result);
        const allUsers = await UserInfo.find({});
        if (allUsers.length > 0) {
            // console.log(allUsers);
            resMsg(res, "Successfully Fetching Data.", allUsers, null, 201, "/admin/getUserLists");
        } else {
            resMsg(res, "Data Not Found", null, null, 404, "/admin/getUserLists");
        }
    } catch (error) {
        console.log(error);
        resMsg(res, "Something Was Wrong", null, null, 500, "/admin/getUserLists");
    }
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const getUserListing = await userListing.deleteMany({ userId: userId });
        const deleted = await UserInfo.deleteOne({ userId: userId });

        if (!deleted) {
            return resMsg(res, "User not found", null, null, 404, "/admin/deleteUser");
        }
        resMsg(res, "User deleted successfully", null, null, 404, "/admin/deleteUser");
    } catch (error) {
        resMsg(res, "Error deleting user", null, null, 500, "/admin/deleteUser");
    }
};



module.exports = { getAllUserLists, deleteUser };