import React from 'react';
import { useParams } from 'react-router-dom';

import { ArticleFull } from 'modules/Articles/Article';

export function ArticlePage() {
  const { slug } = useParams();
  return <ArticleFull slug={slug} />;
}
