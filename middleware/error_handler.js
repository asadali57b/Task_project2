

const error=async(err,req,res,next)=>{
if(err instanceof mongoose.Error.ValidationError){
    return res.status(400).json({
        message:"validation error",
        error:err
    })
}

    res.status(500).json({
        message:"something went wrong",
        error:err
    })
    next();
}

module.exports=error