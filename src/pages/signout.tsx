import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

const SignOut: NextPage = () => {
  const signOutUser = trpc.user.signout.useMutation();
  const router = useRouter();

  let signingOut = false;
  if (signingOut === false) {
    signOutUser.mutate();
  }

  if (router.isReady) {
    router.push("/");
  }

  return <>Please wait.</>;
};

export default SignOut;
