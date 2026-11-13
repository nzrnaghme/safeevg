export type PageMeta = { title: string; name: string; description: string };
export const SITE_URL = "https://safeevg.com";
export const pages: Record<string, PageMeta> = {
  "/": {
    name: "EV Charging, Solar & Battery Storage",
    title: "EV Charging, Solar & Battery Storage | Safeevg",
    description:
      "Plan home, public and fleet EV charging with Safeevg. Explore solar, battery storage, equipment and site assessment for Southern California properties.",
  },
  "/ev-charging": {
    name: "EV Charging Solutions",
    title: "EV Charging Solutions | Safeevg",
    description:
      "Explore home, apartment, workplace, public and fleet EV charging. Compare options based on parking time, vehicle needs and electrical capacity.",
  },
  "/solutions/home": {
    name: "Home EV Charging",
    title: "Home EV Charging | Safeevg",
    description:
      "Plan residential EV charging around your daily drive, parking space and electrical capacity. Explore home chargers and prepare for an assessment.",
  },
  "/solutions/apartments": {
    name: "Apartment & HOA EV Charging",
    title: "Apartment & HOA EV Charging | Safeevg",
    description:
      "Plan apartment and HOA EV charging with shared capacity, resident access, billing and future growth considered from the start.",
  },
  "/solutions/commercial": {
    name: "Commercial & Workplace EV Charging",
    title: "Commercial & Workplace EV Charging | Safeevg",
    description:
      "Explore charging for employees, customers and guests. Compare charging speeds, operating models and electrical needs for your business property.",
  },
  "/solutions/public-dc": {
    name: "Public DC Fast Charging",
    title: "Public DC Fast Charging | Safeevg",
    description:
      "Plan public fast charging around local demand, power availability, electricity costs and site operations. Compare equipment and assessment priorities.",
  },
  "/solutions/fleets": {
    name: "Fleet & Depot EV Charging",
    title: "Fleet & Depot EV Charging | Safeevg",
    description:
      "Plan fleet, electric bus and truck charging around routes, return times, vehicle energy needs and depot electrical capacity.",
  },
  "/equipment": {
    name: "EV Charger Equipment Catalog",
    title: "EV Charger Equipment Catalog | Safeevg",
    description:
      "Compare Tesla and ABB charger references for homes, workplaces, public sites and fleets. Filter equipment and review model specifications.",
  },
  "/funding": {
    name: "EV Charging Funding & Incentives",
    title: "EV Charging Funding & Incentives | Safeevg",
    description:
      "Understand incentives, utility infrastructure support and financing for EV charging. Review project preparation steps and official program resources.",
  },
  "/approach": {
    name: "Our EV Charging Project Process",
    title: "Our EV Charging Project Process | Safeevg",
    description:
      "Follow the Safeevg process from discovery and electrical assessment through scope, utility coordination, installation and commissioning.",
  },
  "/solar": {
    name: "Solar Energy & Battery Storage",
    title: "Solar Energy & Battery Storage | Safeevg",
    description:
      "Explore rooftop solar, battery storage and EV charging together. Plan around property conditions, electricity use and future energy needs.",
  },
  "/resources": {
    name: "EV Charging Planning Resources",
    title: "EV Charging Planning Resources | Safeevg",
    description:
      "Find manufacturer references and practical planning resources. Prepare a project brief, explore common questions and test project assumptions.",
  },
  "/faq": {
    name: "EV Charging Questions & Answers",
    title: "EV Charging Questions & Answers | Safeevg",
    description:
      "Get answers about charger selection, electrical upgrades, charging speeds, solar integration, operations and funding considerations.",
  },
  "/about": {
    name: "About Safeevg",
    title: "About Safeevg",
    description:
      "Learn how Safeevg approaches EV charging, solar and battery storage planning with clear scope, site-specific decisions and ongoing operations in mind.",
  },
  "/contact": {
    name: "Plan Your EV Charging Project",
    title: "Plan Your EV Charging Project | Safeevg",
    description:
      "Prepare an EV charging or energy project brief. Share your property goals, charging needs and timing, then review an email draft for an assessment.",
  },
  "/economics": {
    name: "EV Charging Economics Calculator",
    title: "EV Charging Economics Calculator | Safeevg",
    description:
      "Test an illustrative charging cash flow model. Adjust utilization, electricity costs and operating expenses to understand how assumptions affect results.",
  },
  "/privacy": {
    name: "Privacy Information",
    title: "Privacy Information | Safeevg",
    description:
      "Read how the Safeevg project brief works, what stays in your browser and what happens when you choose to share information through your email app.",
  },
  "/how-we-help": {
    name: "EV Charging Project Support",
    title: "EV Charging Project Support | Safeevg",
    description:
      "Explore Safeevg support for assessment, equipment selection, utility and permit coordination, installation planning and charging operations.",
  },
  "/property-owners": {
    name: "Charging for Property Owners & Developers",
    title: "Charging for Property Owners & Developers | Safeevg",
    description:
      "Explore EV charging planning for property owners and developers. Consider site use, capacity, ownership and long-term operating needs.",
  },
  "/ownership-financing": {
    name: "EV Charging Ownership & Financing",
    title: "EV Charging Ownership & Financing | Safeevg",
    description:
      "Compare EV charging ownership and financing considerations, including upfront costs, operating responsibilities, pricing and project terms.",
  },
  "/operations-maintenance": {
    name: "EV Charging Operations & Maintenance",
    title: "EV Charging Operations & Maintenance | Safeevg",
    description:
      "Plan charging operations, driver support, maintenance and handover responsibilities to keep your site ready for the people who use it.",
  },
  "/equipment/universal": {
    name: "Tesla Universal Wall Connector",
    title: "Tesla Universal Wall Connector | Safeevg",
    description:
      "Review Tesla Universal Wall Connector technical specifications, connector options and electrical requirements. Compare equipment and plan the installation for your site.",
  },
  "/equipment/ac40": {
    name: "ABB Terra AC Wallbox 40A",
    title: "ABB Terra AC Wallbox 40A | Safeevg",
    description:
      "Review ABB Terra AC Wallbox 40A technical specifications, connector options and electrical requirements. Compare equipment and plan the installation for your site.",
  },
  "/equipment/ac80": {
    name: "ABB Terra AC Wallbox 80A",
    title: "ABB Terra AC Wallbox 80A | Safeevg",
    description:
      "Review ABB Terra AC Wallbox 80A technical specifications, connector options and electrical requirements. Compare equipment and plan the installation for your site.",
  },
  "/equipment/dcwall": {
    name: "ABB Terra DC Wallbox",
    title: "ABB Terra DC Wallbox | Safeevg",
    description:
      "Review ABB Terra DC Wallbox technical specifications, connector options and electrical requirements. Compare equipment and plan the installation for your site.",
  },
  "/equipment/terra54": {
    name: "ABB Terra 54HV",
    title: "ABB Terra 54HV | Safeevg",
    description:
      "Review ABB Terra 54HV technical specifications, connector options and electrical requirements. Compare equipment and plan the installation for your site.",
  },
  "/equipment/terra124": {
    name: "ABB Terra 124",
    title: "ABB Terra 124 | Safeevg",
    description:
      "Review ABB Terra 124 technical specifications, connector options and electrical requirements. Compare equipment and plan the installation for your site.",
  },
  "/equipment/terra184": {
    name: "ABB Terra 184",
    title: "ABB Terra 184 | Safeevg",
    description:
      "Review ABB Terra 184 technical specifications, connector options and electrical requirements. Compare equipment and plan the installation for your site.",
  },
  "/equipment/terra360": {
    name: "ABB Terra 360 UL",
    title: "ABB Terra 360 UL | Safeevg",
    description:
      "Review ABB Terra 360 UL technical specifications, connector options and electrical requirements. Compare equipment and plan the installation for your site.",
  },
  "/equipment/hp": {
    name: "ABB Terra HP",
    title: "ABB Terra HP | Safeevg",
    description:
      "Review ABB Terra HP technical specifications, connector options and electrical requirements. Compare equipment and plan the installation for your site.",
  },
  "/equipment/a400": {
    name: "ABB A200 / A300 / A400",
    title: "ABB A200 / A300 / A400 | Safeevg",
    description:
      "Review ABB A200 / A300 / A400 technical specifications, connector options and electrical requirements. Compare equipment and plan the installation for your site.",
  },
  "/equipment/depot": {
    name: "ABB HVC-C Depot Charging",
    title: "ABB HVC-C Depot Charging | Safeevg",
    description:
      "Review ABB HVC-C Depot Charging technical specifications, connector options and electrical requirements. Compare equipment and plan the installation for your site.",
  },
  "/equipment/mobile": {
    name: "Tesla Gen 3 Mobile Connector",
    title: "Tesla Gen 3 Mobile Connector | Safeevg",
    description:
      "Review Tesla Gen 3 Mobile Connector technical specifications, connector options and electrical requirements. Compare equipment and plan the installation for your site.",
  },
};

