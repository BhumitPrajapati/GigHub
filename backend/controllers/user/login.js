const userInfoSchema = require("../../models/UserInfo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { resMsg, isNullUndefineOrEmpthy } = require("../../middleware/authMiddleware");

const createUser = async (req, res) => {
  const { firstName, lastName, location, department, skills, profilePicImageLink, email, password, role } = req.body;

  const userNameInitials = firstName.substring(0, 4);
  userId = userNameInitials + crypto.randomBytes(5).toString("hex");

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    if (!isNullUndefineOrEmpthy(email) && !isNullUndefineOrEmpthy(password)) {
      const newUser = new userInfoSchema({ userId, firstName, lastName, email, password: hashedPassword, location, profilePicImageLink, department, skills, role });

      const _id = newUser._id.toString() ?? '';
      const token = jwt.sign(
        { _id: _id, userId: newUser.userId, email: newUser.email, role: newUser.role, profilePicImageLink: newUser.profilePicImageLink, firstName: newUser.firstName },
        process.env.JWT_SECRET, { expiresIn: "1h" });
      await newUser.save();
      resMsg(res, "User registered successfully", token, null, 200, "api/createUser");
    } else {
      resMsg(res, "Please Enter email or Password Correct.", null, null, 400, "api/createUser");
    }
  } catch (error) {
    console.log(error);
    resMsg(res, "Something was wrong.", null, error, 500, "api/createUser");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!isNullUndefineOrEmpthy(email) && !isNullUndefineOrEmpthy(password)) {
      const user = await userInfoSchema.findOne({ email });
      if (!user)
        return resMsg(res, "User Not found, Please SignUp!", null, null, 400, "api/login");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return resMsg(res, "Invalid credentials", null, null, 400, "api/login");
      const token = jwt.sign({ _id: user._id.toString(), userId: user.userId, email: user.email, role: user.role, profilePicImageLink: user.profilePicImageLink, firstName: user.firstName },
        process.env.JWT_SECRET, { expiresIn: "1h" });
      return resMsg(res, "Successfully Login", token, null, 200, "api/login");
    } else {
      resMsg(res, "Incorrect email or password.", null, null, 500, "api/login");
    }
  } catch (error) {
    console.log(error);
    resMsg(res, "Something went wrong.", null, error, 500, "api/login");
  }
};

const logOut = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 })
    return resMsg(res, "Successfully Logout", null, null, 200, "api/logout");
  } catch (error) {
    console.log("Error in logout", error);
    return resMsg(res, "Something was Wrong", null, null, 500, "api/logout");
  }
}

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { createUser, login, logOut, checkAuth };
