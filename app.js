/* ============================================================
   Análise Técnica · multi-tipo — shell único + mecânicas componíveis
   Mecânicas: produto = comparar/escolher SKU (matriz) · serviço/software = atende-não (checklist) · solução = seções
   ============================================================ */
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const clone = o => JSON.parse(JSON.stringify(o));
const ICO_OK = `<svg class="ico ok" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>`;
const ICO_NO = `<svg class="ico no" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>`;
const ICO_ARROW = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11L11 5M6 5h5v5"/></svg>`;
const ICO_CHAT = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M3 4h10v7H8l-3 2v-2H3z"/></svg>`;
const ICO_PLUS = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>`;
const ICO_CARET = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg>`;
const ICO_PENCIL = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2.5l2.5 2.5L6 12.5 3 13l.5-3z"/></svg>`;
const ICO_CHEV_L = `<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4l-4 4 4 4"/></svg>`;
const ICO_CHEV_R = `<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg>`;
const ICO_TRASH = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.5 8h6l.5-8M6.5 7v3.5M9.5 7v3.5"/></svg>`;
const ICO_LINK = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.7 9.3l2.6-2.6M7 4.6l1-1a2.4 2.4 0 0 1 3.4 3.4l-1 1M9 11.4l-1 1a2.4 2.4 0 0 1-3.4-3.4l1-1"/></svg>`;
const ICO_WARN = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.5l6 11H2l6-11z"/><path d="M8 6.5v3.2"/><path d="M8 11.6v.01"/></svg>`;
const ICO_ALERT = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3.4" stroke-linecap="round"/><path d="M8 11v.01" stroke-linecap="round"/></svg>`;
const PIN_SVG = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M6 2.5h4l-.8 3.5 2.3 2H4.5l2.3-2L6 2.5z"/><path d="M8 8v5.5"/></svg>`;

/* ---------- matriz (componente "produto") ----------
   comp = { mecanica:"produto", skus:[...], reqs:[...], overrides:[], naoAnalisadas:[], catalogoNaoEdital:[] } */
function matrixOf(comp) {
  if (!comp._m) {
    const s = clone(comp.reqs); (comp.overrides || []).forEach(o => s[o.ri].cells[o.ci] = { st: o.st, v: o.v, c: o.c });
    // requisitos identificados no edital cujo valor não foi extraído → entram como linhas com placeholder
    (comp.naoAnalisadas || []).forEach(n => s.push({ req: n.req, exig: "", unidade: n.unidade || "", naoExtraido: true, modulo: "—", _valorEdital: n.valorEdital, _trecho: n.trecho, origem: { doc: "Edital — Termo de Referência", pag: "—", trecho: "A IA identificou a exigência deste requisito no edital, mas não conseguiu extrair o valor automaticamente." }, cells: comp.skus.map((_, i) => ({ st: "nm", v: (n.vals && n.vals[i]) || "—" })) }));
    comp._m = s;
  }
  return comp._m;
}
function scoresFor(specs, skus) {
  return skus.map((sku, i) => {
    let ok = 0, evaluable = 0, ne = 0; const diverg = [];
    specs.forEach(spec => {
      if (spec.exigNa || spec.naoExtraido) return;
      const cell = spec.cells[i];
      if (cell.st === "ok") { ok++; evaluable++; }
      else if (cell.st === "no") { evaluable++; diverg.push(spec.req); }
      else if (cell.st === "ne") ne++;
    });
    return { i, sku, ok, evaluable, ne, pct: evaluable ? Math.round(ok / evaluable * 100) : 0, diverg };
  });
}
/* compara o valor do produto com a exigência do edital → atende (ok) / não atende (no) / não avaliável (ne) */
const numOf = s => { const m = String(s).replace(",", ".").match(/-?\d+(?:\.\d+)?/); return m ? parseFloat(m[0]) : null; };
const alnum = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
function evalCell(v, req) {
  const rv = (req == null ? "" : String(req)).trim(), vv = (v == null ? "" : String(v)).trim();
  if (!rv || !vv || vv === "—") return "ne";
  const op = rv.match(/(≥|>=|≤|<=|>|<|=)\s*(-?[\d.,]+)/);
  if (op) { const r = numOf(op[2]), n = numOf(vv); if (r == null || n == null) return "ne";
    const o = op[1], ok = (o === "=") ? n === r : (o === "≥" || o === ">=") ? n >= r : (o === "≤" || o === "<=") ? n <= r : (o === ">") ? n > r : n < r; return ok ? "ok" : "no"; }
  if (/^sim\b/i.test(rv)) return (/\b(n[aã]o|nao)\b/i.test(vv)) ? "no" : "ok";
  const ar = alnum(rv), av = alnum(vv); if (!ar) return "ne";
  return (av.includes(ar) || ar.includes(av)) ? "ok" : "no";
}
/* unidade de medida FIXA do requisito: só o valor é editável, a unidade é um sufixo que não muda */
const unitSep = u => (u === "°" || u === "%") ? "" : " ";
function splitUnit(value, unidade) {
  if (!unidade || value == null || value === "—") return value == null ? "" : String(value);
  const re = new RegExp("\\s*" + unidade.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*$");
  return String(value).replace(re, "").replace(/\s+$/, "");
}
function joinUnit(core, unidade) {
  core = String(core).trim();
  if (!unidade || core === "" || core === "—") return core || "—";
  return core + unitSep(unidade) + unidade;
}
const unitTag = unidade => unidade ? `<span class="unit-fixed" data-tip="Unidade de medida do requisito (fixa, não editável)">${esc(unitSep(unidade) + unidade)}</span>` : "";
/* operador da exigência (≥, ≤, >, <, =) também é FIXO, vem do edital: só o número é editável */
const OP_RE = /^\s*(≥|≤|>=|<=|>|<|=)\s*/;
const splitOp = value => { const m = String(value == null ? "" : value).match(OP_RE); return m ? { op: m[1], rest: String(value).slice(m[0].length) } : { op: "", rest: String(value == null ? "" : value) }; };
const opTag = op => op ? `<span class="op-fixed" data-tip="Operador da exigência (fixo, vem do edital)">${esc(op)} </span>` : "";
const rankFor = sc => [...sc].sort((a, b) => b.pct - a.pct || a.ne - b.ne || b.ok - a.ok);
const bestOf = (specs, skus) => rankFor(scoresFor(specs, skus))[0];
const prodSummary = comp => { const best = bestOf(matrixOf(comp), comp.skus); return { best, ok: best.diverg.length === 0 }; };
const isConcordant = spec => new Set(spec.cells.filter(c => c.st === "ok" || c.st === "no").map(c => c.st)).size <= 1;

/* ---------- checklist (serviço / software) ---------- */
function checklistSummary(cl) {
  const ev = cl.filter(r => ["ok", "no", "parcial"].includes(r.st));
  const ok = cl.filter(r => r.st === "ok").length, no = cl.filter(r => r.st === "no").length;
  return { ok, total: ev.length, no, status: no === 0 ? "ok" : "no", pct: ev.length ? Math.round(ok / ev.length * 100) : 0 };
}
const CL_ST = { ok: { cls: "ok", label: "Atende", ico: ICO_OK }, no: { cls: "bad", label: "Não atende", ico: ICO_NO }, parcial: { cls: "warn", label: "Atende parcialmente", ico: "" }, ne: { cls: "soft", label: "Não avaliado", ico: "" } };
const confBadge = c => c ? `<span class="badge ${c === "alta" ? "ok" : c === "media" ? "warn" : "bad"}" data-tip="Confiança da IA na extração">${cap(c === "media" ? "média" : c)}</span>` : `<span class="state-na">—</span>`;

/* ---------- resumo por item (adapta ao tipo) ---------- */
function itemSummary(i) {
  const it = ITEMS[i];
  const comps = it.componentes.map(comp => {
    if (comp.mecanica === "produto") { const ps = prodSummary(comp); return { mecanica: "produto", rotulo: comp.rotulo, ok: ps.ok, best: ps.best, comp }; }
    const s = checklistSummary(comp.lista); return { mecanica: "checklist", rotulo: comp.rotulo, ok: s.status === "ok", ok_n: s.ok, total: s.total, comp };
  });
  return { comps, multi: comps.length > 1, status: comps.every(c => c.ok) ? "ok" : "no" };
}
/* resumo compacto de uma seção (para o cabeçalho do accordion) */
function secSummary(cs) {
  const mono = m => `<span style="font-family:var(--mono)">${esc(m)}</span>`;
  if (cs.mecanica === "produto") {
    // a escolha substitui a recomendação
    const chosenIdx = prefs.chosen[active];
    if (chosenIdx != null && cs.comp.skus[chosenIdx]) {
      const s = cs.comp.skus[chosenIdx];
      return `<b>✓ Escolhido:</b> ${mono(s.model)} · ${esc(s.brand)}`;
    }
    return cs.ok
      ? `<b>Recomendado:</b> ${mono(cs.best.sku.model)} · atende ${cs.best.pct}%`
      : `Melhor produto atende ${cs.best.pct}% (${cs.best.ok}/${cs.best.evaluable})`;
  }
  return `Atende ${cs.ok_n} de ${cs.total} exigências`;
}

/* ---------- estado ---------- */
const LS = "settle-at-prefs-v7";
let prefs = (() => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } })();
const savePrefs = () => localStorage.setItem(LS, JSON.stringify(prefs));
prefs.chosen = prefs.chosen || {};
let statusFilter = prefs.filter || "all";
let active = null, SPECS = null, STATE, RANKED, ORDER, BEST, activeComp = null, MX_SKUS = [];
let currentChecklists = [];
/* "Atualizar informações": re-analisa o item e a IA tenta extrair os valores que faltam (linhas "Valor não extraído") */
function updateInfo() {
  if (!SPECS) { toast("Nada para atualizar neste item"); return; }
  let n = 0;
  SPECS.forEach(spec => {
    if (spec.naoExtraido && spec._valorEdital) {
      spec.exig = spec._valorEdital; spec.naoExtraido = false;
      if (spec._trecho) spec.origem = { doc: "Edital — Termo de Referência", pag: "—", trecho: spec._trecho };
      rematchRow(spec); n++;
    }
  });
  recompute(); renderMatrix();
  toast(n ? `Análise atualizada: ${n} valor(es) extraído(s) do edital automaticamente.` : "Análise atualizada: nenhum dado faltando.");
}
let colW = prefs.colW || {};
let frozen = new Set(prefs.frozen || ["req", "val"]);
const COLW = k => colW[k] || (k === "check" ? 44 : k === "req" ? 300 : k === "val" ? 160 : k === "acoes" ? 84 : 176);
const saveCols = () => { prefs.colW = colW; prefs.frozen = [...frozen]; savePrefs(); };
let renderPending = false;
const scheduleRender = () => { if (!renderPending) { renderPending = true; requestAnimationFrame(() => { renderPending = false; renderMatrix(); }); } };
function recompute() { STATE = scoresFor(SPECS, MX_SKUS); RANKED = rankFor(STATE); ORDER = RANKED.map(s => s.i); BEST = RANKED[0]; window.SCORES = STATE; }

