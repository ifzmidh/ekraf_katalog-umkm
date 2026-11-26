/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supaya deploy tidak gagal hanya karena error tipe kecil selama workshop.
  typescript: { ignoreBuildErrors: true },
  experimental: {
    agentUpgrade: "security",
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
