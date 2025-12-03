/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/hvac',
                destination: '/hvac-static/index.html',
            },
        ]
    },
}

module.exports = nextConfig
