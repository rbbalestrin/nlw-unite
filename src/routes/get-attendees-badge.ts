import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        summary: "Get an attendee badge",
        tags: ["attendees"],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInURL: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          Event: {
            select: {
              title: true,
            },
          },
        },
        where: {
          id: attendeeId,
        },
      });

      if (attendee === null) {
        console.log("Attendee not found.");
      }

      const baseURL = `${request.protocol}://${request.hostname}`;

      const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL);

      if (attendee !== null) {
        return reply.send({
          badge: {
            name: attendee.name,
            email: attendee.email,
            eventTitle: attendee.Event.title,
            checkInURL: checkInURL.toString(),
          },
        });
      } else {
        console.log("Attendee not found.");
      }
    }
  );
}
