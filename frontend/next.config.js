/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['undici'],
    webpack: (config, { isServer }) => {
        // undici의 private class field (#target) 파싱 에러 방지
        if (isServer) {
            config.externals = config.externals || [];
            config.externals.push('undici');
        }
        return config;
    },
}

module.exports = nextConfig
