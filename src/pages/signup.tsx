import type { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useState } from "react";
import { TRPCError } from "@trpc/server";
import { Alert } from "../components/alert";

interface SignUpFormValues {
  email: string;
  password: string;
}

const SignUpFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

const SignUp: NextPage = () => {
  const router = useRouter();

  const [signUpStatus, setSignUpMessage] = useState<{
    type: "info" | "warn" | "error";
    message: string;
  }>();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
  });

  let signupSuccess = false;
  const signUpUser = trpc.user.signin.useMutation();

  const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
    setSignUpMessage(undefined);
    signUpUser.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess(_data, variables, _context) {
          setSignUpMessage({
            type: "info",
            message: `Token => ${variables.email}`,
          });
          router.push("/");
        },
        onError(error, _variables, _context) {
          switch (error.data?.code) {
            case "UNAUTHORIZED":
              setSignUpMessage({
                type: "error",
                message: "Your credentials are wrong! Whoopsie!",
              });
              break;
            default:
              setSignUpMessage({
                type: "warn",
                message:
                  "An unknown error occurred, please try again in a few minutes.",
              });
              // ! TODO Add error reporting.
              console.log("unknown sign in error", error.data?.code);
              break;
          }
        },
      }
    );
  };

  return (
    <div>
      <h2 className="text-3xl uppercase">Sign Up</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {signUpStatus && (
          <Alert type={signUpStatus.type} message={signUpStatus.message} />
        )}
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
            {signUpUser.isIdle || !signupSuccess ? (
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

export default SignUp;
