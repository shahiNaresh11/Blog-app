import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { usePosts } from '../hooks/usePosts';
import { useFormValidation } from '../hooks/useFormValidation';
import Loader from '../components/Loader';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, editPost } = usePosts();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [post, setPost] = useState(null);

  const postSchema = Yup.object().shape({
    title: Yup.string()
      .min(5, 'Title must be at least 5 characters')
      .required('Title is required'),
    body: Yup.string()
      .min(20, 'Content must be at least 20 characters')
      .required('Content is required'),
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setValues } =
    useFormValidation(
      { title: '', body: '' },
      postSchema
    );

  useEffect(() => {
    const foundPost = posts.find((p) => p.id === parseInt(id));
    if (foundPost) {
      setPost(foundPost);
      setValues({
        title: foundPost.title,
        body: foundPost.body,
      });
    } else {
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setPost(data);
          setValues({
            title: data.title,
            body: data.body,
          });
        })
        .catch(() => {
          setError('Post not found');
        });
    }
  }, [id, posts, setValues]);

  const onSubmit = async (formValues) => {
    setIsLoading(true);
    setError('');

    const result = await editPost(parseInt(id), {
      ...formValues,
      userId: post?.userId || 1,
    });

    if (result.success) {
      // Add a small delay to ensure state update is processed before navigation
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  if (!post && !error) {
    return <Loader fullScreen />;
  }

  if (error && !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error}
          </h2>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Edit Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Update your blog post
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
              {isLoading ? 'Updating...' : 'Update Post'}
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

export default EditPost;
