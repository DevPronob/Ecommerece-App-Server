const express = require('express');
const router = express.Router();
const passport = require('passport');

// Bring in Models & Utils
const Product = require('../models/productModel');
const Category = require("../models/categoryModel");

const setProduct = async (req, res) => {
    try {
        const {
          category,
          name,
          reviews,
          price,
          brand,
          productCode,
          offerPrice,
          availability,
          available, // Added the missing "available" field
          description,
          images,
          featuredImage,
          packaging,
          delivery,
          size,
          isTrending,
          isDealOfTheDay,
          isBestSeller,
          year,
        } = req.body;
      
        const newProduct = new Product({
          category,
          name,
          reviews,
          price,
          brand,
          productCode,
          offerPrice,
          availability,
          available,
          description,
          images,
          featuredImage,
          packaging: {
            boxType: packaging.boxType,
            giftWrap: packaging.giftWrap, // Added the missing "giftWrap" field
          },
          delivery,
          size,
          isTrending,
          isDealOfTheDay,
          isBestSeller,
          year,
        });
      
        const savedProduct = await newProduct.save(); // Changed Product.save() to newProduct.save()
        res.status(201).json(savedProduct);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    

  };



  const getProduct = async (req, res) => {
    let {
              sortOrder,
              minPrice,
              maxPrice,
              category,
              brand,
              page = 1,
              limit = 10
            } = req.query;
            sortOrder = sortOrder === 'asc' ? 1 : -1;
          
            const aggregateQuery = [
                      { $match: {"category":{ $in: [category] }} },
                    //   {
                    //     $sort: {
                    //       price: sortOrder,
                    //     },
                    //   },
            ]
            const result = await Product.aggregate(aggregateQuery);
            res.send(result)
    }

    // try {
    //     let {
    //       sortOrder,
    //       minPrice,
    //       maxPrice,
    //       category,
    //       brand,
    //       page = 1,
    //       limit = 10
    //     } = req.query;
    //     sortOrder = sortOrder === 'asc' ? 1 : -1;
      
    //     const matchStage = {};
      
    //     if (minPrice && maxPrice) {
    //       matchStage.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    //     }
      
    //     if (category) {
    //       matchStage.category = category;
    //     }
      
    //     if (brand) {
    //       matchStage.brand = brand;
    //     }
      
    //     const aggregateQuery = [
    //       { $match: matchStage },
    //       {
    //         $sort: {
    //           price: sortOrder,
    //         },
    //       },
    //       {
    //         $facet: {
    //           metadata: [
    //             { $count: 'total' },
    //             { $addFields: { page: parseInt(page), limit: parseInt(limit) } },
    //           ],
    //           products: [
    //             { $skip: (parseInt(page) - 1) * parseInt(limit) },
    //             { $limit: parseInt(limit) },
    //             // Additional stages for projecting or modifying product data if needed
    //           ],
    //         },
    //       },
    //     ];
      
    //     const [result] = await Product.aggregate(aggregateQuery);
      
    //     if (!result || !result.products || result.products.length === 0) {
    //       return res.status(404).json({
    //         message: 'No products found.',
    //       });
    //     }
      
    //     res.status(200).json({
    //       products: result.products,
    //       totalPages: Math.ceil(result.metadata[0].total / limit),
    //       currentPage: result.metadata[0].page,
    //       totalProducts: result.metadata[0].total,
    //     });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({
    //       error: 'Internal Server Error',
    //     });
  
        // const products = await Product.find({})
        //   .populate('category') // Populate the 'categories' field
        //   .exec();
        // const products = await Product.aggregate([
            
        //     {
        //         $lookup: {
        //             from: 'categories', // The name of the collection to perform the join with (Category collection)
        //             localField: 'category', // The field from the input documents (Product collection)
        //             foreignField: '_id', // The field from the documents of the "from" collection (Category collection)
        //             as: 'categoryDetail', // The name to give to the output array
        //         }
        //       },

        //     // {
        //     //     $match: { price: { $gte: 150 } }
        //     //   },
        //     // //   { $count : "total product upper 50" },
        //     //   {
        //     //     $group: {
        //     //         _id: null,
        //     //         ids: { $push: "$name" },
        //     //         totalPrice: { $sum: "$price" }
        //     //     }
        //     // }
        //     // {
        //     //   $match: { price: { $gte: 50 } }
        //     // },
        //     // // { $project : { name : 1, _id:0 } },
        //     // // { $count : { $sum: "price" } }
        //     // {
        //     //     $group: {
        //     //       _id: null,
        //     //       totalPrice: { $sum: "$price" }
        //     //     }
        //     // Add other aggregation stages if needed
        //   ]).exec();

//   };

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
    setProduct,
    getProduct
  };
  