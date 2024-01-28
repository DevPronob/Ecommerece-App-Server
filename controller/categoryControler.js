const express = require("express");
const router = express.Router();
const passport = require("passport");

// Bring in Models & Utils
const Category = require("../models/categoryModel");

const setCategory = async (req, res) => {
  const { name, image, isActive, slug, description } = req.body;


  try {
    const newCategory = new Category({
      name,
      image,
      isActive,
      slug,
      description,
    });
    await newCategory.save();
    res
      .status(201)
      .json({ message: "Category added successfully", category: newCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }

// try {
//     const result = await Category.insertMany(categoriesData);
//     console.log('Categories inserted:', result);
//     res.status(201).json({ message: "Categories added successfully", categories: result });
//   } catch (error) {
//     console.error('Error inserting categories:', error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
};

const getCategory = async (req, res) => {
    try {
        const categories = await Category.find({});
       return res.status(200).json({
          message: "All categories found successfully",
          categories: categories,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
};

// try {
//
//   const newCategory = new Category({
//     name, image, isActive, slug, description
//   });
//   await newCategory.save();
//   res
//     .status(201)
//     .json({ message: "User registered successfully", category: newCategory });
// } catch (err) {
//   console.error(err);
//   res.status(500).json({ message: "Internal Server Error" });
// }

module.exports = {
  setCategory,
  getCategory,
};
