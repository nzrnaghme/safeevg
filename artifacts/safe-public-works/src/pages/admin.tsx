import { servicePages } from './service-content';
import { useEffect, useState, type FormEvent } from 'react';
import { fetchContent, type ContentSnapshot, type EquipmentFields, type SiteContent } from '@/lib/site-content';
import { equipmentDefaults } from './managed-equipment';
import './admin.css';

const pages = [
  ['/', 'Homepage'], ['/ev-charging', 'EV charging'], ['/solutions/home', 'Homes'], ['/solutions/apartments', 'Apartments & HOAs'],
  ['/solutions/commercial', 'Workplaces & businesses'], ['/solutions/public-dc', 'Public fast charging'], ['/solutions/fleets', 'Fleets & depots'],
  ['/equipment', 'Equipment catalog'], ['/funding', 'Funding & incentives'], ['/approach', 'Our approach'], ['/solar', 'Solar energy'],
  ['/resources', 'Resources'], ['/faq', 'Common questions'], ['/about', 'About'], ['/contact', 'Plan your project'],
  ['/economics', 'Project economics'], ['/privacy', 'Privacy information'],
  ...Object.entries(servicePages).map(([path, page]) => [path, page.title]),
  ...equipmentDefaults.map(({ id, fields }) => ['/equipment/' + id, fields.name]),
];

const fields: { key: Exclude<keyof EquipmentFields, 'specs'>; label: string; multiline?: boolean }[] = [
  { key: 'name', label: 'Model name' }, { key: 'brand', label: 'Brand' }, { key: 'category', label: 'Category label' },
  { key: 'connector', label: 'Connector' }, { key: 'power', label: 'Rated output' }, { key: 'uses', label: 'Uses (separate with ·)' },
  { key: 'image', label: 'Photo URL or site image path' }, { key: 'source', label: 'Manufacturer source URL' },
  { key: 'description', label: 'Description', multiline: true }, { key: 'note', label: 'Planning note', multiline: true },
];

type Session = { configured: boolean; authenticated: boolean };
async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch('/api/admin/' + path, { ...init, cache: 'no-store' });
  if (response.status === 204) return undefined as T;
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error ?? 'The admin service could not complete that request.');
  if (!result || typeof result !== 'object') throw new Error('The admin service is unavailable.');
  return result as T;
}
function json(method: string, body: unknown): RequestInit {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
}

function TextEditor({ content, onChange }: { content: SiteContent; onChange: (next: SiteContent) => void }) {
  const [page, setPage] = useState('/');
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<HTMLIFrameElement | null>(null);
  const [copy, setCopy] = useState<string[]>([]);
  useEffect(() => {
    if (!preview) return;
    let previous = '';
    const read = () => {
      const values = [...(preview.contentWindow?.spwEditableCopy ?? [])];
      const signature = JSON.stringify(values);
      if (previous !== signature) { previous = signature; setCopy(values); }
    };
    const timer = window.setInterval(read, 300);
    read();
    return () => window.clearInterval(timer);
  }, [preview]);

  const shown = (page === 'edited' ? Object.keys(content.text) : copy).filter(original => {
    return (original + ' ' + (content.text[original] ?? '')).toLowerCase().includes(query.trim().toLowerCase());
  });
  function change(original: string, value: string) {
    const text = { ...content.text, [original]: value };
    if (value === original) delete text[original];
    onChange({ ...content, text });
  }

  return <section className="spw-admin-card"><h2>Website text</h2><p>Select a page to find its editable text. Matching original wording updates everywhere it appears.</p>
    <div className="spw-admin-grid"><label>Page<select value={page} onChange={event => { setCopy([]); setPage(event.target.value); }}>
      {pages.map(([path, label]) => <option key={path} value={path}>{label}</option>)}<option value="edited">All edited text</option>
    </select></label><label>Search text<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a heading, paragraph or button" /></label></div>
    {page !== 'edited' && <iframe key={page} ref={setPreview} hidden tabIndex={-1} title="Read editable text from selected page" src={page + '?edit-preview=1'} />}
    <p role="status">{shown.length ? shown.length + ' text entries' : page !== 'edited' && !copy.length ? 'Loading editable text…' : 'No matching text.'}</p>
    <div className="spw-admin-copy-list">{shown.map(original => <label key={original}><span>{original}</span><textarea rows={original.length > 120 ? 3 : 2} maxLength={3000} value={Object.hasOwn(content.text, original) ? content.text[original] : original} onChange={event => change(original, event.target.value)} />
      {Object.hasOwn(content.text, original) && <button type="button" onClick={() => change(original, original)}>Restore original text</button>}
    </label>)}</div>
  </section>;
}

