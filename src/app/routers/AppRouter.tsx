import { createHashRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import React from 'react';

import { Layout } from 'app/layout/';
import { Fallback } from 'shared/ui/Fallback';

export function AppRouter() {
  const routers = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="/articles/1" replace />} />
      <Route
        path="/articles/:page"
        lazy={async () => {
          const m = await import('pages/HomePage');
          return { Component: m.HomePage };
        }}
      />
      <Route
        path="/login"
        lazy={async () => {
          const m = await import('pages/LogInPage');
          return { Component: m.LogInPage };
        }}
      />
      <Route
        path="/signup"
        lazy={async () => {
          const m = await import('pages/SignUpPage');
          return { Component: m.SignUpPage };
        }}
      />
      <Route
        path="/profile"
        lazy={async () => {
          const m = await import('pages/EditProfilePage');
          return { Component: m.EditProfilePage };
        }}
      />

      <Route
        path="/article/:slug"
        lazy={async () => {
          const m = await import('pages/ArticlePage');
          return { Component: m.ArticlePage };
        }}
      />
      <Route
        path="/article/:slug/edit"
        lazy={async () => {
          const m = await import('pages/EditArticlePage');
          return { Component: m.EditArticlePage };
        }}
      />
      <Route
        path="/create-article"
        lazy={async () => {
          const m = await import('pages/CreateArticlePage');
          return { Component: m.CreateArticlePage };
        }}
      />
      <Route path="*" element={<Fallback />} />
    </Route>
  );

  const router = createHashRouter(routers, {});

  return <RouterProvider router={router} />;
}
