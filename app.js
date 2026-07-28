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
const ICO_OK_C = `<svg class="ico ok" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="8" cy="8" r="6.3"/><path d="M5.3 8.2l1.9 1.9 3.5-4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICO_NO_C = `<svg class="ico no" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="8" cy="8" r="6.3"/><path d="M5.9 5.9l4.2 4.2M10.1 5.9l-4.2 4.2" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const ICO_ARROW = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11L11 5M6 5h5v5"/></svg>`;
const ICO_CHAT = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M3 4h10v7H8l-3 2v-2H3z"/></svg>`;
const ICO_PLUS = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 3v10M3 8h10"/></svg>`;
const ICO_CARET = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg>`;
const ICO_PENCIL = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2.5l2.5 2.5L6 12.5 3 13l.5-3z"/></svg>`;
const ICO_CHEV_L = `<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4l-4 4 4 4"/></svg>`;
const ICO_CHEV_R = `<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg>`;
const ICO_TRASH = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.5 8h6l.5-8M6.5 7v3.5M9.5 7v3.5"/></svg>`;
const ICO_LINK = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.7 9.3l2.6-2.6M7 4.6l1-1a2.4 2.4 0 0 1 3.4 3.4l-1 1M9 11.4l-1 1a2.4 2.4 0 0 1-3.4-3.4l1-1"/></svg>`;
const ICO_GLOBE = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="8" cy="8" r="6"/><path d="M2 8h12" stroke-linecap="round"/><path d="M8 2c2.1 2.2 2.1 9.8 0 12M8 2c-2.1 2.2-2.1 9.8 0 12"/></svg>`;
const ICO_CATALOG = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M8 3.4C6.9 2.7 5.4 2.4 3.7 2.6a1 1 0 0 0-.9 1v8a1 1 0 0 0 1.1 1c1.5-.2 2.9.1 4.1.8"/><path d="M8 3.4c1.1-.7 2.6-1 4.3-.8a1 1 0 0 1 .9 1v8a1 1 0 0 1-1.1 1c-1.5-.2-2.9.1-4.1.8"/><path d="M8 3.4v10.4" stroke-linecap="round"/></svg>`;
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
  const ev = cl.filter(r => ["ok", "no", "parcial", "parceiro"].includes(r.st));
  const ok = cl.filter(r => r.st === "ok" || r.st === "parceiro").length, no = cl.filter(r => r.st === "no").length;
  return { ok, total: ev.length, no, status: no === 0 ? "ok" : "no", pct: ev.length ? Math.round(ok / ev.length * 100) : 0 };
}
const CL_ST = { ok: { cls: "ok", label: "Atende", ico: ICO_OK }, no: { cls: "bad", label: "Não atende", ico: ICO_NO }, parcial: { cls: "warn", label: "Atende parcialmente", ico: "" }, parceiro: { cls: "warn", label: "Atende com parceiro", ico: "" }, ne: { cls: "soft", label: "Não avaliado", ico: "" } };
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
    return `<b>Melhor produto:</b> ${mono(cs.best.sku.model)} · atende ${cs.best.pct}%`;
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
let editingRow = null, pendingCommitRi = null; // edição inline do "Valor requerido" na matriz (com confirmação)
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
  // Resumo executivo AGNÓSTICO DE TIPO: conta ITENS por status (única unidade que sobrevive ao item misto).
  // Detalhe por requisito (parcial / com parceiro) vive dentro do item; questionamento/impugnação são de outra superfície.
  const ader = total ? Math.round(atend / total * 100) : 0;
  const cards = [
    { ico: "brand", svg: I.target, n: ader + "%", label: "Aderência do edital" },
    { ico: "", svg: I.layers, n: total, label: "Itens analisados" },
    { ico: "ok", svg: I.check, n: atend, label: "Itens que atende" },
    { ico: "bad", svg: I.cross, n: nao, label: "Itens que não atende" },
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
    // "Não atende" sempre com o total do item: soma das exigências de todas as camadas (produto ancorado no melhor SKU)
    let badgeCount = "", badgeTip = "Há exigência(s) que você não atende";
    if (sum.status !== "ok") {
      let at = 0, tot = 0;
      sum.comps.forEach(c => { if (c.mecanica === "produto") { at += c.best.ok; tot += c.best.evaluable; } else { at += c.ok_n; tot += c.total; } });
      badgeCount = ` · ${at}/${tot}`; badgeTip = `Atende ${at} de ${tot} exigências do item`;
    }
    const statusBadge = sum.status === "ok"
      ? `<span class="badge ok" data-tip="Você consegue atender este item">Atende</span>`
      : `<span class="badge bad" data-tip="${badgeTip}">Não atende${badgeCount}</span>`;
    const qtyTxt = it.quantidade === "1" ? "1 unidade" : `${esc(it.quantidade)} unidades`;
    // chip do topo: "Melhor produto · atende X%" quando há produto (a pendência de camada vive na própria badge "Não atende · X/Y")
    const prod = sum.comps.find(c => c.mecanica === "produto");
    let reco = "", recoCls = "";
    if (prod) { reco = `<b>Melhor produto:</b> <span style="font-family:var(--mono)">${esc(prod.best.sku.model)}</span>`; recoCls = " prod"; } // na lista, sem o % (o % aparece dentro do item)
    // a escolha substitui a recomendação: se um SKU foi escolhido, a linha vira "Produto escolhido"
    const chosenSku = (prod && chosenIdx != null && prod.comp.skus[chosenIdx]) ? prod.comp.skus[chosenIdx] : null;
    if (chosenSku) {
      reco = `<b>✓ Produto escolhido:</b> <span style="font-family:var(--mono)">${esc(chosenSku.model)}</span> · ${esc(chosenSku.brand)}`;
      recoCls = " chosen";
    }
    return `<div class="item-card ${chosenIdx != null ? "selected" : ""}" data-item="${i}" data-tip="Abrir a análise completa deste item">
      <div class="ic-badges"><span class="ic-num" data-tip="Número do item no edital">Item ${esc(it.numero || "—")}</span>${segBadge}${statusBadge}${reco ? `<span class="ic-reco-inline${recoCls}">${reco}</span>` : ""}</div>
      <div class="ic-desc">${esc(it.nome)}</div>
      <div class="ic-metaline">
        <span><b>Quantidade:</b> ${qtyTxt}</span>
        <span><b>Valor unitário:</b> <span class="mono">${esc(it.valorUnitario.v)}</span></span>
        <span><b>Valor total:</b> <span class="mono">${esc(it.valorTotal.v)}</span></span>
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
  $("#toTitle").textContent = (it.numero ? "Item " + it.numero + " · " : "") + (it.titulo || it.nome);
  const sum = itemSummary(i), multi = it.componentes.length > 1;

  // componente produto é processado antes (collapsiblesHTML usa SPECS)
  const prodComp = it.componentes.find(comp => comp.mecanica === "produto");
  if (prodComp) { activeComp = prodComp; MX_SKUS = prodComp.skus; SPECS = matrixOf(prodComp); recompute(); }

  let body = collapsiblesHTML(it), secs = "";
  it.componentes.forEach((comp, ci) => {
    let hostHTML, editSec;
    if (comp.mecanica === "produto") { hostHTML = `<div class="mech-host" id="matrixHost"></div>`; editSec = "produto"; }
    else { const idx = currentChecklists.length; currentChecklists.push(comp.lista); hostHTML = `<div class="mech-host" id="clHost-${idx}"></div>`; editSec = "cl:" + idx; }
    // toda seção é um accordion colapsável (aberto por padrão) com seu próprio botão Editar
    const cs = sum.comps[ci];
    const editBtn = `<button class="comp-edit" data-editsec="${editSec}" data-tip="Editar as exigências desta seção">${ICO_PENCIL} Editar</button>`;
    secs += `<details class="comp-acc" open><summary class="comp-head"><span class="comp-rotulo">${esc(comp.rotulo)}</span><span class="comp-status badge ${cs.ok ? "ok" : "bad"}">${cs.ok ? "Atende" : "Não atende"}</span><span class="comp-sum">${secSummary(cs)}</span>${editBtn}${CARET}</summary><div class="comp-acc-body">${hostHTML}</div></details>`;
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
  if (!details || !BEST) return;
  const chosenIdx = prefs.chosen[active], mono = m => `<span style="font-family:var(--mono)">${esc(m)}</span>`;
  const ok = BEST.diverg.length === 0;
  let html;
  if (chosenIdx != null && MX_SKUS[chosenIdx]) { const s = MX_SKUS[chosenIdx]; html = `<b>✓ Escolhido:</b> ${mono(s.model)} · ${esc(s.brand)}`; }
  else html = `<b>Melhor produto:</b> ${mono(BEST.sku.model)} · atende ${BEST.pct}%`;
  const sum = details.querySelector(".comp-sum"); if (sum) sum.innerHTML = html;
  const st = details.querySelector(".comp-status"); if (st) { st.className = "comp-status badge " + (ok ? "ok" : "bad"); st.textContent = ok ? "Atende" : "Não atende"; }
}

/* ---------- Mecânica: matriz (produto) ---------- */
function buildCols(order) {
  const cols = [{ key: "req" }, { key: "val" }, ...order.map(i => ({ key: "sku-" + i, skuIdx: i })), { key: "acoes" }];
  let fl = 0;
  cols.forEach(c => { c.w = COLW(c.key); c.frozen = frozen.has(c.key); });
  cols.forEach(c => { if (c.frozen) { c.left = fl; fl += c.w; } });
  const frz = cols.filter(c => c.frozen); if (frz.length) frz[frz.length - 1].edge = true;
  return cols;
}
const fzCls = c => c.frozen ? ` frozen${c.edge ? " frozen-edge" : ""}` : "";
const fzStyle = c => c.frozen ? ` style="left:${c.left}px"` : "";
const colCtrls = c => `<span class="col-resize" data-resize="${c.key}" data-tip="Arraste para redimensionar a largura"></span>`;
function cellTd(cell, ri, ci, exigNa, c, unidade) {
  if (exigNa) return `<td class="cell na-cell${fzCls(c)}"${fzStyle(c)}><span class="cell-val">${esc(cell.v)}</span></td>`;
  const icoInner = cell.st === "ok" ? ICO_OK_C : cell.st === "no" ? ICO_NO_C : "";
  const conf = (cell.st !== "ne" && cell.c) ? `<div class="conf ${cell.c}" data-tip="Confiança da IA na extração deste valor"><span class="dot"></span>${cap(cell.c)} confiança</div>` : "";
  return `<td class="cell ${cell.st}${fzCls(c)}"${fzStyle(c)}><div class="cell-line"><span class="cell-ico ${cell.st}" data-tip="Atendimento calculado pelo sistema (valor do produto × exigência do edital)">${icoInner}</span><span class="cell-val" data-tip="Valor do produto (vem do seu catálogo, somente leitura). Só a exigência do edital é editável.">${esc(splitUnit(cell.v, unidade))}</span>${unitTag(unidade)}</div>${conf}</td>`;
}
/* edição = ação consciente numa BARRA LATERAL, POR SEÇÃO (cada seção tem seu Editar). Tabela é sempre leitura. */
let editSnapshot = null, editTarget = null; // {type:"produto"} | {type:"checklist", sec:N}
function renderEditControls() { const el = $("#toEditCtrls"); if (el) el.innerHTML = active == null ? "" : `<button class="to-editbtn primary" id="btnEditItem" data-tip="Editar as informações do item (quantidade, unidade de medida, valores)">${ICO_PENCIL} Editar</button>`; } // header edita o item; cada seção tem seu próprio Editar
function editSecLabel() {
  const it = ITEMS[active];
  if (editTarget.type === "produto") return (it.componentes.find(c => c.mecanica === "produto") || {}).rotulo || "";
  return (it.componentes.filter(c => c.mecanica !== "produto")[editTarget.sec] || {}).rotulo || "";
}
function openEditDrawer(target) {
  editTarget = target;
  if (target.type === "produto") editSnapshot = SPECS ? clone(SPECS) : null;
  else if (target.type === "checklist") editSnapshot = clone(currentChecklists[target.sec]);
  else { const it = ITEMS[active]; editSnapshot = { quantidade: it.quantidade, unidadeMedida: it.unidadeMedida, vu: it.valorUnitario.v, vt: it.valorTotal.v }; }
  renderEditDrawer();
  $("#editOverlay").hidden = false; $("#editDrawer").hidden = false;
  const fab = $("#tourFab"); if (fab) fab.style.display = "none";
}
function closeEditDrawer() { $("#editDrawer").hidden = true; $("#editOverlay").hidden = true; editSnapshot = null; editTarget = null; const fab = $("#tourFab"); if (fab) fab.style.display = ""; }
function cancelEditDrawer() {
  if (editSnapshot && editTarget) {
    if (editTarget.type === "produto") { SPECS = editSnapshot; recompute(); renderMatrix(); }
    else if (editTarget.type === "checklist") { const l = currentChecklists[editTarget.sec]; l.splice(0, l.length, ...editSnapshot); renderChecklist($("#clHost-" + editTarget.sec), l, editTarget.sec); }
    // item: só aplica no Salvar, nada a restaurar
  }
  closeEditDrawer();
}
function renderEditDrawer() {
  const it = ITEMS[active];
  let scopeLine = "", sectionLabel = "Especificações", fields = "", addBtn = "", hint = "Revise as especificações extraídas do edital. Ao salvar, vamos atualizar a análise de compatibilidade dos produtos.";
  if (editTarget.type === "item") {
    sectionLabel = "Informações do item";
    hint = "Revise as informações do item extraídas do edital. Você pode corrigir os valores caso a IA não tenha extraído corretamente.";
    fields = `
      <div class="ed-field"><label>Quantidade</label><input class="ed-input" data-eitem="quantidade" value="${esc(it.quantidade)}"></div>
      <div class="ed-field"><label>Unidade de medida</label><input class="ed-input" data-eitem="unidadeMedida" value="${esc(it.unidadeMedida || "")}"></div>
      <div class="ed-field"><label>Valor unitário</label><input class="ed-input" data-eitem="vu" value="${esc(it.valorUnitario.v)}"></div>
      <div class="ed-field"><label>Valor total</label><input class="ed-input" data-eitem="vt" value="${esc(it.valorTotal.v)}"></div>`;
  } else if (editTarget.type === "produto") {
    scopeLine = `<div class="ed-scope">Seção: <b>${esc(editSecLabel())}</b></div>`;
    fields = SPECS.map((spec, ri) => {
      if (spec.exigNa) return "";
      const nx = !!spec.naoExtraido, full = nx ? "" : esc(spec.exig);
      const isBool = !nx && /^(sim|n[aã]o)\b/i.test((spec.exig || "").trim());
      const control = isBool
        ? `<select class="ed-input" data-eri="${ri}"><option${/^sim/i.test(spec.exig) ? " selected" : ""}>Sim</option><option${/^n[aã]o/i.test(spec.exig) ? " selected" : ""}>Não</option></select>`
        : `<input class="ed-input" data-eri="${ri}" value="${full}">`;
      return `<div class="ed-field"><label>${esc(spec.req)}</label>${control}</div>`;
    }).join("");
    addBtn = `<button class="ed-add" id="editAddReq">${ICO_PLUS} Adicionar requisito</button>`;
  } else {
    scopeLine = `<div class="ed-scope">Seção: <b>${esc(editSecLabel())}</b></div>`;
    fields = currentChecklists[editTarget.sec].map((r, ri) => `<div class="ed-field">
      <label>${esc(r.req)}</label>
      <input class="ed-input" data-eri="${ri}" value="${esc(r.exig || "")}" placeholder="Valor exigido">
      <div class="ed-sub"><span class="ed-sub-label">Status</span><select class="ed-status" data-eri="${ri}">${CL_OPTS.map(k => `<option value="${k}"${k === r.st ? " selected" : ""}>${CL_ST[k].label}</option>`).join("")}</select></div>
    </div>`).join("");
    addBtn = `<button class="ed-add" id="editAddCl">${ICO_PLUS} Adicionar requisito</button>`;
  }
  $("#editBody").innerHTML = `
    ${scopeLine}
    <div class="ed-hintbox">${hint}</div>
    <div class="ed-section-label">Descrição</div>
    <p class="ed-desc clamp">${esc(it.nome)}</p>
    <button class="ed-more" id="edMore">Ver mais</button>
    <div class="ed-section-label">${sectionLabel}</div>
    ${fields}${addBtn}`;
}
function saveEditDrawer() {
  if (editTarget.type === "item") {
    const it = ITEMS[active];
    $("#editBody").querySelectorAll("[data-eitem]").forEach(el => {
      const k = el.dataset.eitem, v = String(el.value || "").trim();
      if (k === "quantidade") it.quantidade = v;
      else if (k === "unidadeMedida") it.unidadeMedida = v;
      else if (k === "vu") it.valorUnitario = { v };
      else if (k === "vt") it.valorTotal = { v };
    });
  } else if (editTarget.type === "produto") {
    $("#editBody").querySelectorAll(".ed-input[data-eri]").forEach(el => {
      const ri = +el.dataset.eri, spec = SPECS[ri]; if (!spec || spec.exigNa) return;
      const val = String(el.value != null ? el.value : "").trim(), wasMissing = spec.naoExtraido;
      if (!val) { if (!wasMissing) spec.exig = ""; return; }
      spec.exig = val; if (wasMissing) spec.naoExtraido = false;
    });
    SPECS.forEach(spec => { if (!spec.exigNa && !spec.naoExtraido && spec.exig) rematchRow(spec); });
    recompute(); renderMatrix(); updateProdSecSummary();
  } else {
    const l = currentChecklists[editTarget.sec];
    $("#editBody").querySelectorAll(".ed-input[data-eri]").forEach(el => { const ri = +el.dataset.eri; const v = String(el.value || "").trim(); if (l[ri]) l[ri].exig = v || l[ri].exig; });
    $("#editBody").querySelectorAll(".ed-status[data-eri]").forEach(el => { const ri = +el.dataset.eri; if (l[ri]) l[ri].st = el.value; });
    renderChecklist($("#clHost-" + editTarget.sec), l, editTarget.sec); refreshClSecSummary(editTarget.sec);
  }
  renderItemSummary(); closeEditDrawer();
  toast("Análise reprocessada com as novas informações");
}
function refreshClSecSummary(sec) {
  const host = $("#clHost-" + sec); if (!host) return;
  const details = host.closest(".comp-acc"); if (!details) return;
  const s = checklistSummary(currentChecklists[sec]), ok = s.status === "ok";
  const sum = details.querySelector(".comp-sum"); if (sum) sum.innerHTML = `Atende ${s.ok} de ${s.total} exigências`;
  const st = details.querySelector(".comp-status"); if (st) { st.className = "comp-status badge " + (ok ? "ok" : "bad"); st.textContent = ok ? "Atende" : "Não atende"; }
}
function renderMatrix() {
  const host = $("#matrixHost"); if (!host) return;
  const chosenIdx = prefs.chosen[active];
  const cols = buildCols(ORDER), totalW = cols.reduce((s, c) => s + c.w, 0);
  const colgroup = `<colgroup>${cols.map(c => `<col data-k="${c.key}" style="width:${c.w}px">`).join("")}</colgroup>`;
  let head = "";
  cols.forEach(c => {
    if (c.key === "req") head += `<th class="col-req${fzCls(c)}"${fzStyle(c)}>Especificações do edital${colCtrls(c)}</th>`;
    else if (c.key === "val") head += `<th class="col-val${fzCls(c)}"${fzStyle(c)} data-tip="Valor que o edital exige para o requisito">Valor requerido${colCtrls(c)}</th>`;
    else if (c.key === "acoes") head += `<th class="col-acoes">Ações</th>`;
    else {
      const idx = c.skuIdx, sc = STATE[idx], rank = ORDER.indexOf(idx), best = rank === 0, isChosen = chosenIdx === idx, hasChoice = chosenIdx != null;
      const sku = sc.sku;
      // fonte do dado qualifica o estoque: catálogo = seu estoque; internet = fonte externa (com link para a origem)
      const isNet = sku.origem === "internet";
      // estoque = só disponibilidade (verde/âmbar), independente da fonte
      const estoqueBadge = sku.estoque
        ? `<span class="sku-tag ok" data-tip="Em estoque">Em estoque</span>`
        : `<span class="sku-tag warn" data-tip="Sem estoque: precisaria comprar ou terceirizar">Sem estoque</span>`;
      // fonte = ÍCONE de origem: livro = catálogo do cliente, globo = internet (externo). Azul quando tem link (clicável), cinza quando não.
      const hasLink = isNet || !!sku.datasheet;
      const srcIco = isNet ? ICO_GLOBE : ICO_CATALOG;
      const srcTip = isNet ? "Fonte: Internet (catálogo externo)" : "Fonte: Catálogo do cliente";
      const sourceIcon = hasLink
        ? `<button class="sku-srcico haslink" data-${isNet ? "neturl" : "caturl"}="${idx}" data-tip="${srcTip} — clique para abrir">${srcIco}</button>`
        : `<span class="sku-srcico" data-tip="${srcTip} (sem link disponível)">${srcIco}</span>`;
      const badgeHTML = isChosen ? `<div class="chosen-tag" data-tip="Produto escolhido para a proposta">✓ Escolhido</div>` : (best && !hasChoice) ? `<div class="best-tag" data-tip="Melhor produto: maior aderência aos requisitos e, entre os que atendem, o menor preço">★ Melhor produto</div>` : `<div class="sku-rank">${rank + 1}º</div>`;
      const precoLine = sku.preco != null ? `<div class="sku-preco" data-tip="Preço do produto (conforme a fonte)">${esc(fmtBRL(sku.preco))}</div>` : "";
      const fitCls = sc.pct === 100 ? "full" : sc.pct >= 50 ? "mid" : "low";
      head += `<th class="col-sku${(best && !hasChoice) ? " best" : ""}${isChosen ? " chosen" : ""}${fzCls(c)}"${fzStyle(c)}>
        <div class="sku-top">${badgeHTML}${sourceIcon}</div>
        <div class="sku-model">${esc(sku.model)}</div><div class="sku-brand" data-tip="Fabricante (info do produto, não é requisito)">${esc(sku.brand)}</div>
        <div class="sku-fit" data-tip="Aderência: requisitos atendidos e percentual"><span class="score-pct">${sc.pct}%</span><span class="score-frac">${sc.ok}/${sc.evaluable}${sc.ne ? ` · ${sc.ne} n/e` : ""}</span></div>
        <div class="score-bar"><span class="score-fill ${fitCls}" style="width:${sc.pct}%"></span></div>
        <div class="sku-metaline">${precoLine}${estoqueBadge}</div>
        <button class="sku-select${isChosen ? " on" : ""}" data-choose="${idx}" data-tip="${isChosen ? "Remover seleção" : "Definir como produto escolhido para a proposta"}">${isChosen ? "✓ Selecionado" : "Selecionar"}</button>${colCtrls(c)}</th>`;
    }
  });
  let body = "";
  SPECS.forEach((spec, ri) => {
    if (spec.exigNa) return;
    const nx = !!spec.naoExtraido;
    let row = `<tr class="${nx ? "nx-row" : (isConcordant(spec) ? "concordant" : "")}">`;
    cols.forEach(c => {
      if (c.key === "req") row += `<td class="col-req${fzCls(c)}"${fzStyle(c)}><span class="req-name" data-tip="Requisito exigido pelo edital">${esc(spec.req)}</span></td>`;
      else if (c.key === "val") {
        if (nx) {
          const originBtn = `<button class="req-ico val-ico" data-origin="${ri}" data-tip="Abrir o edital para localizar e extrair o valor exigido">${ICO_ARROW}</button>`;
          row += `<td class="col-val${fzCls(c)}"${fzStyle(c)}><div class="val-head"><span class="val-missing" data-tip="O edital exige este requisito, mas a IA não conseguiu extrair o valor. Preencha para liberar a comparação.">${ICO_WARN} Não extraído</span>${originBtn}</div></td>`;
        } else if (editingRow === ri) {
          const core = esc(splitUnit(splitOp(spec.exig).rest, spec.unidade)), vrOp = opTag(splitOp(spec.exig).op), vrUnit = unitTag(spec.unidade);
          row += `<td class="col-val${fzCls(c)}"${fzStyle(c)}><div class="val-head val-edit">${vrOp}<input class="val-inline-input" data-vedit="${ri}" value="${core}">${vrUnit}<button class="val-confirm" data-vconfirm="${ri}" data-tip="Confirmar e recalcular">${ICO_OK}</button><button class="val-cancelbtn" data-vcancel="${ri}" data-tip="Cancelar edição">${ICO_NO}</button></div></td>`;
        } else {
          const vrCore = esc(splitUnit(splitOp(spec.exig).rest, spec.unidade)), vrOp = opTag(splitOp(spec.exig).op), vrUnit = unitTag(spec.unidade);
          const originBtn = `<button class="req-ico val-ico" data-origin="${ri}" data-tip="Ver de onde a IA extraiu no edital (página e trecho)">${ICO_ARROW}</button>`;
          const editBtn = `<button class="req-ico val-editbtn" data-vstart="${ri}" data-tip="Editar o valor requerido (recalcula ao confirmar)">${ICO_PENCIL}</button>`;
          const valInner = `<span class="val-text">${vrOp}<span class="val-plain">${vrCore}</span>${vrUnit}</span>`;
          row += `<td class="col-val${fzCls(c)}"${fzStyle(c)}><div class="val-head">${valInner}${originBtn}${editBtn}</div></td>`;
        }
      }
      else if (c.key === "acoes") row += `<td class="col-acoes"><div class="acoes-cell"><button class="act-ico" data-rowlink="${ri}" data-tip="Copiar link para este requisito (ir direto para a linha)">${ICO_LINK}</button><button class="act-ico danger" data-delreq="${ri}" data-tip="Excluir este requisito">${ICO_TRASH}</button></div></td>`;
      else if (nx) row += `<td class="cell nm-cell${fzCls(c)}"${fzStyle(c)}><div class="cell-line"><span class="ico-nm" data-tip="Valor do seu produto disponível, mas ainda sem correspondência: falta extrair a exigência do edital">${ICO_ALERT}</span><span class="cell-val">${esc(splitUnit(spec.cells[c.skuIdx].v, spec.unidade))}</span>${unitTag(spec.unidade)}</div></td>`;
      else row += cellTd(spec.cells[c.skuIdx], ri, c.skuIdx, spec.exigNa, c, spec.unidade);
    });
    body += row + `</tr>`;
  });
  host.innerHTML = `<div class="table-wrap"><table class="cmp" style="width:${totalW}px">${colgroup}<thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  if (editingRow != null) { const inp = host.querySelector(".val-inline-input"); if (inp) { inp.focus(); inp.select(); } }
}
/* edição inline do "Valor requerido" (matriz): editar direto na célula com confirmação (check) antes de recalcular */
function startInlineEdit(ri) { editingRow = ri; renderMatrix(); }
function cancelInlineEdit() { editingRow = null; renderMatrix(); }
function commitInline(ri) {
  const inp = $("#matrixHost .val-inline-input"), spec = SPECS[ri];
  if (inp && spec) {
    const raw = String(inp.value || "").trim();
    if (raw) { const op = splitOp(spec.exig).op; spec.exig = op ? op + " " + joinUnit(raw, spec.unidade) : joinUnit(raw, spec.unidade); if (spec.naoExtraido) spec.naoExtraido = false; rematchRow(spec); }
  }
  editingRow = null; recompute(); renderMatrix(); updateProdSecSummary();
  toast("Valor requerido atualizado — análise recalculada");
}
function tryCommitInline(ri) {
  if (!prefs.warnedInline) { pendingCommitRi = ri; $("#warnOverlay").hidden = false; $("#warnModal").hidden = false; return; }
  commitInline(ri);
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
  let html = collapsible("Descrição completa", `<p class="cps-desc">${esc(it.nome)}</p><p class="cps-desc">${esc(it.resumoTR)}</p>`, null, true);
  // "Especificações não exigidas pelo edital": o seu produto oferece, o edital não pede. Aberto por padrão, com texto explicativo.
  const naoExig = [...new Set(it.componentes.flatMap(c => c.catalogoNaoEdital || []))];
  if (naoExig.length) {
    const note = "Especificações que o seu produto oferece e o edital não exige. Ficam aqui só como referência, não entram na comparação. Se alguma passar a ser exigida, você pode adicioná-la pelo Editar.";
    html += collapsible("Especificações não exigidas pelo edital", tagList(naoExig, note), naoExig.length, true);
  }
  return `<div class="to-collapsibles">${html}</div>`;
}

