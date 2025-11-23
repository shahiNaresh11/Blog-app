import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, limit = 10 }) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
    );
    const data = await response.json();
    return { posts: data, page };
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    return { ...data, userId: postData.userId };
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(postData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }
    );
    const data = await response.json();
    return { ...data, id };
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id) => {
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE',
    });
    return id;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    filteredPosts: [],
    loading: false,
    error: null,
    currentPage: 1,
    hasMore: true,
    searchTerm: '',
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
      if (action.payload) {
        state.filteredPosts = state.posts.filter(
          (post) =>
            post.title.toLowerCase().includes(action.payload.toLowerCase()) ||
            post.body.toLowerCase().includes(action.payload.toLowerCase())
        );
      } else {
        state.filteredPosts = state.posts;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    nextPage: (state) => {
      if (state.hasMore) {
        state.currentPage += 1;
      }
    },
    prevPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.filteredPosts = action.payload.posts;
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.posts.length === 10;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.filteredPosts.unshift(action.payload);
        state.currentPage = 1;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
          // Update filtered posts if the post exists there
          const filteredIndex = state.filteredPosts.findIndex((post) => post.id === action.payload.id);
          if (filteredIndex !== -1) {
            state.filteredPosts[filteredIndex] = action.payload;
          }
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        state.filteredPosts = state.posts;
      });
  },
});

export const { setSearchTerm, clearError, setCurrentPage, nextPage, prevPage } = postsSlice.actions;
export default postsSlice.reducer;
