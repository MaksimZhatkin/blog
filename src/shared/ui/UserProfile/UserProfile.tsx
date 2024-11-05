import React from 'react';

import type { User } from 'modules/Articles/api';

import * as css from './styles.module.css';

export function UserProfile({
  children = undefined,
  username,
  image = '',
}: {
  children?: React.ReactNode | null | undefined;
  username: User['username'];
  image?: User['image'] | null | undefined;
}) {
  return (
    <span className={css.container}>
      <span className={css.info}>
        <span className={css.nickname}>{username}</span>
        {children && <span className={css.add_info}>{children}</span>}
      </span>
      <img
        className={css.avatar_pic}
        src={image || 'https://static.productionready.io/images/smiley-cyrus.jpg'}
        alt=" "
      />
    </span>
  );
}
