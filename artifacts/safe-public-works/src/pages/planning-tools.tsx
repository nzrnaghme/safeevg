/** @jsxImportSource @/lib/site-jsx */
import { useState, type FormEvent } from 'react';

const projectTypes = ['Home charging', 'Apartments & HOAs', 'Workplaces & businesses', 'Public fast charging', 'Fleets & depots', 'Solar energy', 'Battery storage', 'Combined solar, storage and charging', 'Other'];

export function ProjectBrief() {
  const [brief, setBrief] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const equipment = new URLSearchParams(window.location.search).get('equipment');

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = [...new FormData(event.currentTarget)]
      .filter(([, value]) => String(value).trim())
      .map(([label, value]) => label + ': ' + String(value).trim());
    setBrief(['Safeevg project brief', ...fields].join(String.fromCharCode(10)));
    setReviewed(true);
  }

  function download() {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'evg-project-brief.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <form className="spw-card spw-form" onSubmit={review} onChange={() => setReviewed(false)}>
    <label>Full name *<input name="Full name" autoComplete="name" required /></label>
    <label>Email address *<input name="Email address" type="email" autoComplete="email" required /></label>
    <label>Project type *<select name="Project type" required defaultValue=""><option value="" disabled>Select project type</option>{projectTypes.map(type => <option key={type}>{type}</option>)}</select></label>
    <label>City or ZIP code *<input name="City or ZIP code" required /><small>Confirm the full site address during assessment.</small></label>
    <label>Company / HOA<input name="Company or HOA" autoComplete="organization" /></label>
    <label>Serving utility<select name="Serving utility"><option>Not sure yet</option><option>SCE</option><option>SDG&E</option><option>LADWP</option><option>Other</option></select></label>
    <label>Planning timeline<select name="Planning timeline"><option>Exploring options</option><option>Within 3 months</option><option>3–12 months</option><option>More than 12 months</option></select></label>
    <label>Estimated charging ports<input name="Estimated charging ports" type="number" min="1" step="1" placeholder="If known" /></label>
    <label className="spw-form-wide">Tell us about the project *<textarea name="Project details" required rows={5} defaultValue={equipment ? 'Equipment of interest: ' + equipment : ''} /><small>Parking, vehicle needs, goals or other useful context.</small></label>
    <label className="spw-form-wide spw-check-label"><input type="checkbox" required />I understand this creates a brief on my device.</label>
    <button type="submit" className="spw-action spw-form-wide">Review project brief ↗</button>
    <p className="spw-note spw-form-wide">Your details stay in this browser until you download the brief or choose to open an email draft. <a href="/privacy">Privacy information</a></p>
    {reviewed && <div className="spw-form-wide spw-brief" role="status"><h3>Your project brief</h3><pre>{brief}</pre><button type="button" className="spw-action spw-outline" onClick={download}>Download brief</button> <a className="spw-action" href={"mailto:hello@safepublicworks.com?subject=" + encodeURIComponent("Site assessment request") + "&body=" + encodeURIComponent(brief)}>Open assessment email draft</a></div>}
  </form>;
}

const assumptions = [
  { label: 'Total investment ($)', initial: '10000', min: 1 },
  { label: 'Delivered energy (kWh/day)', initial: '35', min: 0 },
  { label: 'Selling price ($/kWh)', initial: '0.45', min: 0 },
  { label: 'Input electricity ($/kWh)', initial: '0.25', min: 0 },
  { label: 'Efficiency (%)', initial: '92', min: 1, max: 100 },
  { label: 'Variable fee ($/kWh)', initial: '0.03', min: 0 },
  { label: 'Fixed annual operating costs ($)', initial: '500', min: 0 },
];
const defaults = assumptions.map(({ initial }) => initial);
const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export function EconomicsModel() {
  const [inputs, setInputs] = useState(defaults);
  const valid = inputs.every((input, i) => {
    const number = Number(input);
    const { min, max } = assumptions[i];
    return input.trim() && Number.isFinite(number) && number >= min && (max === undefined || number <= max);
  });
  const [investment, energy, sale, electricity, efficiency, fee, fixed] = inputs.map(Number);
  const cash = 365 * energy * (sale - electricity / (efficiency / 100) - fee) - fixed;
  const cashReturn = cash / investment * 100;
  const payback = investment / cash;
  const results = [
    ['Illustrative annual cash flow', valid && Number.isFinite(cash) ? dollars.format(cash) : '—', 'Before taxes, financing and depreciation. Incentives excluded.'],
    ['Simple payback', valid && cash > 0 && Number.isFinite(payback) ? payback.toFixed(1) + ' years' : '—', 'Requires positive, stable annual cash flow.'],
    ['Annual cash return', valid && Number.isFinite(cashReturn) ? cashReturn.toFixed(1) + '%' : '—', 'Annual cash flow divided by investment.'],
  ];
  return <div className="spw-split"><form className="spw-card spw-form" onSubmit={event => event.preventDefault()}>
    <div className="spw-form-wide"><p className="spw-kicker">Commercial AC · one illustrative port</p><h3>Your assumptions</h3></div>
    {assumptions.map(({ label, min, max }, i) => <label key={label} className={i === assumptions.length - 1 ? 'spw-form-wide' : undefined}>{label}<input type="number" min={min} max={max} step="any" required value={inputs[i]} onChange={event => setInputs(inputs.map((value, index) => index === i ? event.target.value : value))} /></label>)}
    <button className="spw-action spw-outline" type="button" onClick={() => setInputs(defaults)}>Reset example</button>
  </form><div className="spw-results" aria-live="polite">{results.map(([label, value, note]) => <article key={label}><p className="spw-kicker">{label}</p><strong>{value}</strong><p>{note}</p></article>)}<p className="spw-note">Try 15 kWh per day to compare a lower-use scenario. Actual cash flow may be negative.</p></div></div>;
}
