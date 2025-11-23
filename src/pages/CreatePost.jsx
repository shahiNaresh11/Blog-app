import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { usePosts } from '../hooks/usePosts';
import { useFormValidation } from '../hooks/useFormValidation';
import { useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CreatePost = () => {
  const navigate = useNavigate();
  const { addPost } = usePosts();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const postSchema = Yup.object().shape({
    title: Yup.string()
      .min(5, 'Title must be at least 5 characters')
      .required('Title is required'),
    body: Yup.string()
      .min(20, 'Content must be at least 20 characters')
      .required('Content is required'),
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation(
      { title: '', body: '' },
      postSchema
    );

  const onSubmit = async (formValues) => {
    setIsLoading(true);
    setError('');

    const postData = {
      ...formValues,
      userId: user?.id || 1,
    };

    const result = await addPost(postData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Create New Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your thoughts with the world
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Post Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-field"
              placeholder="Enter an engaging title..."
            />
            {touched.title && errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Post Content
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={values.body}
              onChange={(event, editor) => {
                const data = editor.getData();
                // Trigger handleChange-like behavior
                handleChange({
                  target: {
                    name: 'body',
                    value: data,
                  },
                });
              }}
              onBlur={() => {
                handleBlur({
                  target: {
                    name: 'body',
                  },
                });
              }}
            />
            {touched.body && errors.body && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.body}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Publishing...' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
