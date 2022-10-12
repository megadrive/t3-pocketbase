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
        id: z.string().nullish(),
        email: z.string().email().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { id, email } = input;

      let user;

      if (id) {
        console.info(`getting user with id ${id}`);
        user = await ctx.pocketbase.users.getOne(id);
      } else if (email) {
        console.info(`getting user with email ${email}`);
        user = await ctx.pocketbase.users.getList(1, 1, {
          filter: `email = '${email}'`,
        });
      }

      return user;
    }),
  signin: t.procedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        admin: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.admin) {
        const rv = await ctx.pocketbase.admins.authViaEmail(
          input.email,
          input.password
        );

        console.log(rv);
        return rv;
      }

      const rv = await ctx.pocketbase.users.authViaEmail(
        input.email,
        input.password
      );

      console.log(rv);
      return rv;
    }),
  me: t.procedure.query(async ({ ctx }) => {
    const user = await ctx.pocketbase.authStore.model;

    return user;
  }),
  signout: t.procedure.mutation(async ({ ctx }) => {
    await ctx.pocketbase.authStore.clear();
    return true;
  }),
});
