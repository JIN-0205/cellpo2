"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find().select("-password");
        res.status(200).json(users);
    }
    catch (err) {
        console.error("Get Users Error:", err);
        res.status(500).json({ error: "Unable to get users" });
    }
});
// Get user by id
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.params.id).select("-password");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Get User By ID Error:", error);
        res.status(500).json({ error: `Unable to get the user` });
    }
});
// Register
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Username and Password are required" });
            return;
        }
        const existingUser = yield user_model_1.User.findOne({ username });
        if (existingUser) {
            res.status(409).json({ message: "Username already exists" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new user_model_1.User({
            username,
            password: hashedPassword,
        });
        yield newUser.save();
        const userToReturn = newUser.toObject();
        delete userToReturn.password;
        res.status(201).json(userToReturn);
    }
    catch (error) {
        console.error("Register User Error:", error);
        res.status(500).json({ error: "Unable to register user" });
    }
});
// Login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Username and password are required." });
            return;
        }
        const user = yield user_model_1.User.findOne({ username });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(403).json({ message: "Password is incorrect" });
            return;
        }
        req.session.isAuthenticated = true;
        req.session.userId = user.id.toString();
        res.json({ message: "Login successful" });
    }
    catch (error) {
        console.error("Login User Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
// Profile
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = yield user_model_1.User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error("User Profile Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
// Logout
const logoutUser = (req, res) => {
    try {
        req.session = null;
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        console.error("Logout User Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};
// Update user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).select("-password");
        if (!user) {
            res.status(404).json({ error: `The user does not exist` });
            return;
        }
        res.status(200).json({ message: "Update user successfully", user });
    }
    catch (err) {
        console.error("Failed to update user:", err);
        res.status(500).json({ error: `Unable to update the user` });
    }
});
// Delete user by id
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findByIdAndDelete(req.params.id).select("-password");
        if (!user) {
            res.status(404).json({ error: "The user does not exist" });
            return;
        }
        res.status(200).json({ message: "Deleted the user", user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to delete the user" });
    }
});
exports.default = {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    userProfile,
    logoutUser,
    updateUser,
    deleteUserById,
};
