// Lightweight typing animation for hero typed-text
(function(){
  const els = document.querySelectorAll('.typed-text');
  if(!els.length) return;

  function sleep(ms){return new Promise(r=>setTimeout(r, ms));}

  els.forEach(el=>{
    let items = [];
    try{ items = JSON.parse(el.getAttribute('data-typed')) }catch(e){ items = [el.textContent.trim()] }
    let index = 0;
    let typingSpeed = 45; // ms per char
    let pauseAfter = 1200; // ms to pause after typing full word
    let pauseBetween = 400; // pause before deleting
    let deletingSpeed = 25;

    el.setAttribute('aria-live','polite');
    el.classList.add('typing');

    async function run(){
      while(true){
        const text = items[index % items.length];
        // type
        for(let i=0;i<=text.length;i++){
          el.textContent = text.slice(0,i);
          await sleep(typingSpeed);
        }
        await sleep(pauseAfter);
        // delete
        for(let i=text.length;i>=0;i--){
          el.textContent = text.slice(0,i);
          await sleep(deletingSpeed);
        }
        await sleep(pauseBetween);
        index++;
      }
    }
    // small delay to allow CSS transitions and fonts to load
    setTimeout(run, 250);
  });
})();
