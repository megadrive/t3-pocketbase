import type { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

interface SignInFormValues {
  email: string;
  password: string;
}

const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

const SignUp: NextPage = () => {
  const router = useRouter();

  const signInUser = trpc.user.signin.useMutation();
  const admin = !!router.query["admin"];

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInFormSchema),
  });

  const onSubmit: SubmitHandler<SignInFormValues> = (data) => {
    signInUser.mutate({
      email: data.email,
      password: data.password,
      admin,
    });

    if (router.isReady && signInUser.isSuccess) {
      router.push("/");
    }
  };

  return (
    <div>
      <h2 className="text-3xl uppercase">Sign In {admin ? "as admin" : ""}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div>{errors.email?.message}</div>
          <input
            className="block w-full rounded-md border-gray-200 py-3 px-4 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            {...register("email")}
          />
        </div>
        <div>
          <div>{errors.password?.message}</div>
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
            {signInUser.isIdle ? (
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
