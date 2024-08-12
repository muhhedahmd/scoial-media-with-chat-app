/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental : {
        serverComponentsExternalPackages : [  "bcrypt"]
    },
    // webpack: (config, options) => {
    //     config.externals.push({
    //       'react-hook-form': 'react-hook-form',
    //     });
    
    //     return config;
    //   },


};

export default nextConfig;
