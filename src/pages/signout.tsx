import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const SignOut: NextPage = () => {
  const signOutUser = trpc.user.signout.useMutation();
  const router = useRouter();

  const [signingOut, setSigningOut] = useState(false);
  if (signingOut === false) {
    signOutUser.mutate();
    setSigningOut(true);
  }

  if (router.isReady) {
    router.push("/");
  }

  return <>Please wait.</>;
};

export default SignOut;
