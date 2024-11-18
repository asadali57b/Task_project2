const ProductRpcClient = require('../utils/index');

const startMQ=async(req,res,next)=>{
    let rpcClient;
    if (!rpcClient) {
        rpcClient = new ProductRpcClient();
        await rpcClient.connect();
    }

    req.rpcClient = rpcClient;
    next();
}

module.exports=startMQ