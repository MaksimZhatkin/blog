import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';

import { UserProfile } from 'shared/ui/UserProfile/';
import { FavButton } from 'widgets/FavButton';
import { truncate } from 'shared/utils';

import type { Article } from '../api';

import * as css from './styles.module.css';
export function Article({ article }: { article: Article }) {
  const dateOfCreation = format(article.createdAt, 'MMMM d, yyyy', { locale: enGB });

  return (
    <article className={css.article}>
      <header className={css.article_header}>
        <span className={css.article_info}>
          <Link to={`../article/${article.slug}`}>
            <h2 className={css.article_title}>
              {article.title && article.title.trim() !== '' ? truncate(article.title, 70) : 'No Title'}
            </h2>
          </Link>
          <FavButton slug={article.slug} favorited={article.favorited} favoritesCount={article.favoritesCount} />
          <ul className={css.tags_list}>
            {article.tagList.map((tag, index) => {
              return (
                <li key={`${index + tag}`} className={css.tag}>
                  {tag}
                </li>
              );
            })}
          </ul>
        </span>

        <UserProfile username={article.author.username} image={article.author.image}>
          <time dateTime={dateOfCreation}>{dateOfCreation}</time>
        </UserProfile>
      </header>
      <main className={css.article_preview}>
        {article.description && article.description.trim() !== ''
          ? truncate(article.description, 500)
          : 'No Description'}
      </main>
    </article>
  );
}
