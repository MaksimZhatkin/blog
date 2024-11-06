import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Markdown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { Modal, Button } from 'antd';
import { enGB } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';

import { UserProfile } from 'shared/ui/UserProfile/';
import { FavButton } from 'widgets/FavButton';
import { useGetUserLocalData } from 'shared/hooks';
import { invalidateAppQuery } from 'shared/queryClient';

import { getArticleQueryOptions, deleteArticle, type Article } from '../api';

import * as css from './styles.module.css';

export function ArticleFull({ slug = '', isEditingMode = false }: { slug?: Article['slug']; isEditingMode?: boolean }) {
  const { data: article, error, isLoading } = useQuery(getArticleQueryOptions(slug));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const { token, username } = useGetUserLocalData();
  const isAuthor = article?.author.username === username;

  const mutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      invalidateAppQuery(['article', article?.slug]);
      navigate('/');
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const dateOfCreation = article?.createdAt ? format(article.createdAt, 'MMMM d, yyyy', { locale: enGB }) : '';

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!article || error) {
    return <p>Something went Wrong</p>;
  }

  const showDeleteConfirm = () => {
    setIsModalVisible(true);
  };
  const handleDelete = () => {
    mutation.mutate({ slug: article?.slug ?? '', token: token ?? '' });
    setIsModalVisible(false);
    invalidateAppQuery(['article', 'list', token]);
    invalidateAppQuery(['article', slug]);
    navigate(-1);
  };

  if (!isEditingMode) {
    return (
      <article className={css.article}>
        <header className={css.article_header}>
          <span className={css.article_info}>
            <h2 className={css.article_title}>{article.title}</h2>
            <FavButton slug={article.slug} favorited={article.favorited} favoritesCount={article.favoritesCount} />
            <ul className={css.tags_list}>
              {article.tagList?.map((tag, index) => (
                <li key={`${index + tag}`} className={css.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </span>

          <UserProfile username={article.author.username} image={article.author.image}>
            <time dateTime={dateOfCreation}>{dateOfCreation}</time>
          </UserProfile>
          {isAuthor && (
            <div className={css.article_controls}>
              <Button danger onClick={showDeleteConfirm}>
                Delete
              </Button>
              <Link to="edit">
                <Button>Edit</Button>
              </Link>
            </div>
          )}
        </header>

        <section className={css.article_description}>{article.description}</section>
        <main className={css.article_body}>
          {!article.body || article.body.trim() !== '' ? (
            <Markdown options={{ forceBlock: true, wrapper: 'div' }}>{article?.body ?? 'text not found'}</Markdown>
          ) : (
            'Text not found'
          )}
        </main>

        <Modal
          title="Are you sure you want to delete this article?"
          open={isModalVisible}
          onOk={handleDelete}
          onCancel={() => setIsModalVisible(false)}
          okText="Yes"
          cancelText="No"
        >
          <p>Are you sure you want to delete this article?</p>
        </Modal>
      </article>
    );
  }
}
