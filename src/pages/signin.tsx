import type { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useState } from "react";
import { TRPCError } from "@trpc/server";

interface SignInFormValues {
  email: string;
  password: string;
}

const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

const SignIn: NextPage = () => {
  const router = useRouter();

  const [signInErrorMessage, setSignInErrorMessage] = useState("");

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInFormSchema),
  });

  let loginSuccess = false;
  const signInUser = trpc.user.signin.useMutation();
  const admin = !!router.query["admin"];

  const onSubmit: SubmitHandler<SignInFormValues> = (data) => {
    setSignInErrorMessage("");
    signInUser.mutate(
      {
        email: data.email,
        password: data.password,
        admin,
      },
      {
        onSuccess(_data, variables, _context) {
          setSignInErrorMessage(`Token => ${variables.email}`);
          router.push("/");
        },
        onError(error, _variables, _context) {
          switch (error.data?.code) {
            case "UNAUTHORIZED":
              setSignInErrorMessage("Your credentials are wrong! Whoopsie!");
              break;
            default:
              setSignInErrorMessage(
                "An unknown error occurred, please try again in a few minutes."
              );
              // ! TODO Add error reporting.
              console.error("unknown sign in error", error.data?.code);
              break;
          }
        },
      }
    );
  };

  return (
    <div>
      <h2 className="text-3xl uppercase">Sign In {admin ? "as admin" : ""}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>{signInErrorMessage}</div>
        <div>
          <div className="text-red-500">{errors.email?.message}</div>
          <input
            className="block w-full rounded-md border-gray-200 py-3 px-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            {...register("email")}
          />
        </div>
        <div>
          <div className="text-red-500">{errors.password?.message}</div>
          <input
            type="password"
            className="block w-full rounded-md border-gray-200 py-3 px-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            {...register("password")}
          />
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-blue-500 py-3 px-4 text-sm font-semibold uppercase text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {signInUser.isIdle || !loginSuccess ? (
              "Sign In"
            ) : (
              <div
                className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-transparent text-blue-600"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
