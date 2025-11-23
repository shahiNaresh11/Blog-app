import { Link } from 'react-router-dom';

const PostCard = ({ post, onDelete, showActions = false }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.id);
    }
  };

  return (
    <div className="card group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {post.body}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {post.userId}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            User {post.userId}
          </span>
        </div>

        {showActions && (
          <div className="flex space-x-2">
            <Link
              to={`/edit/${post.id}`}
              className="px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
