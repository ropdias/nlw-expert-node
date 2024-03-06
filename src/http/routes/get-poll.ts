import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { FastifyInstance } from 'fastify';

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = getPollParams.parse(request.params);

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            // we will avoid bringing the pollId again here
            id: true,
            title: true,
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

    return reply.send({ poll }); // default status code = 200
  });
}
