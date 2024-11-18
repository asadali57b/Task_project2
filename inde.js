const express=require("express");
const app=express();
require('./db')
const product_routes=require("./routes/products_routes");
app.use(express.json());

//   app.use("/", (req, res)=>{
//     res.send("hello ECOMMERCE");
//   })
app.use("/",product_routes);
app.use((req,res,next) => {
    res.status(404).json({
        success:false,
        msg:"page not found"
    })
    next();
});

app.listen(6000,()=>console.log("server is running"));