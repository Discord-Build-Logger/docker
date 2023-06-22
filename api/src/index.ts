import amqplib from "amqplib";
import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";

const fastify = Fastify({ logger: true });

const database = new PrismaClient();

const queue = "tasks";

let conn: amqplib.Channel;

const connect = async () => {
  try {
    const connection = await amqplib.connect(
      "amqp://guest:guest@rabbitmq:5672"
    );
    console.log("Connected to RabbitMQ");
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    return channel;
  } catch (error) {
    console.log(error);
  }
};

async function main() {
  conn = (await connect()) as amqplib.Channel;
  if (!conn) return;
  await fastify.listen({ port: 8080, host: "0.0.0.0" });
  conn.sendToQueue(queue, Buffer.from("Hello World!"));
}

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.get("/builds/:id", async (request, reply) => {
  const { id } = request.params as { id: string };

  const build = await database.build.findUnique({
    where: { id },
    include: { files: true },
  });

  if (!build) {
    reply.status(404);
    conn.sendToQueue(queue, Buffer.from(id));
    return {
      error:
        "Build not found. Please check the id and try again. If the problem persists, please contact support.",
    };
  }

  return build;
});

main();
