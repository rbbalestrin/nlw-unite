import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createEventRoute } from "./routes/create-event";

const app = fastify();

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEventRoute);

app.listen({ port: 3000 }).then(() => {
  console.log("Server is running on http://localhost:3000");
});
