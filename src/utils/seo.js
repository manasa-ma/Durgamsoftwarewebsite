function setMetaTag(selector, attribute, value) {
  if (!value) return;
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    const [attrName, attrVal] = selector.replace(/[\[\]"]/g, '').split('=');
    element.setAttribute(attrName, attrVal);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

export function updatePageMeta({ title, description, canonical, image, type = 'website' } = {}) {
  let fullTitle = 'Durgam Soft Pvt. Ltd. | Software Products & Technology Solutions';
  if (title) {
    if (title.includes('Durgam Soft')) {
      fullTitle = title;
    } else {
      fullTitle = `${title} | Durgam Soft`;
    }
  }
  document.title = fullTitle;

  const defaultDesc =
    'Durgam Soft Pvt. Ltd. is a software product and technology company offering billmaster billing software, business applications, billing hardware, web and mobile app development, desktop applications, and digital solutions for businesses.';
  const descContent = description || defaultDesc;

  setMetaTag('meta[name="description"]', 'content', descContent);

  // Canonical URL
  const canonicalUrl = canonical || (window.location.origin + window.location.pathname);
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonicalUrl);

  // Open Graph
  setMetaTag('meta[property="og:site_name"]', 'content', 'Durgam Soft');
  setMetaTag('meta[property="og:title"]', 'content', fullTitle);
  setMetaTag('meta[property="og:description"]', 'content', descContent);
  setMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
  setMetaTag('meta[property="og:type"]', 'content', type);

  const defaultImage = 'https://www.durgamsoft.com/logos/durgamsoft-logo.webp';
  setMetaTag('meta[property="og:image"]', 'content', image || defaultImage);

  // Twitter Card
  setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
  setMetaTag('meta[name="twitter:description"]', 'content', descContent);
  setMetaTag('meta[name="twitter:image"]', 'content', image || defaultImage);
}
