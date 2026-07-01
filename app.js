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
    (comp.naoAnalisadas || []).forEach(n => s.push({ req: n.req, exig: "", naoExtraido: true, modulo: "—", origem: { doc: "Edital — Termo de Referência", pag: "—", trecho: "A IA identificou a exigência deste requisito no edital, mas não conseguiu extrair o valor automaticamente." }, cells: comp.skus.map((_, i) => ({ st: "nm", v: (n.vals && n.vals[i]) || "—" })) }));
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
  const op = rv.match(/(≥|>=|≤|<=|>|<)\s*(-?[\d.,]+)/);
  if (op) { const r = numOf(op[2]), n = numOf(vv); if (r == null || n == null) return "ne";
    const o = op[1], ok = (o === "≥" || o === ">=") ? n >= r : (o === "≤" || o === "<=") ? n <= r : (o === ">") ? n > r : n < r; return ok ? "ok" : "no"; }
  if (/^sim\b/i.test(rv)) return (/\b(n[aã]o|nao)\b/i.test(vv)) ? "no" : "ok";
  const ar = alnum(rv), av = alnum(vv); if (!ar) return "ne";
  return (av.includes(ar) || ar.includes(av)) ? "ok" : "no";
}
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

/* ---------- estado ---------- */
const LS = "settle-at-prefs-v7";
let prefs = (() => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } })();
const savePrefs = () => localStorage.setItem(LS, JSON.stringify(prefs));
prefs.chosen = prefs.chosen || {};
let statusFilter = prefs.filter || "all";
let active = null, SPECS = null, STATE, RANKED, ORDER, BEST, activeComp = null, MX_SKUS = [];
let currentChecklists = [];
let colW = prefs.colW || {};
let frozen = new Set(prefs.frozen || ["req", "val"]);
const COLW = k => colW[k] || (k === "check" ? 44 : k === "req" ? 300 : k === "val" ? 160 : k === "acoes" ? 84 : 176);
const saveCols = () => { prefs.colW = colW; prefs.frozen = [...frozen]; savePrefs(); };
let renderPending = false;
const scheduleRender = () => { if (!renderPending) { renderPending = true; requestAnimationFrame(() => { renderPending = false; renderMatrix(); }); } };
function recompute() { STATE = scoresFor(SPECS, MX_SKUS); RANKED = rankFor(STATE); ORDER = RANKED.map(s => s.i); BEST = RANKED[0]; window.SCORES = STATE; }

