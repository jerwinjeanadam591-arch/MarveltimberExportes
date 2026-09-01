// Lightweight typing animation for hero typed-text
(function(){
  function sleep(ms){return new Promise(r=>setTimeout(r, ms));}

  function createTyper(el){
    let items = [];
    try{ items = JSON.parse(el.getAttribute('data-typed')) }catch(e){ items = [el.textContent.trim()] }
    if(!items || !items.length) return null;

    let index = 0;
    const typingSpeed = parseInt(el.getAttribute('data-typing-speed')) || 45;
    const pauseAfter = parseInt(el.getAttribute('data-pause-after')) || 1200;
    const pauseBetween = parseInt(el.getAttribute('data-pause-between')) || 400;
    const deletingSpeed = parseInt(el.getAttribute('data-deleting-speed')) || 25;
    let running = true;

    el.setAttribute('aria-live','polite');
    el.classList.add('typing');

    async function run(){
      while(running){
        const text = items[index % items.length] || '';
        for(let i=0;i<=text.length;i++){
          el.textContent = text.slice(0,i);
          await sleep(typingSpeed);
          if(!running) return;
        }
        await sleep(pauseAfter);
        if(!running) return;
        for(let i=text.length;i>=0;i--){
          el.textContent = text.slice(0,i);
          await sleep(deletingSpeed);
          if(!running) return;
        }
        await sleep(pauseBetween);
        index++;
      }
    }

    run().catch(()=>{});

    return {
      stop(){ running = false; }
    };
  }

  function startAll(){
    const els = document.querySelectorAll('.typed-text');
    if(!els.length) return;

    // For each element, create a MutationObserver to restart typing when data-typed changes
    els.forEach(el => {
      // avoid creating multiple instances
      if(el.__typer) return;
      el.__typer = createTyper(el);

      // observe attribute changes to data-typed (language switching might update it)
      const mo = new MutationObserver((records)=>{
        for(const r of records){
          if(r.type === 'attributes' && r.attributeName === 'data-typed'){
            // restart
            if(el.__typer && el.__typer.stop) el.__typer.stop();
            el.__typer = createTyper(el);
          }
        }
      });
      mo.observe(el, { attributes: true });
    });
  }

  // Wait for DOM ready, then start. Also retry after a short delay to account for translation scripts
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{
      startAll();
      // retry once after translations likely loaded
      setTimeout(startAll, 600);
    });
  } else {
    startAll();
    setTimeout(startAll, 600);
  }
})();
