const sendEmailVerification = require("../helper/emailVerification")
const comparePassword = require("../middleware/comparePassword")
const generateUserToken = require("../middleware/createUserToken")
const  hashPassword  = require("../middleware/hashPassword")
const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");
 const fs=require('fs')
 const path=require('path')

class AuthController{

    // --------------User Authentication-------------------
    async registerUser(req, res) {
    try {
      const { name, email, password } = req.body;
      let userImage;

      if (!name || !email || !password) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "All fields are required!" });
      }

      if (req.file) {
        userImage = req.file.path;
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(409).json({
          status: false,
          message: "User already exists"
        });
      }

      const passwordHashed = await hashPassword(password);
      const newUser = await UserModel.create({
        name,
        email,
        password: passwordHashed,
        image: userImage
      });

      const token = await generateUserToken(newUser);
      await sendEmailVerification(req, newUser, token);

      return res.status(201).json({
        status: true,
        message: "User created successfully",
        data: newUser,
        token
      });

    } catch (error) {
      console.error("Register Error:", error);
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message  // You can remove this in production
      });
    }
  }

    async verifyEmail(req,res){
        try {
            const {token}=req.params
            const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)
            // console.log(decode)
            await UserModel.findByIdAndUpdate(decode.userId,{isVerified:true})
            res.send("Email Verified")
        } catch (error) {
            
        }
    }

    async loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const exitingUser = await UserModel.findOne({ email });

        if (!exitingUser) {
            return res.status(400).json({
                status: false,
                message: "User does not exist",
            });
        }

        const passwordMatched = await comparePassword(password, exitingUser.password);
        if (!passwordMatched) {
            return res.status(400).json({
                status: false,
                message: "Incorrect password",
            });
        }

        if (!exitingUser.isVerified) {
             return res.status(400).json({
                status: false,
                message: "User is not verified",
            });
        }

         const token = await generateUserToken(exitingUser);

        return res.status(200).json({
            status: true,
            message: "Logged in successfully",
            token,
            // exitingUser
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
}

    async profile(req,res){
       try {
        return res.status(200).json({
            message: "Profile fetched successfully",
            data: req.user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching profile",
            error: error.message
        });
    }
    }

    async updateProfile(req, res) {
    try {
    const{name,newPassword,email}=req.body
        const id = req.user.userId; 
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "No image file provided"
            });
        }

         const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

         if (user.image && fs.existsSync(user.image)) {
            fs.unlinkSync(user.image);
        }

     const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { image: req.file.path,name,email,password:await hashPassword(newPassword)},
      { new: true }  
    );

        return res.status(200).json({
            status: true,
            message: "Profile updated successfully",
            data:updatedUser
        });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
        console.error("Error updating profile image:", error);
        return res.status(500).json({
            status: false,
            message: "Error updating profile image",
            error: error.message
        });
    }
    }

}

module.exports=new AuthController