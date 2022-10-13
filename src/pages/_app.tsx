// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { useEffect } from "react";

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    // * This is here because preline doesn't come with types for the injected JS.
    // @ts-ignore
    import("preline");
  }, []);
  return (
    <>
      <Component {...pageProps} />
    </>
  );
};

export default trpc.withTRPC(MyApp);
