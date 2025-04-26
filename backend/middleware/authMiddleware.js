const jwt = require("jsonwebtoken");
const UserInfo = require("../models/UserInfo");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const resMsg = (res, message, data, error, statusCode, url) => {
  const response = { message, data, error, statusCode, url };
  return res.status(statusCode).json(response);
};

const isNullUndefineOrEmpthy = (parms) => {
  if (parms == undefined || parms == null || parms == "") return true;
  else return false;
};

const genrateToken = (_id, userId, email, role, res) => {
  const token = jwt.sign(
    {  _id,  userId,  email,  role, },
    process.env.JWT_SECRET, { expiresIn: "1h" });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV !== "devlopment"
  });
  return token;
}

const routeAuth = async (req, res, next) => {
  let token = req.headers.token;
//   let a = req.headers.token;
// console.log("token", token);
// console.log("a", a);

    if (!token) {
        return res.status(401).json({ 
            status: "error", 
            message: "Not authorized, no token provided" 
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded token:", "   ID: ",decoded._id);

        // Find user by id - use either decoded._id or decoded.userId depending on your token structure
        const user = await UserInfo.findById(decoded._id.toString() || decoded.userId);

        if (!user) {
            return res.status(401).json({ 
                status: "error", 
                message: "User not found" 
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.log("Auth middleware error:", error);
        return res.status(401).json({ 
            status: "error", 
            message: "Not authorized, token failed" 
        });
    }
}

module.exports = { authMiddleware, resMsg, isNullUndefineOrEmpthy, genrateToken, routeAuth };
