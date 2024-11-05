import { queryOptions } from '@tanstack/react-query';

import { UserResponseDTO } from 'modules/Auth/api';
import { BASE_URL } from 'shared/queryClient';

export type User = {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
};
export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: User;
};

export type NewArticleResponse = {
  article: {
    title: Article['title'];
    body: Article['body'];
    description: Article['description'];
    tagList: Article['tagList'];
  };
  token: UserResponseDTO['user']['token'];
};

export type UpdateArticleResponse = {
  token: UserResponseDTO['user']['token'];
  slug: Article['slug'];
  article: {
    title: Article['title'];
    body: Article['body'];
    description: Article['description'];
    tagList: Article['tagList'];
  };
};

export type ArticlesDTO = { articles: Article[]; articlesCount: number };

export const getArticlesQueryOptions = (limit: number, offset: number, page: number, token: null | string = null) => {
  // const key = ['articles', 'list', offset];
  return queryOptions({
    queryKey: ['article', 'list', page],
    staleTime: 0,
    refetchInterval: 0,
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/articles?limit=${limit}&offset=${offset}`, {
        signal,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data as ArticlesDTO;
    },
  });
};

export const getArticleQueryOptions = (slug: Article['slug']) => {
  return queryOptions({
    queryKey: ['article', slug],
    staleTime: 0,
    queryFn: async ({ signal }) => {
      const response = await fetch(`${BASE_URL}/articles/${slug}`, { signal });
      const data = await response.json();

      if (!(data.article satisfies Article)) {
        throw new Error("Article's data not satisfies requirements");
      }

      return data.article as Article;
    },
  });
};

export const postArticle = async ({ token, article }: NewArticleResponse): Promise<void> => {
  const response = await fetch(`${BASE_URL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ article }),
  });

  return response.json();
};

export const deleteArticle = async ({
  token,
  slug,
}: {
  token: UserResponseDTO['user']['token'];
  slug: Article['slug'];
}): Promise<void> => {
  const response = await fetch(`${BASE_URL}/articles/${slug}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ article: slug }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete article: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const postArticleFav = async ({
  token,
  slug,
}: {
  token: UserResponseDTO['user']['token'];
  slug: Article['slug'];
}): Promise<Article> => {
  const response = await fetch(`${BASE_URL}/articles/${slug}/favorite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const responseData = await response.json();

  if (!response.ok) {
    throw responseData;
  }

  return responseData.article;
};

export const deleteArticleFav = async ({
  token,
  slug,
}: {
  token: UserResponseDTO['user']['token'];
  slug: Article['slug'];
}): Promise<Article> => {
  const response = await fetch(`${BASE_URL}/articles/${slug}/favorite`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const responseData = await response.json();

  if (!response.ok) {
    throw responseData;
  }

  return responseData.article;
};

export const updateArticle = async ({ token, slug, article }: UpdateArticleResponse): Promise<void> => {
  const response = await fetch(`${BASE_URL}/articles/${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ article }),
  });
  const responseData = await response.json();

  if (!response.ok) {
    throw responseData;
  }

  return responseData.article;
};
