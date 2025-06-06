import { motion, AnimatePresence } from 'framer-motion';

export default function PostModal({ post, onClose }) {
  if (!post) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3,
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
            onClick={onClose}
          />

          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>

          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            className="inline-block w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark-200 text-left align-middle shadow-xl transition-all relative
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-500/10 before:to-transparent before:opacity-50 dark:before:from-primary-400/5"
          >
            <div className="relative">
              {/* Close button with hover effect */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <motion.div variants={contentVariants} className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Posted on {post.created_at}
                  </p>
                </motion.div>

                <motion.div 
                  variants={contentVariants}
                  className="prose prose-lg dark:prose-invert max-w-none"
                >
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {post.content}
                  </p>
                </motion.div>

                {/* Engagement Section with hover effects */}
                <motion.div 
                  variants={contentVariants}
                  className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors group"
                      >
                        <motion.svg 
                          whileHover={{ scale: 1.2 }}
                          className="w-5 h-5 transform group-hover:rotate-12 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </motion.svg>
                        <span>Like</span>
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors group"
                      >
                        <motion.svg 
                          whileHover={{ scale: 1.2 }}
                          className="w-5 h-5 transform group-hover:rotate-12 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </motion.svg>
                        <span>Comment</span>
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors group"
                      >
                        <motion.svg 
                          whileHover={{ scale: 1.2 }}
                          className="w-5 h-5 transform group-hover:rotate-12 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </motion.svg>
                        <span>Share</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
} 