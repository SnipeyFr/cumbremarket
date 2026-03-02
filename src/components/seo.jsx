export function setSEO({ 
  title, 
  description, 
  canonicalPath, 
  ogImage, 
  ogType = 'website',
  structuredData 
}) {
  // Title
  if (title) {
    document.title = title;
  }

  // Meta helpers
  const setMeta = (name, content) => {
    if (!content) return;
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  const setProperty = (property, content) => {
    if (!content) return;
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Description
  setMeta('description', description);

  // Canonical
  const fullUrl = canonicalPath ? new URL(canonicalPath, window.location.origin).toString() : window.location.href;
  if (canonicalPath) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', fullUrl);
  }

  // Open Graph
  setProperty('og:title', title);
  setProperty('og:description', description);
  setProperty('og:url', fullUrl);
  setProperty('og:type', ogType);
  if (ogImage) {
    setProperty('og:image', ogImage);
  }

  // Twitter
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  if (ogImage) {
    setMeta('twitter:image', ogImage);
  }

  // Structured Data (JSON-LD)
  if (structuredData) {
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }
}