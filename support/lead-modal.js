// Simple lead modal with focus trap and form submission (mailto fallback)
(function(){
  function qs(sel, root=document){return root.querySelector(sel)}
  function qsa(sel, root=document){return Array.from((root||document).querySelectorAll(sel))}

  const openButtons = qsa('[data-open-lead]');
  const backdrop = document.createElement('div');
  backdrop.className = 'lead-modal-backdrop';
  backdrop.setAttribute('role','dialog');
  backdrop.setAttribute('aria-modal','true');
  backdrop.setAttribute('aria-hidden','true');
  backdrop.tabIndex = -1;

  backdrop.innerHTML = `
    <div class="lead-modal" role="document">
      <h2 data-i18n="lead.title">Request a Quote</h2>
      <p data-i18n="lead.subtitle">Tell us what you need and we'll follow up within one business day.</p>
      <form class="lead-form" id="leadForm">
        <label class="full" for="company">Company</label>
        <input class="full" id="company" name="company" placeholder="Company name" data-i18n-type="placeholder" data-i18n="lead.company" />
        <div>
          <label for="name">Name</label>
          <input id="name" name="name" placeholder="Full name" data-i18n-type="placeholder" data-i18n="lead.name" />
        </div>
        <div>
          <label for="email">Email</label>
          <input id="email" name="email" placeholder="Email address" data-i18n-type="placeholder" data-i18n="lead.email" />
        </div>
        <label class="full" for="message">Message</label>
        <textarea class="full" id="message" name="message" placeholder="Project details, quantity, destination..." data-i18n-type="placeholder" data-i18n="lead.message"></textarea>
        <div class="lead-actions full">
          <button type="button" class="btn-cancel" id="leadCancel" data-i18n="lead.cancel">Cancel</button>
          <button type="submit" class="btn-lead" id="leadSubmit" data-i18n="lead.submit">Send Request</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(backdrop);

  const modal = qs('.lead-modal');
  const form = qs('#leadForm');
  const cancel = qs('#leadCancel');

  function openModal(){
    backdrop.classList.add('active');
    backdrop.setAttribute('aria-hidden','false');
    // simple focus trap: focus first input
    const first = qs('#company');
    if(first) first.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    backdrop.classList.remove('active');
    backdrop.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    // return focus
    if(lastTrigger) lastTrigger.focus();
  }

  let lastTrigger = null;
  openButtons.forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault(); lastTrigger = e.currentTarget; openModal();
    })
  });

  cancel.addEventListener('click', (e)=>{ e.preventDefault(); closeModal(); });

  backdrop.addEventListener('click', (e)=>{
    if(e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && backdrop.classList.contains('active')){
      closeModal();
    }
  });

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')||'';
    const company = data.get('company')||'';
    const email = data.get('email')||'';
    const message = data.get('message')||'';
    // fallback: mailto
    const subject = encodeURIComponent('Quote request from '+(company||name||'website'));
    const body = encodeURIComponent(`Name: ${name}\nCompany: ${company}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:marveltimberexporters@gmail.com?subject=${subject}&body=${body}`;
    closeModal();
  });

  // create sticky CTA button
  const sticky = document.createElement('button');
  sticky.className = 'sticky-cta';
  sticky.type = 'button';
  sticky.setAttribute('aria-label','Request Quote');
  sticky.setAttribute('data-open-lead','');
  sticky.textContent = 'Request Quote';
  document.body.appendChild(sticky);
  sticky.addEventListener('click', (e)=>{ e.preventDefault(); lastTrigger = sticky; openModal(); });

})();
