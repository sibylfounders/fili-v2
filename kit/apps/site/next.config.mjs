/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: ["@fili/react", "@fili/charts", "@fili/tokens"],
};
export default nextConfig;
