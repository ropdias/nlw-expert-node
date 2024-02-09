import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { FastifyInstance } from 'fastify';

export async function createPoll(app: FastifyInstance) {
  app.post('/polls', async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    });

    const { title, options } = createPollBody.parse(request.body);

    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((option) => {
              // we don't need to pass the pollId here, Prisma will identify automatically
              return { title: option };
            }),
          },
        },
      },
    });

    // We can create a pollOption this way but we used the "options" column created by Prisma
    // To make sure it will make everything together or we would have to use a transaction here
    // so the poll created would be deleted if something failed below
    // await prisma.pollOption.createMany({
    //   data: options.map((option) => {
    //     return { title: option, pollId: poll.id };
    //   }),
    // });

    return reply.status(201).send({ pollId: poll.id });
  });
}
