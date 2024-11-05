import React, { ReactNode } from 'react';

import * as css from './styles.module.css';

export function Button({
  children,
  classes = '',
  type = 'button',
  onClickEvent = () => {},
}: {
  children: ReactNode;
  classes: string | null | undefined;
  type?: 'button' | 'submit' | 'reset';
  onClickEvent?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  let prepStyles = classes
    ? classes
        .split(' ')
        .filter((style) => style in css)
        .reduce((newStyle: string, style: string) => {
          return `${newStyle} ${css[style]}`;
        }, '')
    : '';

  prepStyles += ` ${css.button}`;

  return (
    <button onClick={onClickEvent} className={prepStyles} type={type === null || type === undefined ? 'button' : type}>
      {children}
    </button>
  );
}
