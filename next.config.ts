import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nodemailer uses Node APIs; bundling it can break on Vercel serverless.
  serverExternalPackages: ["nodemailer"],
};

export default nextConfig;
