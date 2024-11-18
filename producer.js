// // const amqp=require('amqplib');

// // async function sendMessage(){
// //     try{
// //         const connection=await amqp.connect('amqp://localhost:5672');
// //         const channel=await connection.createChannel();
// //         const exchange='mail_exchange';
// //         const  routKey='product';
// //         const message={
// //             to:"hassan@gmail.com",
// //             from:"asadali@gmailc.com",
// //             subject:"hello",
// //             body:"hello"
// //         }
// //         await channel.assertExchange(exchange,'direct',{durable:false});
// //         await channel.assertQueue('mail_queue',{durable:false});
// //         await channel.bindQueue('mail_queue',exchange,routKey);
// //         await channel.publish(exchange, routKey, Buffer.from(JSON.stringify(message)));
// //         console.log("message sent");
// //         await channel.close();
// //         await connection.close();
// //     }
// //     catch(error){
// //         console.log(error);
// //         }
// //     }
// //     sendMessage();

// const amqp = require("amqplib");
// async function sendData(data) {
//     try {
//                 const connection=await amqp.connect('amqp://localhost:5672');
//                 const channel=await connection.createChannel();
//                 const exchange='cart_exchange';
//                 const  routKey='cart';
//         const message={data}
           

//              await channel.assertExchange(exchange,'direct',{durable:false});
//              await channel.assertQueue('cart_que',{durable:false});
//              await channel.bindQueue('cart_que',exchange,routKey);
//              await channel.publish(exchange, routKey, Buffer.from(JSON.stringify(message)));
//              console.log(`CART DATA SENT:${message}`);
//              await channel.close();
//              await connection.close();  
//     } catch (error) {
//         console.log(`ERROR RBMQLIB: ${error}`)
//     }
// }

// module.exports=sendData;

