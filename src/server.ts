import fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createEventRoute } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendees-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";

const app = fastify();

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEventRoute);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);

app.listen({ port: 3000 }).then(() => {
	console.log("Server is running on http://localhost:3000");
});
