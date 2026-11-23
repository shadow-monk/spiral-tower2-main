// ==================================================================
// 🎒 item.js: 新規アイテム管理システム（拡張アーティファクト）
// ==================================================================
// 【目次】
// 【１】新規アイテム定義リスト（トト神の羽根ペン 他）
// 【２】アイテム効果実行ハンドラ（onUse）
// 【３】外部システム連携・初期化（初期所持＆キャンプ統合）
// ==================================================================


// ==================================================================
// 【１．1】新規アイテム定義リスト　アーティファクト
// ==================================================================
window.EXTRA_CAMP_ITEMS = [
    /* 01 */ { id: 'quill',      name: "トト神の羽根ペン", icon: "🪶", desc: "進行状況を虚空に記録・保存する", bg: "#6366f1", isKeyItem: true },
    /* 02 */ { id: 'warp',       name: "ワープロッド",     icon: "🪄", desc: "到達済みの階層へ時空転移する",   bg: "#ec4899", isKeyItem: true },
    /* 03 */ { id: 'apple_wis',  name: "知恵のリンゴ",     icon: "🍎", desc: "1回限定：知力(INT)が15%アップ",     bg: "#dc2626", isKeyItem: false },

    /* 03 */ { id: 'hi_potion',  name: "ハイポーション",   icon: "🧪", desc: "最大HPの50%を即座に回復",          bg: "#059669", isKeyItem: false },
    /* 04 */ { id: 'mana_crys',  name: "魔力水晶",       icon: "💎", desc: "最大MPの50%を即座に回復",          bg: "#2563eb", isKeyItem: false },
    /* 05 */ { id: 'water_life', name: "命の水",           icon: "💧", desc: "基礎最大HPを永久に20%上昇",        bg: "#0284c7", isKeyItem: false },
    /* 06 */ { id: 'hermes_bts', name: "ヘルメスの靴",     icon: "👟", desc: "戦闘中から瞬時に安全脱出する",      bg: "#d97706", isKeyItem: false },
    /* 07 */ { id: 'mage_cloak', name: "魔導士のマント",   icon: "🧥", desc: "常時効果：被ダメージを10%軽減",    bg: "#475569", isKeyItem: true },
    /* 08 */ { id: 'mage_hat',   name: "魔術学士の帽子",   icon: "🎓", desc: "常時効果：最大MPが20%アップ",       bg: "#7c3aed", isKeyItem: true }
];

