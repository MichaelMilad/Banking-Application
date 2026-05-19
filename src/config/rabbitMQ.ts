import * as amqp from 'amqplib';

export const rabbitMQConnection = () =>
  amqp
    .connect(process.env.RABBITMQ_URL || 'amqp://localhost')
    .then((connection: any) => {
      console.log('Connected to RabbitMQ');
      return connection;
    })
    .catch((error: any) => {
      console.error('Error connecting to RabbitMQ:', error);
    });
