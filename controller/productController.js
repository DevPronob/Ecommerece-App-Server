const express = require("express");
const router = express.Router();
const passport = require("passport");

// Bring in Models & Utils
const Product = require("../models/productModel");
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
    res.status(500).json({ message: "Internal Server Error" });
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
    limit = 10,
  } = req.query;
  sortOrder = sortOrder === "asc" ? 1 : -1;

  console.log(parseInt(minPrice), parseInt(maxPrice), "okkk");

  const aggregateQuery = [
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryData",
      },
    },
  ];

  const hasFilters =
    category || brand || (minPrice !== undefined && maxPrice !== undefined);
  // res.send(hasFilters ? true : false)

  if (hasFilters) {
    const matchConditions = {};
    if (category) {
      matchConditions["categoryData.name"] = category;
    }

    if (brand) {
      matchConditions["brand"] = brand;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      matchConditions["price"] = {
        $gte: parseInt(minPrice),
        $lte: parseInt(maxPrice),
      };
    }

    aggregateQuery.push({
      $match: matchConditions,
    });
  }

  const result = await Product.aggregate(aggregateQuery);
 return res.send(result);
};
const getProductDetails = async (req, res) => {
  const id = req.params.id;
  // console.log(id)
  try {
    const productDetail = await Product.findById(id);
    if (!productDetail) {
      // If no product is found with the given ID
      return res.status(404).json({
        error: "Product not found",
        message: "No product found with the provided ID.",
      });
    }
   return res.status(201).json(productDetail);
  } catch (error) {
   return res.status(500).json({
      error: "Internal Server Error",
      message:
        "An unexpected error occurred while fetching the product details.",
    });
  }
};

const getProductDelete = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const DeletedProduct = await Product.findByIdAndDelete(id);
    if (!DeletedProduct) {
      // If no product is found with the given ID
      return res.status(404).json({
        error: "Product not found",
        message: "No product found with the provided ID.",
      });
    }
   return res.status(204).json(DeletedProduct);
  } catch (error) {
   return res.status(500).json({
      error: "Internal Server Error",
      message:
        "An unexpected error occurred while fetching the product delete.",
    });
  }
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  console.log(id, updateData, "updated document");

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // To return the updated document
      runValidators: true,
    });
    if (!updatedProduct) {
      // If no product is found with the given ID
      return res.status(404).json({
        error: "Product not found",
        message: "No product found with the provided ID.",
      });
    }
   return res.status(201).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
   return res.status(500).json({
      error: "Internal Server Error",
      message:
        "An unexpected error occurred while fetching the product update.",
    });
  }
};

const SearchProductByName = async (req, res) => {
  try {
    const name = req.params.name;
    console.log(name, "name");
    const findProduct = await Product.find(
      { name: { $regex: new RegExp(name, "i") } },
      { name: 1, price: 1, featuredImage: 1, _id: 1 }
    );

    if (findProduct.length === 0) {
      return res.status(404).json({
        error: "Product not found",
        message: "No product found with the provided name.",
      });
    }

   return res.status(200).json({
      message: "Product found successfully",
      findProduct,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while fetching the product found.",
    });
  }
};

//  const aggregateQuery = [
//   {
//     $lookup: {
//       from: 'categories',
//       localField: 'category',
//       foreignField: '_id',
//       as: 'categoryData'
//     }
//   }
// ];

// // Check if any filter parameters are provided
// const hasFilters = category || brand || (minPrice !== undefined && maxPrice !== undefined);

// if (hasFilters) {
//   const matchConditions = {};

//   if (category) {
//     matchConditions['categoryData.name'] = category;
//   }

//   if (brand) {
//     matchConditions['brand'] = brand;
//   }

//   if (minPrice !== undefined && maxPrice !== undefined) {
//     matchConditions['price'] = {
//       $gte: parseInt(minPrice),
//       $lte: parseInt(maxPrice)
//     };
//   }

//   aggregateQuery.push({
//     $match: matchConditions
//   });
// }

// const result = await Product.aggregate(aggregateQuery);
// res.send(result);

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
  getProduct,
  getProductDetails,
  getProductDelete,
  updateProduct,
  SearchProductByName,
};