/* valores do item (a partir do preço unitário) */
const fmtBRL = n => "R$ " + Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
ITEMS.forEach(it => { const q = parseFloat(it.quantidade) || 1; it.valorUnitario = it.precoUnit ? { v: fmtBRL(it.precoUnit) } : { v: "—" }; it.valorTotal = it.precoUnit ? { v: fmtBRL(it.precoUnit * q) } : { v: "—" }; });

/* ============================================================
   Resumo do edital (stats) + grid de cards
   ============================================================ */
function renderStats(ofType) {
  const total = ofType.length;
  const atend = ofType.filter(x => itemSummary(x.i).status === "ok").length;
  const nao = total - atend;
  const I = {
    target: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3"/><circle cx="8" cy="8" r="0.6" fill="currentColor"/></svg>`,
    layers: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M8 2l6 3-6 3-6-3 6-3z"/><path d="M2 8l6 3 6-3"/></svg>`,
    check: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg>`,
    cross: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>`,
  };
  // Resumo executivo a revisar: por enquanto valores zerados e rótulos "A definir"
  const cards = [
    { ico: "brand", svg: I.target, n: 0, label: "A definir" },
    { ico: "", svg: I.layers, n: 0, label: "A definir" },
    { ico: "ok", svg: I.check, n: 0, label: "A definir" },
    { ico: "bad", svg: I.cross, n: 0, label: "A definir" },
  ];
  $("#stats").innerHTML = cards.map(c => `<div class="stat" data-tip="${c.label}"><div class="stat-top"><div class="stat-ico ${c.ico}">${c.svg}</div><div class="stat-n">${c.n}</div></div><div class="stat-label">${c.label}</div></div>`).join("");
}
function renderGrid() {
  $("#crumbId").textContent = `Edital ${EDITAL.numero}`;
  const all = ITEMS.map((it, i) => ({ it, i }));
  renderStats(all);
  const html = all.map(({ it, i }) => {
    const sum = itemSummary(i);
    if (statusFilter !== "all" && sum.status !== statusFilter) return "";
    const chosenIdx = prefs.chosen[i];
    // badge de apoio (fictícia) só para entender o tipo do item durante a validação
    const TIPO_LBL = { produto: "Produto", servico: "Serviço", software: "Software" };
    const tipos = [...new Set(it.componentes.map(c => c.mecanica === "produto" ? "produto" : (/software|vms|licen/i.test(c.rotulo) ? "software" : "servico")))];
    const segLabel = tipos.length > 1 ? `Misto (${tipos.map(t => TIPO_LBL[t]).join(" + ")})` : TIPO_LBL[tipos[0]];
    const segTip = "Tipo do item (badge de apoio para entender o protótipo)" + (tipos.length > 1 ? ": " + tipos.map(t => TIPO_LBL[t]).join(" + ") : "");
    const segBadge = `<span class="badge seg" data-tip="${esc(segTip)}">${esc(segLabel)}</span>`;
    const statusBadge = sum.status === "ok"
      ? `<span class="badge ok" data-tip="Você consegue atender este item">Atende</span>`
      : `<span class="badge bad" data-tip="Há exigência(s) que você não atende">Não atende</span>`;
    const qtyTxt = it.quantidade === "1" ? "1 unidade" : `${esc(it.quantidade)} unidades`;
    // Opção C: card mostra status + o bloqueio em linguagem clara (ou o SKU recomendado quando atende)
    const prod = sum.comps.find(c => c.mecanica === "produto");
    let reco, recoCls = "";
    if (sum.status === "ok") {
      reco = prod
        ? `<b>Recomendado:</b> <span style="font-family:var(--mono)">${esc(prod.best.sku.model)}</span> · ${esc(prod.best.sku.brand)}`
        : `Atende todas as exigências do edital`;
    } else {
      // escalável: número agregado (atende X de Y), ancorado no melhor produto. O detalhe por produto/requisito fica na tabela. O selo "Não atende" já carrega o veredito, então a linha fica neutra.
      const fails = sum.comps.filter(c => !c.ok);
      if (!sum.multi && fails.length === 1) {
        const f = fails[0];
        reco = f.mecanica === "produto"
          ? `<b>Melhor produto:</b> <span style="font-family:var(--mono)">${esc(f.best.sku.model)}</span> · atende ${f.best.pct}% (${f.best.ok}/${f.best.evaluable})`
          : `Atende ${f.ok_n} de ${f.total} exigências`;
      } else {
        reco = `<b>Pendências:</b> ` + fails.map(f => {
          const at = f.mecanica === "produto" ? f.best.ok : f.ok_n;
          const tot = f.mecanica === "produto" ? f.best.evaluable : f.total;
          return `${esc(f.rotulo)} ${at}/${tot}`;
        }).join(" · ");
      }
    }
    // a escolha substitui a recomendação: se um SKU foi escolhido, a linha vira "Produto escolhido"
    const chosenSku = (prod && chosenIdx != null && prod.comp.skus[chosenIdx]) ? prod.comp.skus[chosenIdx] : null;
    if (chosenSku) {
      reco = `<b>✓ Produto escolhido:</b> <span style="font-family:var(--mono)">${esc(chosenSku.model)}</span> · ${esc(chosenSku.brand)}`;
      recoCls = " chosen";
    }
    return `<div class="item-card ${chosenIdx != null ? "selected" : ""}" data-item="${i}" data-tip="Abrir a análise completa deste item">
      <div class="ic-badges">${segBadge}${statusBadge}</div>
      <div class="ic-desc">${esc(it.nome)}</div>
      <div class="ic-metaline">
        <span><b>Quantidade:</b> ${qtyTxt}</span>
        <span><b>Valor unitário:</b> <span class="mono">${esc(it.valorUnitario.v)}</span></span>
        <span><b>Valor total:</b> <span class="mono">${esc(it.valorTotal.v)}</span></span>
        <span class="ic-reco-inline${recoCls}">${reco}</span>
      </div>
    </div>`;
  }).join("");
  $("#cardGrid").innerHTML = html || `<div style="grid-column:1/-1;color:var(--muted-foreground);padding:24px;text-align:center">Nenhum item neste filtro.</div>`;
  [...$("#filterTabs").children].forEach(b => b.classList.toggle("active", b.dataset.filter === statusFilter));
}

