import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostModal from './PostModal';

const API_URL = 'http://localhost:5001/api';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    boxShadow: "0 20px 35px -10px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.05)",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.05)",
    transition: {
      duration: 0.1,
      ease: "easeOut"
    }
  }
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const iconVariants = {
  initial: { rotate: 0 },
  hover: { rotate: 12, scale: 1.1 },
  tap: { scale: 0.9 },
  active: { 
    scale: [1, 1.2, 1],
    rotate: [0, 15, -15, 0],
    transition: { duration: 0.4 }
  }
};

export default function PostCard({ post, onEdit, onDelete }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [showModal, setShowModal] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const action = isLiked ? 'unlike' : 'like';
      const response = await fetch(`${API_URL}/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      
      if (response.ok) {
        const updatedPost = await response.json();
        setLikes(updatedPost.likes);
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (comment.trim()) {
      try {
        const response = await fetch(`${API_URL}/posts/${post.id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: comment,
            author: 'User',
          }),
        });

        if (response.ok) {
          const newComment = await response.json();
          setComments(prevComments => [...prevComments, newComment]);
          setComment('');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: window.location.href,
        });
        setIsShared(true);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(post);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(post.id);
  };

  const toggleComments = (e) => {
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const base64 = await convertToBase64(file);
          const response = await fetch(`${API_URL}/posts/${post.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...post,
              image: base64
            }),
          });
          
          if (response.ok) {
            const updatedPost = await response.json();
            // Update the image in the UI
            post.image = updatedPost.image;
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    };
    input.click();
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        className="bg-white dark:bg-dark-200 rounded-xl overflow-hidden cursor-pointer
                  relative backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90
                  before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity
                  after:absolute after:inset-0 after:bg-gradient-to-tr after:from-transparent after:to-primary-500/5 after:opacity-0 hover:after:opacity-100 after:transition-opacity"
        onClick={() => setShowModal(true)}
      >
        <div className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <motion.div layout>
              <motion.h2 
                className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent
                          relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-primary-500 after:to-transparent after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                whileHover={{ scale: 1.01 }}
              >
                {post.title}
              </motion.h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 italic">
                Posted on {post.created_at}
              </p>
            </motion.div>
            
            <div className="flex space-x-2">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleEdit}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300
                         relative after:absolute after:inset-0 after:bg-primary-500/10 after:rounded-full after:scale-0 hover:after:scale-150 after:transition-transform"
              >
                <motion.svg 
                  variants={iconVariants}
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </motion.svg>
              </motion.button>
              
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300
                         relative after:absolute after:inset-0 after:bg-red-500/10 after:rounded-full after:scale-0 hover:after:scale-150 after:transition-transform"
              >
                <motion.svg 
                  variants={iconVariants}
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </motion.svg>
              </motion.button>
            </div>
          </div>
          
          {post.image ? (
            <motion.div
              className="relative mt-4 mb-6 rounded-lg overflow-hidden group"
              whileHover={{ scale: 1.02 }}
            >
              <motion.img
                src={`http://localhost:5001${post.image}`}
                alt="Post"
                className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                         flex items-center justify-center"
                onClick={handleImageClick}
              >
                <motion.span
                  className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full
                           border border-white/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Change Image
                </motion.span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.button
              onClick={handleImageClick}
              className="w-full mt-4 mb-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg
                       text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:border-primary-500
                       transition-colors duration-300 flex flex-col items-center justify-center group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.svg
                className="w-8 h-8 mb-2 transition-transform duration-300 group-hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </motion.svg>
              <span className="text-sm font-medium">Add Image</span>
            </motion.button>
          )}

          <motion.p 
            className="text-gray-600 dark:text-gray-300 line-clamp-3 relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {post.content}
          </motion.p>

          <motion.div 
            layout
            className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-dark-300 pt-4"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleLike}
              className={`flex items-center space-x-2 group ${
                isLiked
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <motion.svg 
                variants={iconVariants}
                animate={isLiked ? "active" : "initial"}
                className="w-5 h-5" 
                fill={isLiked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </motion.svg>
              <span className="relative">
                <motion.span
                  key={likes}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {likes} {likes === 1 ? 'Like' : 'Likes'}
                </motion.span>
              </span>
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={toggleComments}
              className={`flex items-center space-x-2 group ${
                showComments
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <motion.svg 
                variants={iconVariants}
                animate={showComments ? "active" : "initial"}
                className="w-5 h-5" 
                fill={showComments ? 'currentColor' : 'none'}
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </motion.svg>
              <span className="relative">
                <motion.span
                  key={comments.length}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                </motion.span>
              </span>
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleShare}
              className={`flex items-center space-x-2 group ${
                isShared
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <motion.svg 
                variants={iconVariants}
                animate={isShared ? "active" : "initial"}
                className="w-5 h-5" 
                fill={isShared ? 'currentColor' : 'none'}
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </motion.svg>
              <span>{isShared ? 'Shared!' : 'Share'}</span>
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-4 border-t border-gray-200 dark:border-dark-300 pt-4 space-y-4"
                onClick={e => e.stopPropagation()}
              >
                <form onSubmit={handleComment} className="mb-4">
                  <div className="flex space-x-2">
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-100 dark:border-dark-300 dark:text-white sm:text-sm
                               transition-all duration-200 ease-in-out
                               focus:shadow-lg focus:shadow-primary-500/20"
                    />
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                               shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30
                               transition-all duration-200 ease-in-out"
                    >
                      Post
                    </motion.button>
                  </div>
                </form>

                <motion.div layout className="space-y-4">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex space-x-3"
                    >
                      <div className="flex-1 bg-gray-50 dark:bg-dark-100 rounded-lg px-4 py-2 transform hover:scale-[1.02] transition-transform
                                    shadow-sm hover:shadow-md hover:shadow-primary-500/10
                                    relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-500/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {comment.author}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {comment.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <PostModal post={post} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}