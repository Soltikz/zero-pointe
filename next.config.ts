import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [],
        // Autorise les images locales dans /public/avatars
        localPatterns: [
            {
                pathname: "/avatars/**",
            },
        ],
    },
}

export default nextConfig