import React from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from 'widgets/Header';

import * as css from './layout.module.css';

export function Layout() {
  return (
    <>
      <Header />
      <main className={css.body}>
        <Outlet />
      </main>
    </>
  );
}
