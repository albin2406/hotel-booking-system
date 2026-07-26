import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// user registration
export const registerUser = async (req, res) => {
    try{
        const{name, email, password} = req.body;

        const userExist = await User.findOne({email});

        if(userExist){
            return res.status(400).json({message: "User already exist"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({message: "User registered successfully", user});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// user login
export const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({message: "User not found!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid password!"});
        }

        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );

        res.json({message: "Login successful", token, user});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

//get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};