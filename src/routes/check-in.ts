import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function checkIn(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/attendess/:attendeeId/check-in",
		{
			schema: {
				params: {
					attendeeId: z.coerce.number().int(),
				},
				response: {
					201: z.null(),
				},
			},
		},
		async (request, reply) => {
			const { attendeeId } = request.params;

			const attendee = await prisma.checkIn.findUnique({
				where: { attendeeId },
			});

			if (attendeeCheckIn !== null) {
				return reply.status(404).send({ message: "Attendee not found" });
			}
			await prisma.checkIn.create({
				data: {
					attendeeId,
				},
			});
			return reply.status(201).send({ message: "Attendee checked in" });
		}
	);
}
