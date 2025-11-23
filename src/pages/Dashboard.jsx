import { useEffect, useRef, useCallback, useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = () => {
  const {
    posts,
    loading,
    error,
    hasMore,
    currentPage,
    searchTerm,
    loadPosts,
    removePost,
    searchPosts,
    clearPostError,
    goToNextPage,
    goToPrevPage,
  } = usePosts();

  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (posts.length === 0) {
      loadPosts(1, 10);
    }
  }, []);

  const handlePageChange = (newPage) => {
    loadPosts(newPage, 10);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchInput(value);
      searchPosts(value);
    },
    [searchPosts]
  );

  const handleDelete = async (id) => {
    await removePost(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          My Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and explore your blog posts
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchInput}
            onChange={handleSearch}
            className="input-field pl-12"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
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
      </div>

      <ErrorMessage message={error} onClose={clearPostError} />

      {loading && posts.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
                showActions={true}
              />
            ))}
          </div>

          {posts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No posts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Start by creating your first blog post'}
              </p>
            </div>
          )}

          {!searchTerm && posts.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                ← Previous
              </button>

              <div className="flex gap-1 mx-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasMore}
                className="px-3 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
