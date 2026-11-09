export type EquipmentFields = {
  brand: string;
  name: string;
  category: string;
  connector: string;
  power: string;
  uses: string;
  description: string;
  note: string;
  image: string;
  source: string;
  specs: [string, string][];
};
export type SiteContent = { text: Record<string, string>; equipment: Record<string, Partial<EquipmentFields>> };
export type ContentSnapshot = { revision: number; content: SiteContent };

let snapshot: ContentSnapshot = { revision: 0, content: { text: {}, equipment: {} } };

export async function fetchContent(signal?: AbortSignal): Promise<ContentSnapshot> {
  const response = await fetch('/api/site-content', { signal, cache: 'no-store' });
  if (!response.ok) throw new Error('Could not load saved site content.');
  return response.json() as Promise<ContentSnapshot>;
}

export async function loadContent() {
  try { snapshot = await fetchContent(AbortSignal.timeout(2500)); }
  catch { /* The built-in website copy remains available when the API is unavailable. */ }
}

export function currentContent() { return snapshot.content; }

declare global {
  interface Window { spwEditableCopy?: Set<string> }
}

const isCopyPreview = window.parent !== window && new URLSearchParams(window.location.search).has('edit-preview');

export function siteText(value: string) {
  const original = value.trim();
  if (!original || !/[\p{L}]/u.test(original) || original.length > 1400) return value;
  if (isCopyPreview) {
    (window.spwEditableCopy ??= new Set()).add(original);
  }
  const edits = currentContent().text;
  if (!Object.hasOwn(edits, original)) return value;
  return value.slice(0, value.indexOf(original)) + edits[original] + value.slice(value.indexOf(original) + original.length);
}

export function editHostProps(type: unknown, props: unknown) {
  if (typeof type !== "string" || !props || typeof props !== "object") return props;
  const editable = { ...(props as Record<string, unknown>) };
  const editChild = (child: unknown): unknown => typeof child === 'string' ? siteText(child) : Array.isArray(child) ? child.map(editChild) : child;
  if (type === 'option' && editable.value === undefined && typeof editable.children === 'string') editable.value = editable.children;
  if ('children' in editable && !['script', 'style', 'textarea', 'pre', 'output'].includes(type)) {
    editable.children = editChild(editable.children);
  }
  for (const key of ['alt', 'placeholder', 'title', 'aria-label']) {
    if (typeof editable[key] === 'string') editable[key] = siteText(editable[key]);
  }
  return editable;
}

