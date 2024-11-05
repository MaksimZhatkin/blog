import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { deleteArticleFav, postArticleFav, type Article } from 'modules/Articles/api';
import { invalidateAppQuery } from 'shared/queryClient';
import { useGetUserLocalData } from 'shared/hooks';

import * as css from './styles.module.css';
export function FavButton({
  slug,
  favorited,
  favoritesCount = 0,
}: {
  slug: Article['slug'];
  favorited: Article['favorited'];
  favoritesCount: Article['favoritesCount'];
}) {
  const navigate = useNavigate();
  const [isFav, setFav] = useState<Article['favorited']>(favorited);
  const [likeCount, setLikeCount] = useState(favoritesCount);

  const { token } = useGetUserLocalData();

  const mutateFav = useMutation({
    mutationFn: isFav ? deleteArticleFav : postArticleFav,
    onSuccess: (data) => {
      setFav(data.favorited);
      setLikeCount(data.favoritesCount);

      invalidateAppQuery(['article', slug]);
      // invalidateAppQuery(['article', 'list', offset]);
    },
    onError: (error) => {
      throw new Error(error.message);
    },
  });

  const handleLike = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    mutateFav.mutate({ token, slug });
  };

  return (
    <button className={css.like_btn} onClick={handleLike} data-fav={isFav} data-likes={likeCount} type="button">
      like
      <svg className={css.like_icon}>
        {isFav ? <use href="img/sprite.svg#heart-filled" /> : <use href="img/sprite.svg#heart" />}
      </svg>
    </button>
  );
}