/* ============================================================
   Overlay — despacha por mecânica
   ============================================================ */
function openTable(i) {
  active = i; const it = ITEMS[i];
  currentChecklists = []; SPECS = null; BEST = null; activeComp = null; MX_SKUS = [];
  closeEditDrawer();
  $("#toTitle").textContent = it.titulo || it.nome;
  const sum = itemSummary(i), multi = it.componentes.length > 1;

  // componente produto é processado antes (collapsiblesHTML usa SPECS)
  const prodComp = it.componentes.find(comp => comp.mecanica === "produto");
  if (prodComp) { activeComp = prodComp; MX_SKUS = prodComp.skus; SPECS = matrixOf(prodComp); recompute(); }

  let body = collapsiblesHTML(it), secs = "";
  it.componentes.forEach((comp, ci) => {
    let hostHTML;
    if (comp.mecanica === "produto") { hostHTML = `<div class="mech-host" id="matrixHost"></div>`; }
    else { const idx = currentChecklists.length; currentChecklists.push(comp.lista); hostHTML = `<div class="mech-host" id="clHost-${idx}"></div>`; }
    // toda seção é um accordion colapsável (inclusive itens de uma seção só), aberto por padrão
    const cs = sum.comps[ci];
    secs += `<details class="comp-acc" open><summary class="comp-head"><span class="comp-dot ${cs.ok ? "ok" : "no"}">${cs.ok ? ICO_OK : ICO_NO}</span><span class="comp-rotulo">${esc(comp.rotulo)}</span><span class="comp-sum">${secSummary(cs)}</span>${CARET}</summary><div class="comp-acc-body">${hostHTML}</div></details>`;
  });
  body += `<div class="to-sections">${secs}</div>`;

  $("#toBody").innerHTML = body;
  if ($("#matrixHost")) renderMatrix();
  currentChecklists.forEach((c, idx) => renderChecklist($("#clHost-" + idx), c, idx));
  renderNav(); renderItemSummary(); renderEditControls();
  $("#tableOverlay").hidden = false;
}
const closeTable = () => { $("#tableOverlay").hidden = true; active = null; renderGrid(); };
/* itens visíveis segundo o filtro ativo (para a navegação Anterior/Próximo) */
function visibleItemsIdx() { return ITEMS.map((_, i) => i).filter(i => statusFilter === "all" || itemSummary(i).status === statusFilter); }
function renderNav() {
  const nav = $("#toNav"); if (!nav) return;
  const list = visibleItemsIdx(), pos = list.indexOf(active);
  if (pos === -1 || list.length <= 1) { nav.innerHTML = ""; return; }
  const hasPrev = pos > 0, hasNext = pos < list.length - 1;
  nav.innerHTML = `<button class="to-navbtn" data-nav="prev"${hasPrev ? "" : " disabled"} data-tip="Item anterior">${ICO_CHEV_L}</button>
    <span class="to-navcount">Item ${pos + 1} de ${list.length}</span>
    <button class="to-navbtn" data-nav="next"${hasNext ? "" : " disabled"} data-tip="Próximo item">${ICO_CHEV_R}</button>`;
}
function renderItemSummary() {
  const el = $("#toSummary"); if (!el || active == null) return;
  const it = ITEMS[active];
  el.innerHTML = `<div class="ts-metas">
      <span><b>Quantidade:</b> ${esc(it.quantidade)}</span>
      <span><b>Unidade de medida:</b> ${esc(it.unidadeMedida || "unidade")}</span>
      <span><b>Valor unitário:</b> <span class="mono">${esc(it.valorUnitario.v)}</span></span>
      <span><b>Valor total:</b> <span class="mono">${esc(it.valorTotal.v)}</span></span>
    </div>`;
}
/* atualiza ao vivo o resumo da seção de produto (accordion) quando o SKU escolhido muda */
function updateProdSecSummary() {
  const details = [...document.querySelectorAll(".comp-acc")].find(d => d.querySelector("#matrixHost"));
  if (!details) return;
  const cs = itemSummary(active).comps.find(c => c.mecanica === "produto");
  const el = details.querySelector(".comp-sum");
  if (cs && el) el.innerHTML = secSummary(cs);
}

