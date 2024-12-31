// import withPlaiceholder from "@plaiceholder/next";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  productionBrowserSourceMaps: false, // Disable source maps in development
  optimizeFonts: false, // Disable font optimization

  experimental: {
    // Allows the use of external packages in server components
    
    serverComponentsExternalPackages: ["bcrypt" ],
  },

  images: {
    // Define domains allowed for image optimization
    domains: ["res.cloudinary.com", "utfs.io" , "tools-api.webcrumbs.org" , "localhost"],
    // Define more granular patterns for remote images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Matches all paths
      },
      {
        protocol: "https",
        hostname: "tools-api.webcrumbs.org",
        pathname: "/**", // Matches all paths
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**", // Matches all paths
      },
      {
        protocol: "https",
        hostname: "localhost",
        pathname: "/**", // Matches all paths
      },
    ],
  },
  // webpack: (config, { isServer }) => {
    
  //   if (!isServer) {
  //     config.externals.push({
  //       bufferutil: "bufferutil",
  //       "utf-8-validate": "utf-8-validate",
  //     })
  //   }
  //   return config
  // },

};

export default nextConfig