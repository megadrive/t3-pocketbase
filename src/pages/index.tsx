import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  // const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const user = trpc.user.me.useQuery();

  return (
    <>
      <Head>
        <title>Create T3 App with Pocketbase</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Create <span className="text-purple-300">T3</span> App
        </h1>
        <div className="flex">
          <div>
            {user.data ? (
              <Link href="/signout">
                <a>Sign out</a>
              </Link>
            ) : (
              <Link href="/signin">
                <a>Sign in</a>
              </Link>
            )}
          </div>
        </div>
        <div className="flex w-full items-center justify-center pt-6 text-2xl text-blue-500">
          {user.isLoading && <div>Loading..</div>}
          {user.error && <div>{JSON.stringify(user.error)}</div>}
          {user.data && JSON.stringify(user.data)}
        </div>
      </main>
    </>
  );
};

export default Home;

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const TechnologyCard = ({
  name,
  description,
  documentation,
}: TechnologyCardProps) => {
  return (
    <section className="flex flex-col justify-center rounded border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
      <h2 className="text-lg text-gray-700">{name}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <a
        className="m-auto mt-3 w-fit text-sm text-violet-500 underline decoration-dotted underline-offset-2"
        href={documentation}
        target="_blank"
        rel="noreferrer"
      >
        Documentation
      </a>
    </section>
  );
};