/* ---------- Mecânica: matriz (produto) ---------- */
function buildCols(order) {
  const cols = [{ key: "check" }, { key: "req" }, { key: "val" }, ...order.map(i => ({ key: "sku-" + i, skuIdx: i })), { key: "acoes" }];
  let fl = 0;
  cols.forEach(c => { c.w = COLW(c.key); c.frozen = c.key === "check" || frozen.has(c.key); });
  cols.forEach(c => { if (c.frozen) { c.left = fl; fl += c.w; } });
  const frz = cols.filter(c => c.frozen); if (frz.length) frz[frz.length - 1].edge = true;
  return cols;
}
const fzCls = c => c.frozen ? ` frozen${c.edge ? " frozen-edge" : ""}` : "";
const fzStyle = c => c.frozen ? ` style="left:${c.left}px"` : "";
const colCtrls = c => `<button class="col-pin ${c.frozen ? "on" : ""}" data-pin="${c.key}" data-tip="${c.frozen ? "Descongelar coluna" : "Congelar coluna (fixa ao rolar)"}">${PIN_SVG}</button><span class="col-resize" data-resize="${c.key}" data-tip="Arraste para redimensionar a largura"></span>`;
function cellTd(cell, ri, ci, exigNa, c, unidade) {
  if (exigNa) return `<td class="cell na-cell${fzCls(c)}"${fzStyle(c)}><span class="cell-val">${esc(cell.v)}</span></td>`;
  const icoInner = cell.st === "ok" ? ICO_OK : cell.st === "no" ? ICO_NO : "";
  const conf = (cell.st !== "ne" && cell.c) ? `<div class="conf ${cell.c}" data-tip="Confiança da IA na extração deste valor"><span class="dot"></span>${cap(cell.c)} confiança</div>` : "";
  return `<td class="cell ${cell.st}${fzCls(c)}"${fzStyle(c)}><div class="cell-line"><span class="cell-ico ${cell.st}" data-tip="Atendimento calculado pelo sistema (valor do produto × exigência do edital)">${icoInner}</span><span class="cell-val" data-tip="Valor do produto (vem do seu catálogo, somente leitura). Só a exigência do edital é editável.">${esc(splitUnit(cell.v, unidade))}</span>${unitTag(unidade)}</div>${conf}</td>`;
}
/* edição = ação consciente numa BARRA LATERAL (Editar → inputs no sidebar → Salvar reprocessa). Tabela é sempre leitura. */
let editSnapshot = null;
function renderEditControls() {
  const el = $("#toEditCtrls"); if (!el) return;
  el.innerHTML = $("#matrixHost")
    ? `<button class="to-editbtn" id="btnEnterEdit" data-tip="Editar as exigências do edital numa barra lateral. A análise é reprocessada ao salvar.">${ICO_PENCIL} Editar</button>`
    : "";
}
function openEditDrawer() { if (!SPECS) return; editSnapshot = clone(SPECS); renderEditDrawer(); $("#editOverlay").hidden = false; $("#editDrawer").hidden = false; }
function closeEditDrawer() { $("#editDrawer").hidden = true; $("#editOverlay").hidden = true; editSnapshot = null; }
function cancelEditDrawer() { if (editSnapshot) { SPECS = editSnapshot; recompute(); renderMatrix(); } closeEditDrawer(); }
function renderEditDrawer() {
  const fields = SPECS.map((spec, ri) => {
    if (spec.exigNa) return "";
    const nx = !!spec.naoExtraido;
    const op = nx ? "" : splitOp(spec.exig).op;
    const core = nx ? "" : esc(splitUnit(splitOp(spec.exig).rest, spec.unidade));
    const unit = spec.unidade ? esc(unitSep(spec.unidade) + spec.unidade) : "";
    return `<div class="ed-field${nx ? " missing" : ""}">
      <label>${esc(spec.req)}${nx ? ` <span class="ed-tag">não extraído</span>` : ""}</label>
      <div class="ed-input-wrap">${op ? `<span class="ed-op">${esc(op)}</span>` : ""}<input class="ed-input" data-eri="${ri}" value="${core}" placeholder="${nx ? "Informe o valor exigido pelo edital" : ""}">${unit ? `<span class="ed-unit">${unit}</span>` : ""}</div>
    </div>`;
  }).join("");
  let ref = "";
  if (activeComp) {
    const naoEx = [...matrixOf(activeComp).filter(s => s.exigNa).map(s => s.req), ...(activeComp.catalogoNaoEdital || [])];
    if (naoEx.length) ref = `<div class="ed-ref"><div class="ed-ref-title">Especificações do seu produto não exigidas pelo edital</div><div class="tag-list">${naoEx.map(t => `<span class="tag-item">${esc(t)}</span>`).join("")}</div></div>`;
  }
  $("#editBody").innerHTML = `<p class="ed-hint">Corrija ou complete as exigências do edital. O operador e a unidade são fixos (vêm do edital). Ao salvar, a análise é reprocessada.</p>${fields}<button class="ed-add" id="editAddReq">${ICO_PLUS} Adicionar requisito</button>${ref}`;
}
function saveEditDrawer() {
  $("#editBody").querySelectorAll(".ed-input[data-eri]").forEach(inp => {
    const ri = +inp.dataset.eri, spec = SPECS[ri]; if (!spec || spec.exigNa) return;
    const val = inp.value.trim(), wasMissing = spec.naoExtraido;
    if (!val) { if (!wasMissing) spec.exig = ""; return; }
    const op = wasMissing ? "" : splitOp(spec.exig).op;
    spec.exig = op ? op + " " + joinUnit(val, spec.unidade) : joinUnit(val, spec.unidade);
    if (wasMissing) spec.naoExtraido = false;
  });
  SPECS.forEach(spec => { if (!spec.exigNa && !spec.naoExtraido && spec.exig) rematchRow(spec); });
  recompute(); renderMatrix(); renderItemSummary(); closeEditDrawer();
  toast("Análise reprocessada com as novas informações");
}
function renderMatrix() {
  const host = $("#matrixHost"); if (!host) return;
  const chosenIdx = prefs.chosen[active];
  // ocultar quem não atende: esconde SKUs que não atendem 100% dos requisitos
  const pctOf = i => (STATE.find(s => s.i === i) || {}).pct || 0;
  const hideNoMatch = !!prefs.hideNoMatch;
  const fullOrder = ORDER, matchOrder = ORDER.filter(i => pctOf(i) === 100);
  const shownOrder = (hideNoMatch && matchOrder.length) ? matchOrder : ORDER;
  const hiddenCount = fullOrder.length - shownOrder.length;
  const cols = buildCols(shownOrder), totalW = cols.reduce((s, c) => s + c.w, 0);
  const colgroup = `<colgroup>${cols.map(c => `<col data-k="${c.key}" style="width:${c.w}px">`).join("")}</colgroup>`;
  let head = "";
  cols.forEach(c => {
    if (c.key === "check") head += `<th class="col-check${fzCls(c)}"${fzStyle(c)}><span class="cbox" data-tip="Selecionar requisitos (para ações em lote, em breve)"></span></th>`;
    else if (c.key === "req") head += `<th class="col-req${fzCls(c)}"${fzStyle(c)}>Especificações do edital${colCtrls(c)}</th>`;
    else if (c.key === "val") head += `<th class="col-val${fzCls(c)}"${fzStyle(c)} data-tip="Valor que o edital exige para o requisito">Valor requerido${colCtrls(c)}</th>`;
    else if (c.key === "acoes") head += `<th class="col-acoes">Ações</th>`;
    else {
      const idx = c.skuIdx, sc = STATE[idx], rank = ORDER.indexOf(idx), best = rank === 0, isChosen = chosenIdx === idx, hasChoice = chosenIdx != null;
      const sku = sc.sku;
      const estoqueBadge = sku.estoque
        ? `<span class="sku-tag ok" data-tip="Disponível no estoque">Em estoque</span>`
        : `<span class="sku-tag warn" data-tip="Sem estoque: precisaria comprar/terceirizar">Sem estoque</span>`;
      const FONTE_LBL = { catalogo: "Catálogo", internet: "Internet" };
      const fonteLbl = FONTE_LBL[sku.origem] || cap(sku.origem || "—");
      const origemBadge = `<span class="sku-tag src" data-tip="Fonte de onde veio este dado do produto">Fonte: ${esc(fonteLbl)}</span>`;
      const precoLine = sku.preco != null ? `<div class="sku-preco" data-tip="Preço do SKU">${esc(fmtBRL(sku.preco))}</div>` : "";
      head += `<th class="col-sku${(best && !hasChoice) ? " best" : ""}${isChosen ? " chosen" : ""}${fzCls(c)}"${fzStyle(c)}>
        ${isChosen ? `<div class="chosen-tag" data-tip="Produto escolhido para a proposta">✓ Escolhido</div>` : (best && !hasChoice) ? `<div class="best-tag" data-tip="Produto com maior aderência">★ Recomendado</div>` : `<div class="sku-rank">${rank + 1}º</div>`}
        <div class="sku-model">${esc(sku.model)}</div><div class="sku-brand" data-tip="Fabricante (info do SKU, não é requisito)">${esc(sku.brand)}</div>
        ${precoLine}
        <div class="sku-tags">${estoqueBadge}${origemBadge}</div>
        <div class="sku-scoreline" data-tip="Requisitos atendidos e percentual de aderência"><span class="score-frac">${sc.ok}/${sc.evaluable}${sc.ne ? ` · ${sc.ne} n/e` : ""}</span><span class="score-pct">${sc.pct}%</span></div>
        <div class="score-bar"><span class="score-fill" style="width:${sc.pct}%"></span></div>
        <button class="sku-select${isChosen ? " on" : ""}" data-choose="${idx}" data-tip="${isChosen ? "Remover seleção" : "Definir como produto escolhido para a proposta"}">${isChosen ? "✓ Selecionado" : "Selecionar"}</button>${colCtrls(c)}</th>`;
    }
  });
  let body = "";
  SPECS.forEach((spec, ri) => {
    if (spec.exigNa) return;
    const nx = !!spec.naoExtraido;
    if (nx) return; // "valor não extraído" não aparece na tabela; é completado na barra de edição
    let row = `<tr class="${isConcordant(spec) ? "concordant" : ""}">`;
    cols.forEach(c => {
      if (c.key === "check") row += `<td class="col-check${fzCls(c)}"${fzStyle(c)}><span class="cbox" data-tip="Selecionar requisito (para ações em lote, em breve)"></span></td>`;
      else if (c.key === "req") row += `<td class="col-req${fzCls(c)}"${fzStyle(c)}><span class="req-name" data-tip="Requisito exigido pelo edital">${esc(spec.req)}</span></td>`;
      else if (c.key === "val") {
        const vrCore = esc(splitUnit(splitOp(spec.exig).rest, spec.unidade)), vrOp = opTag(splitOp(spec.exig).op), vrUnit = unitTag(spec.unidade);
        const originBtn = `<button class="req-ico val-ico" data-origin="${ri}" data-tip="Ver de onde a IA extraiu no edital (página e trecho)">${ICO_ARROW}</button>`;
        const valInner = `<span class="val-text">${vrOp}<span class="val-plain">${vrCore}</span>${vrUnit}</span>`;
        row += `<td class="col-val${fzCls(c)}"${fzStyle(c)}><div class="val-head">${valInner}${originBtn}</div></td>`;
      }
      else if (c.key === "acoes") row += `<td class="col-acoes"><div class="acoes-cell"><button class="act-ico danger" data-delreq="${ri}" data-tip="Excluir este requisito">${ICO_TRASH}</button></div></td>`;
      else if (nx) row += `<td class="cell nm-cell${fzCls(c)}"${fzStyle(c)}><div class="cell-line"><span class="ico-nm" data-tip="Valor do produto disponível, mas ainda sem correspondência: não conseguimos extrair a exigência do edital">${ICO_ALERT}</span><span class="cell-val">${esc(splitUnit(spec.cells[c.skuIdx].v, spec.unidade))}</span>${unitTag(spec.unidade)}</div></td>`;
      else row += cellTd(spec.cells[c.skuIdx], ri, c.skuIdx, spec.exigNa, c, spec.unidade);
    });
    body += row + `</tr>`;
  });
  const noneNote = (hideNoMatch && !matchOrder.length) ? `<span class="mx-note">Nenhum produto atende 100% — mostrando todos.</span>` : "";
  const toolbar = `<div class="mx-toolbar"><button class="mx-toggle${hideNoMatch ? " on" : ""}" data-hidenomatch data-tip="Esconde os produtos que não atendem 100% dos requisitos, para focar na análise"><span class="mx-switch"></span>Ocultar quem não atende${hideNoMatch && hiddenCount ? ` · ${hiddenCount} oculto${hiddenCount > 1 ? "s" : ""}` : ""}</button>${noneNote}</div>`;
  host.innerHTML = `${toolbar}<div class="table-wrap"><table class="cmp" style="width:${totalW}px">${colgroup}<thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

/* ---------- Seções colapsáveis (topo do overlay) ---------- */
const CARET = `<svg class="caret-svg" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10l4-4 4 4"/></svg>`;
function collapsible(title, inner, count, open) {
  return `<details class="cps"${open ? " open" : ""}><summary><span class="cps-title">${title}</span>${count != null ? `<span class="cps-cnt">${count}</span>` : ""}${CARET}</summary><div class="cps-body">${inner}</div></details>`;
}
function tagList(items, note) {
  return `${note ? `<div class="ex-note">${note}</div>` : ""}<div class="tag-list">${items.map(t => `<span class="tag-item">${esc(t)}</span>`).join("")}</div>`;
}
function collapsiblesHTML(it) {
  // só a Descrição no corpo; as "não exigidas" vivem na barra de edição (referência)
  const html = collapsible("Descrição completa", `<p class="cps-desc">${esc(it.nome)}</p><p class="cps-desc">${esc(it.resumoTR)}</p>`, null, true);
  return `<div class="to-collapsibles">${html}</div>`;
}

/* ---------- Mecânica: checklist (serviço / software) ---------- */
function renderChecklist(host, clArr, sec) {
  if (!host) return;
  const rows = clArr.map((r, ri) => {
    const st = CL_ST[r.st] || CL_ST.ne;
    return `<tr>
      <td class="col-check"><span class="cbox" data-tip="Selecionar requisito (para ações em lote, em breve)"></span></td>
      <td class="col-req"><span class="req-name">${esc(r.req)}</span></td>
      <td class="col-val"><div class="val-head"><span class="val-text">${esc(r.exig || "—")}</span><button class="req-ico val-ico" data-clorigin="${sec}:${ri}" data-tip="Ver de onde a IA extraiu no edital (página e trecho)">${ICO_ARROW}</button></div></td>
      <td class="col-meta"><span class="badge soft">${esc(r.modulo || "—")}</span></td>
      <td class="col-meta"><button class="badge ${st.cls} clickable-badge" data-clstatus="${sec}:${ri}" data-tip="Clique para escolher o status">${st.ico}${st.label}<span class="cl-caret">▾</span></button></td>
      <td class="col-meta">${confBadge(r.c)}</td>
      <td class="col-meta c-just">${esc(r.just || "—")}</td>
      <td class="col-meta"><span class="badge soft with-avatar">Selecionar</span></td>
    </tr>`;
  }).join("");
  host.innerHTML = `<div class="dt-wrap"><table class="dt"><thead><tr><th class="col-check"><span class="cbox" data-tip="Selecionar requisitos (para ações em lote, em breve)"></span></th><th class="col-req">Requisito</th><th class="col-val">Valor requerido</th><th class="col-meta">Módulo</th><th class="col-meta">Status</th><th class="col-meta">Confiança IA</th><th class="col-meta c-just">Justificativa IA</th><th class="col-meta">Responsável</th></tr></thead><tbody>${rows}</tbody></table><div class="dt-foot" data-addcl="${sec}">${ICO_PLUS} Adicionar requisito</div></div>`;
}

/* ============================================================
   Origem (genérico)
   ============================================================ */
let extractRi = null, pendingExtract = null;
const FILE_SVG = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 2h6l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M10 2v3h3"/></svg>`;
function openOriginSpec(spec, ri) {
  extractRi = null; pendingExtract = null;
  $("#drawerHead").textContent = "Visualização do arquivo";
  $("#drawerBody").innerHTML = `<div class="file-preview-empty">${FILE_SVG}<span>Visualização do arquivo</span></div>`;
  $("#drawer").hidden = false; $("#tableOverlay").classList.add("sidebar-open");
}
const closeOrigin = () => { $("#drawer").hidden = true; $("#tableOverlay").classList.remove("sidebar-open"); extractRi = null; pendingExtract = null; };

let toastT;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2400); }

