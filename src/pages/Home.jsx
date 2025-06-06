import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/posts');
      if (!response.ok) {
        throw new Error('Server responded with an error');
      }
      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Cannot connect to server. Make sure the backend is running.' : err.message);
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      console.log('Creating post with data:', postData);
      const response = await fetch('http://localhost:5001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server responded with an error');
      }
      
      const newPost = await response.json();
      console.log('Post created successfully:', newPost);
      
      setPosts(prevPosts => [...prevPosts, newPost]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      const errorMessage = err.message === 'Failed to fetch' 
        ? 'Cannot connect to server. Make sure the backend is running.'
        : err.message;
      console.error('Error creating post:', err);
      setError(errorMessage);
    }
  };

  const handleUpdatePost = async (postData) => {
    try {
      const response = await fetch(`http://localhost:5001/api/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) throw new Error('Failed to update post');
      await fetchPosts();
      setEditingPost(null);
    } catch (err) {
      setError('Failed to update post');
      console.error('Error updating post:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete post');
      await fetchPosts();
    } catch (err) {
      setError('Failed to delete post');
      console.error('Error deleting post:', err);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 dark:from-dark-200 dark:to-dark-400">
        <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-70 dark:from-white/5"></div>
        <div className="container relative py-16 sm:py-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Share Your Stories
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 mx-auto max-w-2xl text-lg text-primary-100 dark:text-gray-300"
            >
              Create, edit, and share your thoughts with the world using PyPigeon
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {showForm ? 'Close Form' : 'Create New Post'}
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 max-w-xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full px-4 py-3 text-gray-900 placeholder-gray-500 bg-white/90 dark:bg-dark-100/90 dark:text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 backdrop-blur-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showForm && (
            <div className="mb-12">
              <PostForm onSubmit={handleCreatePost} onCancel={() => setShowForm(false)} />
            </div>
          )}
          
          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="col-span-full">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    No posts found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first post above'}
                  </p>
                </motion.div>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={() => setEditingPost(post)}
                  onDelete={handleDeletePost}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full">
            <PostForm
              post={editingPost}
              onSubmit={handleUpdatePost}
              onCancel={() => setEditingPost(null)}
            />
          </div>
        </div>
      )}
    </main>
  );
} 