function EquipmentEditor({ content, onChange }: { content: SiteContent; onChange: (next: SiteContent) => void }) {
  const [id, setId] = useState(equipmentDefaults[0].id);
  const record = equipmentDefaults.find(item => item.id === id) ?? equipmentDefaults[0];
  const model = { ...record.fields, ...content.equipment[id] };
  function update<K extends keyof EquipmentFields>(key: K, value: EquipmentFields[K]) {
    onChange({ ...content, equipment: { ...content.equipment, [id]: { ...content.equipment[id], [key]: value } } });
  }
  function reset() {
    const equipment = { ...content.equipment };
    delete equipment[id];
    onChange({ ...content, equipment });
  }
  return <section className="spw-admin-card"><h2>Equipment</h2><p>Update the model information used across the website.</p>
    <label>Equipment model<select value={id} onChange={event => setId(event.target.value)}>{equipmentDefaults.map(item => <option key={item.id} value={item.id}>{content.equipment[item.id]?.name || item.fields.name}</option>)}</select></label>
    <div className="spw-admin-grid">{fields.map(({ key, label, multiline }) => <label key={key}>{label}{multiline ? <textarea rows={3} maxLength={2000} value={model[key]} onChange={event => update(key, event.target.value)} /> : <input maxLength={key === 'image' || key === 'source' ? 1500 : 2000} value={model[key]} onChange={event => update(key, event.target.value)} />}</label>)}</div>
    <h3>Technical specifications</h3>
    {model.specs.map(([label, value], i) => <div className="spw-admin-spec" key={i}>
      <label>Specification {i + 1}<input maxLength={600} value={label} onChange={event => update('specs', model.specs.map((row, index) => index === i ? [event.target.value, value] : row))} /></label>
      <label>Value {i + 1}<input maxLength={600} value={value} onChange={event => update('specs', model.specs.map((row, index) => index === i ? [label, event.target.value] : row))} /></label>
      <button type="button" onClick={() => update('specs', model.specs.filter((_, index) => index !== i))}>Remove row</button>
    </div>)}
    <div className="spw-admin-actions"><button type="button" disabled={model.specs.length >= 35} onClick={() => update('specs', [...model.specs, ['', '']])}>Add specification</button>
      <button type="button" disabled={!content.equipment[id]} onClick={reset}>Restore model defaults</button><a href={'/equipment/' + id} target="_blank" rel="noreferrer">Open equipment page ↗</a></div>
  </section>;
}

export default function Admin() {
  const [session, setSession] = useState<Session>();
  const [saved, setSaved] = useState<ContentSnapshot>();
  const [draft, setDraft] = useState<SiteContent>();
  const [panel, setPanel] = useState<'text' | 'equipment'>('text');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const dirty = Boolean(saved && draft && draft !== saved.content);

  useEffect(() => {
    document.title = 'Website admin | EVG';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.append(meta);
    adminRequest<Session>('session').then(setSession).catch(reason => setError(reason.message));
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (!session?.authenticated) return;
    const controller = new AbortController();
    fetchContent(controller.signal).then(snapshot => {
      setSaved(snapshot);
      setDraft(snapshot.content);
    }).catch(reason => { if (!controller.signal.aborted) setError(reason.message); });
    return () => controller.abort();
  }, [session?.authenticated]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const password = new FormData(form).get('password');
    setBusy(true);
    setError('');
    try {
      await adminRequest('session', json('POST', { password }));
      form.reset();
      setSession({ configured: true, authenticated: true });
    } catch (reason) { setError((reason as Error).message); }
    finally { setBusy(false); }
  }
  async function signOut() {
    if (dirty && !window.confirm('Discard unsaved changes and sign out?')) return;
    setBusy(true);
    setError('');
    try {
      await adminRequest('session', { method: 'DELETE' });
      setSaved(undefined);
      setDraft(undefined);
      setStatus('');
      setSession({ configured: true, authenticated: false });
    } catch (reason) { setError((reason as Error).message); }
    finally { setBusy(false); }
  }
  async function save() {
    if (!saved || !draft) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const result = await adminRequest<{ revision: number }>('content', json('PUT', { revision: saved.revision, content: draft }));
      setSaved({ revision: result.revision, content: draft });
      setStatus('Saved. The updated content is available when the site reloads.');
    } catch (reason) { setError((reason as Error).message); }
    finally { setBusy(false); }
  }

  return <main className="spw-admin"><header><div><p>EVG</p><h1>Website admin</h1></div><a href="/" target="_blank" rel="noreferrer">View website ↗</a></header>
    {error && <p role="alert" className="spw-admin-error">{error}</p>}
    {!session && !error && <p>Checking admin access…</p>}
    {session && !session.configured && <section className="spw-admin-card"><h2>Enable admin access</h2><p>Add a Replit Secret named <code>SPW_ADMIN_PASSWORD</code> with a unique password of at least 16 characters. Restart the project and reload this page.</p></section>}
    {session?.configured && !session.authenticated && <form className="spw-admin-card spw-admin-signin" onSubmit={signIn}><h2>Sign in</h2><label>Admin password<input name="password" type="password" autoComplete="current-password" required maxLength={1024} /></label><button className="spw-admin-primary" disabled={busy}>Sign in</button></form>}
    {session?.authenticated && !draft && !error && <p>Loading website content…</p>}
    {session?.authenticated && draft && <><div className="spw-admin-toolbar"><div className="spw-admin-actions" role="group" aria-label="Content type"><button type="button" aria-pressed={panel === 'text'} onClick={() => setPanel('text')}>Website text</button><button type="button" aria-pressed={panel === 'equipment'} onClick={() => setPanel('equipment')}>Equipment</button></div>
      <div className="spw-admin-actions"><button type="button" className="spw-admin-primary" disabled={!dirty || busy} onClick={save}>{busy ? 'Working…' : 'Save changes'}</button><button type="button" disabled={busy} onClick={signOut}>Sign out</button></div></div>
      {status && <p role="status">{status}</p>}
      {panel === 'text' ? <TextEditor content={draft} onChange={setDraft} /> : <EquipmentEditor content={draft} onChange={setDraft} />}
    </>}
  </main>;
}