/* ---------- Mecânica: checklist (serviço / software) ---------- */
function renderChecklist(host, clArr, sec) {
  if (!host) return;
  const rows = clArr.map((r, ri) => {
    const st = CL_ST[r.st] || CL_ST.ne;
    return `<tr>
      <td class="col-req"><span class="req-name">${esc(r.req)}</span></td>
      <td class="col-val"><div class="val-head"><span class="val-text">${esc(r.exig || "—")}</span><button class="req-ico val-ico" data-clorigin="${sec}:${ri}" data-tip="Ver de onde a IA extraiu no edital (página e trecho)">${ICO_ARROW}</button></div></td>
      <td class="col-meta"><span class="badge soft">${esc(r.modulo || "—")}</span></td>
      <td class="col-meta"><button class="badge ${st.cls} clickable-badge" data-clstatus="${sec}:${ri}" data-tip="Clique para escolher o status">${st.ico}${st.label}<span class="cl-caret">▾</span></button></td>
      <td class="col-meta">${confBadge(r.c)}</td>
      <td class="col-meta c-just">${esc(r.just || "—")}</td>
      <td class="col-meta"><span class="badge soft with-avatar">Selecionar</span></td>
    </tr>`;
  }).join("");
  host.innerHTML = `<div class="dt-wrap"><table class="dt"><thead><tr><th class="col-req">Requisito</th><th class="col-val">Valor requerido</th><th class="col-meta">Módulo</th><th class="col-meta">Status</th><th class="col-meta">Confiança IA</th><th class="col-meta c-just">Justificativa IA</th><th class="col-meta">Responsável</th></tr></thead><tbody>${rows}</tbody></table><div class="dt-foot" data-addcl="${sec}">${ICO_PLUS} Adicionar requisito</div></div>`;
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
const CL_OPTS = ["ok", "no", "parcial", "parceiro", "ne"];
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
  $("#toEditCtrls").addEventListener("click", e => { if (e.target.closest("#btnEditItem")) openEditDrawer({ type: "item" }); });
  $("#editClose").onclick = cancelEditDrawer;
  $("#editCancel").onclick = cancelEditDrawer;
  $("#editOverlay").onclick = cancelEditDrawer;
  $("#editSave").onclick = saveEditDrawer;
  $("#editBody").addEventListener("click", e => {
    if (e.target.closest("#editAddReq")) { openAddModal(); return; }
    if (e.target.closest("#editAddCl")) { const sec = editTarget.sec; currentChecklists[sec].push({ req: "Novo requisito", exig: "", modulo: "—", st: "ne", c: null, just: "—", origem: { doc: "Inserido manualmente", pag: "—" } }); renderEditDrawer(); return; }
    const more = e.target.closest("#edMore");
    if (more) { const d = $("#editBody .ed-desc"); d.classList.toggle("clamp"); more.textContent = d.classList.contains("clamp") ? "Ver mais" : "Ver menos"; }
  });
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
    const es = e.target.closest("[data-editsec]"); if (es) { e.preventDefault(); const v = es.dataset.editsec; openEditDrawer(v === "produto" ? { type: "produto" } : { type: "checklist", sec: +v.split(":")[1] }); return; }
    const vs = e.target.closest("[data-vstart]"); if (vs) { startInlineEdit(+vs.dataset.vstart); return; }
    const vconf = e.target.closest("[data-vconfirm]"); if (vconf) { tryCommitInline(+vconf.dataset.vconfirm); return; }
    const vcan = e.target.closest("[data-vcancel]"); if (vcan) { cancelInlineEdit(); return; }
    const pin = e.target.closest("[data-pin]"); if (pin) { const k = pin.dataset.pin; frozen.has(k) ? frozen.delete(k) : frozen.add(k); saveCols(); renderMatrix(); return; }
    const nl = e.target.closest("[data-neturl]"); if (nl) { e.stopPropagation(); toast(`Abrindo a origem do dado na internet — ${MX_SKUS[+nl.dataset.neturl].model} (para conferência)`); return; }
    const cl = e.target.closest("[data-caturl]"); if (cl) { e.stopPropagation(); toast(`Abrindo no catálogo — ${MX_SKUS[+cl.dataset.caturl].model}`); return; }
    const ch = e.target.closest("[data-choose]"); if (ch) { const i = +ch.dataset.choose; prefs.chosen[active] = (prefs.chosen[active] === i) ? undefined : i; if (prefs.chosen[active] == null) delete prefs.chosen[active]; savePrefs(); renderMatrix(); updateProdSecSummary(); toast(prefs.chosen[active] != null ? `Produto escolhido: ${MX_SKUS[i].model}` : "Seleção removida"); return; }
    const or = e.target.closest("[data-origin]"); if (or) { const ri = +or.dataset.origin; openOriginSpec(SPECS[ri], ri); return; }
    const rl = e.target.closest("[data-rowlink]"); if (rl) { toast(`Link para o requisito "${SPECS[+rl.dataset.rowlink].req}" copiado`); return; }
    const dl = e.target.closest("[data-delreq]"); if (dl) { const ri = +dl.dataset.delreq; const nm = SPECS[ri].req; SPECS.splice(ri, 1); recompute(); renderMatrix(); toast(`Requisito removido: "${nm}"`); return; }
    const q = e.target.closest("[data-question]"); if (q) { toast(`Abrindo questionamento/impugnação — "${SPECS[+q.dataset.question].req}" (referente ao edital)`); return; }
    if (e.target.closest("#addReq")) { openAddModal(); return; }
    const cs = e.target.closest("[data-clstatus]"); if (cs) { const [s, r] = cs.dataset.clstatus.split(":").map(Number); openStatusMenu(cs, s, r); return; }
    const co = e.target.closest("[data-clorigin]"); if (co) { const [s, r] = co.dataset.clorigin.split(":").map(Number); openOriginSpec(currentChecklists[s][r]); return; }
    const cq = e.target.closest("[data-clquestion]"); if (cq) { const [s, r] = cq.dataset.clquestion.split(":").map(Number); toast(`Abrindo questionamento/impugnação — "${currentChecklists[s][r].req}" (referente ao edital)`); return; }
    const ac = e.target.closest("[data-addcl]"); if (ac) { addClReq(+ac.dataset.addcl); return; }
  });
  tb.addEventListener("keydown", e => {
    const inp = e.target.closest(".val-inline-input"); if (!inp) return;
    if (e.key === "Enter") { e.preventDefault(); tryCommitInline(+inp.dataset.vedit); }
    else if (e.key === "Escape") { e.preventDefault(); cancelInlineEdit(); }
  });

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
  const closeWarn = () => { $("#warnModal").hidden = true; $("#warnOverlay").hidden = true; pendingCommitRi = null; };
  $("#warnCancel").onclick = closeWarn; $("#warnOverlay").onclick = closeWarn;
  $("#warnOk").onclick = () => { prefs.warnedInline = true; savePrefs(); $("#warnModal").hidden = true; $("#warnOverlay").hidden = true; const ri = pendingCommitRi; pendingCommitRi = null; if (ri != null) commitInline(ri); };
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
if (!prefs.seededChosen2) {
  const DEMO_ITEM = 2; // "Câmeras bullet fixas": só produto que ATENDE, para ilustrar o "produto escolhido"
  const pc = ITEMS[DEMO_ITEM].componentes.find(c => c.mecanica === "produto");
  prefs.chosen = pc ? { [DEMO_ITEM]: bestOf(matrixOf(pc), pc.skus).i } : {};
  prefs.seededChosen2 = true; savePrefs();
}
renderGrid(); wire(); initAddModal(); initTooltip(); initTour();
