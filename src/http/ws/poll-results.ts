import { z } from 'zod';
import { FastifyInstance } from 'fastify';
import { voting } from '../../utils/voting-pub-sub';

export async function pollResults(app: FastifyInstance) {
  app.get(
    '/polls/:pollId/results',
    { websocket: true },
    (connection, request) => {
      const getPollParams = z.object({
        pollId: z.string().uuid(),
      });

      const { pollId } = getPollParams.parse(request.params);

      voting.subscribe(pollId, (message) => {
        connection.socket.send(JSON.stringify(message));
      });
      // connection.socket.on('message', (message: string) => {
      //   // connection.socket.send('you sent: ' + message);
      //   // Subscribe only in the messages published in the channel with the ID from the poll ('pollId')
      // });

      // setInterval(() => {
      //   connection.socket.send('hi');
      // }, 500);
    }
  );
}
