/* Atalho para os controles de medição do React, que permanecem no rodapé da Calculadora Gestacional. */
(() => {
  "use strict";
  if (location.hostname !== "calculadoragestacional.orquestrator.ai" || !["/", "/index.html"].includes(location.pathname)) return;
  const chave = "cookie-consent-v1";
  const encontrarAviso = () => document.querySelector('section[aria-label="Aviso de cookies"]');
  let entrada, voltarPara = null, quadro = 0;
  function decidiu() {
    try { return typeof JSON.parse(localStorage.getItem(chave))?.analytics === "boolean"; }
    catch { return false; }
  }
  function sincronizar() {
    quadro = 0;
    if (decidiu()) {
      observador.disconnect();
      entrada?.remove();
      if (voltarPara !== null) {
        const anterior = voltarPara;
        voltarPara = null;
        requestAnimationFrame(() => {
          document.getElementById("idade-gestacional")?.focus({preventScroll:true});
          window.scrollTo({top:anterior,behavior:"instant"});
        });
      }
      return;
    }
    const aviso = encontrarAviso();
    const barra = document.querySelector(".gestacional-produto > .c2-barra");
    if (!aviso || !barra || entrada?.isConnected) return;
    // O aviso é montado só depois da hidratação e da leitura das preferências pela própria página.
    entrada = document.createElement("div");
    entrada.className = "gst-primeira-escolha";
    const dentro = document.createElement("div");
    const rotulo = document.createElement("span");
    rotulo.textContent = "Permitir a medição de visitas?";
    const opcoes = document.createElement("button");
    opcoes.type = "button";
    opcoes.textContent = "Ver opções";
    opcoes.setAttribute("aria-label","Ver opções de medição de visitas");
    opcoes.addEventListener("click", () => {
      const atual = encontrarAviso();
      if (!atual) return;
      voltarPara = window.scrollY;
      atual.tabIndex = -1;
      atual.focus({preventScroll:true});
      atual.scrollIntoView({block:"center",behavior:"instant"});
    });
    dentro.append(rotulo,opcoes);
    entrada.append(dentro);
    barra.after(entrada);
  }
  const agendar = () => { if (!quadro) quadro=requestAnimationFrame(sincronizar); };
  const observador = new MutationObserver(agendar);
  if (!decidiu()) observador.observe(document.body,{childList:true,subtree:true});
  window.addEventListener("contagem:consentimento",sincronizar);
  window.addEventListener("storage",e=>{if(e.key===chave)sincronizar();});
  sincronizar();
})();