/* ============================================================
   Edição inline + interações
   ============================================================ */
const rematchRow = spec => { if (spec.exigNa) return; spec.cells.forEach(cc => cc.st = evalCell(cc.v, spec.exig)); };
function commitEdit(el) {
  const ri = +el.dataset.ri, kind = el.dataset.edit, txt = el.textContent.trim(), spec = SPECS[ri];
  // edição só acontece no modo de edição; guarda o valor e reprocessa só no Salvar (sem auto-recálculo)
  if (kind === "vr") {
    if (spec.exigNa) return;
    const wasMissing = spec.naoExtraido;
    if (!txt || txt === "Valor não extraído") { if (!wasMissing) spec.exig = ""; return; }
    const op = wasMissing ? "" : splitOp(spec.exig).op; // operador fixo, preservado do edital
    spec.exig = op ? op + " " + joinUnit(txt, spec.unidade) : joinUnit(txt, spec.unidade);
    if (wasMissing) spec.naoExtraido = false;
  }
}
/* ---------- Adicionar requisito do edital (a partir do catálogo) ---------- */
let addSpec = null, addTrecho = null;
function openAddModal() {
  addSpec = null; addTrecho = null;
  $("#amSearch").value = ""; renderCatalog("");
  $("#amStep2").hidden = true; $("#amStep3").hidden = true; $("#amSel").hidden = true; $("#amAdd").disabled = true;
  $("#amDoc").textContent = EDITAL.docTexto;
  $("#amDocHint").textContent = "Selecione no edital o trecho que comprova a exigência.";
  $("#addModal").hidden = false;
}
function catalogAvailable() { const existing = new Set(SPECS.map(s => s.req.toLowerCase())); return CATALOGO_SPECS.filter(s => !existing.has(s.nome.toLowerCase())); }
function renderCatalog(term) {
  const t = term.trim().toLowerCase(), list = catalogAvailable().filter(s => !t || s.nome.toLowerCase().includes(t));
  $("#amCatalog").innerHTML = list.map(s => `<button class="am-cat-item${addSpec && addSpec.nome === s.nome ? " sel" : ""}" data-cat="${esc(s.nome)}"><span>${esc(s.nome)}</span><span class="am-cat-tag">${s.unidade ? esc(s.unidade) : (s.dominio === "lista" ? "lista" : s.dominio === "booleano" ? "sim/não" : "número")}</span></button>`).join("") || `<div class="am-empty">Nenhuma especificação do catálogo corresponde.</div>`;
  $("#amNotfound").hidden = !(t && list.length === 0);
  $("#amTerm").textContent = term.trim();
}
function pickSpec(nome) {
  addSpec = catalogAvailable().find(s => s.nome === nome); if (!addSpec) return;
  renderCatalog($("#amSearch").value);
  $("#amStep2").hidden = false; $("#amStep3").hidden = false;
  renderAddValue(); updateAddEnabled();
}
function renderAddValue() {
  const s = addSpec; let inp;
  if (s.dominio === "lista") inp = `<select id="amValInput" class="am-input">${s.opcoes.map(o => `<option${o === s.valorEdital ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
  else if (s.dominio === "booleano") inp = `<select id="amValInput" class="am-input"><option${s.valorEdital === "Sim" ? " selected" : ""}>Sim</option><option${s.valorEdital === "Não" ? " selected" : ""}>Não</option></select>`;
  else inp = `<div class="am-num"><span class="am-op">${esc(s.operador || "")}</span><input id="amValInput" class="am-input am-num-input" value="${esc(s.valorEdital)}"><span class="am-unit-fixed">${s.unidade ? esc(unitSep(s.unidade) + s.unidade) : ""}</span></div>`;
  $("#amValue").innerHTML = `<div class="am-hint">A IA sugere o valor a partir do trecho selecionado. Confirme ou ajuste (operador e unidade são fixos, vêm do catálogo).</div>${inp}`;
}
function updateAddEnabled() { $("#amAdd").disabled = !(addSpec && addTrecho); }
function confirmAddReq() {
  if (!addSpec || !addTrecho) return;
  const s = addSpec, vi = $("#amValInput"), raw = String(vi.value != null ? vi.value : vi.textContent).trim();
  const exigFull = s.dominio === "numero" ? ((s.operador ? s.operador + " " : "") + joinUnit(raw, s.unidade)) : raw;
  const cells = s.valsPorSku.map(v => ({ st: evalCell(v, exigFull), v, c: "alta" }));
  SPECS.push({ req: s.nome, exig: exigFull, unidade: s.unidade, added: true, origem: { doc: "Edital — Termo de Referência", pag: "—", trecho: addTrecho }, cells });
  recompute(); renderMatrix();
  if (!$("#editDrawer").hidden) renderEditDrawer(); // reflete o novo requisito na barra de edição
  $("#addModal").hidden = true;
  toast(`Requisito adicionado do catálogo: "${s.nome}"`);
}
function requestCatalog() { $("#addModal").hidden = true; toast(`Pedido enviado ao time de catálogo: "${$("#amSearch").value.trim()}"`); }

/* ---------- Alerta de edição direta na célula (1ª vez) ---------- */
let pendingWarnEl = null;
function focusEditable(el) { el.focus(); try { const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch (_) { } }
function openInlineWarn(el) { pendingWarnEl = el; $("#warnModal").hidden = false; }
/* dropdown de status do checklist: escolhe direto em vez de ciclar */
const CL_OPTS = ["ok", "no", "parcial", "ne"];
let statusMenuTarget = null;
function openStatusMenu(anchor, sec, ri) {
  const menu = $("#statusMenu"); if (!menu) return;
  statusMenuTarget = { sec, ri };
  const cur = currentChecklists[sec][ri].st;
  menu.innerHTML = CL_OPTS.map(k => { const o = CL_ST[k]; return `<button class="sm-item${k === cur ? " sel" : ""}" data-stval="${k}"><span class="badge ${o.cls}">${o.ico}${o.label}</span>${k === cur ? `<span class="sm-check">✓</span>` : ""}</button>`; }).join("");
  menu.hidden = false;
  const r = anchor.getBoundingClientRect(), mw = menu.offsetWidth, mh = menu.offsetHeight;
  let top = r.bottom + 6; if (top + mh > innerHeight - 8) top = Math.max(8, r.top - mh - 6);
  menu.style.top = top + "px"; menu.style.left = Math.max(8, Math.min(r.left, innerWidth - mw - 8)) + "px";
}
function closeStatusMenu() { const m = $("#statusMenu"); if (m) m.hidden = true; statusMenuTarget = null; }
function addClReq(sec) { currentChecklists[sec].push({ req: "Novo requisito", exig: "", modulo: "—", st: "ne", c: null, just: "—", origem: { doc: "Inserido manualmente", pag: "—" } }); renderChecklist($("#clHost-" + sec), currentChecklists[sec], sec); }

/* ============================================================
   Wire
   ============================================================ */
function wire() {
  $("#filterTabs").addEventListener("click", e => { const b = e.target.closest("[data-filter]"); if (b) { statusFilter = b.dataset.filter; prefs.filter = statusFilter; savePrefs(); renderGrid(); } });
  $("#cardGrid").addEventListener("click", e => { const c = e.target.closest("[data-item]"); if (c) openTable(+c.dataset.item); });

  $("#toClose").onclick = closeTable;
  $("#toNav").addEventListener("click", e => {
    const b = e.target.closest("[data-nav]"); if (!b || b.disabled) return;
    const list = visibleItemsIdx(), pos = list.indexOf(active);
    const target = b.dataset.nav === "prev" ? list[pos - 1] : list[pos + 1];
    if (target != null) openTable(target);
  });
  $("#toEditCtrls").addEventListener("click", e => { if (e.target.closest("#btnEnterEdit")) openEditDrawer(); });
  $("#editClose").onclick = cancelEditDrawer;
  $("#editCancel").onclick = cancelEditDrawer;
  $("#editOverlay").onclick = cancelEditDrawer;
  $("#editSave").onclick = saveEditDrawer;
  $("#editBody").addEventListener("click", e => { if (e.target.closest("#editAddReq")) openAddModal(); });
  $("#toExport").onclick = () => toast("Exportando análise (PDF · planilha · resumo técnico)…");
  $("#toShare").onclick = () => toast("Link da análise copiado — compartilhe para validação (engenharia, fornecedor, gestor)");

  const tb = $("#toBody");
  tb.addEventListener("pointerdown", e => {
    const rz = e.target.closest("[data-resize]"); if (!rz) return;
    e.preventDefault(); rz.classList.add("active");
    const key = rz.dataset.resize, startX = e.clientX, startW = COLW(key);
    const move = ev => { colW[key] = Math.max(90, Math.round(startW + (ev.clientX - startX))); scheduleRender(); };
    const up = () => { saveCols(); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); renderMatrix(); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  });
  tb.addEventListener("click", e => {
    const pin = e.target.closest("[data-pin]"); if (pin) { const k = pin.dataset.pin; frozen.has(k) ? frozen.delete(k) : frozen.add(k); saveCols(); renderMatrix(); return; }
    const hnm = e.target.closest("[data-hidenomatch]"); if (hnm) { prefs.hideNoMatch = !prefs.hideNoMatch; savePrefs(); renderMatrix(); return; }
    const ch = e.target.closest("[data-choose]"); if (ch) { const i = +ch.dataset.choose; prefs.chosen[active] = (prefs.chosen[active] === i) ? undefined : i; if (prefs.chosen[active] == null) delete prefs.chosen[active]; savePrefs(); renderMatrix(); updateProdSecSummary(); toast(prefs.chosen[active] != null ? `Produto escolhido: ${MX_SKUS[i].model}` : "Seleção removida"); return; }
    const or = e.target.closest("[data-origin]"); if (or) { const ri = +or.dataset.origin; openOriginSpec(SPECS[ri], ri); return; }
    const dl = e.target.closest("[data-delreq]"); if (dl) { const ri = +dl.dataset.delreq; const nm = SPECS[ri].req; SPECS.splice(ri, 1); recompute(); renderMatrix(); toast(`Requisito removido: "${nm}"`); return; }
    const q = e.target.closest("[data-question]"); if (q) { toast(`Abrindo questionamento/impugnação — "${SPECS[+q.dataset.question].req}" (referente ao edital)`); return; }
    if (e.target.closest("#addReq")) { openAddModal(); return; }
    const cs = e.target.closest("[data-clstatus]"); if (cs) { const [s, r] = cs.dataset.clstatus.split(":").map(Number); openStatusMenu(cs, s, r); return; }
    const co = e.target.closest("[data-clorigin]"); if (co) { const [s, r] = co.dataset.clorigin.split(":").map(Number); openOriginSpec(currentChecklists[s][r]); return; }
    const cq = e.target.closest("[data-clquestion]"); if (cq) { const [s, r] = cq.dataset.clquestion.split(":").map(Number); toast(`Abrindo questionamento/impugnação — "${currentChecklists[s][r].req}" (referente ao edital)`); return; }
    const ac = e.target.closest("[data-addcl]"); if (ac) { addClReq(+ac.dataset.addcl); return; }
  });
  tb.addEventListener("focusout", e => { const el = e.target.closest("[data-edit]"); if (el) commitEdit(el); });
  tb.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.closest("[data-edit]")) { e.preventDefault(); e.target.blur(); } });

  $("#drawerClose").onclick = closeOrigin; $("#drawerOverlay").onclick = closeOrigin;
  $("#drawerBody").addEventListener("mouseup", () => {
    if (extractRi == null) return;
    const doc = $("#extractDoc"), acts = $("#extractActions"); if (!doc || !acts) return;
    const sel = window.getSelection(), txt = sel.toString().trim();
    if (!txt || !doc.contains(sel.anchorNode)) { acts.hidden = true; pendingExtract = null; return; }
    pendingExtract = txt; $("#extractSel").textContent = `“${txt}”`; acts.hidden = false;
  });
  $("#drawerBody").addEventListener("click", e => {
    if (!e.target.closest("#extractConfirm") || extractRi == null || !pendingExtract) return;
    const ri = extractRi, val = pendingExtract, nm = SPECS[ri].req;
    SPECS[ri].naoExtraido = false; SPECS[ri].exig = val;
    SPECS[ri].origem = { doc: EDITAL.docNome || "Edital — Termo de Referência", pag: "—", trecho: val };
    recompute(); renderMatrix(); closeOrigin();
    toast(`Valor extraído para "${nm}" — produtos liberados para comparação`);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { if (!$("#statusMenu").hidden) closeStatusMenu(); else if (!$("#drawer").hidden) closeOrigin(); else if (!$("#tableOverlay").hidden) closeTable(); } });
  // dropdown de status do checklist
  $("#statusMenu").addEventListener("click", e => {
    const b = e.target.closest("[data-stval]"); if (!b || !statusMenuTarget) return;
    const { sec, ri } = statusMenuTarget;
    currentChecklists[sec][ri].st = b.dataset.stval;
    renderChecklist($("#clHost-" + sec), currentChecklists[sec], sec);
    closeStatusMenu();
  });
  document.addEventListener("click", e => {
    if ($("#statusMenu").hidden) return;
    if (e.target.closest("#statusMenu") || e.target.closest("[data-clstatus]")) return;
    closeStatusMenu();
  });
}