// ==================================================================
// 【１．2】新規アイテム定義リスト
// ==================================================================
// ==================================================================
// 【２】新規スタンダードアイテム（1行目：基本情報 / 2行目：実行ハンドラ込み）
// ==================================================================
window.NEW_ITEMS = [
    /* 01 */ { id: 'new_potion', name: "ポーション",     icon: "🧪", desc: "最大HPの30%を回復",             bg: "#10b981",
               run: (mode) => { if (mode === 'battle' && window.playerNoHealTurns > 0) { if (typeof playSE === 'function') playSE(SOUND_ICE); return "🧪 ポーションを飲んだが、毒血の呪縛が拒絶しHPが【0】しか回復しない！"; } const v = Math.max(1, Math.floor((window.pMaxHp || 100) * 0.30)); window.pHp = Math.min(window.pMaxHp, window.pHp + v); if (typeof playSE === 'function') playSE(SOUND_HOLY); const pg = document.getElementById('p-sprite-graphic'); if (pg) { pg.classList.add('heal-green-anim'); setTimeout(() => pg.classList.remove('heal-green-anim'), 700); } return `🧪 ポーションを飲み干した！HPが ${v}（最大HPの30%）回復した！`; } },

    /* 02 */ { id: 'new_mana',   name: "魔力の結晶",     icon: "🔷", desc: "最大MPの30%を回復",             bg: "#3b82f6",
               run: (mode) => { const v = Math.max(1, Math.floor((window.pMaxMp || 50) * 0.30)); window.pMp = Math.min(window.pMaxMp, window.pMp + v); if (typeof playSE === 'function') playSE(SOUND_HOLY); const pg = document.getElementById('p-sprite-graphic'); if (pg) { pg.classList.add('heal-blue-anim'); setTimeout(() => pg.classList.remove('heal-blue-anim'), 700); } return `🔷 魔力の結晶を砕いた！MPが ${v}（最大MPの30%）回復した！`; } },

    /* 03 */ { id: 'harpy_wing', name: "ハーピーの羽根", icon: "🪶", desc: "戦闘:エアロ効果 / 野営:風を起す", bg: "#06b6d4",
               run: (mode) => { if (typeof playSE === 'function') playSE(SOUND_WIND); if (mode !== 'battle') { window.campWindTriggered = true; return "🪶 ハーピーの羽根を掲げた！踊り場に激しい旋風が巻き起こった……！（風イベント判定発生）"; } const eff = document.getElementById('eff-scr'); if (eff) { const f = document.createElement('div'); f.innerText = "🪶"; f.style.cssText = "position:absolute;left:18%;top:48%;font-size:2.4rem;z-index:9999;pointer-events:none;transition:all 0.45s cubic-bezier(0.2,0.8,0.3,1);filter:drop-shadow(0 0 8px #38bdf8);"; eff.appendChild(f); requestAnimationFrame(() => { f.style.left = "72%"; f.style.top = "38%"; f.style.transform = "rotate(540deg) scale(1.3)"; }); setTimeout(() => { f.remove(); eff.className = "anim-player-aero"; setTimeout(() => eff.className = "", 600); }, 420); } const d = (window.STAGES && window.STAGES[window.curIdx]) || (typeof getStageData === 'function' ? getStageData(window.curIdx + 1) : {}) || {}, intB = 1 + Math.log10(((window.pSavedStats && window.pSavedStats.int) || 18) / 18), res = Array.isArray(d.resist) && d.resist.includes('aero'), wk = !res && Array.isArray(d.weak) && d.weak.includes('aero'); let dmg = res ? 0 : Math.floor(18 * intB * (0.8 + Math.random() * 0.4) * (wk ? 2.2 : 1)); if (window.isIronIronShieldActive) dmg = 1; window.isEnemyShieldActive = false; window.eHp = Math.max(0, window.eHp - dmg); if (typeof createDmgPop === 'function') createDmgPop(dmg, false); if (typeof updateHpUI === 'function') updateHpUI(); return `🪶 ハーピーの羽根を放った！鋭い真空の刃（エアロ）が吹き荒れ、${res ? "【耐性】" : (wk ? "【弱点！】" : "")}敵に ${dmg} の風ダメージ！`; } },

    /* 04 */ { id: 'mana_bomb',  name: "魔導爆弾",       icon: "💣", desc: "戦闘:最大MP(±5%)のダメージ",     bg: "#ef4444",
               run: (mode) => { if (mode !== 'battle') { if (typeof playSE === 'function') playSE(SOUND_KICK); return "💣 魔導爆弾を取り出して構えてみたが……ここでは何も起きなかった。"; } let dmg = Math.max(1, Math.floor((window.pMaxMp || 50) * (0.95 + Math.random() * 0.10))); if (window.isIronIronShieldActive) dmg = 1; window.eHp = Math.max(0, window.eHp - dmg); if (typeof playSE === 'function') playSE(SOUND_WIND); const b = document.getElementById('sq-board'), pc = document.getElementById('p-sprite-container'), ec = document.getElementById('e-sprite-container'), eg = document.getElementById('e-sprite-graphic') || ec, pr = pc ? pc.getBoundingClientRect() : null, er = ec ? ec.getBoundingClientRect() : null, x1 = pr && pr.width > 0 ? pr.left + pr.width * 0.65 : window.innerWidth * 0.25, y1 = pr && pr.height > 0 ? pr.top + pr.height * 0.48 : window.innerHeight * 0.5, x2 = er && er.width > 0 ? er.left + er.width * 0.5 : window.innerWidth * 0.72, y2 = er && er.height > 0 ? er.top + er.height * 0.45 : window.innerHeight * 0.44, el = document.createElement('div'); el.textContent = "💣"; el.style.cssText = `position:fixed;left:${x1}px;top:${y1}px;font-size:44px;z-index:100008;pointer-events:none;transition:left 420ms cubic-bezier(0.2,0.85,0.35,1),top 420ms cubic-bezier(0.2,0.85,0.35,1),transform 420ms linear,opacity 0.14s ease-out;transform:translate(-50%,-50%) rotate(0deg) scale(0.95);opacity:1;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.75));`; document.body.appendChild(el); void el.offsetWidth; el.style.left = `${x2}px`; el.style.top = `${y2}px`; el.style.transform = `translate(-50%,-50%) rotate(720deg) scale(1.4)`; setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 150); if (typeof playSE === 'function') playSE(SOUND_FIRE); if (typeof createDmgPop === 'function') createDmgPop(dmg, false); if (typeof updateHpUI === 'function') updateHpUI(); [{ ox: 0, oy: 0, sz: 150, d: 0 }, { ox: -28, oy: -22, sz: 115, d: 75 }, { ox: 26, oy: 18, sz: 125, d: 145 }, { ox: -16, oy: 24, sz: 105, d: 210 }].forEach(bt => setTimeout(() => { const ex = document.createElement('div'); ex.style.cssText = `position:fixed;left:${x2 + bt.ox}px;top:${y2 + bt.oy}px;width:${bt.sz}px;height:${bt.sz}px;border-radius:50%;background:radial-gradient(circle,#fee2e2 0%,#ef4444 38%,#dc2626 68%,rgba(185,28,28,0) 100%);border:3px solid #fca5a5;box-shadow:0 0 28px #ef4444,0 0 48px #dc2626;z-index:100009;pointer-events:none;transform:translate(-50%,-50%) scale(0.15);opacity:1;transition:transform 0.28s cubic-bezier(0.1,0.9,0.2,1),opacity 0.28s ease-out;`; document.body.appendChild(ex); void ex.offsetWidth; ex.style.transform = "translate(-50%,-50%) scale(1.25)"; ex.style.opacity = "0"; setTimeout(() => ex.remove(), 300); }, bt.d)); if (eg) { eg.style.transition = "transform 0.08s ease-out,filter 0.1s"; eg.style.transform = "translateX(16px) rotate(8deg)"; eg.style.filter = "brightness(2) sepia(1) hue-rotate(-50deg) saturate(6)"; setTimeout(() => { eg.style.transition = "transform 0.26s ease-out,filter 0.26s"; eg.style.transform = "translateX(0) rotate(0deg)"; eg.style.filter = ""; }, 280); } if (b) { b.style.transition = "none"; b.style.transform = "translate(9px,7px)"; setTimeout(() => { b.style.transition = "transform 0.16s ease-out"; b.style.transform = "translate(0,0)"; setTimeout(() => { b.style.transform = ""; b.style.transition = ""; }, 170); }, 75); } }, 420); return `💣 魔導爆弾を投げつけた！着弾と同時に魔力炉が大爆発！！最大MPに比例した ${dmg} の固定ダメージ！`; } },
