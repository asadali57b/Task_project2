const mongoose = require("mongoose");
const dB_connection=mongoose.connect("mongodb://localhost:27017/ecommerce_product_services", 
    
).then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports=dB_connection;