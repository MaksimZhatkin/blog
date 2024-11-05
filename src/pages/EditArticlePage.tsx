import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArticleForm } from 'modules/Articles/ArticleForm';

export function EditArticlePage() {
  const { slug } = useParams();

  const navigate = useNavigate();

  if (!slug) {
    navigate('/login');
    return null;
  }

  return <ArticleForm slug={slug} />;
}
