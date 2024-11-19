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


exports.deleteCartProduct = async (req, res) => {
  const { cartId } = req.body;

  try {

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid cartId format",
      });
    }

    const deletedCart = await Product.findByIdAndDelete(cartId);

    if (!deletedCart) {
      return res.status(404).json({
        success: false,
        msg: "Cart not found",
      });
    }


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
exports.addToCart = async (req, res, next) => {
  try {
      const { productID, qty } = req.body;
      const userID = req.user._id;

      if (!productID || !qty) {
          return res.status(400).json({ error: "Product ID and quantity are required" });
      }

      if (!mongoose.Types.ObjectId.isValid(productID)) {
          return res.status(400).json({ error: "Invalid Product ID format" });
      }

      const product = await Product.findById(productID);
      if (!product) {
          return res.status(404).json({ error: "Product not found" });
      }

      const data = {
          type: "ADD_TO_CART",
          userID: userID,
          product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              qty: qty,
          },
      };

      const rpcClient = await createRpcClient();
      const result = await rpcClient.rpcCall(data);

      res.status(200).json({ result });
  } catch (error) {
      console.error(error);
      next(error);
  }
};



exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
   

    
    let cartData = {
      type: "GET_CART",
      userId: userId,
    };

    const rpcClient = await createRpcClient();
    const cartResult = await rpcClient.rpcCall(cartData);

    console.log(rpcClient);

    
    console.log("Cart result:", cartResult);

    
    if (!cartResult || cartResult.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Cart is empty. Add items to the cart before creating an order.",
      });
    }

    let orderData = {
      type: "CREATE_ORDER",
      userId: userId,
      cart: cartResult, 
    };

    const orderResult = await rpcClient.rpcCall(orderData);

    
    let clearCartData = {
      type: "CLEAR_CART",
      userId: userId,
    };

    await rpcClient.rpcCall(clearCartData);

    res.status(200).json({
      success: true,
      msg: "Order created successfully",
      data: orderResult,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};











