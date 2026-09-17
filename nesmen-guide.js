(() => {
  "use strict";

  const app = document.getElementById("app");
  const hud = document.getElementById("hud");
  const objective = document.getElementById("objectiveLabel");
  const briefTitle = document.getElementById("briefTitle");
  const briefText = document.getElementById("briefText");

  if (!app || !hud || !objective) return;

  const style = document.createElement("style");
  style.textContent = `
    .nesmen-ranger-guide{
      position:fixed;
      z-index:46;
      left:50%;
      top:max(calc(env(safe-area-inset-top) + 92px),108px);
      transform:translate(-50%,-8px);
      width:min(88vw,430px);
      padding:10px 15px 11px;
      border:1px solid rgba(196,235,176,.65);
      border-radius:14px;
      background:rgba(22,43,29,.94);
      box-shadow:0 10px 28px rgba(0,0,0,.28);
      color:#f5fff1;
      text-align:center;
      pointer-events:none;
      opacity:0;
      visibility:hidden;
      transition:opacity .18s ease,transform .18s ease,visibility .18s linear;
      backdrop-filter:blur(7px);
      -webkit-backdrop-filter:blur(7px);
    }
    .nesmen-ranger-guide.visible{
      opacity:1;
      visibility:visible;
      transform:translate(-50%,0);
    }
    .nesmen-ranger-guide strong{
      display:block;
      font-size:13px;
      line-height:1.2;
      letter-spacing:.075em;
      text-transform:uppercase;
      color:#c7f0b8;
    }
    .nesmen-ranger-guide span{
      display:block;
      margin-top:3px;
      font-size:12px;
      line-height:1.35;
      color:rgba(245,255,241,.9);
    }
    @media(max-height:540px) and (orientation:landscape){
      .nesmen-ranger-guide{top:max(calc(env(safe-area-inset-top) + 62px),72px);width:min(58vw,420px);padding:7px 12px 8px}
      .nesmen-ranger-guide span{font-size:11px}
    }
  `;
  document.head.appendChild(style);

  const guide = document.createElement("div");
  guide.className = "nesmen-ranger-guide";
  guide.setAttribute("role", "status");
  guide.setAttribute("aria-live", "polite");
  guide.setAttribute("aria-hidden", "true");
  guide.innerHTML = "<strong>↖ LESNÍK · U CHATY U STARTU</strong><span>Přibliž se k postavě v zeleném a stiskni AKCE.</span>";
  app.appendChild(guide);

  function syncGuide(){
    const isNesmenBrief = briefTitle?.textContent.trim() === "Lesní profily";
    if (isNesmenBrief && briefText && briefText.dataset.rangerHint !== "1") {
      const base = briefText.textContent.trim();
      const extra = "Lesník stojí u chaty hned u místa, kde začínáš.";
      briefText.textContent = base ? `${base} ${extra}` : extra;
      briefText.dataset.rangerHint = "1";
    }

    const needsRanger = !hud.classList.contains("hidden") && objective.textContent.trim() === "Získej souhlas lesníka";
    guide.classList.toggle("visible", needsRanger);
    guide.setAttribute("aria-hidden", needsRanger ? "false" : "true");
  }

  const observer = new MutationObserver(syncGuide);
  observer.observe(objective, { childList:true, characterData:true, subtree:true });
  observer.observe(hud, { attributes:true, attributeFilter:["class"] });
  if (briefTitle) observer.observe(briefTitle, { childList:true, characterData:true, subtree:true });
  if (briefText) observer.observe(briefText, { childList:true, characterData:true, subtree:true });

  syncGuide();
})();
