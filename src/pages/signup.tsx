import type { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";

interface SignUpFormValues {
  email: string;
  password: string;
}

const SignUpFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

const SignUp: NextPage = () => {
  const createUser = trpc.user.create_user.useMutation();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
    console.log(data);

    createUser.mutate({ email: data.email, password: data.password });
  };

  return (
    <div>
      <h2>Sign up</h2>

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
            className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-blue-500 py-3 px-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {createUser.isIdle ? (
              "Sign up"
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
