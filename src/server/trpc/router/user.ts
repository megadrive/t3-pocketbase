import { t } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = t.router({
  create_user: t.procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      let user;
      try {
        user = await ctx.pocketbase.users.create({
          email: input.email,
          password: input.password,
          passwordConfirm: input.password,
        });
      } catch (err) {
        console.log(err);
      }

      console.info(user);

      if (!user) {
        // TODO: add error logging
        console.error(user);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't create a user.",
        });
      }

      return user;
    }),
  get_user: t.procedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.pocketbase.records.getList("users", 1, 1, {
        filter: `email = "${input.email}"`,
      });
      return user;
    }),
});
