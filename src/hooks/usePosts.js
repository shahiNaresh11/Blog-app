import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  setSearchTerm,
  clearError,
  setCurrentPage,
  nextPage,
  prevPage,
} from '../store/postsSlice';

export const usePosts = () => {
  const dispatch = useDispatch();
  const {
    posts,
    filteredPosts,
    loading,
    error,
    currentPage,
    hasMore,
    searchTerm
  } = useSelector((state) => state.posts);

  const loadPosts = useCallback(
    (page = 1, limit = 10) => {
      dispatch(fetchPosts({ page, limit }));
    },
    [dispatch]
  );

  const addPost = useCallback(
    async (postData) => {
      try {
        await dispatch(createPost(postData)).unwrap();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [dispatch]
  );

  const editPost = useCallback(
    async (id, postData) => {
      try {
        await dispatch(updatePost({ id, postData })).unwrap();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [dispatch]
  );

  const removePost = useCallback(
    async (id) => {
      try {
        await dispatch(deletePost(id)).unwrap();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [dispatch]
  );

  const searchPosts = useCallback(
    (term) => {
      dispatch(setSearchTerm(term));
    },
    [dispatch]
  );

  const clearPostError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const goToNextPage = useCallback(() => {
    dispatch(nextPage());
  }, [dispatch]);

  const goToPrevPage = useCallback(() => {
    dispatch(prevPage());
  }, [dispatch]);

  const goToPage = useCallback((page) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  const loadMorePosts = useCallback(() => {
    if (hasMore && !loading) {
      dispatch(fetchPosts({ page: currentPage + 1, limit: 10 }));
    }
  }, [dispatch, currentPage, hasMore, loading]);

  return {
    posts: searchTerm ? filteredPosts : posts,
    loading,
    error,
    hasMore,
    currentPage,
    searchTerm,
    loadPosts,
    addPost,
    editPost,
    removePost,
    searchPosts,
    clearPostError,
    loadMorePosts,
    goToNextPage,
    goToPrevPage,
    goToPage,
  };
};
