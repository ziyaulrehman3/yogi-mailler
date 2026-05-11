import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nodemailer uses Node APIs; bundling it can break on Vercel serverless.
  serverExternalPackages: ["nodemailer"],
  /**
   * Resume PDF lives under ./attachments and is read at runtime via fs + process.cwd().
   * Without this, Vercel/serverless traces omit that folder and buildAttachmentsFromEnv()
   * returns [] in production.
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/output#caveats
   */
  outputFileTracingIncludes: {
    "/app/api/send-one": ["./attachments/**/*"],
  },
};

export default nextConfig;
