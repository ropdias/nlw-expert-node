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

    return reply.send({ poll }); // default status code = 200
  });
}