/* valores do item (a partir do preço unitário) */
ITEMS.forEach(it => { const q = parseFloat(it.quantidade) || 1, fmt = n => "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2 }); it.valorUnitario = it.precoUnit ? { v: fmt(it.precoUnit) } : { v: "—" }; it.valorTotal = it.precoUnit ? { v: fmt(it.precoUnit * q) } : { v: "—" }; });

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
    const statusBadge = sum.status === "ok"
      ? `<span class="badge ok" data-tip="Você consegue atender este item">Atende</span>`
      : `<span class="badge bad" data-tip="Há exigência(s) que você não atende">Não atende</span>`;
    const chosenBadge = (chosenIdx != null) ? `<span class="badge brand">Produto selecionado</span>` : "";
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
          ? `<b>Melhor produto:</b> <span style="font-family:var(--mono)">${esc(f.best.sku.model)}</span> · atende ${f.best.ok} de ${f.best.evaluable} requisitos`
          : `Atende ${f.ok_n} de ${f.total} exigências`;
      } else {
        reco = `<b>Pendências:</b> ` + fails.map(f => {
          const at = f.mecanica === "produto" ? f.best.ok : f.ok_n;
          const tot = f.mecanica === "produto" ? f.best.evaluable : f.total;
          return `${esc(f.rotulo)} ${at}/${tot}`;
        }).join(" · ");
      }
    }
    return `<div class="item-card ${chosenIdx != null ? "selected" : ""}" data-item="${i}" data-tip="Abrir a análise completa deste item">
      <div class="ic-badges">${statusBadge}${chosenBadge}</div>
      <div class="ic-desc">${esc(it.nome)}</div>
      <div class="ic-divider"></div>
      <div class="ic-line"><b>Quantidade:</b> ${qtyTxt}</div>
      <div class="ic-line"><b>Valor unitário:</b> <span style="font-family:var(--mono)">${esc(it.valorUnitario.v)}</span> &nbsp;&nbsp; <b>Valor total:</b> <span style="font-family:var(--mono)">${esc(it.valorTotal.v)}</span></div>
      <div class="ic-reco${recoCls}">${reco}</div>
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
  $("#toTitle").textContent = it.titulo || it.nome;
  const sum = itemSummary(i), multi = it.componentes.length > 1;

  // componente produto é processado antes (collapsiblesHTML usa SPECS)
  const prodComp = it.componentes.find(comp => comp.mecanica === "produto");
  if (prodComp) { activeComp = prodComp; MX_SKUS = prodComp.skus; SPECS = matrixOf(prodComp); recompute(); }

  let body = collapsiblesHTML(it);
  it.componentes.forEach((comp, ci) => {
    if (multi) {
      const cs = sum.comps[ci];
      body += `<div class="comp-head"><span class="comp-dot ${cs.ok ? "ok" : "no"}">${cs.ok ? ICO_OK : ICO_NO}</span><span class="comp-rotulo">${esc(comp.rotulo)}</span><span class="comp-mec">${comp.mecanica === "produto" ? "comparar produto" : "atende / não atende"}</span></div>`;
    }
    if (comp.mecanica === "produto") { body += `<div class="mech-host" id="matrixHost"></div>`; }
    else { const idx = currentChecklists.length; currentChecklists.push(comp.lista); body += `<div class="mech-host" id="clHost-${idx}"></div>`; }
  });

  $("#toBody").innerHTML = body;
  if ($("#matrixHost")) renderMatrix();
  currentChecklists.forEach((c, idx) => renderChecklist($("#clHost-" + idx), c, idx));
  $("#tableOverlay").hidden = false;
}
const closeTable = () => { $("#tableOverlay").hidden = true; active = null; renderGrid(); };

/* ---------- Mecânica: matriz (produto) ---------- */
function buildCols() {
  const cols = [{ key: "check" }, { key: "req" }, { key: "val" }, ...ORDER.map(i => ({ key: "sku-" + i, skuIdx: i })), { key: "acoes" }];
  let fl = 0;
  cols.forEach(c => { c.w = COLW(c.key); c.frozen = c.key === "check" || frozen.has(c.key); });
  cols.forEach(c => { if (c.frozen) { c.left = fl; fl += c.w; } });
  const frz = cols.filter(c => c.frozen); if (frz.length) frz[frz.length - 1].edge = true;
  return cols;
}
const fzCls = c => c.frozen ? ` frozen${c.edge ? " frozen-edge" : ""}` : "";
const fzStyle = c => c.frozen ? ` style="left:${c.left}px"` : "";
const colCtrls = c => `<button class="col-pin ${c.frozen ? "on" : ""}" data-pin="${c.key}" data-tip="${c.frozen ? "Descongelar coluna" : "Congelar coluna (fixa ao rolar)"}">${PIN_SVG}</button><span class="col-resize" data-resize="${c.key}" data-tip="Arraste para redimensionar a largura"></span>`;
function cellTd(cell, ri, ci, exigNa, c) {
  if (exigNa) return `<td class="cell na-cell${fzCls(c)}"${fzStyle(c)}><span class="cell-val">${esc(cell.v)}</span></td>`;
  const icoInner = cell.st === "ok" ? ICO_OK : cell.st === "no" ? ICO_NO : "";
  const conf = (cell.st !== "ne" && cell.c) ? `<div class="conf ${cell.c}" data-tip="Confiança da IA na extração deste valor"><span class="dot"></span>${cap(cell.c)} confiança</div>` : "";
  return `<td class="cell ${cell.st}${fzCls(c)}"${fzStyle(c)}><div class="cell-line"><span class="cell-ico ${cell.st}" data-tip="Atendimento calculado pelo sistema (valor do produto × exigência do edital)">${icoInner}</span><span class="cell-val editable" data-edit="v" data-ri="${ri}" data-ci="${ci}" contenteditable="true" data-tip="Edite o valor do produto. O sistema recalcula o atendimento automaticamente.">${esc(cell.v)}</span></div>${conf}</td>`;
}
function renderMatrix() {
  const host = $("#matrixHost"); if (!host) return;
  const cols = buildCols(), chosenIdx = prefs.chosen[active], totalW = cols.reduce((s, c) => s + c.w, 0);
  const colgroup = `<colgroup>${cols.map(c => `<col data-k="${c.key}" style="width:${c.w}px">`).join("")}</colgroup>`;
  let head = "";
  cols.forEach(c => {
    if (c.key === "check") head += `<th class="col-check${fzCls(c)}"${fzStyle(c)}><span class="cbox" data-tip="Selecionar todos"></span></th>`;
    else if (c.key === "req") head += `<th class="col-req${fzCls(c)}"${fzStyle(c)}>Especificações do edital${colCtrls(c)}</th>`;
    else if (c.key === "val") head += `<th class="col-val${fzCls(c)}"${fzStyle(c)} data-tip="Valor que o edital exige para o requisito">Valor requerido${colCtrls(c)}</th>`;
    else if (c.key === "acoes") head += `<th class="col-acoes">Ações</th>`;
    else {
      const idx = c.skuIdx, sc = STATE[idx], rank = ORDER.indexOf(idx), best = rank === 0, isChosen = chosenIdx === idx;
      head += `<th class="col-sku${best ? " best" : ""}${isChosen ? " chosen" : ""}${fzCls(c)}"${fzStyle(c)}>
        ${best ? `<div class="best-tag" data-tip="Produto com maior aderência">★ Recomendado</div>` : `<div class="sku-rank">${rank + 1}º</div>`}
        <div class="sku-model">${esc(sc.sku.model)}</div><div class="sku-brand" data-tip="Fabricante (info do SKU, não é requisito)">${esc(sc.sku.brand)}</div>
        <div class="sku-scoreline" data-tip="Requisitos atendidos e percentual de aderência"><span class="score-frac">${sc.ok}/${sc.evaluable}${sc.ne ? ` · ${sc.ne} n/e` : ""}</span><span class="score-pct">${sc.pct}%</span></div>
        <div class="score-bar"><span class="score-fill" style="width:${sc.pct}%"></span></div>
        <button class="sku-select${isChosen ? " on" : ""}" data-choose="${idx}" data-tip="Definir como produto escolhido">${isChosen ? "✓ Selecionado" : "Selecionar"}</button>${colCtrls(c)}</th>`;
    }
  });
  let body = "";
  SPECS.forEach((spec, ri) => {
    if (spec.exigNa) return;
    const nx = !!spec.naoExtraido;
    let row = `<tr class="${isConcordant(spec) ? "concordant" : ""}${nx ? " row-missing" : ""}">`;
    cols.forEach(c => {
      if (c.key === "check") row += `<td class="col-check${fzCls(c)}"${fzStyle(c)}><span class="cbox" data-tip="Selecionar requisito"></span></td>`;
      else if (c.key === "req") row += `<td class="col-req${fzCls(c)}"${fzStyle(c)}><div class="req-head"><span class="req-name editable" data-edit="r" data-ri="${ri}" contenteditable="true" data-tip="Clique para editar o requisito">${esc(spec.req)}</span><button class="req-ico" data-origin="${ri}" data-tip="${nx ? "Não conseguimos extrair essa informação. Selecione um trecho para extrair o dado." : "Ver de onde a IA extraiu (página e trecho)"}">${ICO_ARROW}</button></div></td>`;
      else if (c.key === "val") row += nx
        ? `<td class="col-val${fzCls(c)}"${fzStyle(c)}><span class="val-missing editable" data-edit="vr" data-ri="${ri}" contenteditable="true" data-tip="A IA identificou esta exigência no edital, mas não conseguiu extrair o valor. Clique para informar o valor requerido.">Valor não extraído</span></td>`
        : `<td class="col-val${fzCls(c)}"${fzStyle(c)}><span class="editable" data-edit="vr" data-ri="${ri}" contenteditable="true" data-tip="Clique para corrigir o valor exigido">${esc(spec.exig)}</span></td>`;
      else if (c.key === "acoes") row += `<td class="col-acoes"><div class="acoes-cell"><button class="act-ico danger" data-delreq="${ri}" data-tip="Excluir este requisito">${ICO_TRASH}</button><button class="act-ico" data-origin="${ri}" data-tip="${nx ? "Não conseguimos extrair essa informação. Selecione um trecho para extrair o dado." : "Vincular / ver fonte no edital"}">${ICO_LINK}</button></div></td>`;
      else if (nx) row += `<td class="cell nm-cell${fzCls(c)}"${fzStyle(c)}><div class="cell-line"><span class="ico-nm" data-tip="Valor do produto disponível, mas ainda sem correspondência: não conseguimos extrair a exigência do edital">${ICO_ALERT}</span><span class="cell-val">${esc(spec.cells[c.skuIdx].v)}</span></div></td>`;
      else row += cellTd(spec.cells[c.skuIdx], ri, c.skuIdx, spec.exigNa, c);
    });
    body += row + `</tr>`;
  });
  host.innerHTML = `<div class="table-wrap"><table class="cmp" style="width:${totalW}px">${colgroup}<thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>
    <div class="add-req" id="addReq" data-tip="Adicionar um requisito que a IA não extraiu">${ICO_PLUS} Adicionar requisito</div>`;
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
  const prodComp = it.componentes.find(comp => comp.mecanica === "produto");
  if (prodComp) {
    const naoExigidas = [...matrixOf(prodComp).filter(s => s.exigNa).map(s => s.req), ...(prodComp.catalogoNaoEdital || [])];
    if (naoExigidas.length) html += collapsible("Especificações não exigidas pelo edital", tagList(naoExigidas, ""), null);
  }
  return `<div class="to-collapsibles">${html}</div>`;
}

/* ---------- Mecânica: checklist (serviço / software) ---------- */
function renderChecklist(host, clArr, sec) {
  if (!host) return;
  const rows = clArr.map((r, ri) => {
    const st = CL_ST[r.st] || CL_ST.ne;
    return `<tr>
      <td class="c-check"><span class="cbox"></span></td>
      <td class="c-req"><div class="req-name">${esc(r.req)}</div><div class="req-exig">Exigido: <span class="val">${esc(r.exig)}</span></div><div class="cl-actions"><button class="req-origin" data-clorigin="${sec}:${ri}" data-tip="Ver de onde a IA extraiu (página e trecho)">${ICO_ARROW} Ver no edital · p.${r.origem.pag}</button><button class="req-origin" data-clquestion="${sec}:${ri}" data-tip="Questionar / impugnar este requisito">${ICO_CHAT} Questionar</button></div></td>
      <td><span class="badge soft">${esc(r.modulo || "—")}</span></td>
      <td><button class="badge ${st.cls} clickable-badge" data-clstatus="${sec}:${ri}" data-tip="Clique para alternar o status">${st.ico}${st.label}</button></td>
      <td>${confBadge(r.c)}</td>
      <td class="c-just">${esc(r.just || "—")}</td>
      <td><span class="badge soft with-avatar">Selecionar</span></td>
    </tr>`;
  }).join("");
  host.innerHTML = `<div class="dt-wrap"><table class="dt"><thead><tr><th class="c-check"><span class="cbox"></span></th><th class="c-req">Requisito</th><th>Módulo</th><th>Status</th><th>Confiança IA</th><th class="c-just">Justificativa IA</th><th>Responsável</th></tr></thead><tbody>${rows}</tbody></table><div class="dt-foot" data-addcl="${sec}">${ICO_PLUS} Adicionar requisito</div></div>`;
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
  if (kind === "r") { spec.req = txt || "Requisito"; return; }
  if (kind === "vr") {
    if (spec.exigNa) return;
    const wasMissing = spec.naoExtraido;
    spec.exig = txt;
    if (!txt) return;
    if (wasMissing) spec.naoExtraido = false;
    rematchRow(spec); recompute(); renderMatrix();
    toast(wasMissing ? `Valor requerido informado para "${spec.req}" — atendimento recalculado` : `Exigência atualizada — atendimento recalculado`);
    return;
  }
  if (kind === "v") {
    const cc = spec.cells[+el.dataset.ci]; cc.v = txt || "—"; cc.c = "alta";
    if (!spec.exigNa && spec.exig && !spec.naoExtraido) cc.st = evalCell(cc.v, spec.exig);
    recompute(); renderMatrix();
  }
}
function addReq() {
  SPECS.push({ req: "Novo requisito", exig: "", exigNa: false, added: true, origem: { doc: "Inserido manualmente", pag: "—" }, cells: MX_SKUS.map(() => ({ st: "ne", v: "—" })) });
  renderMatrix();
  const rows = $("#matrixHost").querySelectorAll("tbody tr"); const nameEl = rows[rows.length - 1]?.querySelector('[data-edit="r"]');
  if (nameEl) { nameEl.focus(); document.getSelection().selectAllChildren(nameEl); }
}
const CL_CYCLE = { ok: "no", no: "parcial", parcial: "ne", ne: "ok" };
function toggleClStatus(sec, ri) { const r = currentChecklists[sec][ri]; r.st = CL_CYCLE[r.st] || "ok"; renderChecklist($("#clHost-" + sec), currentChecklists[sec], sec); }
function addClReq(sec) { currentChecklists[sec].push({ req: "Novo requisito", exig: "", modulo: "—", st: "ne", c: null, just: "—", origem: { doc: "Inserido manualmente", pag: "—" } }); renderChecklist($("#clHost-" + sec), currentChecklists[sec], sec); }

/* ============================================================
   Wire
   ============================================================ */
function wire() {
  $("#filterTabs").addEventListener("click", e => { const b = e.target.closest("[data-filter]"); if (b) { statusFilter = b.dataset.filter; prefs.filter = statusFilter; savePrefs(); renderGrid(); } });
  $("#cardGrid").addEventListener("click", e => { const c = e.target.closest("[data-item]"); if (c) openTable(+c.dataset.item); });

  $("#toClose").onclick = closeTable;
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
    const ch = e.target.closest("[data-choose]"); if (ch) { const i = +ch.dataset.choose; prefs.chosen[active] = (prefs.chosen[active] === i) ? undefined : i; if (prefs.chosen[active] == null) delete prefs.chosen[active]; savePrefs(); renderMatrix(); toast(prefs.chosen[active] != null ? `Produto escolhido: ${MX_SKUS[i].model}` : "Seleção removida"); return; }
    const or = e.target.closest("[data-origin]"); if (or) { const ri = +or.dataset.origin; openOriginSpec(SPECS[ri], ri); return; }
    const dl = e.target.closest("[data-delreq]"); if (dl) { const ri = +dl.dataset.delreq; const nm = SPECS[ri].req; SPECS.splice(ri, 1); recompute(); renderMatrix(); toast(`Requisito removido: "${nm}"`); return; }
    const q = e.target.closest("[data-question]"); if (q) { toast(`Abrindo questionamento/impugnação — "${SPECS[+q.dataset.question].req}" (referente ao edital)`); return; }
    if (e.target.closest("#addReq")) { addReq(); return; }
    const cs = e.target.closest("[data-clstatus]"); if (cs) { const [s, r] = cs.dataset.clstatus.split(":").map(Number); toggleClStatus(s, r); return; }
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
  document.addEventListener("keydown", e => { if (e.key === "Escape") { if (!$("#drawer").hidden) closeOrigin(); else if (!$("#tableOverlay").hidden) closeTable(); } });
}

/* ============================================================
   Editar informações (lado a lado com o edital) + vincular fonte
   ============================================================ */
const LINK_SVG = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 9.5l3-3M5 8L3.5 9.5a2.1 2.1 0 0 0 3 3L8 11M11 8l1.5-1.5a2.1 2.1 0 0 0-3-3L8 5"/></svg>`;
let editList = [], esActive = null, pendingText = null, pendingRange = null;
function currentReqList() { if (SPECS) return SPECS.filter(s => !s.exigNa); if (currentChecklists.length) return currentChecklists[0]; return []; }
function renderEsFields() {
  $("#esFields").innerHTML = editList.map((s, i) => `
    <div class="es-field ${i === esActive ? "active" : ""}" data-ef="${i}">
      <label>${esc(s.req)}</label>
      <input class="inp" value="${esc(s.exig || "")}" placeholder="Informe o valor esperado" data-eival="${i}">
      <button class="es-link ${s.fonte ? "linked" : ""}" data-eilink="${i}">${LINK_SVG} ${s.fonte ? "Fonte vinculada" : "Vincular fonte no edital"}</button>
    </div>`).join("");
}
function openEditSheet() {
  editList = currentReqList();
  if (!editList.length) { toast("Nada para editar neste item"); return; }
  esActive = null; pendingText = null;
  $("#esDesc").textContent = ITEMS[active].nome;
  $("#esDoc").innerHTML = esc(EDITAL.docTexto);
  $("#esDocHint").textContent = "Selecione um trecho para vincular como fonte";
  renderEsFields();
  $("#editSheet").hidden = false;
}
function hidePopover() { $("#fontePopover").hidden = true; pendingText = null; pendingRange = null; }
function saveEditSheet() {
  if (SPECS) { recompute(); if ($("#matrixHost")) renderMatrix(); }
  else currentChecklists.forEach((c, i) => renderChecklist($("#clHost-" + i), c, i));
  $("#editSheet").hidden = true; hidePopover();
  toast("Análise de compatibilidade atualizada com os novos dados");
}
function initEditSheet() {
  $("#toEdit").onclick = openEditSheet;
  $("#esClose").onclick = () => { $("#editSheet").hidden = true; hidePopover(); };
  $("#esSave").onclick = saveEditSheet;
  $("#esFields").addEventListener("input", e => { const el = e.target.closest("[data-eival]"); if (el) editList[+el.dataset.eival].exig = el.value; });
  $("#esFields").addEventListener("click", e => {
    const lk = e.target.closest("[data-eilink]"); if (!lk) return;
    esActive = +lk.dataset.eilink; renderEsFields();
    $("#esDocHint").textContent = `Selecione no edital o trecho que comprova: "${editList[esActive].req}"`;
  });
  $("#esDoc").addEventListener("mouseup", () => {
    const sel = window.getSelection(), txt = sel.toString().trim();
    if (!txt || esActive == null || !$("#esDoc").contains(sel.anchorNode)) { hidePopover(); return; }
    pendingText = txt; pendingRange = sel.getRangeAt(0).cloneRange();
    const r = sel.getRangeAt(0).getBoundingClientRect(), pop = $("#fontePopover");
    pop.hidden = false;
    pop.style.top = Math.max(8, r.top - pop.offsetHeight - 8) + "px";
    pop.style.left = Math.max(8, Math.min(r.left + r.width / 2 - pop.offsetWidth / 2, innerWidth - pop.offsetWidth - 8)) + "px";
  });
  $("#fontePopover").addEventListener("click", e => {
    const b = e.target.closest("[data-fonte]"); if (!b) return;
    if (b.dataset.fonte === "confirm" && pendingText != null && esActive != null) {
      editList[esActive].fonte = pendingText;
      try { const m = document.createElement("mark"); m.className = "bound"; pendingRange.surroundContents(m); } catch (_) { }
      renderEsFields(); toast(`Fonte vinculada: "${editList[esActive].req}"`);
    }
    window.getSelection().removeAllRanges(); hidePopover();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#editSheet").hidden) { $("#editSheet").hidden = true; hidePopover(); } });
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
    { before: ensureGrid, sel: ".item-card:nth-child(2) .ic-reco", title: "O quanto você atende, sem abrir", text: "Quando o item não atende, o card mostra o quanto o melhor produto atende (ex.: 385 de 400 requisitos), sem listar tudo. O detalhe por produto e por requisito fica na tabela, ao abrir." },
    { before: ensureMisto, sel: ".comp-head", title: "Um item pode ter várias seções", text: "Ao abrir, o item se divide em seções (produto, licença, garantia, serviço), cada uma com a sua análise. Item simples tem só uma seção." },
    { before: ensureMisto, sel: ".best-tag", title: "Comparação de produtos", text: "Na seção de produto, comparamos os SKUs do seu catálogo com a exigência do edital e recomendamos o que mais atende." },
    { before: ensureMisto, sel: ".val-missing", title: "Valor não extraído", text: "Quando a IA não achou a exigência no edital, marcamos aqui. O ícone ao lado do requisito abre o arquivo para você selecionar o trecho e extrair o valor." },
    { before: ensureMisto, sel: ".cell-val.editable", title: "Você corrige, o sistema recalcula", text: "O valor de cada produto é editável. Ao alterar, o atendimento (atende / não atende) é recalculado automaticamente pelo sistema." },
    { before: ensureMisto, sel: ".sku-select", title: "Escolha o produto da proposta", text: "Quando decidir, selecione o SKU que vai para a proposta. É o encerramento do fluxo de análise do item." },
    { before: ensureGrid, title: "Pronto!", text: "Esse é o fluxo: entender o item, ver o que falta, corrigir e escolher o produto. Você pode refazer o tour quando quiser pelo botão no canto inferior direito." },
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
renderGrid(); wire(); initEditSheet(); initTooltip(); initTour();
