// const amqp=require('amqplib');
// async function consumeMessage() {
//     try {
          
//         const connection=await amqp.connect('amqp://localhost:5672');
//         const channel=await connection.createChannel();

//         await channel.assertQueue('mail_queue', {durable: false});

//         channel.consume('mail_queue', async (message) => {
//             if (message !== null) {
//        console.log(message.content.toString());
//        channel.ack(message);
//             }
//         });

//     } catch (error) {
//      console.log(error);   
//     }
// }
// consumeMessage();