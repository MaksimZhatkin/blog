import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetUserLocalData } from 'shared/hooks';

import { Article } from '../Article';
import { getArticlesQueryOptions } from '../api';

import * as css from './styles.module.css';

export function ArticlesList() {
  const navigate = useNavigate();
  const { token } = useGetUserLocalData();

  const pageSize = 5;
  const { page: currentPage = 1 } = useParams();
  const offset = (Number(currentPage) - 1) * pageSize;

  const { data: articlesData, isLoading } = useQuery(
    getArticlesQueryOptions(pageSize, offset, Number(currentPage), token)
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const totalPages = Math.ceil(articlesData?.articlesCount || 0 / pageSize);

  return (
    <ul className={css.list}>
      {articlesData?.articles.map((article) => (
        <li className={css.list_item} key={article.slug}>
          <Article key={article.slug} article={article} />
        </li>
      ))}
      <Pagination
        className={css.pagination}
        responsive
        showSizeChanger={false}
        total={totalPages}
        current={Number(currentPage)}
        onChange={(newPage) => navigate(`/articles/${newPage}`, { replace: true })}
      />
    </ul>
  );
}
