/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://127.0.0.1:5000/api',
  },
}

module.exports = nextConfig
