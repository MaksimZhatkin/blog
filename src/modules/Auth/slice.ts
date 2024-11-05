import { createSlice } from '@reduxjs/toolkit';

import type { Article } from 'modules/Articles/api';

type ArticlesState = { articles: Article[] | []; status: 'successful' | 'error' | 'pending' } | undefined;

type initialState = ArticlesState;

const initialState = { authToken: [], status: 'pending' };
const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
});

export default articlesSlice;
