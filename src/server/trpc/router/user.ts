import { t } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import pocketbaseEs from "pocketbase";

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
      let loggedInUser;
      try {
        if (input.admin) {
          loggedInUser = await ctx.pocketbase.admins.authViaEmail(
            input.email,
            input.password
          );

          console.log(loggedInUser);
          return loggedInUser;
        }

        loggedInUser = await ctx.pocketbase.users.authViaEmail(
          input.email,
          input.password
        );
      } catch (error) {
        //! TODO: Figure out how to pull the Pocketbase Client error type
        const err = error as {
          url: string;
          status: number;
          data: { code: number; message: string; data: Record<any, any> };
          isAbort: boolean;
          originalError: Error | null;
        };
        let codeToThrow: TRPCError["code"];

        // Error is a "Pocketbase.ClientResponseError"
        switch (err.status) {
          case 400: // unauthorized
            codeToThrow = "UNAUTHORIZED";
            break;
          default:
            codeToThrow = "BAD_REQUEST";
        }

        throw new TRPCError({
          code: codeToThrow,
          message: err.data.message,
          cause: "Incorrect credentials",
        });
      }

      return loggedInUser;
    }),
  me: t.procedure
    .input(
      z
        .object({
          profile: z.boolean().default(false),
        })
        .nullish()
    )
    .query(async ({ input, ctx }) => {
      const user = ctx.pocketbase.authStore.model;
      let userWithProfile:
        | (typeof user & { profile: Record<string, any> })
        | null = user ? Object.assign(user, { profile: {} }) : null;

      if (input?.profile && user && userWithProfile) {
        const profile = await ctx.pocketbase.records.getOne(
          "profiles",
          user.id
        );

        userWithProfile.profile = profile;
      }

      return user;
    }),
  signout: t.procedure.mutation(async ({ ctx }) => {
    await ctx.pocketbase.authStore.clear();
    return true;
  }),
});
