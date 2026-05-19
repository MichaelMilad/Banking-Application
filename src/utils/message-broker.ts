import { rabbitMQConnection } from '../config/rabbitMQ';

let connection: any = null;
let publishChannel: any = null;
let consumeChannel: any = null;

export default async function main() {
  try {
    connection = await rabbitMQConnection();
    publishChannel = await connection.createChannel();
    consumeChannel = await connection.createChannel();

    console.log('RabbitMQ connection and channels created successfully');

    await receiveMessage('task_queue');
  } catch (err) {
    console.error('Error creating RabbitMQ channel:', err);
    throw err;
  }
}

async function sendMessage(queue: string, msg: string) {
  await publishChannel.assertQueue(queue, { durable: true });
  publishChannel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
  console.log(" [x] Sent '%s'", msg);
}

async function receiveMessage(queue: string) {
  await consumeChannel.assertQueue(queue, { durable: true });
  consumeChannel.prefetch(1);
  console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
  consumeChannel.consume(queue, async (msg: any) => {
    if (msg !== null) {
      console.log(" [x] Received '%s'", msg.content.toString());
      consumeChannel.ack(msg);
    }
  });
}
