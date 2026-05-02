/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a fully static site to `./out` so the GitHub Pages workflow
  // (.github/workflows/nextjs.yml) can publish it directly.
  output: "export",
  // GitHub Pages serves from a sub-path on project sites, so trailing
  // slashes keep client-side links resolving correctly when basePath is
  // injected by `actions/configure-pages`.
  trailingSlash: true,
  images: {
    // next/image's default loader requires a Node runtime; disable it
    // for the static export so future <Image> usage works on Pages.
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  },
};

export default nextConfig;
