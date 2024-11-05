import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { UserProfile } from 'shared/ui/UserProfile/';
import { Button } from 'shared/ui/Button/';
import { useGetUserLocalData, useLogOut } from 'shared/hooks';

import * as css from './styles.module.css';

export function Header() {
  const { username, image, isLoged } = useGetUserLocalData();

  const navigate = useNavigate();

  const handleLogOut = useLogOut(navigate);

  return (
    <header className={css.header}>
      <div className={css.wrapper}>
        <Link to="/">
          <h2 className={css.title}>📻RealWorld Blog🥋</h2>
        </Link>
        <ul className={css.user_panel}>
          {!isLoged ? (
            <li className={css.user_panel_item}>
              <Link to="/login">
                <Button classes="stroke_none fill_none text_none">Log In</Button>
              </Link>
            </li>
          ) : null}

          {!isLoged ? (
            <li className={css.user_panel_item}>
              <Link to="/signup">
                <Button classes="stroke_success fill_none text_success">Sign Up</Button>
              </Link>
            </li>
          ) : null}
          {isLoged ? (
            <li className={css.user_panel_item}>
              <Link to="/create-article">
                <Button classes="stroke_success fill_none text_success">Create article</Button>
              </Link>
            </li>
          ) : null}
          {isLoged ? (
            <li className={css.user_panel_item}>
              <Link to="/profile" replace>
                <UserProfile username={username ?? 'noname'} image={image ?? ''} />
              </Link>
            </li>
          ) : null}

          {isLoged ? (
            <li className={css.user_panel_item}>
              <Button onClickEvent={handleLogOut} classes="fill_none text_none">
                Log Out
              </Button>
            </li>
          ) : null}
        </ul>
      </div>
    </header>
  );
}
