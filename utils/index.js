const amqp=require('amqplib');
const { v4: uuidv4 } = require("uuid");
async function createRpcClient() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const q = await channel.assertQueue("", {exclusive:true});

  const callbackQueue = q.queue;
  let response = null;
  let correlationId = null;

  channel.consume(
    callbackQueue,
    (msg) => {
      if (msg.properties.correlationId === correlationId) {
        console.log("Received response:", msg.content.toString());
        response = JSON.parse(msg.content.toString());
      }
    },
    { noAck: true }
  );

  const rpcCall = async (message, timeout = 5000) => {
    // 5 seconds timeout
    response = null;
    correlationId = uuidv4();
    channel.sendToQueue("rpc_queue", Buffer.from(JSON.stringify(message)), {
      correlationId,
      replyTo: callbackQueue,
    });

    const start = Date.now();
    while (!response) {
      await new Promise((resolve) => setTimeout(resolve, 50)); // Wait for response
      if (Date.now() - start >= timeout) {
        response = "Request timed out";
      }
    }
    return response;
  };

  return { rpcCall };
}




module.exports = { createRpcClient };