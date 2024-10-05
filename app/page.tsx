import Link from 'next/link';
import Header from './_componsents/homeComp/Header/header';

// export const getServerSideProps = () => {


//   return {
//     props: {
//       statictest: {a : 1 }, // Return the data from the query
//     },
//   };

// }

export default function Home() {
  return ( <>
        {/* <Head>
        <title>SocialApp - Connect with Friends Around the World</title>
        <meta
          name="description"
          content="Join SocialApp, the platform where you can connect with friends, share updates, and discover new people."
        />
        <meta
          name="keywords"
          content="SocialApp, social media, connect with friends, share updates, discover people"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="SocialApp - Connect with Friends" />
        <meta property="og:description" content="Join SocialApp to connect with friends, share your moments, and discover new people." />
        <meta property="og:image" content="/socialapp-og-image.jpg" />
        <meta property="og:url" content="https://www.socialapp.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SocialApp - Connect with Friends" />
        <meta name="twitter:description" content="Join SocialApp to connect with friends, share your moments, and discover new people." />
        <meta name="twitter:image" content="/socialapp-twitter-image.jpg" />
        <link rel="canonical" href="https://www.socialapp.com/" />
      </Head> */}


    
    <main className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header Section */}
    <Header />

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Connect with friends and the world around you on <span className="text-blue-600">SocialApp</span>.
          </h1>
          <p className="text-lg mb-8 text-gray-400">
            Share {"what's"} on your mind, discover new people, and stay updated on your {"friends'"} activities.
          </p>
          <Link href="/signup" className="px-6 py-3 bg-blue-600 rounded text-lg hover:bg-blue-500">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Join SocialApp?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Share Your Moments</h3>
            <p className="text-gray-400">
              Post photos, updates, and stories. Let your friends know what’s happening in your life!
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Find New Friends</h3>
            <p className="text-gray-400">
              Discover people who share your interests and grow your network.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Stay Connected</h3>
            <p className="text-gray-400">
              Stay up to date with your {"friends'"} posts and activities with our easy-to-use feed.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Join SocialApp Today!</h2>
        <p className="text-lg mb-8 text-gray-100">Sign up now and start connecting with friends.</p>
        <Link href="/signup" className="px-8 py-4 bg-gray-900 rounded text-white text-lg hover:bg-gray-800">
          Create Your Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-center text-gray-500">
        <p>&copy; 2024 SocialApp. All rights reserved.</p>
        <div className="mt-4">
          <Link href="/terms" className="hover:text-gray-300">Terms</Link>
          <span className="mx-2">|</span>
          <Link href="/privacy" className="hover:text-gray-300">Privacy</Link>
        </div>
      </footer>
    </main>
    </>
  );
}
