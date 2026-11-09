import { jsx as reactJsx, jsxs as reactJsxs } from 'react/jsx-runtime';
import { editHostProps } from '../site-content';
export { Fragment, type JSX } from 'react/jsx-runtime';
export const jsx: typeof reactJsx = (type, props, key) => reactJsx(type, editHostProps(type, props), key);
export const jsxs: typeof reactJsxs = (type, props, key) => reactJsxs(type, editHostProps(type, props), key);

