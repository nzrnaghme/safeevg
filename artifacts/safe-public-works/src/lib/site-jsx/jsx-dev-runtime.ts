import { jsxDEV as reactJsxDEV } from 'react/jsx-dev-runtime';
import { editHostProps } from '../site-content';
export { Fragment, type JSX } from 'react/jsx-dev-runtime';
export const jsxDEV: typeof reactJsxDEV = (type, props, key, isStaticChildren, source, self) =>
  reactJsxDEV(type, editHostProps(type, props), key, isStaticChildren, source, self);

