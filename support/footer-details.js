(() => {
  const footer = document.querySelector('.site-footer');
  if (!footer) return;

  let grid = footer.querySelector('.footer-grid');
  if (!grid) {
    grid = document.createElement('div');
    grid.className = 'container footer-grid';
    const brand = document.createElement('div');
    brand.className = 'footer-brand';
    const name = document.createElement('h3');
    name.textContent = 'Marvel Timber Exporters';
    const description = document.createElement('p');
    description.textContent = 'Reliable timber and agro-commodity supply for global buyers.';
    brand.append(name, description);
    grid.append(brand);
    footer.insertBefore(grid, footer.firstChild);
  }

  const ensureLinks = (heading, links) => {
    let column = [...grid.children].find(
      (child) => child.querySelector('h4')?.textContent.trim().toLowerCase() === heading.toLowerCase()
    );

    if (!column) {
      column = document.createElement('div');
      const title = document.createElement('h4');
      title.textContent = heading;
      const list = document.createElement('ul');
      column.append(title, list);
      grid.append(column);
    }

    let list = column.querySelector('ul');
    if (!list) {
      list = document.createElement('ul');
      column.append(list);
    }

    links.forEach(({ label, href }) => {
      if ([...list.querySelectorAll('a')].some((link) => link.getAttribute('href') === href)) return;
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      item.append(link);
      list.append(item);
    });
  };

  ensureLinks('Company', [
    { label: 'Home', href: 'index.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Quality & Compliance', href: 'quality-compliance.html' },
    { label: 'Supply Network', href: 'supply-network.html' },
    { label: 'Contact', href: 'contact.html' }
  ]);

  ensureLinks('Products', [
    { label: 'All Products', href: 'products.html' },
    { label: 'Timber', href: 'products.html#timber-products' },
    { label: 'Agro Commodities', href: 'products.html#agro-commodities' },
    { label: 'Oil Seeds', href: 'oil-seeds.html' },
    { label: 'Spices', href: 'spices.html' },
    { label: 'Pulses & Beans', href: 'pulses-and-beans.html' },
    { label: 'Other Commodities', href: 'other-commodities.html' }
  ]);

  let contactColumn = [...grid.children].find((child) =>
    child.querySelector('h4')?.textContent.trim().toLowerCase().includes('contact')
  );
  if (!contactColumn) {
    contactColumn = document.createElement('div');
    contactColumn.className = 'footer-contact-block';
    const meta = document.createElement('div');
    meta.className = 'footer-meta-item';
    const title = document.createElement('h4');
    title.textContent = 'Contact';
    const list = document.createElement('ul');
    meta.append(title, list);
    contactColumn.append(meta);
    grid.append(contactColumn);
  }
  const contactList = contactColumn?.querySelector('ul');
  if (contactList && !contactList.textContent.includes('Mafinga')) {
    const item = document.createElement('li');
    item.textContent = 'Marvel Timber Exporters, Mafinga, Iringa Region, Tanzania';
    contactList.append(item);
  }

  if (!grid.querySelector('.social-links')) {
    const social = document.createElement('div');
    social.className = 'footer-meta-item footer-social-block';
    const title = document.createElement('h4');
    title.textContent = 'Follow Us';
    const list = document.createElement('ul');
    list.className = 'social-links footer-social-text';

    [
      ['Facebook', 'https://facebook.com'],
      ['Instagram', 'https://www.instagram.com/marveltimberexporters?utm_source=qr'],
      ['TikTok', 'https://tiktok.com'],
      ['X', 'https://x.com']
    ].forEach(([label, href]) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = href;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = label;
      item.append(link);
      list.append(item);
    });

    social.append(title, list);
    (contactColumn || grid).append(social);
  }

  if (!footer.querySelector('.footer-bottom')) {
    const bottom = document.createElement('div');
    bottom.className = 'container footer-bottom';
    const copyright = document.createElement('span');
    copyright.textContent = '© 2026 Marvel Timber Exporters. All rights reserved.';
    bottom.append(copyright);
    footer.append(bottom);
  }

  const footerBottom = footer.querySelector('.footer-bottom');
  if (footerBottom && !footerBottom.querySelector('.footer-credit')) {
    const credit = document.createElement('a');
    credit.className = 'footer-credit';
    credit.href = 'https://digicoretech.co.tz';
    credit.target = '_blank';
    credit.rel = 'noopener noreferrer';
    credit.textContent = 'Developed by DigiCoreTech';
    footerBottom.append(credit);
  }
})();
