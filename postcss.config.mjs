
 import withPlaiceholder from '@plaiceholder/next';
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default withPlaiceholder(config);
