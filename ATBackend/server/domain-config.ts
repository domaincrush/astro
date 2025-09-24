// Domain configuration for production deployment on Replit
// This handles the routing for specialized domain frontends

export interface DomainConfig {
  domain: string;
  frontendDir: string;
  tenant: string;
  language: string;
  name: string;
}

export const domainConfigs: DomainConfig[] = [
  {
    domain: 'astroneram.com',
    frontendDir: 'astroneram-frontend',
    tenant: 'astroneram-com',
    language: 'tamil',
    name: 'AstroNeram'
  },
  {
    domain: 'astrojothidam.com',
    frontendDir: 'astrojothidam-frontend',
    tenant: 'astrojothidam-com',
    language: 'tamil',
    name: 'AstroJothidam'
  },
  {
    domain: 'jaataka.com',
    frontendDir: 'jaataka-frontend',
    tenant: 'jaataka-com',
    language: 'kannada',
    name: 'Jaataka'
  },
  {
    domain: 'astroscroll.com',
    frontendDir: 'astroscroll-frontend',
    tenant: 'astroscroll-com',
    language: 'hindi',
    name: 'AstroScroll'
  },
  {
    domain: 'indiahoroscope.com',
    frontendDir: 'indiahoroscope-frontend',
    tenant: 'indiahoroscope-com',
    language: 'english',
    name: 'IndiaHoroscope'
  },
  {
    domain: 'kundali.in',
    frontendDir: 'kundali-frontend',
    tenant: 'kundali-in',
    language: 'hindi',
    name: 'Kundali'
  },
  {
    domain: 'astrotelugu.com',
    frontendDir: 'astrotelugu-frontend',
    tenant: 'astrotelugu-com',
    language: 'telugu',
    name: 'AstroTelugu'
  }
];

// Default domain mapping function
export function getFrontendByDomain(domain: string): DomainConfig | null {
  return domainConfigs.find(config => domain.includes(config.domain)) || null;
}

// Production environment detection
export function isProductionDomain(host: string): boolean {
  return !host.includes('localhost') && !host.includes('replit.dev') && !host.includes('spock');
}