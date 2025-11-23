const Loader = ({ fullScreen = false }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClass}>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