export const normalizePath = (value: string) =>
  value.split("?")[0].replace(/\/+$/, "") || "/";
export const missingPage: PageMeta = {
  title: "Page not found | Safeevg",
  name: "Page not found",
  description:
    "This page could not be found. Explore Safeevg charging solutions, equipment and project planning resources.",
};
export function breadcrumbs(url: string) {
  const p = normalizePath(url);
  const result = [{ name: "Home", url: "/" }];
  if (p.startsWith("/equipment/"))
    result.push({ name: "Equipment", url: "/equipment" });
  if (p.startsWith("/solutions/"))
    result.push({ name: "EV charging", url: "/ev-charging" });
  if (p !== "/")
    result.push({ name: pages[p]?.name || "Page not found", url: p });
  return result;
}
export function structuredData(url: string) {
  const p = normalizePath(url),
    meta = pages[p];
  if (!meta) return null;
  const canonical = SITE_URL + p;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": SITE_URL + "/#organization",
        name: "Safeevg",
        url: SITE_URL,
        logo: SITE_URL + "/brand-logo.webp",
      },
      {
        "@type": "WebSite",
        "@id": SITE_URL + "/#website",
        name: "Safeevg",
        url: SITE_URL,
        publisher: { "@id": SITE_URL + "/#organization" },
      },
      {
        "@type":
          p === "/about"
            ? "AboutPage"
            : p === "/contact"
              ? "ContactPage"
              : "WebPage",
        "@id": canonical + "#webpage",
        url: canonical,
        name: meta.title,
        description: meta.description,
        isPartOf: { "@id": SITE_URL + "/#website" },
        breadcrumb: { "@id": canonical + "#breadcrumb" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": canonical + "#breadcrumb",
        itemListElement: breadcrumbs(p).map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: SITE_URL + item.url,
        })),
      },
    ],
  };
}
