const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  reactStrictMode: true,
  transpilePackages: ['dataset'],
  basePath: '/game',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.staticflickr.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.quizlet.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
