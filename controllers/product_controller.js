const mongoose = require("mongoose");
const Product = require('../models/products_model');
const Cart = require("../models/cart_model");
const axios = require('axios');
const sendData = require('../producer')
const {createRpcClient}=require('../utils/index')




exports.saveProduct = async (req, res) => {
  try {
    const { name, price, description, category, brand, stock, ratings, numReviews, isFeatured } = req.body;
    const user = req.user._id;
    console.log(user);
    const image = req.file ? req.file.filename : null;





    let product = new Product({
      name,
      price,
      description,
      image,
      category,
      brand,
      stock,
      user,

    });

    await product.save();
    res.status(200).json({
      success: true,
      msg: "Product added successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).send({ error: "Failed to save product" });
    console.log(`Error: ${error}`);
  }
};

// exports.getAllProducts = async (req, res) => {
//   try {
//     const AllProducts = await Product.find();

//     if (AllProducts.length === 0) {
//       return res.status(404).json({
//         success: false,
//         msg: "Product not found",
//       });
//     };
//     let alluser;

//     // Send all user data associated with products to the other server
//      await Promise.all(
//       AllProducts.map(async (element) => {
//         const userId = element.user.toString(); // Convert ObjectId to string
//         console.log("User ID:", userId);

//         try {
//           // Send user data to another server (modify URL as necessary)
//           const response = await axios.post('http://localhost:3000/dashboard', { userId });
//           alluser= response.data;
//         } catch (error) {
//           console.error('Error sending user data:', error.message);
//         }
//       })
//     );
//     const userId = alluser._id.toString()
//     // Respond after sending all user data

//     res.status(200).json({
//       success: true,
//       msg: "Products fetched successfully",
//       data: {
//         AllProducts: AllProducts.map((element) => ({
//           name:userId,
//           _id: element._id,
//           name: element.name,
//           price: element.price,
//           description: element.description,
//           image: element.image,
//           category: element.category,
//           brand: element.brand,
//           stock: element.stock,
//           user: alluser
//         })),
//       },
//     });
//   } catch (error) {
//     res.status(500).send({ error: "Failed to fetch products" });
//     console.log(`Error: ${error}`);
//   }
// };

exports.getAllProducts = async (req, res) => {
  try {
    // Step 1: Fetch all products from the database
    const allProducts = await Product.find();

    if (!allProducts) {
      return res.status(404).json({
        success: false,
        msg: "No products found",
      });
    }

    // Step 2: Fetch user data for each product using an external service
    const productsWithUserData = await Promise.all(
      allProducts.map(async (product) => {
        const userId = product.user.toString(); // Convert ObjectId to string
        let userData = null;

        try {
          console.log("User ID:", userId);
          // Send a request to the user service to get user data by userId
          const response = await axios.post('http://localhost:6001/dashboard', { userId });
          userData = response.data;
        } catch (error) {
          console.error(`Error fetching user data for user ID ${userId}:`, error.message);
        }
       
        return {
          _id: product._id,
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
          category: product.category,
          brand: product.brand,
          stock: product.stock,
          user: userData || null, // Include user data if available, else set as null
        };
      })
    );

    // Step 3: Send a response with the list of products including user data
    res.status(200).json({
      success: true,
      msg: "Products fetched successfully",
      data: {
        allProducts: productsWithUserData,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};

// controllers/productController.js
exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id; // Extract the ID from the URL parameters
    const oneProduct = await Product.findById(id); // Use the ID directly

    if (!oneProduct) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Data fetched successfully",
      data: oneProduct,
    });
  } catch (error) {
    console.log("Error fetching product:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, id, category, brand, stock } = req.body; // Extract `id` from req.body directly
    const image = req.file ? req.file.filename : null; // Handle file if provided

    // Define update fields, only adding image if it’s not null
    const update = {
      name,
      price,
      description,
      ...(image && { image }) // Only add image field if it's available
    };

    // Update product using `id` directly instead of `{ _id: userId }`
    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: update }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id; // Extract the ID from the URL parameters
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        msg: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Product deleted successfully",
      data: {
        _id: deletedProduct._id
      },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};

// exports.addtoCart = async (req, res) => {
//   const userId = req.user._id; // Replace with userId from your authentication
//   const { productId, quantity } = req.body;

//   try {
//     // Validate productId
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({
//         success: false,
//         msg: "Invalid productId format",
//       });
//     }

//     // Fetch product price
//     const product = await Product.findById(productId).select('price _id');
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         msg: "Product not found",
//       });
//     }
//     let cartItem = await Cart.findOne({ user: userId, product: productId });
//     if (cartItem) {
//       cartItem.quantity += quantity;
//       cartItem.price = product.price * cartItem.quantity;
//     } else {
//       // Create a new cart item
//       cartItem = new Cart({
//         user: userId,
//         product: productId,
//         quantity,
//         price: product.price * quantity,
//       });
//     }
//     // Save the cart item
//     await cartItem.save();
//     let data={
//       type:"Add_to_cart",
//       userId:userId,
//       product:{
//         _id:product._id,
//         name:product.name,
//         price:product.price,
//         quantity:req.body.quantity
//       }
//     }
//     const rpcClient = await createRpcClient();
//     await rpcClient.rpcCall(data);
//     res.status(200).json({
//       success: true,
//       msg: "Product added to cart successfully",
//       data: data,
//     });

//   } catch (error) {
//     console.error("Error adding product to cart:", error);
//     res.status(500).json({
//       success: false,
//       msg: "Server error",
//       error: error.message,
//     });
//   }
// };

exports.deleteCartProduct = async (req, res) => {
  const { cartId } = req.body;

  try {

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid cartId format",
      });
    }

    // Delete the cart by its ID
    const deletedCart = await Cart.findByIdAndDelete(cartId);

    if (!deletedCart) {
      return res.status(404).json({
        success: false,
        msg: "Cart not found",
      });
    }


    // Send the response with a success message
    res.status(200).json({
      success: true,
      msg: "Cart deleted successfully",
      data: deletedCart,

    });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};
exports.deleteItem = async (req, res) => {
  try {
    const { productId, cartId } = req.body;
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cartId }, // Match the cartId
      { $pull: { items: { product: productId } } }, // Remove the product from the cart items array
      { new: true } // Return the updated cart after removal
    );
    if (!updatedCart) {
      return res.status(404).json({
        success: false,
        msg: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Item deleted successfully",
      data: updatedCart,
    });

  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
}

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
   
   sendData(cart);
    res.status(200).json({
      success: true,
      msg: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
}
exports.addToCart=async(req,res,next)=>{
  let productID=req.body.productID;
  let userID=req.user
 
      let product=await Product.findById(productID);
     
      let data={
          type:"ADD_TO_CART",
          userID:userID,
          product:{
              _id:product._id,
              name:product.name,
              price:product.price,
              qty:req.body.qty

          }
          
      }

      const rpcClient = await createRpcClient();
      const result = await rpcClient.rpcCall(data);
      res.status(200).json({result});
    }
  


exports.createOrder = async (req, res) => {
 try {
  let userId=req.user._id;
  let data={
    type:"Create_order",
    userId:userId,

  }
const rpcClient=await createRpcClient();
const result=await rpcClient.rpcCall(data);
res.status(200).json({
  success: true,
  msg: "Order created successfully",
  data: result,
});
}
catch (error) {
  res.status(500).json({
    success: false,
    msg: "Server error",
    error: error.message,
  })
 }
}










