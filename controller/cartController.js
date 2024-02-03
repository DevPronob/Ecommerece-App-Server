const express = require("express");
const router = express.Router();
const passport = require("passport");
const store = require("../utils/store");
// Bring in Models & Utils
const Category = require("../models/categoryModel");
const Cart = require("../models/cartModel");
const sendEmail = require("../utils/sendEmail");
const { Mongoose } = require("mongoose");
const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

// const setCategory = async (req, res) => {
//   const { name, image, isActive, slug, description } = req.body;

//   try {
//     const newCategory = new Category({
//       name,
//       image,
//       isActive,
//       slug,
//       description,
//     });
//     await newCategory.save();
//     res
//       .status(201)
//       .json({ message: "Category added successfully", category: newCategory });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }

// // try {
// //     const result = await Category.insertMany(categoriesData);
// //     console.log('Categories inserted:', result);
// //     res.status(201).json({ message: "Categories added successfully", categories: result });
// //   } catch (error) {
// //     console.error('Error inserting categories:', error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// };

const setCart = async (req, res) => {
    try {
        const user = req.params?.id;
        const items = req.body.products;
        const products = store.caculateItemsSalesTax(items);
    
        const existingCart = await Cart.findOne({ user: user });
    
        if (existingCart) {
          existingCart.products.push(...products);
          existingCart.updated = new Date();
          await existingCart.save();
          return res.status(200).send({ message: "Cart Updated Successfully", cart: existingCart });
        } else {
          const newCart = new Cart({ user: user, products });
          await newCart.save();
          return res.status(200).send({ message: "Cart Added Successfully", cart: newCart });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
      }
};

const getCartByEmail = async (req, res) => {
  const user = req.query.email;
  const aggregateQuery =[
    {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'UserData'
          }
        },
        {
          $match:{
            "UserData.email":user
          }
        }
  ]

  const result = await Cart.aggregate(aggregateQuery);

  return  res.status(200).send(result);

};

const deleteCartByEmail = async (req, res) => {
  const user = req.query.email;
  const cartId = req.query.cartId;
  const userB = req.user?.email;
  console.log(user, cartId);
  const aggregateQuery = [
    {
      $match: {
        user: user, // Match the user's email
        _id: new mongoose.Types.ObjectId(cartId), // Match the cartId as an ObjectId
      },
    },
    // {
    //     $unwind: "$products" // Unwind the products array
    // },
    // {
    //     $match: {
    //         "products._id": Mongoose.Types.ObjectId("65bb3d1ec46b6b122ab2e876") // Match the specific product ObjectId
    //     }
    // }
  ];
  try {
    // if(user ==userB){

    // }
    const result = await Cart.aggregate(aggregateQuery);
    const deleteCart = await Cart.findByIdAndDelete(result._id);
    // res.send(result);
    return res.status(200).json({
      message: " Cart Item Deleted Successfully",
      cart: deleteCart,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// const updateCategory = async (req, res) => {
//   const id = req.params.id;
//   const updateData = req.body;
//   try {

//       const updateCategory = await Category.findByIdAndUpdate(id, updateData, {
//         new: true, // To return the updated document
//         runValidators: true,
//       });
//      return res.status(200).json({
//         message: "category updated successfully",
//         categories: updateCategory,
//       });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
// };

const deleteCartItem = async (req, res) => {
  

  const user = req.query.email;
const productId = req.query.productId;

try {
  const aggregateQuery = [
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'UserData'
      }
    },
    {
      $match: {
        "UserData.email": user,
        // "products.product": new mongoose.Schema.ObjectId(productId)
      }
    },
    {
      $unwind: "$products"
    },
    {
      $match: {
        "products.product": new mongoose.Types.ObjectId(productId)
      }
    }
  ];

  const result = await Cart.aggregate(aggregateQuery);

  if (result.length > 0) {
    const deleteCartProduct = await Cart.findOneAndDelete({ _id: result[0]._id });
    return res.status(200).json({ message: "Cart product deleted Successfully", deleteCartProduct: deleteCartProduct });
  } else {
    return res.status(404).json({ message: "Cart or product not found" });
  }
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Internal Server Error" });
}

  // const deleteCartProduct = await Cart.findOneAndDelete(result._id)
  //    try{
  //     const userCartProduct =await result?.categories?.map(ite =>{
  //         return ite
  //     })
  //     return res.status(200).json({
  //         message: "Cart Product delete successfully",
  //         categories: userCartProduct
  //       });
  //    } catch(err){
  //     return res.status(500).json({
  //         message: "Ca successfully",
  //         categories: err
  //       });
  //    }

  // const updateData = req.body;
  //   try {

  //       const deleteCategory = await Category.findByIdAndDelete(id);
  //      return res.status(200).json({
  //         message: "category delete successfully",
  //         categories: deleteCategory,
  //       });
  //     } catch (err) {
  //       console.error(err);
  //       return res.status(500).json({ message: "Internal Server Error" });
  //     }
};

// // const deleteCategory = async (req, res) => {
// //   const id = req.params.id;
// //   // const updateData = req.body;
// //   try {

// //       const deleteCategory = await Category.findByIdAndDelete(id);
// //      return res.status(200).json({
// //         message: "category delete successfully",
// //         categories: deleteCategory,
// //       });
// //     } catch (err) {
// //       console.error(err);
// //       return res.status(500).json({ message: "Internal Server Error" });
// //     }
// // };

// // try {
// //
// //   const newCategory = new Category({
// //     name, image, isActive, slug, description
// //   });
// //   await newCategory.save();
// //   res
// //     .status(201)
// //     .json({ message: "User registered successfully", category: newCategory });
// // } catch (err) {
// //   console.error(err);
// //   res.status(500).json({ message: "Internal Server Error" });
// // }

module.exports = {
  //   setCategory,
  getCartByEmail,
  setCart,
  deleteCartByEmail,
  deleteCartItem,
  //   updateCategory,
  //   deleteCategory,
};
