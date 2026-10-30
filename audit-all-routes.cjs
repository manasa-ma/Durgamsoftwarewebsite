const { execSync } = require('child_process');
const fs = require('fs');

const routes = [
  { name: 'Home', path: '/' },
  { name: 'Billmaster Product', path: '/products/billmaster' },
  { name: 'Hardware Products', path: '/products/hardware' },
  { name: 'Services Overview', path: '/services' },
  { name: 'Web Development', path: '/services/web-development' },
  { name: 'Mobile Development', path: '/services/mobile-development' },
  { name: 'Desktop Development', path: '/services/desktop-development' },
  { name: 'Digital Marketing', path: '/services/digital-marketing' },
  { name: 'Industries', path: '/industries' },
  { name: 'About Us', path: '/about-us' },
  { name: 'Blog Overview', path: '/blog' },
  { name: 'Blog Post Article', path: '/blog/how-technology-helps-small-businesses-grow' },
  { name: 'Careers', path: '/careers' },
  { name: 'Job Details', path: '/careers/software-engineer-flutter' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Book a Demo', path: '/book-demo' }
];

const results = [];

for (const r of routes) {
  const url = `http://localhost:4173${r.path}`;
  const slug = r.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  // 1. Audit Desktop
  console.log(`\n========================================`);
  console.log(`[DESKTOP] Auditing ${r.name} (${url})...`);
  const desktopOut = `lh-${slug}-desktop.json`;
  try {
    execSync(`npx --yes lighthouse "${url}" --chrome-flags="--headless" --output=json --output-path="${desktopOut}" --preset=desktop --quiet`, { stdio: 'inherit' });
    const data = JSON.parse(fs.readFileSync(desktopOut, 'utf8'));
    const cats = data.categories;
    const desktopScore = {
      name: r.name,
      path: r.path,
      device: 'Desktop',
      performance: Math.round(cats.performance.score * 100),
      accessibility: Math.round(cats.accessibility.score * 100),
      bestPractices: Math.round(cats['best-practices'].score * 100),
      seo: Math.round(cats.seo.score * 100),
      cls: data.audits['cumulative-layout-shift']?.numericValue || 0,
      lcp: data.audits['largest-contentful-paint']?.displayValue || '',
      fcp: data.audits['first-contentful-paint']?.displayValue || ''
    };
    results.push(desktopScore);
    console.log(`DESKTOP Score for ${r.name}:`, desktopScore);
  } catch (err) {
    console.error(`DESKTOP Failed ${r.name}:`, err.message);
  }

  // 2. Audit Mobile
  console.log(`[MOBILE] Auditing ${r.name} (${url})...`);
  const mobileOut = `lh-${slug}-mobile.json`;
  try {
    execSync(`npx --yes lighthouse "${url}" --chrome-flags="--headless" --output=json --output-path="${mobileOut}" --quiet`, { stdio: 'inherit' });
    const data = JSON.parse(fs.readFileSync(mobileOut, 'utf8'));
    const cats = data.categories;
    const mobileScore = {
      name: r.name,
      path: r.path,
      device: 'Mobile',
      performance: Math.round(cats.performance.score * 100),
      accessibility: Math.round(cats.accessibility.score * 100),
      bestPractices: Math.round(cats['best-practices'].score * 100),
      seo: Math.round(cats.seo.score * 100),
      cls: data.audits['cumulative-layout-shift']?.numericValue || 0,
      lcp: data.audits['largest-contentful-paint']?.displayValue || '',
      fcp: data.audits['first-contentful-paint']?.displayValue || ''
    };
    results.push(mobileScore);
    console.log(`MOBILE Score for ${r.name}:`, mobileScore);
  } catch (err) {
    console.error(`MOBILE Failed ${r.name}:`, err.message);
  }
}

fs.writeFileSync('all-routes-scores.json', JSON.stringify(results, null, 2), 'utf8');
console.log('\n========================================');
console.log('ALL ROUTE AUDITS COMPLETED SUCCESSFULLY!');
