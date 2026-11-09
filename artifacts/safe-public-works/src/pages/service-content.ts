export const servicePages = {
  '/how-we-help': {
    title: 'How we can help', headline: 'From site assessment to daily operation',
    intro: 'Plan EV charging, solar and battery storage around the way your property uses energy. Start with the site and decide what to build, who will deliver it and who will run it.',
    sections: [
      ['Planning and site assessment', 'Review who will charge, how long vehicles park, when power is needed and what electrical capacity is available. Identify constraints and decide what needs a closer look.'],
      ['Equipment selection', 'Compare charging speeds, connectors, access controls and software against your needs and budget. Evaluate solar and storage where they can support the project.'],
      ['Engineering, permits and installation', 'Define the design scope, utility coordination, permitting and installation sequence. Confirm which tasks the project team will coordinate and which require qualified contractors or licensed professionals.'],
      ['Incentives and project structure', 'Check current program rules and compare ownership, operator and financing arrangements before committing.'],
      ['Commissioning and ongoing operations', 'Agree on testing, network setup, support responsibilities and maintenance before the equipment goes live.'],
    ], links: ['/approach', '/property-owners', '/ownership-financing', '/operations-maintenance'],
  },
  '/property-owners': {
    title: 'Property owners & developers', headline: 'Make charging work for your property',
    intro: 'Evaluate EV charging for shopping centers, hotels, offices, new developments, parking structures and mixed-use buildings.',
    sections: [
      ['Shopping centers and hotels', 'Look at visitor dwell time, turnover and overnight demand. Decide whether charging is an amenity, a paid service or a mix, and plan who helps guests when a session fails.'],
      ['Offices and mixed-use properties', 'Separate employee, tenant and visitor demand by time of day. Plan who can access each charger, how costs are allocated and how to expand as demand grows.'],
      ['New developments and parking structures', 'Coordinate electrical capacity, conduit, accessible routes and future spaces early. A phased design can reserve capacity and pathways while starting with fewer ports.'],
      ['Build a case before procurement', 'Compare parking use, electrical capacity, installed and recurring costs, utility timelines and potential charging revenue. Bring a site plan, available electrical information and your goals to the assessment.'],
    ], links: ['/solutions/commercial', '/ownership-financing', '/economics', '/contact'],
  },
  '/ownership-financing': {
    title: 'Ownership, revenue & financing', headline: 'Decide who owns, pays for and runs charging',
    intro: 'Compare the roles, costs and tradeoffs before selecting a business model. Availability and terms depend on the site, project economics and participating partners.',
    sections: [
      ['Property-owner investment', 'The owner funds the project and can retain control over pricing and access. Budget for electricity, networking, payment fees, maintenance and replacements.'],
      ['Third-party charging operator', 'An operator may finance, own or run equipment under a site agreement. Compare term length, pricing control, uptime obligations, access rights and what happens when the agreement ends.'],
      ['Leasing and revenue sharing', 'Compare payment schedules, ownership, minimum commitments and service obligations. For revenue sharing, check which costs are deducted before the split.'],
      ['Utility incentives and grants', 'Screen the site against current utility and program requirements. Keep potential incentives separate from documented awards and include a scenario without incentives.'],
      ['What investors should check', 'Review utilization assumptions, electricity rates, fixed costs, contract obligations and downtime. Test lower demand and higher costs before making an investment decision.'],
    ], links: ['/funding', '/economics', '/operations-maintenance', '/contact'],
  },
  '/operations-maintenance': {
    title: 'Operations & maintenance', headline: 'Know who keeps your chargers running',
    intro: 'Put a support plan in place before launch. Assign a named contact and an escalation path for each part of the charging service.',
    sections: [
      ['Monitoring and incident response', 'Specify who checks charger status, receives alerts and owns each incident until it is resolved. Agree on coverage hours and how outages are escalated.'],
      ['Driver assistance', 'Decide who answers questions about access, payment, failed sessions and refunds. Put the right support contact on the station and in any app.'],
      ['Repairs and preventive maintenance', 'Document who handles remote diagnostics, on-site repair, parts, inspections and warranty claims. Identify which work requires a qualified technician.'],
      ['Reporting and handover', 'Agree on uptime reporting, access to usage data, account ownership and escalation targets. Make sure the property team has contacts, manuals and credentials at handover.'],
    ], links: ['/approach', '/ownership-financing', '/faq', '/contact'],
  },
} as const;

export const serviceLinks: Record<string, string> = {
  '/how-we-help': 'How we can help', '/property-owners': 'Property owners & developers',
  '/ownership-financing': 'Ownership, revenue & financing', '/operations-maintenance': 'Operations & maintenance',
  '/approach': 'Project process', '/solutions/commercial': 'Workplace and business charging', '/economics': 'Project economics',
  '/funding': 'Funding & incentives', '/faq': 'Common questions', '/contact': 'Request a site assessment',
};
