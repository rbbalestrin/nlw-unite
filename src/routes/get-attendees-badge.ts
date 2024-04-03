import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

// Função para obter o crachá de um participante
export async function getAttendeeBadge(app: FastifyInstance) {
	// Define uma rota GET para "/attendees/:attendeeId/badge"
	app.withTypeProvider<ZodTypeProvider>().get(
		"/attendees/:attendeeId/badge",
		{
			schema: {
				summary: "Get an attendee badge",
				tags: ["attendees"],
				// Define os parâmetros da rota
				params: z.object({
					attendeeId: z.coerce.number().int(),
				}),
				// Define a resposta tipada
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
			// Extrai o ID do participante dos parâmetros da requisição
			const { attendeeId } = request.params;

			// Busca o participante no banco de dados
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

			// Se o participante não for encontrado, loga uma mensagem
			if (attendee === null) {
				console.log("Attendee not found.");
			}

			// Constrói a URL base
			const baseURL = `${request.protocol}://${request.hostname}`;

			// Constrói a URL de check-in
			const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL);

			// Se o participante for encontrado, retorna o crachá
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
				// Se o participante não for encontrado, loga uma mensagem
				console.log("Attendee not found.");
			}
		}
	);
}
