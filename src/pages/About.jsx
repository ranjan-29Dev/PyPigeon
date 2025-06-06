import { motion } from 'framer-motion';

const features = [
  {
    name: 'Modern Platform',
    description: 'Built with the latest technologies to provide the best blogging experience.',
    icon: (
      <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Responsive Design',
    description: 'Looks great on any device, from mobile phones to desktop computers.',
    icon: (
      <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'Dark Mode',
    description: 'Easy on the eyes with automatic dark mode support based on system preferences.',
    icon: (
      <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
  },
  {
    name: 'Fast Performance',
    description: 'Optimized for speed with modern build tools and efficient code splitting.',
    icon: (
      <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-300 pt-16">
      <div className="relative py-16 bg-white dark:bg-dark-200 overflow-hidden">
        <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
          <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
            <svg
              className="absolute top-12 left-full transform translate-x-32"
              width={404}
              height={384}
              fill="none"
              viewBox="0 0 404 384"
            >
              <defs>
                <pattern
                  id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect x={0} y={0} width={4} height={4} className="text-primary-200 dark:text-primary-900" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={384} fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
            </svg>
          </div>
        </div>
        
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="text-lg max-w-prose mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1>
                <span className="block text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">
                  About Us
                </span>
                <span className="mt-2 block text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  A Better Way to Blog
                </span>
              </h1>
              <p className="mt-8 text-xl text-gray-500 dark:text-gray-300 leading-8">
                PyPigeon is a modern blogging platform designed to help you share your stories with the world.
                We believe in making content creation accessible, beautiful, and enjoyable.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16"
            >
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature.name} className="relative">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">{feature.icon}</div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {feature.name}
                        </h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Join Our Community
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                We're more than just a blogging platform - we're a community of writers, thinkers, and creators.
                Join us today and start sharing your unique perspective with the world.
              </p>
              <div className="mt-8">
                <a
                  href="#"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Get Started
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 