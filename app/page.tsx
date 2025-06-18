import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Users, ImageIcon, Shield } from "lucide-react"
import Header from "./_components/homeComp/Header/header"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
                Connect with friends and the world on{" "}
                <span className="text-emerald-600 dark:text-emerald-400">SocialApp</span>
              </h1>
              <p className="text-lg mb-8 text-gray-700 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                Share what&apos;s on your mind, discover new people, and stay updated with your friends&apos; activities in a
                beautiful, modern experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-600"
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-emerald-300 dark:bg-emerald-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-teal-300 dark:bg-teal-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-100 to-teal-200 dark:from-emerald-900 dark:to-teal-900 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-sm"></div>
                <div className="relative p-8">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Sarah Johnson</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      Just finished hiking at Mount Rainier! The views were absolutely breathtaking. 🏔️
                    </p>
                    <div className="rounded-lg overflow-hidden h-40 bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500 mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Alex Chen</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Anyone have recommendations for good coffee shops in Portland? Working remotely there next week!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Why Join SocialApp?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform is designed to give you the best social experience with powerful features and a beautiful
              interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-emerald-50 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform hover:scale-105">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Share Your Moments</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Post photos, updates, and stories. Let your friends know what&apos;s happening in your life!
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-emerald-50 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform hover:scale-105">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Find New Friends</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Discover people who share your interests and grow your network with our smart suggestions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-emerald-50 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform hover:scale-105">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Stay Connected</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chat with friends, make video calls, and never miss important updates with our real-time notifications.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-emerald-50 dark:bg-gray-700 p-6 rounded-xl shadow-md transition-transform hover:scale-105">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Privacy First</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Control who sees your content with advanced privacy settings and secure messaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-emerald-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hear from people who are already enjoying SocialApp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-200 dark:bg-emerald-800 mr-4"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Jessica T.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Designer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                &#34;SocialApp has completely changed how I stay in touch with my friends. The interface is beautiful and
                it&apos;s so easy to use!&quot;
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-200 dark:bg-emerald-800 mr-4"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Michael R.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Developer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                &quot;The video chat feature is amazing! I use it daily to connect with my team and the quality is
                outstanding.&quot;
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-200 dark:bg-emerald-800 mr-4"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Sophia L.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Photographer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                &quot;As a photographer, I love how SocialApp displays my photos. The image quality is preserved and the
                layout is perfect.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-emerald-600 dark:bg-emerald-800">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Join SocialApp Today!</h2>
          <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
            Sign up now and start connecting with friends in a whole new way.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-emerald-50 dark:bg-gray-800 dark:text-emerald-400 dark:hover:bg-gray-700"
            >
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">SocialApp</h3>
              <p className="mb-4">Connecting people around the world through shared experiences and moments.</p>
            </div>
            <div>
              <h4 className="text-white text-md font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-md font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/developers" className="hover:text-white transition-colors">
                    Developers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-md font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} SocialApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
