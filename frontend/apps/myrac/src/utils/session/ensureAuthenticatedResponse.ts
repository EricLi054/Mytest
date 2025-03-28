import { redirect } from "next/navigation";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GraphQLResponseSchema = z.object({
  errors: z
    .array(
      z.object({
        message: z.string().nullish(),
        extensions: z
          .object({
            code: z.string().nullish(),
          })
          .nullish(),
      }),
    )
    .nullish(),
});

export const ensureAuthenticatedResponse = (response: z.infer<typeof GraphQLResponseSchema>) => {
  if (response.errors) {
    const error = response.errors[0];
    if (error?.extensions?.code === "AUTH_NOT_AUTHENTICATED" || error?.message === "Unauthenticated") {
      redirect("/signIn");
    }
  }
};
