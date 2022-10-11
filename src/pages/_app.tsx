// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <script defer src="./assets/vendor/preline/dist/preline.js"></script>
    </>
  );
};

export default trpc.withTRPC(MyApp);
