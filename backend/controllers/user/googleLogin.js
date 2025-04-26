const { OAuth2Client } = require('google-auth-library');
const userInfoSchema = require("../../models/UserInfo");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require("crypto");
const { resMsg } = require("../../middleware/authMiddleware");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Add this new route
const googlLogin = async (req, res) => {
    const { tokenId } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const { email_verified, name, email } = ticket.getPayload();

        if (email_verified) {
            const user = await userInfoSchema.findOne({ email });

            if (user) {
                // User exists, generate JWT token
                const token = jwt.sign(
                    { _id: user._id.toString(), userId: user.userId, email: user.email, role: user.role, },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                );
                return resMsg(res, "Google Login Successful", token, null, 200, "/api/googlelogin");
            } else {
                const userNameInitials = name.split(' ')[0].substring(0, 4);
                const userId = userNameInitials + crypto.randomBytes(5).toString("hex");
                // Create new user
                const newUser = new userInfoSchema({
                    firstName: name.split(' ')[0],
                    lastName: name.split(' ')[1] || '',
                    email,
                    password: '', // Google login doesn't need password
                    isGoogleUser: true,
                    role: 'user', // Default role
                    userId: userId
                });

                await newUser.save();
                const token = jwt.sign(
                    { _id: newUser._id.toString(), userId: newUser.userId, email: newUser.email, role: newUser.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                );

                return resMsg(res, "Successfully register user from google", token, null, 200, "/api/googlelogin");
            }
        } else {
            return resMsg(res, "Google authentication failed. Email not verified.", null, null, 400, "/api/googlelogin");
        }
    } catch (error) {
        console.log('Error in Google login:', error);
        return resMsg(res, "Something went wrong", null, null, 500, "/api/googlelogin")
    }
};

module.exports = googlLogin; 