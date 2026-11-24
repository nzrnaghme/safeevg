/** @jsxImportSource @/lib/site-jsx */
import { serviceLinks, servicePages } from './service-content';
import { equipment } from './managed-equipment';
import { EconomicsModel, ProjectBrief } from './planning-tools';
import NotFound from './not-found';
import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { solutions, steps } from './charging-data';
import './charging-pages.css';
import './additional-pages.css';

const project = '/contact';
const defaultTitle = ['Your property.', 'A clear way forward.'];
const route = (slug: string) => '/solutions/' + slug;
const image = (name: string) => name === 'solar' ? '/equipment-photos/solar.webp' : '/charging-images/' + name + '.webp';
const incentiveQuestion = ['Are incentives available for my project?', 'Eligibility depends on the project address, serving utility, equipment and current program terms. See Funding & incentives for official resources.'];

function Logo() {
  return <a className="spw-logo" href="/" aria-label="Safeevg home"><img src="/brand-logo.webp" alt="" width={36} height={36} /><strong>Safeevg</strong></a>;
}
function Action({ href = project, children = 'Plan your project', outline = false }: { href?: string; children?: ReactNode; outline?: boolean }) {
  return <a className={'spw-action' + (outline ? ' spw-outline' : '')} href={href}>{children}<ArrowUpRight size={17} aria-hidden="true" /></a>;
}
function Layout({ children }: { children: ReactNode }) {
  return <div className="spw-pages">
    <header className="spw-header"><div className="spw-wrap"><Logo /><nav aria-label="Main navigation"><a href="/how-we-help">How we can help</a><details><summary>Solutions <ChevronDown size={13} /></summary><div><a href="/ev-charging">EV charging</a><a href="/property-owners">Property owners & developers</a><a href="/ownership-financing">Ownership, revenue & financing</a><a href="/operations-maintenance">Operations & maintenance</a>{solutions.map(item => <a key={item.slug} href={route(item.slug)}>{item.name}</a>)}<a href="/solar">Solar energy</a></div></details><a href="/funding">Funding & incentives</a><a href="/approach">Our approach</a><a href="/resources">Resources</a></nav><Action /></div></header>
    <main>{children}</main>
    <footer className="spw-footer"><div className="spw-wrap"><div><Logo /><p>Practical energy.<br />Thoughtfully planned for your property.</p></div><div><strong>Solutions</strong><a href="/property-owners">Property owners & developers</a><a href="/ev-charging">EV charging</a><a href="/solar">Solar energy</a><a href={route('apartments')}>Apartments & HOAs</a><a href={route('fleets')}>Fleets & depots</a></div><div><strong>Plan your project</strong><a href="/how-we-help">How we can help</a><a href="/ownership-financing">Ownership & financing</a><a href="/operations-maintenance">Operations & maintenance</a><a href="/equipment">Explore equipment</a><a href="/funding">Funding & incentives</a><a href="/approach">Our approach</a><a href={project}>Request an assessment</a></div><div><strong>Company & resources</strong><a href="/about">About Safeevg</a><a href="/resources">Guides & documents</a><a href="/faq">Common questions</a><a href="/economics">Project economics</a></div><small>© {new Date().getFullYear()} Safeevg <span>Southern California · <a href="/privacy">Privacy information</a></span></small></div></footer>
  </div>;
}
function Lines({ lines }: { lines: string[] }) {
  return <>{lines.map((line, i) => <span className="spw-line" key={i}>{line}</span>)}</>;
}
function Hero({ label, title, description, photo, children }: { label: string; title: string[]; description: string; photo?: string; children?: ReactNode }) {
  return <section className={'spw-hero' + (photo ? ' spw-photo spw-photo-' + photo : '')}>{photo && <div className="spw-hero-photo" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(90deg, #15232f96, #15232f25), url(' + image(photo) + ')' }} />}<div className="spw-wrap"><nav className="spw-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> / <span aria-current="page">{label}</span></nav><p className="spw-kicker">{label}</p><h1><Lines lines={title} /></h1><p className="spw-intro">{description}</p>{children && <div className="spw-actions">{children}</div>}</div></section>;
}
function Section({ children, tone = '', id }: { children: ReactNode; tone?: string; id?: string }) {
  return <section className={'spw-section ' + tone} id={id}><div className="spw-wrap">{children}</div></section>;
}
function Heading({ label, children }: { label: string; children: ReactNode }) {
  return <><p className="spw-kicker">{label}</p><h2>{children}</h2></>;
}
function Cta({ title = defaultTitle }: { title?: string[] }) {
  return <section className="spw-wrap spw-cta-wrap"><div className="spw-cta"><div><Heading label="Good work starts with a conversation"><Lines lines={title} /></Heading><p>Tell us about your site and what you have in mind. Start with an assessment shaped around your project.</p></div><Action /></div></section>;
}
function Features({ cards }: { cards: string[][] }) {
  return <div className="spw-grid">{cards.map(([title, body, label], i) => <article className="spw-card spw-feature" key={title}><p className="spw-kicker">{label || '0' + (i + 1) + ' /'}</p><h3>{title}</h3><p>{body}</p></article>)}</div>;
}
function Checklist({ items }: { items: string[] }) {
  return <ul className="spw-checklist">{items.map(item => <li key={item}><ArrowUpRight size={14} aria-hidden="true" />{item}</li>)}</ul>;
}
function Questions({ items }: { items: string[][] }) {
  return <Section id="questions"><div className="spw-questions">{items.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}{q === incentiveQuestion[0] && <> <a href="/funding">View official resources ↗</a></>}</p></details>)}</div></Section>;
}
function EquipmentGrid({ items }: { items: typeof equipment }) {
  return <div className="spw-grid">{items.map(item => <article key={item.id} id={item.id} className="spw-card spw-product"><div className="spw-product-image"><span className="spw-kicker">{item.brand}</span><img src={item.image} alt={item.name} loading="lazy" /><small>{item.category}</small></div><div className="spw-product-body"><span className="spw-tag">{item.connector}</span><h3>{item.name}</h3><strong>{item.power}</strong><p>{item.uses}</p><a className="spw-text-link" href={"/equipment/" + item.id}>View specifications <ArrowUpRight size={16} aria-hidden="true" /></a></div></article>)}</div>;
}
function Property({ item }: { item: typeof solutions[number] }) {
  const products = item.equipment.flatMap(id => equipment.filter(product => product.id === id));
  return <><Hero label={item.name} title={item.title} description={item.description} photo={item.image}><Action>Plan this project</Action></Hero>
    <Section><Heading label="The site comes first">{item.heading}</Heading><Features cards={item.cards} /></Section>
    <Section tone="spw-sage"><div className="spw-split"><div><Heading label="Before we recommend"><Lines lines={['Bring a little detail.', 'Get a clearer direction.']} /></Heading><p className="spw-intro">An initial assessment turns practical site information into the next set of decisions.</p><Action outline>Start with your property</Action></div><div><Checklist items={item.checklist} /><p className="spw-note">Confirm the serving utility for the project address during assessment.</p></div></div></Section>
    <Section><div className="spw-section-lead"><div><Heading label="Equipment to consider">Options for the conversation.</Heading></div><p>Reference specifications only. The final fit depends on the electrical design, vehicle and operating needs.</p></div><EquipmentGrid items={products} /></Section>
    <Questions items={[item.faq, incentiveQuestion]} /><Cta title={['Let’s plan your', item.cta + '.']} /></>;
}
function Overview() {
  const options = [['AC / Level 2', 'Time is on your side.', 'Often considered for overnight, resident and workplace parking. Vehicle onboard charging limits matter.', '/equipment?type=ac', 'Explore AC options'], ['Destination DC', 'A compact DC option.', 'Review energy needs and turnover at workplaces, dealerships and selected fleet locations.', '/equipment/dcwall', 'See Terra DC Wallbox'], ['High-power DC', 'Demand comes first.', 'Assess vehicle compatibility, power sharing, connection capacity and the cost of operating the site.', route('public-dc'), 'Explore public DC']];
  const summary = [['Understand your site', 'Your goals, vehicles, parking and electricity use.', 'Discovery & screening'], ['Shape the plan', 'Equipment options, capacity, costs and possible funding.', 'Assessment & proposal'], ['Coordinate the details', 'Design, utility coordination and required approvals.', 'Design & permits'], ['Get ready to charge', 'Installation, testing, handover and support planning.', 'Commissioning']];
  return <><Hero label="EV charging" title={['EV charging services', 'for your property or fleet.']} description="Explore charging for homes, apartments, businesses, public sites and fleets. Start with demand and site capacity, then plan installation, funding and operations." photo="charging"><Action>Request a site assessment</Action><Action href="/how-we-help" outline>See how we can help</Action></Hero>
    <Section><div className="spw-split"><div><Heading label="Which property is yours?"><Lines lines={['Built around', 'your charging day.']} /></Heading><p className="spw-intro">Parking duration, vehicle energy needs and site capacity matter more than the largest number on a charger.</p></div><div className="spw-property-links">{solutions.map((item, i) => <a href={route(item.slug)} key={item.slug}><small>0{i + 1}</small><div><h3>{item.name}</h3><p>{item.teaser}</p></div><ArrowUpRight size={18} /></a>)}</div></div></Section>
    <Section tone="spw-sage"><Heading label="Understand the options"><Lines lines={['Different speeds.', 'Different reasons.']} /></Heading><div className="spw-grid">{options.map(([label, title, text, href, link]) => <article key={label} className="spw-card spw-feature"><p className="spw-kicker">{label}</p><h3>{title}</h3><p>{text}</p><a className="spw-text-link" href={href}>{link}<ArrowUpRight size={16} /></a></article>)}</div></Section>
    <Section tone="spw-green"><Heading label="From question to commissioning">A plan you can follow.</Heading><div className="spw-four">{summary.map(([title, text, detail], i) => <article key={title}><p className="spw-kicker">0{i + 1} /</p><h3>{title}</h3><p>{text}</p><small>{detail}</small></article>)}</div></Section><Cta /></>;
}
const filters = [['all', 'All equipment'], ['ac', 'AC / Level 2'], ['dc', 'DC charging'], ['fleet', 'Fleet depot']];
function Catalog() {
  const [filter, setFilter] = useState(() => {
    const initial = new URLSearchParams(window.location.search).get('type');
    return filters.find(([id]) => id === initial)?.[0] ?? 'all';
  });
  const [search, setSearch] = useState('');
  const items = equipment.filter(item => (filter === 'all' || filter === 'ac' && item.filterCategory === 'AC / Level 2' || filter === 'dc' && item.filterCategory === 'DC' || filter === 'fleet' && item.filterCategory === 'Fleet DC') && [item.name, item.brand, item.connector].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  return <><Hero label="Equipment" title={['Choose with context.', 'Compare the details.']} description="Explore Tesla and ABB equipment references. The right configuration is selected after reviewing the site." /><Section><div className="spw-filter-bar"><div role="group" aria-label="Filter equipment">{filters.map(([id, label]) => <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div><label>Search equipment<input type="search" placeholder="Model or connector" value={search} onChange={event => setSearch(event.target.value)} /></label></div><p className="spw-note" role="status">{items.length} equipment {items.length === 1 ? 'reference' : 'references'}</p>{items.length ? <EquipmentGrid items={items} /> : <p>No matching equipment. Try another model or connector.</p>}<p className="spw-note spw-catalog-note">Technical references are for planning. Confirm the final configuration, availability and any incentive eligibility for your project.</p></Section><Cta title={['Need help finding the right fit?']} /></>;
}
function Approach() {
  return <><Hero label="Our approach" title={['The details matter.', 'So does the path forward.']} description="Tell us about your site, review the options and agree on scope and responsibilities. The team then coordinates design, approvals and installation before testing, training and handover." /><Section><div className="spw-split"><div><Heading label="From idea to operation"><Lines lines={['A practical sequence.', 'Clear decision points.']} /></Heading><p className="spw-intro">Every site has its own utility, permit and equipment timeline. Agree those milestones with the responsible organizations.</p><aside className="spw-aside"><h3>Before procurement</h3><p>Confirm the final equipment configuration, installation scope and approval prerequisites.</p></aside></div><ol className="spw-timeline">{steps.map(([title, text, result], i) => <li key={title}><span aria-hidden="true">0{i + 1}</span><h3>{title}</h3><p>{text}</p><small className="spw-tag">{result}</small></li>)}</ol></div></Section><Cta /></>;
}
const resources = [['SCE', 'Utility infrastructure', 'Review Rule 29, project conditions and utility coordination requirements.', 'https://www.sce.com/business/smart-energy-solar/evs-for-business/rule-29-electric-vehicle-infrastructure/ready-to-apply'], ['SDG&E', 'Utility infrastructure', 'Review the EV Infrastructure Rule page for application status and service options.', 'https://www.sdge.com/business/electric-vehicles/lovelectric/ev-infrastructure-rule'], ['LADWP', 'Commercial EV programs', 'Check the current enrollment announcement and program documents.', 'https://www.ladwp.com/commercial-services/programs-and-rebates-commercial/commercial-ev-charging/commercial-ev-charger-rebate-program']];
function Funding() {
  const cards = [['Project-specific support.', 'Equipment, site use, applicant eligibility and application timing can affect qualification. An application is not an award.', '01 / Rebates & grants'], ['A connection route.', 'Utility rules can address eligible infrastructure and cost allocation. Check which work and costs the rule covers.', '02 / Utility infrastructure'], ['A separate agreement.', 'Borrowing, leasing and other arrangements have their own terms. Confirm available options for your project.', '03 / Financing']];
  const questions = [['Is utility-funded infrastructure the same as a charger rebate?', 'Utility infrastructure support may cover eligible work on the utility side of the meter. A charger rebate offsets eligible equipment or installation costs under its own rules.'], ['Can I assume a published maximum award applies to my site?', 'The award depends on current eligibility, eligible costs, available funds and the program’s approval.'], ['Can incentives be included in project economics?', 'Use confirmed awards in a funded scenario and model the project before incentives as a separate case.']];
  return <><Hero label="Funding & incentives" title={['A sound project.', 'A clearer funding picture.']} description="Understand the difference between equipment incentives, utility infrastructure support and project financing. Start with your address and serving utility. Confirm eligibility, award amount and payment terms with the program before budgeting for an incentive." /><Section><Heading label="Three separate conversations"><Lines lines={['Know what each option', 'actually covers.']} /></Heading><Features cards={cards} /></Section>
    <Section tone="spw-sage"><div className="spw-split"><div><Heading label="Before the application">Get the foundation right.</Heading><p className="spw-intro">A prepared project is easier to screen. Confirm ownership, electrical needs and the documents required before purchasing or installing.</p><Action outline>Request a project review</Action></div><Checklist items={['Project address and serving utility', 'Property type, vehicle class and access', 'Proposed equipment and electrical scope', 'Permits, utility design and program sequence', 'Confirmed award and cost allocation, when available']} /></div></Section>
    <Section><div className="spw-section-lead"><div><Heading label="Official resources">Go to the source.</Heading></div><p>Verify enrollment and terms directly with the program.</p></div><div className="spw-resources">{resources.map(([name, type, description, url]) => <article className="spw-card" key={name}><div><p className="spw-kicker">{type}</p><h3>{name}</h3></div><p>{description}</p><a className="spw-text-link" href={url}>Official resource <ArrowUpRight size={16} /></a></article>)}</div><p className="spw-note spw-catalog-note">Program links are starting points. Availability and eligibility depend on current terms and your project.</p></Section>
    <Section tone="spw-green" id="economics"><div className="spw-split"><div><Heading label="Project economics"><Lines lines={['Make the base case', 'stand on its own.']} /></Heading></div><div><p className="spw-intro">Separate confirmed support from potential opportunities. Test lower utilization, energy costs and delays before committing to equipment.</p><div className="spw-actions"><Action href="/economics" outline>Explore an illustrative model</Action></div></div></div></Section><Questions items={questions} /><Cta /></>;
}
const solarPhoto = '/equipment-photos/solar.webp';
const solarCredit = 'https://commons.wikimedia.org/wiki/File:Solar_panels_on_house_roof.jpg';

function Solar() {
  return <><Hero label="Solar energy" title={['Your roof.', 'A new possibility.']} description="Plan rooftop solar, battery storage and EV charging together. Start with when your building and vehicles need electricity, then compare which system fits the site and utility rate." photo="solar"><Action>Start a solar conversation</Action></Hero>
    <Section><Heading label="A more considered starting point">Begin with the property.</Heading><Features cards={[
      ['Your electricity needs.', 'Review your bill, current usage and planned EV charging or other new loads.', '01 / Use'],
      ['Your roof and site.', 'Review roof condition, orientation, shade and the electrical connection.', '02 / Property'],
      ['Your next chapter.', 'Clarify the goals, ownership and budget before choosing a system configuration.', '03 / Plan'],
    ]} /></Section>
    <Section tone="spw-sage"><div className="spw-split spw-align-center"><div><Heading label="Solar + battery storage + EV charging"><Lines lines={['Consider the', 'whole energy picture.']} /></Heading><p className="spw-intro">Solar can supply daytime building and charging loads. A battery can store energy for later use or help limit peak grid demand. The right combination depends on charging schedules, utility rates, roof space and electrical capacity.</p><Action outline>Discuss your property</Action></div><figure className="spw-solar-figure"><img src={solarPhoto} alt="Solar panels installed on a residential roof" loading="lazy" /><figcaption><a href={solarCredit}>Photo by Gray Watson</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a> · Resized</figcaption></figure></div></Section><Cta title={['Let’s explore', 'your property’s potential.']} /></>;
}

function LinkCard({ href, title, description }: { href: string; title: string; description?: string }) {
  return <a className="spw-card spw-link-card" href={href}><span><strong>{title}</strong>{description && <small>{description}</small>}</span><ArrowUpRight size={19} aria-hidden="true" /></a>;
}

const legacySources = [
  ['Tesla Gen 2 Wall Connector', 'Legacy North American reference', 'https://www.tesla.com/support/charging/gen-2-wall-connector'],
  ['Tesla J1772 Wall Connector', 'Separate model with a J1772 connector', 'https://energylibrary.tesla.com/docs/Public/Charging/WallConnector/Gen3/Install/J1772/en-us/index.html'],
  ['Tesla Wall Connector regional information', 'Check the region and electrical supply before comparing', 'https://www.tesla.com/en_gb/support/charging/wall-connector'],
];

function ResourceLibrary() {
  const starter = [
    ['For property owners', 'Prepare your project brief.', 'Bring your goals, location, parking and utility details into focus.', '/contact', 'Open the project brief'],
    ['For better questions', 'Understand the basics.', 'Explore site selection, equipment fit, electrical upgrades and funding.', '/faq', 'Browse common questions'],
    ['For planning', 'Test the assumptions.', 'See how utilization and costs change an illustrative cash flow model.', '/economics', 'Explore project economics'],
  ];
  const documents = [...new Set(equipment.map(item => item.source))];
  return <><Hero label="Resources" title={['Less guesswork.', 'More useful detail.']} description="Planning resources for property owners, developers and investors. Prepare for a site assessment, compare business models and review equipment specifications when you need them." />
    <Section><Heading label="Start here"><Lines lines={['A little preparation', 'goes a long way.']} /></Heading><div className="spw-grid">{starter.map(([label, title, description, href, link]) => <article className="spw-card spw-feature" key={href}><p className="spw-kicker">{label}</p><h3>{title}</h3><p>{description}</p><a href={href} className="spw-text-link">{link}<ArrowUpRight size={16} aria-hidden="true" /></a></article>)}</div></Section>
    <Section tone="spw-sage"><Heading label="Manufacturer documents">See the source specifications.</Heading><div className="spw-document-grid">{documents.map(key => {
      const models = equipment.filter(item => item.source === key);
      return <LinkCard key={key} href={key} title={models.map(item => item.name).join(' / ')} description={models[0].brand + ' · Manufacturer reference'} />;
    })}</div></Section>
    <Section><Heading label="Keep the versions separate">Legacy & regional references</Heading><div className="spw-document-grid spw-document-stack">{legacySources.map(([title, description, href]) => <LinkCard key={href} {...{ title, description, href }} />)}</div></Section><Section tone="spw-sage"><Heading label="For owners and investors">Plan the business and operations.</Heading><ServiceLinks paths={["/property-owners", "/ownership-financing", "/operations-maintenance"]} /></Section><Cta /></>;
}

function Faq() {
  return <><Hero label="Common questions" title={['The questions worth asking.']} description="Clear starting points for equipment, installation, operations and funding." /><Questions items={[
    ['How do I know which EV charger fits my property?', 'Start with your vehicles, daily mileage, parking time and electrical capacity. Use those details to compare options.'],
    ['Will I need an electrical upgrade?', 'An assessment can determine whether existing service is sufficient and whether managed charging or service upgrades make sense.'],
    incentiveQuestion,
    ['Can solar and EV charging be planned together?', 'Yes. Review the property’s electricity use and charging schedule alongside expected solar production and the applicable utility rate.'],
    ['Who owns and operates a charging site?', 'Compare who pays upfront and ongoing costs, controls access and pricing, and takes support calls.'],
    ['What should investors check before relying on charging revenue?', 'Review utilization, electricity rates, operating expenses, downtime and contract terms. Compare lower-use and higher-cost scenarios in the economics model.'],
    ['What should I prepare for an assessment?', 'Bring the site location, a recent utility bill if available, parking details, vehicle needs and your timeline.'],
    ...solutions.map(item => item.faq),
    ['Does a manufacturer datasheet confirm rebate eligibility?', 'Check the current program’s approved equipment, project requirements and application process.'],
    ['What is the difference between charger output and incoming utility voltage?', 'Output describes what the charger can deliver to a vehicle. Incoming voltage describes the electrical supply needed at the site.'],
  ]} /><Cta /></>;
}

function About() {
  return <><Hero label="About Safeevg" title={['Practical energy.', 'Thoughtfully planned.']} description="We help property owners and fleet teams plan EV charging, solar and battery storage projects around the way their sites use energy." /><Section><div className="spw-split"><div><Heading label="Our point of view"><Lines lines={['Start by understanding.', 'Build with clarity.']} /></Heading></div><p className="spw-intro">Good energy decisions begin with the site, the people using it and the plan for what comes next. We bring equipment information, project preparation and the assessment process together.</p></div></Section><Section tone="spw-sage"><Features cards={[
    ['Your property comes first', 'Recommendations begin with the use, capacity and goals of the site.'],
    ['Make the details clear', 'Understand scope, responsibilities and conditions before committing.'],
    ['Plan beyond installation', 'Access, operations, future demand and support belong in the conversation.'],
  ]} /></Section><Section><Heading label="Why choose us?">Clear scope and clear responsibilities.</Heading><Features cards={[["Planning support", "Start with demand, electrical capacity, costs and how the site will operate. Use those findings to compare options and prepare a scope."], ["Qualified specialists", "Where the project calls for licensed design, electrical work or commissioning, confirm the assigned contractor and their qualifications in the proposal."], ["Clear handover", "Agree who owns the network, supports drivers and handles maintenance. Record those responsibilities before launch."]]} /><ServiceLinks paths={["/how-we-help", "/operations-maintenance"]} /></Section><Cta /></>;
}

function Contact() {
  return <><Hero label="Plan your project" title={['A few details.', 'A better starting point.']} description="Describe your site, charging or energy goals and timeline. Review your project brief and open an email draft to request an assessment." /><Section><div className="spw-split spw-contact-split"><div><Heading label="Your project, in focus"><Lines lines={['Start with', 'what you know.']} /></Heading><p className="spw-intro">Bring the details you have and use them to prepare for a conversation.</p><Checklist items={['Property type and general location', 'Vehicle needs and parking time', 'Goals, utility and timing if known']} /><aside className="spw-aside"><h3>Project brief preview</h3><p>Review and download a copy on your device, or open a draft assessment request in your email app.</p></aside><p className="spw-intro">Ready to get in touch? <a href="mailto:hello@safepublicworks.com?subject=Plan%20my%20project">Email Safeevg</a>.</p></div><ProjectBrief /></div></Section></>;
}

function Economics() {
  return <><Hero label="Project economics" title={['Change an assumption.', 'See the difference.']} description="Test how utilization and electricity costs affect an illustrative commercial charging project. Results are estimates based on your inputs. Actual returns can vary and may be negative." /><Section><EconomicsModel /></Section><Section tone="spw-sage"><aside className="spw-aside"><h3>Know what the model includes.</h3><p>The example assumes 365 operating days. Annual cash flow equals annual delivered energy multiplied by selling price minus electricity cost adjusted for efficiency and the variable fee, then reduced by fixed annual costs.</p><p>The model excludes incentives, debt service, taxes, depreciation and residual value. The defaults are illustrative. Replace them with site-specific figures for a project review.</p></aside></Section><Cta title={['Let’s put real site data', 'behind the plan.']} /></>;
}

function Privacy() {
  return <><Hero label="Privacy information" title={['Respect the details', 'people share.']} description="Privacy information for the project brief preview." /><Section><div className="spw-prose"><aside className="spw-aside"><h3>Your project brief</h3><p>The preview assembles the brief in your browser. You can download a copy to your device. The form does not transmit your details to our server or save them to browser storage. If you open an email draft, your email app receives the brief so you can review it and decide whether to send it.</p></aside><div className="spw-document-grid"><article className="spw-card spw-feature"><h3>Information you choose to share</h3><p>If you email the company, the information you include is sent through your email provider.</p></article><article className="spw-card spw-feature"><h3>Questions about privacy</h3><p>Contact <a href="mailto:hello@safepublicworks.com">Safeevg</a> for questions about the handling of information you share directly.</p></article></div><aside className="spw-aside"><h3>Using this website</h3><p>Equipment references, incentive summaries and calculator outputs are for planning. Confirm current specifications, program rules and project terms with the relevant provider before making a commitment.</p></aside></div></Section></>;
}

function EquipmentDetail({ item }: { item: typeof equipment[number] }) {
  const source = item.source;
  const specs = [['Rated output', item.power], ['Vehicle connector', item.connector], ...item.specs];
  return <><Section><nav className="spw-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/equipment">Equipment</a> / <span aria-current="page">{item.name}</span></nav><div className="spw-split spw-align-center"><figure className="spw-card spw-detail-photo"><img src={item.image} alt={item.name} /><figcaption>Image source <a href={source}>{item.brand}</a></figcaption></figure><div><p className="spw-kicker">{item.brand} / {item.category}</p><div className="spw-detail-tags">{item.uses.split(' · ').map(use => <span className="spw-tag" key={use}>{use}</span>)}</div><h1>{item.name}</h1><p className="spw-detail-output">{item.power}</p><p className="spw-intro">{item.description}</p><div className="spw-actions"><Action href={'/contact?equipment=' + encodeURIComponent(item.name)}>Discuss this equipment</Action><Action href="/equipment" outline>Compare options</Action></div></div></div></Section>
    <Section><div className="spw-split spw-spec-layout"><div><Heading label="The details that matter">Technical reference</Heading><p className="spw-note">Specifications depend on the selected configuration.</p><table className="spw-spec-table" aria-label={item.name + ' specifications'}><tbody>{specs.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table><p className="spw-note">Confirm the current production model and part number before procurement.</p></div><div className="spw-spec-aside"><aside className="spw-aside"><h3>Plan with the full picture.</h3><p>{item.note}</p></aside><LinkCard href={source} title="View source document" description={item.brand + ' · Manufacturer reference'} /><LinkCard href="/approach" title="What happens before installation" /></div></div></Section><Cta title={['Good equipment.', 'A considered installation plan.']} /></>;
}

function ServiceLinks({ paths }: { paths: readonly string[] }) {
  return <div className="spw-document-grid">{paths.map(path => <LinkCard key={path} href={path} title={serviceLinks[path]} />)}</div>;
}

function ServicePage({ content }: { content: typeof servicePages[keyof typeof servicePages] }) {
  return <>
    <Hero label={content.title} title={[content.headline]} description={content.intro}><Action>Request a site assessment</Action></Hero>
    <Section><Heading label="Planning considerations">What to work through</Heading><Features cards={content.sections.map(section => [...section])} /></Section>
    <Section tone="spw-sage"><Heading label="Next steps">Explore the details</Heading><ServiceLinks paths={content.links} /></Section>
    <Cta />
  </>;
}

const additionalPages = {
  '/solar': { title: 'Solar energy', Page: Solar },
  '/resources': { title: 'Resources', Page: ResourceLibrary },
  '/faq': { title: 'Common questions', Page: Faq },
  '/about': { title: 'About Safeevg', Page: About },
  '/contact': { title: 'Plan your project', Page: Contact },
  '/economics': { title: 'Project economics', Page: Economics },
  '/privacy': { title: 'Privacy information', Page: Privacy },
} as const;


export default function ChargingPages() {
  const path = window.location.pathname.replace(/\/$/, '');
  const property = solutions.find(item => path === route(item.slug));
  const item = equipment.find(product => path === '/equipment/' + product.id);
  const additional = additionalPages[path as keyof typeof additionalPages];
  const ExtraPage = additional?.Page;
  const service = servicePages[path as keyof typeof servicePages];
  const title = item?.name ?? service?.title ?? additional?.title ?? property?.name ?? ({ '/equipment': 'Equipment', '/funding': 'Funding & incentives', '/approach': 'Our approach' } as Record<string, string>)[path] ?? 'EV charging';
  useEffect(() => {
    const section = window.location.hash.slice(1);
    if (section) document.getElementById(section)?.scrollIntoView();
  }, [title]);

  return <Layout>{service ? <ServicePage content={service} /> : item ? <EquipmentDetail item={item} /> : ExtraPage ? <ExtraPage /> : property ? <Property item={property} /> : path === '/equipment' ? <Catalog /> : path === '/funding' ? <Funding /> : path === '/approach' ? <Approach /> : path === '/ev-charging' ? <Overview /> : <NotFound />}</Layout>;
}
