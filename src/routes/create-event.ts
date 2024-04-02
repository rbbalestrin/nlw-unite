import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { generateSlug } from "../utils/generate-slug";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";

export async function createEventRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        body: z.object({
          title: z.string(),
          details: z.string().optional(),
          maximumAttendees: z.number().int().positive(),
        }),
        response: {
          201: z.object({
            eventId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      // Validate the request body
      const { title, details, maximumAttendees } = request.body;

      // Generate a slug for the event
      const slug = generateSlug(title);

      // Check if an event with the same slug already exists
      const eventWithSameSlug = await prisma.event.findUnique({
        where: { slug },
      });

      // If an event with the same slug exists, return an error
      if (eventWithSameSlug !== null) {
        console.log("An event with the same title already exists");
      }

      // Create the event
      const event = await prisma.event.create({
        data: {
          title,
          details,
          slug,
          maximumAttendees,
        },
      });

      // Return the event ID
      return reply.status(201).send({ eventId: event.id });
    }
  );
}