/* ---------- Adicionar requisito: wiring do modal ---------- */
function initAddModal() {
  const close = () => { $("#addModal").hidden = true; };
  $("#amClose").onclick = close; $("#amCancel").onclick = close; $("#addOverlay").onclick = close;
  $("#amSearch").addEventListener("input", e => { addSpec = null; $("#amStep2").hidden = true; $("#amStep3").hidden = true; renderCatalog(e.target.value); updateAddEnabled(); });
  $("#amCatalog").addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (b) pickSpec(b.dataset.cat); });
  $("#amRequest").onclick = requestCatalog;
  $("#amAdd").onclick = confirmAddReq;
  $("#amValue").addEventListener("input", updateAddEnabled);
  $("#amDoc").addEventListener("mouseup", () => {
    const sel = window.getSelection(), txt = sel.toString().trim();
    if (!txt || !$("#amDoc").contains(sel.anchorNode)) return;
    addTrecho = txt; $("#amSelText").textContent = txt; $("#amSel").hidden = false; updateAddEnabled();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#addModal").hidden) close(); });
  // alerta de edição direta na célula
  const closeWarn = () => { $("#warnModal").hidden = true; pendingWarnEl = null; };
  $("#warnCancel").onclick = closeWarn; $("#warnOverlay").onclick = closeWarn;
  $("#warnOk").onclick = () => { prefs.warnedInline = true; savePrefs(); $("#warnModal").hidden = true; const el = pendingWarnEl; pendingWarnEl = null; if (el) focusEditable(el); };
}

/* ---------- tooltip próprio ---------- */
function initTooltip() {
  const tip = document.createElement("div"); tip.className = "tt"; document.body.appendChild(tip);
  let cur = null;
  const place = el => { const r = el.getBoundingClientRect(); let top = r.top - tip.offsetHeight - 8; if (top < 6) top = r.bottom + 8; let left = r.left + r.width / 2 - tip.offsetWidth / 2; left = Math.max(6, Math.min(left, innerWidth - tip.offsetWidth - 6)); tip.style.top = top + "px"; tip.style.left = left + "px"; };
  const hide = () => { tip.classList.remove("show"); cur = null; };
  document.addEventListener("mouseover", e => {
    const el = e.target.closest("[data-tip],[title]"); if (!el || el === cur) return;
    if (el.hasAttribute("title")) { const t = el.getAttribute("title"); if (t) el.setAttribute("data-tip", t); el.removeAttribute("title"); }
    const txt = el.getAttribute("data-tip"); if (!txt) return;
    cur = el; tip.textContent = txt; tip.classList.add("show"); place(el);
  });
  document.addEventListener("mouseout", e => { if (cur && (!e.relatedTarget || !cur.contains(e.relatedTarget))) hide(); });
  document.addEventListener("click", hide);
  window.addEventListener("scroll", hide, true);
}

/* ---------- Tour guiado (onboarding do protótipo) ---------- */
function initTour() {
  const layer = $("#tourLayer"), hi = $("#tourHi"), pop = $("#tourPop");
  const ensureGrid = () => { if (!$("#tableOverlay").hidden) closeTable(); if (!$("#drawer").hidden) closeOrigin(); };
  const MISTO = ITEMS.length - 1; // último item = misto completo (produto + software + serviço)
  const ensureMisto = () => { if ($("#tableOverlay").hidden || active !== MISTO) openTable(MISTO); };
  const STEPS = [
    { before: ensureGrid, title: "Bem-vindo à Análise Técnica", text: "Em cerca de 1 minuto eu mostro como o protótipo transforma o edital em decisão: o que você atende, o que falta e qual produto indicar. Use Próximo para avançar." },
    { before: ensureGrid, sel: "#stats", title: "Resumo executivo", text: "Os indicadores do edital ficam aqui. Estão como 'A definir' porque vamos redefinir juntos quais números fazem mais sentido." },
    { before: ensureGrid, sel: "#filterTabs", title: "Filtro por status", text: "Filtre os itens do edital por Atende / Não atende, para focar no que precisa de ação." },
    { before: ensureGrid, sel: ".item-card", title: "Cada card é um item do edital", text: "O card mostra a descrição do item, quantidade, valores e se você atende. Clicar abre a análise completa." },
    { before: ensureGrid, sel: ".item-card:first-child .ic-reco", title: "O quanto você atende, sem abrir", text: "Quando o item não atende, o card mostra em percentual o quanto o melhor produto atende (ex.: 93%). O detalhe, requisito por requisito e produto por produto, fica na tabela, ao abrir o item." },
    { before: ensureMisto, sel: ".comp-head", title: "Um item pode ter várias seções", text: "Ao abrir, o item se divide em seções (produto, licença, garantia, serviço), cada uma com a sua análise. Item simples tem só uma seção." },
    { before: ensureMisto, sel: ".best-tag", title: "Comparação de produtos", text: "Na seção de produto, comparamos os SKUs do seu catálogo com a exigência do edital e recomendamos o que mais atende." },
    { before: ensureMisto, sel: ".val-missing", title: "Valor não extraído", text: "Quando a IA não achou a exigência no edital, marcamos aqui. O ícone ao lado do valor abre o arquivo para você selecionar o trecho e extrair o dado." },
    { before: ensureMisto, sel: "th.col-val", title: "Corrija a extração do edital", text: "Esta coluna é a exigência que a IA extraiu do EDITAL. Se ela leu errado, você corrige o valor requerido e o atendimento de todos os produtos é recalculado. Os valores dos seus produtos vêm do seu catálogo, não se corrigem aqui." },
    { before: ensureMisto, sel: ".dt-wrap", title: "Software e serviço: atende / não", text: "Nas seções que não são de produto (software, serviço, licença, garantia) não há comparação de SKU: para cada exigência do edital você confirma se atende ou não." },
    { before: ensureMisto, sel: ".sku-select", title: "Escolha o produto da proposta", text: "Quando decidir, selecione o SKU que vai para a proposta. É o encerramento do fluxo de análise do item." },
    { before: ensureGrid, title: "Pronto!", text: "Esse é o fluxo: entender o item, ver o que falta, corrigir a extração e escolher o produto. Você pode refazer o tour quando quiser pelo botão no canto inferior direito." },
  ];
  let idx = 0;
  function place() {
    const step = STEPS[idx], el = step.sel ? $(step.sel) : null;
    $("#tourStepLbl").textContent = `Passo ${idx + 1} de ${STEPS.length}`;
    $("#tourTitle").textContent = step.title;
    $("#tourText").textContent = step.text;
    $("#tourPrev").disabled = idx === 0;
    $("#tourNext").textContent = idx === STEPS.length - 1 ? "Concluir" : "Próximo";
    if (el) {
      el.scrollIntoView({ block: "center", inline: "center" });
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect(), pad = 6;
        hi.style.display = "block";
        hi.style.top = (r.top - pad) + "px"; hi.style.left = (r.left - pad) + "px";
        hi.style.width = (r.width + pad * 2) + "px"; hi.style.height = (r.height + pad * 2) + "px";
        const pw = pop.offsetWidth || 330, ph = pop.offsetHeight || 170;
        let top = r.bottom + 12; if (top + ph > innerHeight - 12) top = Math.max(12, r.top - ph - 12);
        let left = Math.max(12, Math.min(r.left, innerWidth - pw - 12));
        pop.style.top = top + "px"; pop.style.left = left + "px";
      });
    } else {
      hi.style.display = "none";
      const pw = pop.offsetWidth || 330, ph = pop.offsetHeight || 170;
      pop.style.top = (innerHeight / 2 - ph / 2) + "px"; pop.style.left = (innerWidth / 2 - pw / 2) + "px";
    }
  }
  function show(i) { idx = Math.max(0, Math.min(STEPS.length - 1, i)); const s = STEPS[idx]; if (s.before) s.before(); layer.hidden = false; place(); }
  function end() { layer.hidden = true; if (!$("#tableOverlay").hidden) closeTable(); }
  $("#tourFab").onclick = () => show(0);
  $("#tourSkip").onclick = end;
  $("#tourPrev").onclick = () => { if (idx > 0) show(idx - 1); };
  $("#tourNext").onclick = () => { if (idx >= STEPS.length - 1) end(); else show(idx + 1); };
  window.addEventListener("resize", () => { if (!layer.hidden) place(); });
  document.addEventListener("keydown", e => { if (!layer.hidden) { if (e.key === "Escape") end(); else if (e.key === "ArrowRight") $("#tourNext").click(); else if (e.key === "ArrowLeft") $("#tourPrev").click(); } });
}

/* boot */
// demo: pré-seleciona um produto num item que ATENDE, para ilustrar melhor o "produto escolhido"
if (!prefs.seededChosen) {
  const DEMO_ITEM = 1; // Câmeras Bullet + instalação (status Atende, tem componente produto)
  const pc = ITEMS[DEMO_ITEM].componentes.find(c => c.mecanica === "produto");
  prefs.chosen = pc ? { [DEMO_ITEM]: bestOf(matrixOf(pc), pc.skus).i } : {};
  prefs.seededChosen = true; savePrefs();
}
renderGrid(); wire(); initAddModal(); initTooltip(); initTour();
