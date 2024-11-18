// const errorHandler=require("../middleware/error_handler")
// const upload=require('../middleware/uploadFile')
// const router=require("express").Router();
// const auth=require('../middleware/auth')
// const {saveProduct,getAllProducts,getProductById,updateProduct,deleteProduct,addtoCart,deleteCartProduct,deleteItem,getCart}=require('../controllers/product_controller')


// router.post("/save",auth,upload.single('image'),saveProduct);
// router.get("/getall",auth,getAllProducts);
// router.get("/:id",auth,getProductById);
// router.put("/update/",auth,updateProduct);
// router.delete("/delete/:id",auth,deleteProduct);
// router.post("/addtocart",auth,addtoCart);
// router.delete("/deletecart",deleteCartProduct)
// router.delete("/deleteitem",deleteItem)
// router.get("/getcart",auth,getCart)



// module.exports=router;
const errorHandler = require("../middleware/error_handler");
const upload = require('../middleware/uploadFile');
const router = require("express").Router();
const auth = require('../middleware/auth');
const {
  saveProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addtoCart,
  deleteCartProduct,
  deleteItem,
  getCart,
  createOrder,
  addToCart
} = require('../controllers/product_controller');
router.get('/',(req,res)=>{
  res.status(200).json({Message:"This is product service"});
});

// Specific routes must come first
router.get("/getcart", auth, getCart);
router.post("/save", auth, upload.single('image'), saveProduct);
router.get("/getall", auth, getAllProducts);
router.post("/addtocart", auth, addToCart);
router.delete("/deletecart", deleteCartProduct);
router.delete("/deleteitem", deleteItem);
router.put("/update", auth, updateProduct);
router.delete("/delete/:id", auth, deleteProduct);
router.get("/:id", auth, getProductById); // Keep dynamic routes last
router.post("/createorder", auth, createOrder);

module.exports = router;
