const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
// const setUser =async(req, res) => {
//     console.log(req.body)
//     const email =req.body;
//     const exist = await User.findOne(email)
//     if(exist){
//         // const accessToken =jwt.sign({
//         //     email:email,
//         //     // admil:savedPost.admin
//         //   },process.env.JWT_SEC,
//         //   {expiresIn:"3d"}
//         //   );
//         const token =jwt.sign({ email:exist.email,admin:exist.admin }, "shhh", { expiresIn: '3d' })
//         return  res.status(400).json({exist,token})
//     }
//     else{

//         const newPost = new User(email);
//     try {
//       const savedPost = await newPost.save();
//       const token =jwt.sign({ email: savedPost.email,admin:savedPost.admin }, "shhh", { expiresIn: '3d' })
//       return  res.status(200).json({savedPost,token});
//     } catch (err) {
//       return res.status(403).json(err);
//     }

//     }

//   };

//   const getAdmin = async (req,res) => {
//     const email = req.params.email;
//     console.log(email,"normal email")

//   try {
//     if (req.user.email !== email) {
//         // console.log(req.user.email,email,"inside user email",email,"normal email")
//       return res.send({ admin: false });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.send({ admin: false });
//     }
//     const result = { admin: user.admin };
//     return res.send(result);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//    return  res.status(500).send({ error: 'An error occurred' });
//   }
//    }

//    const getAllUser = async (req,res) => {
//     try {
//         const users = await User.find(); // Fetch all documents from the "Room" collection
//         return res.status(200).json(users); // Return the fetched data as a JSON response
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         return res.status(500).json({ error: "Internal server error" });
//       }
//    }
//    const makeAdmin = async (req,res) => {
//         const { id } = req.params; // Assuming the _id is passed in the request params

//         try {
//             const updatedUser = await User.findByIdAndUpdate(
//                 id,
//                 { admin: true },
//                 { new: true }
//             );

//             if (updatedUser) {
//                return res.json({ message: 'Admin field updated successfully', user: updatedUser });
//             } else {
//                 res.status(404).json({ message: 'User not found' });
//             }
//         } catch (error) {
//             console.error('Update error:', error);
//            return res.status(500).json({ error: 'Internal server error' });
//         }
//         console.log(id)
//     }

const setUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      email: email,
    });
    await newUser.save();
    const jsontoken =jwt.sign({ email:newUser.email,admin:newUser.isAdmin }, "shhh", { expiresIn: '3d' })
    console.log(jsontoken)
    const userr={
      newUser,
      jsontoken
    }
    return res
      .status(201)
      .json({ message: "User registered successfully", user: userr});
  } catch (err) {
    console.error(err);
   return res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
 return res.json({ message: "Login successful", user: req.user });
};
const resetPassword = async (req, res) => {
  const {token} =req.params;
  const { newPassword } = req.body;

  if(!token){
    return res.status(404).json({ success: false, message: "User Not Valid" });
  }
  try{
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log(user)
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }
  
    // Update user password and clear the token
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
  
    await user.save();
  
    return res.json({ message: 'Password reset successful.' });
  }catch(error){
    console.error(error);
   return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email)
  const user = await User.findOne({ email: req.body.email });
  console.log(email)
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }
  const token = crypto.randomBytes(20).toString("hex");
  (user.resetPasswordToken = token),
    (user.resetPasswordExpires = Date.now() + 3600000);
  await user.save();
  let resetPasswordUrl = "";

  const isLocal = req.hostname === "localhost" || req.hostname === "127.0.0.1";
  if (isLocal) {
    resetPasswordUrl = `http://localhost:5173/password/reset/${token}`;
  } else {
    resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${token}`;
  }

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
   return res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined,
      user.resetPasswordExpires = undefined;
    console.error(error);
   return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  setUser,
  forgetPassword,
  // getAdmin,
  // getAllUser,
  login,
  resetPassword
  // makeAdmin
};
