import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/events/:eventId/attendees",
		{
			schema: {
				summary: "Get an event",
				tags: ["events"],
				params: z.object({
					eventId: z.string().uuid(),
				}),
				querystring: z.object({
					query: z.string().nullish(),
					pageIndex: z.string().nullable().default("0").transform(Number),
				}),
				responde: {
					200: z.object({
						atttendees: z.array(
							z.object({
								id: z.string().uuid(),
								name: z.string(),
								email: z.string().email(),
								createdAT: z.date(),
								checkIn: z.date().nullable(),
							})
						),
					}),
					404: z.object({
						message: z.string().default("Event not found"),
					}),
					500: z.object({
						message: z.string().default("Internal server error"),
					}),
				},
			},
		},
		async (request, reply) => {
			const { eventId } = request.params;
			const { pageIndex, query } = request.query;

			const atttendees = await prisma.attendee.findMany({
				select: {
					id: true,
					name: true,
					email: true,
					createdAT: true,
					checkIn: {
						select: {
							createdAT: true,
						},
					},
				},
				where: query
					? {
							eventId,
							name: {
								contains: query,
							},
					  }
					: {
							eventId,
					  },
				take: 10,
				skip: pageIndex * 10,
				orderBy: {
					createdAT: "desc",
				},
			});

			return reply.send({
				atttendees: atttendees.map((attendee) => {
					return {
						id: attendee.id,
						name: attendee.name,
						email: attendee.email,
						createdAT: attendee.createdAT,
						checkIn: attendee.checkIn?.createdAT,
					};
				}),
			});
		}
	);
}