/* 05 */ { id: 'salted_meat', name: "塩漬け肉",       icon: "🥓", desc: "HPを10回復",                     bg: "#d97706",
               run: (mode) => { if (mode === 'battle' && window.playerNoHealTurns > 0) { if (typeof playSE === 'function') playSE(SOUND_ICE); return "🥓 塩漬け肉をかじったが、毒血の呪縛が拒絶しHPが【0】しか回復しない！"; } window.pHp = Math.min(window.pMaxHp, window.pHp + 10); if (typeof playSE === 'function') playSE(SOUND_HOLY); const pg = document.getElementById('p-sprite-graphic'); if (pg) { pg.classList.add('heal-green-anim'); setTimeout(() => pg.classList.remove('heal-green-anim'), 700); } return "🥓 塩漬け肉をかじった！程よい塩気が体に染み渡り、HPが 10 回復した！"; } },

    /* 06 */ { id: 'new_hipotion',name: "ハイポーション", icon: "🧪", desc: "最大HPの50%を回復",             bg: "#059669",
               run: (mode) => { if (mode === 'battle' && window.playerNoHealTurns > 0) { if (typeof playSE === 'function') playSE(SOUND_ICE); return "🧪 ハイポーションを飲んだが、毒血の呪縛が拒絶しHPが【0】しか回復しない！"; } const v = Math.max(1, Math.floor((window.pMaxHp || 100) * 0.50)); window.pHp = Math.min(window.pMaxHp, window.pHp + v); if (typeof playSE === 'function') playSE(SOUND_HOLY); const pg = document.getElementById('p-sprite-graphic'); if (pg) { pg.classList.add('heal-green-anim'); setTimeout(() => pg.classList.remove('heal-green-anim'), 700); } return `🧪 ハイポーションを飲み干した！濃い生命の霊薬が傷を癒やし、HPが ${v}（最大HPの50%）回復した！`; } },

    /* 07 */ { id: 'new_manacrys',name: "魔力の水晶",     icon: "💎", desc: "最大MPの50%を回復",             bg: "#2563eb",
               run: (mode) => { const v = Math.max(1, Math.floor((window.pMaxMp || 50) * 0.50)); window.pMp = Math.min(window.pMaxMp, window.pMp + v); if (typeof playSE === 'function') playSE(SOUND_HOLY); const pg = document.getElementById('p-sprite-graphic'); if (pg) { pg.classList.add('heal-blue-anim'); setTimeout(() => pg.classList.remove('heal-blue-anim'), 700); } return `💎 魔力の水晶を掲げて魔力を吸収した！MPが ${v}（最大MPの50%）回復した！`; } },

    /* 08 */ { id: 'new_bone',    name: "骨",             icon: "🦴", desc: "戦闘:10ダメ(ウルフ系は3T夢中)",  bg: "#78716c",
               run: (mode) => { if (mode !== 'battle') { if (typeof playSE === 'function') playSE(SOUND_KICK); return "🦴 骨を取り出して眺めてみた。……ここでは特に使い道がないようだ。"; } const d = (window.STAGES && window.STAGES[window.curIdx]) || (typeof getStageData === 'function' ? getStageData(window.curIdx + 1) : {}) || {}, isWolf = d.type === 'warewolf' || /ウルフ|ハウンド|ファング/.test(d.name || ""); if (typeof playSE === 'function') playSE(SOUND_WIND); const pc = document.getElementById('p-sprite-container'), ec = document.getElementById('e-sprite-container'), pr = pc ? pc.getBoundingClientRect() : null, er = ec ? ec.getBoundingClientRect() : null, x1 = pr && pr.width > 0 ? pr.left + pr.width * 0.65 : window.innerWidth * 0.25, y1 = pr && pr.height > 0 ? pr.top + pr.height * 0.48 : window.innerHeight * 0.5, x2 = er && er.width > 0 ? er.left + er.width * 0.5 : window.innerWidth * 0.72, y2 = er && er.height > 0 ? er.top + er.height * 0.58 : window.innerHeight * 0.5, el = document.createElement('div'); el.textContent = "🦴"; el.style.cssText = `position:fixed;left:${x1}px;top:${y1}px;font-size:38px;z-index:100008;pointer-events:none;transition:left 380ms cubic-bezier(0.2,0.85,0.35,1),top 380ms cubic-bezier(0.2,0.85,0.35,1),transform 380ms linear,opacity 0.18s;transform:translate(-50%,-50%) rotate(0deg);opacity:1;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.75));`; document.body.appendChild(el); void el.offsetWidth; el.style.left = `${x2}px`; el.style.top = `${y2}px`; el.style.transform = `translate(-50%,-50%) rotate(${isWolf ? 520 : 720}deg)`; if (isWolf) { window.enemySleepTurns = 3; if (window.enemyStatus) window.enemyStatus.sleepTurns = 3; setTimeout(() => { el.remove(); if (typeof playSE === 'function') playSE(SOUND_HOLY); const oldB = document.getElementById('enemy-wolf-bone'); if (oldB) oldB.remove(); if (ec) { ec.style.position = ec.style.position || 'relative'; const prop = document.createElement('div'); prop.id = 'enemy-wolf-bone'; prop.textContent = "🦴"; prop.style.cssText = "position:absolute;left:32%;bottom:6%;font-size:38px;z-index:10007;pointer-events:none;transform:rotate(-18deg);filter:drop-shadow(0 0 10px #fde047);"; ec.appendChild(prop); const syncBone = () => { const bEl = document.getElementById('enemy-wolf-bone'); if (!bEl) return; if ((window.enemySleepTurns || 0) <= 0 || (window.eHp || 0) <= 0 || (window.pHp || 0) <= 0) bEl.remove(); }; if (!window._wolfBoneHooked) { window._wolfBoneHooked = true; const origB = window.updateStatusBadgesUI; if (typeof origB === 'function') window.updateStatusBadgesUI = function() { const r = origB.apply(this, arguments); syncBone(); return r; }; } } }, 380); return `🦴 骨を投げた！${d.name || "ウルフ"}は骨に夢中にかじりつき、ウトウトしだした！（３Tウトウト！睡魔に襲われている）`; } let dmg = window.isIronIronShieldActive ? 1 : 10; window.eHp = Math.max(0, window.eHp - dmg); setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 180); if (typeof playSE === 'function') playSE(SOUND_KICK); if (typeof createDmgPop === 'function') createDmgPop(dmg, false); if (typeof updateHpUI === 'function') updateHpUI(); }, 380); return `🦴 骨を思いきり投げつけた！ゴツンと命中し、敵に ${dmg} のダメージ！`; } },

    /* 09 */ { id: 'red_mushroom',name: "赤キノコ",       icon: "🍄", desc: "HPを10回復",                     bg: "#dc2626",
               run: (mode) => { if (mode === 'battle' && window.playerNoHealTurns > 0) { if (typeof playSE === 'function') playSE(SOUND_ICE); return "🍄 赤キノコを食べたが、毒血の呪縛が拒絶しHPが【0】しか回復しない！"; } window.pHp = Math.min(window.pMaxHp, window.pHp + 10); if (typeof playSE === 'function') playSE(SOUND_HOLY); const pg = document.getElementById('p-sprite-graphic'); if (pg) { pg.classList.add('heal-green-anim'); setTimeout(() => pg.classList.remove('heal-green-anim'), 700); } return "🍄 赤キノコを食べた！ほんのり甘い胞子が広がり、HPが 10 回復した！"; } }
];


// ==================================================================
// 【２】アイテム効果実行ハンドラ
// ==================================================================
window.executeExtraItemEffect = function(itemId, context = 'camp') {
    if (itemId === 'quill') { if (typeof window.openSavePasswordModal === 'function') window.openSavePasswordModal(); return { handled: true, consumed: false, msg: "冒険の記録を開いた。" }; }
    if (itemId === 'warp')  { if (typeof window.executeCampWarp === 'function') window.executeCampWarp(); return { handled: true, consumed: false, msg: "時空転移の魔導陣を開いた。" }; }
    const item = window.NEW_ITEMS.find(i => i.id === itemId);
    if (!item) return false;
    window.itemInventory[itemId]--;
    return { handled: true, consumed: true, msg: item.run(context) };
};

// ==================================================================
// 【４】初期所持登録
// ==================================================================
window.itemInventory = window.itemInventory || {};
window.itemInventory['quill']        = 1;
window.itemInventory['warp']         = 1;
window.itemInventory['new_potion']   = 1;
window.itemInventory['new_mana']     = 1;
window.itemInventory['mana_bomb']    = 1;
