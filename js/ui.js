// ==================================================================
// 📺 1. 画面表示切り替え・UI制御ロジック（白フリーズ・不透明度完全クリーンアップ版）
// ==================================================================
console.log("%c🎨 [UI SYSTEMS] Ver 7.60: コマンドの真っ白遮断バグを完全粉砕し、23呪文＆20アイテムの所持数配線を全開通しました。", "color: #00ffff; font-weight: bold;");

/**
 * スタート・導入・バトル・リザルトの各画面（div）を表示制御する関数
 */
function showScreen(screenId) {
    ['scr-start', 'scr-intro', 'scr-battle', 'scr-result'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === screenId) ? 'block' : 'none';
    });
}

/**
 * プレイヤーと敵のHPバーおよび文字表記を最新値に更新する関数
 */
function updateHpUI() {
    if (curIdx < 0) return;
    let pPct = Math.max(0, (pHp / pMaxHp) * 100); 
    let ePct = Math.max(0, (eHp / eMaxHp) * 100);
    
    const pBar = document.getElementById('p-hp-bar');
    const eBar = document.getElementById('e-hp-bar');
    if (pBar) pBar.style.width = `${pPct}%`; 
    if (eBar) eBar.style.width = `${ePct}%`;
    
    const pTxt = document.getElementById('p-hp-txt');
    const eTxt = document.getElementById('e-hp-txt');
    if (pTxt) pTxt.innerText = `HP: ${pHp} / ${pMaxHp}`; 
    if (eTxt) eTxt.innerText = `HP: ${eHp} / ${eMaxHp}`;
}

/**
 * 🎯【透過式・ダメージポップアップ回路】
 */
function createDmgPop(dmg, isPlayer) {
    const pContainer = document.getElementById("p-sprite-container");
    const eContainer = document.getElementById("e-sprite-container");
    const targetContainer = isPlayer ? pContainer : eContainer;
    const timeoutKey = isPlayer ? "_pPopTimeout" : "_ePopTimeout";
    const layerKey = isPlayer ? "_pDmgLabel" : "_eDmgLabel";

    if (!targetContainer) return;
    targetContainer.style.position = "relative";

    if (!window[layerKey]) {
        window[layerKey] = document.createElement("div");
        window[layerKey].style.position = "absolute";
        window[layerKey].style.fontWeight = "900";
        window[layerKey].style.textShadow = "3px 3px 0 #000";
        window[layerKey].style.zIndex = "999";
        window[layerKey].style.pointerEvents = "none"; // クリック透過
        window[layerKey].style.width = "100%";
        window[layerKey].style.textAlign = "center";
        window[layerKey].style.left = "0";
        window[layerKey].style.top = "-40px"; 
        targetContainer.appendChild(window[layerKey]);
    }

    const currentLayer = window[layerKey];
    
    // ⏳ 🏆 【足し算回復：ダメージポップの多重タイマー安全破棄】
    // 連続でポップアップが発生した際に古いタイマーを破棄し、表示時間が狂う不具合を根絶します！
    if (window[timeoutKey]) clearTimeout(window[timeoutKey]);

    currentLayer.innerText = isPlayer ? `-${dmg}` : dmg; 
    currentLayer.style.fontSize = isPlayer ? "3.2rem" : "3.6rem"; 
    currentLayer.style.color = isPlayer ? "#ef4444" : "#ffffff"; 
    currentLayer.style.opacity = "1";
    currentLayer.style.display = "block";

    window[timeoutKey] = setTimeout(() => {
        currentLayer.style.opacity = "0";
        currentLayer.style.display = "none";
    }, 800);
}

// ==========================================
// 🔮 2. 呪文スロット（メイン下トグル変形）制御ロジック
// ==========================================

/**
 *
 * 🔮 呪文ボタンエリアを展開（A面を隠し、B面スクロール呪文をカバンの所持状態と同期して点灯！）
 */
function openMagicBag() {
    if (window.isBusy || pHp <= 0 || eHp <= 0) return;

    // 💡【新・11大選抜＆所持呪文フィルター】
    // HTML上にあるすべての呪文ボタン（ボタンのonclick属性の文字）をスキャン！
    // プレイヤーが現在実際に覚えている呪文（window.playerSpells）だけを表示させます。
    const allSpells = ['fire', 'wasp2', 'scis', 'scre', 'wasp', 'flod', 'quak', 'drai', 'mete', 'come', 'ulti', 'ice', 'holy', 'def', 'refl', 'wisp', 'mmis', 'flas', 'slow', 'slee', 'dead', 'aero', 'grav', 'anal', 'ele'];
    
   const ban = (typeof window.getAreaConfig === 'function' ? window.getAreaConfig((window.curIdx || 0) + 1).ban : []) || [];
    allSpells.forEach(key => { const btn = document.querySelector(`button[onclick="turn('${key}')"]`); if (!btn) return; const ok = (window.playerSpells && window.playerSpells.includes(key)) || window.isDebugUnlocked === true, lv = (window.spellLevels && window.spellLevels[key]) || 1, sp = (typeof SPELLS !== 'undefined' && SPELLS[key]) || {}, nm = sp.name || key, ic = sp.icon ? sp.icon + ' ' : '', isBan = ban.includes(key); btn.style.display = ok ? "block" : "none"; btn.disabled = isBan; btn.style.opacity = isBan ? "0.45" : "1"; btn.style.cursor = isBan ? "not-allowed" : "pointer"; btn.textContent = isBan ? `🚫 ${nm} (無効)` : `${ic}${nm} Lv.${lv}`; });


    const mainPanel = document.getElementById('panel-main-mode');
    const magicPanel = document.getElementById('panel-magic-mode');
    
    if (mainPanel) mainPanel.style.display = 'none';
    if (magicPanel) magicPanel.style.display = 'block';
}

/**
 * ↩️ 行動選択に戻る
 */
function closeMagicBag() {
    const mainPanel = document.getElementById('panel-main-mode');
    const magicPanel = document.getElementById('panel-magic-mode');
    
    if (magicPanel) magicPanel.style.display = 'none';
    if (mainPanel) mainPanel.style.display = 'block';
}

// ==========================================
// 🎒 3. 大容量アイテムバッグUI・全開通制御ロジック
// ==========================================

/**
 /**
 * 🎒 大容量アイテムバッグUI・所持アイテム限定表示フィルター版
 */
function openItemBag() { 
    if (window.isBusy || pHp <= 0 || eHp <= 0) return;

    // 🧹 旧アイテム20種のHTMLスロットは所持数に関わらず常に非表示にする
    const oldIds = ['potion', 'amulet', 'elix', 'bomb', 'cure', 'hour', 'whet', 'mirr', 'mana', 'scro', 'smok', 'wing', 'web', 'bone', 'ston', 'cand', 'jewe', 'hone', 'spor', 'scal'];
    oldIds.forEach(id => {
        const el = document.getElementById(`item-slot-${id}`);
        if (el) el.style.display = "none";
    });

    // 🌟 新規アイテム（item.js の NEW_ITEMS）のみを戦闘バッグに動的表示
    const refSlot = document.getElementById('item-slot-potion') || document.getElementById('item-bag-panel');
    const slotParent = refSlot ? (refSlot.id === 'item-bag-panel' ? refSlot : refSlot.parentNode) : null;
    if (slotParent && Array.isArray(window.NEW_ITEMS)) {
        window.NEW_ITEMS.forEach(item => {
            let btn = document.getElementById(`item-slot-${item.id}`);
            const count = (window.itemInventory && window.itemInventory[item.id]) || 0;
            if (!btn && count > 0) {
                btn = document.createElement('button');
                btn.id = `item-slot-${item.id}`;
                if (refSlot && refSlot.className) btn.className = refSlot.className;
                btn.onclick = () => window.useItem(item.id);
                slotParent.insertBefore(btn, slotParent.firstChild);
            }
            if (btn) {
                btn.innerText = `${item.icon} ${item.name} (${count})`;
                btn.style.display = count > 0 ? "block" : "none";
            }
        });
    }

    const mainPanel = document.getElementById('panel-main-mode');
    const bagPanel = document.getElementById('item-bag-panel');
    
    if (mainPanel) mainPanel.style.display = 'none';
    if (bagPanel) bagPanel.style.display = 'flex'; 
}

/**
 * ✕ アイテムバッグを閉じて行動選択に戻る
 */
function closeItemBag() { 
    const mainPanel = document.getElementById('panel-main-mode');
    const bagPanel = document.getElementById('item-bag-panel');
    
    if (bagPanel) bagPanel.style.display = 'none'; 
    if (mainPanel) mainPanel.style.display = 'block'; 
}


// 📡 【ディレクター仕様】battle.jsの4大コマンドと100%有線結線させるグローバル直結エクスポート
window.openMagicBag = openMagicBag;
window.openItemBag = openItemBag;
window.closeMagicBag = closeMagicBag;
window.closeItemBag = closeItemBag;

// ==========================================
// 🎨 種族別・階層別グラフィックサイズ＆位置補正回路
// ==========================================
window.applyEnemyVisualScale = function(data) { const eg = document.getElementById('e-sprite-graphic'), ec = document.getElementById('e-sprite-container'), pc = document.getElementById('p-sprite-container'); if (!eg || !data) return; const fl = typeof data.floor === 'number' ? data.floor : ((window.curIdx || 0) + 1), tp = data.type || "", cfg = (typeof window.getAreaConfig 
    === 'function' ? window.getAreaConfig(fl) : {}) || {}, [ax, ay, asc] = cfg.enemy || [0, 0, 1.0], [px, py] = cfg.player || [0, 0]; if (ec) { ec.style.marginLeft = `${ax || 0}px`; ec.style.marginTop = `${ay || 0}px`; } if (pc) { pc.style.marginLeft = `${px || 0}px`; pc.style.marginTop = `${py || 0}px`; } let sc = (asc || 1.0) * (tp === 'dragon' ? 1.3 : (tp === 'goblin' && fl < 40 ? 0.7 : 1.0)), oy = tp === 'harpy' ? -80 : 0; eg.style.transform = `translateY(${oy}px) scale(${sc})`; };
// ==================================================================
// 🏰 螺旋階段・踊り場（画像特大・ミニマル2ボタン仕様）
// ==================================================================
document.addEventListener("DOMContentLoaded", () => {

    // 1. ポップアップ（モーダル）表示共通関数
    window.openCampModal = function(title, innerHtml) {
        let old = document.getElementById('camp-popup-overlay');
        if (old) old.remove();

        const overlay = document.createElement('div');
        overlay.id = 'camp-popup-overlay';
        overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.78); display:flex; align-items:center; justify-content:center; z-index:100000; padding:15px; box-sizing:border-box;";
        
        overlay.innerHTML = `
            <div style="width:100%; max-width:420px; background:#0f172a; border:2px solid #eab308; border-radius:14px; padding:12px; box-sizing:border-box; color:#fff; font-family:monospace; box-shadow:0 0 25px rgba(234,179,8,0.4); max-height:85vh; display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:6px; margin-bottom:8px;">
                    <span style="font-size:1rem; font-weight:bold; color:#fde047;">${title}</span>
                    <button onclick="document.getElementById('camp-popup-overlay').remove()" style="background:#ef4444; color:#fff; border:none; padding:3px 10px; border-radius:4px; font-weight:bold; cursor:pointer;">✕</button>
                </div>
                <div id="camp-modal-content-zone" style="overflow-y:auto; flex:1; line-height:1.6; font-size:0.85rem; padding-right:2px;">
                    ${innerHtml}
                </div>
            </div>
        `;

        overlay.onclick = function(e) {
            if (e.target === overlay) overlay.remove();
        };

        document.body.appendChild(overlay);
    };

    // 2. 踊り場メイン画面構築（HP/MP削除＆画像を最大化）
    window.buildIntermissionScreen = function() {
        const displayFloor = window.curIdx + 1;
        const floorIndicator = document.getElementById('floor-indicator'); 
        if (floorIndicator) floorIndicator.style.display = 'none';
        const data = (typeof getStageData === 'function') ? getStageData(displayFloor) : { floor: displayFloor, name: "魔物" };

        let interDiv = document.getElementById('scr-intermission');
        if (!interDiv) {
            interDiv = document.createElement('div'); 
            interDiv.id = 'scr-intermission';
            interDiv.style.cssText = "display:none; padding:10px; width:100%; box-sizing:border-box; background:#070b14; color:#fff; font-family:monospace; border-radius:20px; border:2px solid #334155; box-shadow:inset 0 0 30px rgba(0,0,0,0.9);";
            
            const board = document.getElementById('sq-board');
            if (board) { board.appendChild(interDiv); } else { document.body.appendChild(interDiv); }
        }
        
        ['scr-start', 'scr-intro', 'scr-battle', 'scr-result'].forEach(id => {
            const el = document.getElementById(id); if (el) el.style.display = 'none';
        });
        interDiv.style.display = 'block';

        interDiv.innerHTML = `
            <!-- 🏛️ 看板 -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(234, 179, 8, 0.4); padding-bottom:4px; margin-bottom:8px;">
                <span style="color:#fde047; font-size:1.05rem; font-weight:900;">🌀 第 ${displayFloor} 階層 螺旋階段 踊り場</span>
                <span style="background:rgba(30, 27, 75, 0.85); border:1px solid #818cf8; color:#c7d2fe; font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:bold;">LANDING</span>
            </div>

            <!-- 🖼️ 踊り場特大ビジュアル枠（縦幅を360pxまで拡張して大迫力化） -->
            <div id="camp-interactive-scene" style="position:relative; width:100%; height:360px; background:#05070e; border-radius:12px; border:2px solid #334155; margin-bottom:10px; overflow:hidden; box-shadow:inset 0 0 25px #000;">
                <img src="assets/ui/camp_stairs.jpg" style="width:100%; height:100%; object-fit:cover; display:block;" alt="螺旋階段 踊り場">
                
                <!-- 直感ホットスポット -->
                <div onclick="window.interAction('bag')" title="カバンを開く" style="position:absolute; left:4%; top:65%; width:22%; height:32%; cursor:pointer;"></div>
                <div onclick="window.interAction('tower_window')" title="塔の窓" style="position:absolute; left:12%; top:10%; width:22%; height:55%; cursor:pointer;"></div>
                <div onclick="window.interAction('scroll')" title="フロア羊皮紙" style="position:absolute; left:26%; top:62%; width:24%; height:35%; cursor:pointer;"></div>
                <div onclick="window.interAction('status')" title="ステータス" style="position:absolute; left:48%; top:15%; width:14%; height:25%; cursor:pointer;"></div>
                <div onclick="window.triggerEnterBattle()" title="扉を開けて進む" style="position:absolute; left:72%; top:18%; width:18%; height:55%; cursor:pointer;"></div>
<!-- ⑥ 料理の焚火 (中央) ➔ 調理 -->
<div onclick="window.interAction('camp_fire')" title="焚き火と鍋" style="position:absolute; left:33%; top:48%; width:16%; height:25%; cursor:pointer;"></div>
<!-- ⑦ 樹の樽 (右下階段横) ➔ 樽の探索 -->
<div onclick="window.interAction('barrel')" title="木樽" style="position:absolute; left:60%; top:70%; width:18%; height:24%; cursor:pointer;"></div>
                <div style="position:absolute; bottom:0; left:0; width:100%; padding:3px 8px; box-sizing:border-box; background:rgba(2, 6, 23, 0.85); border-top:1px solid #334155; color:#cbd5e1; font-size:0.72rem; text-align:left;">
                    画像内を調べるか、下のコマンドを選択してください。
                </div>
            </div>

            <!-- 🧭 最小限の操作ボタン（カバン / 突入 の2つを横並び） -->
            <div style="display:grid; grid-template-columns: 1fr 1.6fr; gap:8px;">
                <!-- 🎒 カバン（道具、羊皮紙、ステータスをまとめて開く総合ハブ） -->
                <button onclick="window.interAction('bag')" style="background:linear-gradient(135deg, #2d1e10, #181109); color:#ffedd5; border:1px solid #ea580c; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:0.85rem; display:flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 2px 4px rgba(0,0,0,0.5);">
                    <span style="font-size:1.1rem;">🎒</span><span>カバン</span>
                </button>

                <!-- 🚪 突入ボタン -->
                <button onclick="window.triggerEnterBattle()" style="background:linear-gradient(135deg, #059669, #047857); color:#fff; font-size:0.95rem; font-weight:900; padding:10px; border:2px solid #34d399; border-radius:8px; cursor:pointer; box-shadow:0 0 10px rgba(5,150,105,0.4); display:flex; align-items:center; justify-content:center; gap:6px;">
                    <span>🚪</span><span>第 ${data.floor} 階層へ突入</span>
                </button>
            </div>
        
        `;
        if (typeof startBGM === 'function') startBGM("camp");
    };

    // 3. アクションハンドラ（カバン内でタブ切り替え可能な総合モーダル）
    window.interAction = function(mode, subTab = 'item') {
        const rawIdx = (window.curIdx !== undefined && window.curIdx >= 0) ? window.curIdx : 0;
        const targetFloor = rawIdx + 1;
        const data = (typeof getStageData === 'function') ? getStageData(targetFloor) : { floor: targetFloor, lv: targetFloor, name: "魔物", weak: [], resist: [], txt: "" };
        
        if (typeof playSE === 'function') playSE(SOUND_HOLY);

        // 🎒 カバン（道具・羊皮紙・ステータスを1つのポップアップ内で切替可能）
        if (mode === 'bag' || mode === 'camp_item' || mode === 'scroll' || mode === 'status') {
            const initialTab = (mode === 'bag' || mode === 'camp_item') ? 'item' : (mode === 'scroll' ? 'scroll' : 'status');
            
            function renderBagModalHtml(activeTab) {
                const btnStyle = (t) => activeTab === t 
                    ? "background:#eab308; color:#000; font-weight:bold; border:none; padding:5px 12px; border-radius:6px; cursor:pointer; font-size:0.8rem;"
                    : "background:#1e293b; color:#cbd5e1; border:1px solid #475569; padding:5px 12px; border-radius:6px; cursor:pointer; font-size:0.8rem;";

                let contentHtml = "";

                // ① 道具タブ
                if (activeTab === 'item') {
const campUsableItems = [
    ...(Array.isArray(window.EXTRA_CAMP_ITEMS) ? window.EXTRA_CAMP_ITEMS : []),
    ...(Array.isArray(window.NEW_ITEMS) ? window.NEW_ITEMS : [])
];


                    let hasAny = false;
                    contentHtml += `<div style="display:flex; flex-direction:column; gap:6px;">`;
                    campUsableItems.forEach(item => {
                        let count = (window.itemInventory && window.itemInventory[item.id]) || 0;
                        if (count > 0) {
                            hasAny = true;
                            contentHtml += `
                                <div style="display:flex; justify-content:space-between; align-items:center; background:#1e293b; padding:6px 10px; border-radius:6px; border:1px solid #334155;">
                                    <span>${item.icon} <b>${item.name}</b> (所持:${count})</span>
                                    <button onclick="window.useItemInBagTab('${item.id}')" style="background:${item.bg}; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:0.75rem;">使用 (${item.desc})</button>
                                </div>`;
                        }
                    });
                    if (!hasAny) {
                        contentHtml += `<div style="color:#ef4444; padding:15px; text-align:center;">カバンに使用可能なアイテムがありません。</div>`;
                    }
                    contentHtml += `</div>`;
                }

                // ② 羊皮紙タブ
                else if (activeTab === 'scroll') {
                    const cleanRaceName = (data.name || "魔物").replace(/^[0-9]+階の変異体（/,'').replace(/\)$/,'');
                    const flavorTxt = (data.txt && data.txt !== "undefined" && !data.txt.includes("無限回廊に蠢く")) ? data.txt : "深層の瘴気に包まれた未知の変異個体。";
                    contentHtml = `
                        <div style="background:#1e1b4b; border:1px solid #4338ca; padding:8px 10px; border-radius:6px; margin-bottom:8px; color:#e0e7ff; font-size:0.82rem;">
                            「${flavorTxt}」
                        </div>
                        <div style="background:#1e293b; border:1px solid #334155; padding:8px 10px; border-radius:6px; font-size:0.8rem;">
                            <span style="color:#eab308; font-weight:bold;">★ 第 ${data.floor} 階層 攻略情報</span><br>
                            ・敵Lv: [ ${data.lv || targetFloor} ]<br>
                            ・弱点: <span style="color:#38bdf8; font-weight:bold;">${(data.weak && data.weak.length) ? data.weak.join(', ').toUpperCase() : "なし"}</span><br>
                            ・耐性: <span style="color:#f43f5e; font-weight:bold;">${(data.resist && data.resist.length) ? data.resist.join(', ').toUpperCase() : "なし"}</span>
                        </div>
                    `;
                }

                // ③ ステータスタブ
 // ③ ステータスタブ
                else if (activeTab === 'status') {
                    const hpPct = Math.min(100, Math.max(0, (window.pHp / window.pMaxHp) * 100));
                    const mpPct = Math.min(100, Math.max(0, (window.pMp / window.pMaxMp) * 100));
                    const curExp = window.pExp || 0;
                    const reqExp = (typeof window.getRequiredExpForNextLevel === 'function') ? window.getRequiredExpForNextLevel(window.pLevel) : (50 + window.pLevel * 25);
                    const remainExp = Math.max(0, reqExp - curExp);
                    const expPct = Math.min(100, Math.max(0, (curExp / Math.max(1, reqExp)) * 100));
                    const coreStats = window.pSavedStats || { str: 8, dex: 12, con: 12, int: 18, wis: 14, cha: 10 };
                    contentHtml = `
                        <div style="display:flex; flex-direction:column; gap:6px;">
                            <div style="background:#1e1b4b; border:1px solid #6366f1; border-radius:6px; padding:6px 10px;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:2px; font-weight:bold; font-size:0.8rem;">
                                    <span style="color:#c7d2fe;">🧙‍♂️ ${window.pStyle} [Lv.${window.pLevel}]</span>
                                    <span style="color:#a7f3d0;">HP: ${window.pHp}/${window.pMaxHp} ｜ MP: ${window.pMp}/${window.pMaxMp}</span>
                                </div>
                                <div style="background:#0f172a; height:5px; border-radius:99px; overflow:hidden; margin-bottom:3px;"><div style="background:linear-gradient(90deg,#f43f5e,#fda4af); width:${hpPct}%; height:100%;"></div></div>
                                <div style="background:#0f172a; height:5px; border-radius:99px; overflow:hidden; margin-bottom:5px;"><div style="background:linear-gradient(90deg,#38bdf8,#93c5fd); width:${mpPct}%; height:100%;"></div></div>
                                <div style="display:flex; justify-content:space-between; font-size:0.72rem; margin-bottom:2px;">
                                    <span style="color:#10b981; font-weight:bold;">✨ EXP: ${curExp} / ${reqExp}</span>
                                    <span style="color:#fde047; font-weight:bold;">次のLVまで あと ${remainExp} P</span>
                                </div>
                                <div style="background:#0f172a; height:5px; border-radius:99px; overflow:hidden;"><div style="background:linear-gradient(90deg,#10b981,#6ee7b7); width:${expPct}%; height:100%;"></div></div>
                            </div>
                            <div style="background:#1e293b; border:1px solid #334155; border-radius:6px; padding:6px 10px; font-size:0.75rem;">
                                <div style="font-weight:bold; color:#eab308; margin-bottom:3px; border-bottom:1px dashed #334155; padding-bottom:1px;">📊 基礎能力値</div>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:2px;">
                                    <span>⚔️ STR: <b>${coreStats.str}</b></span>
                                    <span>🔮 INT: <b>${coreStats.int}</b></span>
                                    <span>🎯 DEX: <b>${coreStats.dex}</b></span>
                                    <span>📜 WIS: <b>${coreStats.wis}</b></span>
                                    <span>🛡️ CON: <b>${coreStats.con}</b></span>
                                    <span>👑 CHA: <b>${coreStats.cha}</b></span>
                                </div>
                            </div>
                            <div style="background:#1e293b; border:1px solid #334155; border-radius:6px; padding:6px 10px; font-size:0.75rem;">
                                <div style="font-weight:bold; color:#06b6d4; margin-bottom:4px; border-bottom:1px dashed #334155; padding-bottom:1px;">📜 永久記憶呪文</div>
                                <div style="display:flex; flex-direction:column; gap:4px;">
                                    ${(window.playerSpells && window.playerSpells.length) ? window.playerSpells.map(k => {
                                        const lv = (window.spellLevels && window.spellLevels[k]) || 1;
                                        const sName = (typeof SPELLS !== 'undefined' && SPELLS[k] && SPELLS[k].name) ? SPELLS[k].name : k;
                                        const detailTxt = (typeof window.getSpellStatusDetail === 'function') ? window.getSpellStatusDetail(k, lv) : '';
                                        return `<div style="background:#0f172a; border:1px solid #38bdf8; border-radius:4px; padding:4px 6px;">
                                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                                <span style="color:#fff; font-weight:bold; font-size:0.76rem;">🔮 ${sName}</span>
                                                <span style="background:#2563eb; color:#fff; padding:0 5px; border-radius:3px; font-size:0.68rem; font-weight:bold;">Lv.${lv}</span>
                                            </div>
                                            ${detailTxt ? `<div style="color:#93c5fd; font-size:0.68rem; margin-top:2px; line-height:1.3;">${detailTxt}</div>` : ''}
                                        </div>`;
                                    }).join('') : '<span style="color:#94a3b8;">なし</span>'}
                                </div>
                            </div>
                        </div>
                    `;
                }
                

                return `
                    <!-- カバン内タブ切り替えバー -->
                    <div style="display:flex; gap:6px; border-bottom:1px solid #334155; padding-bottom:8px; margin-bottom:10px;">
                        <button onclick="window.switchBagTab('item')" style="${btnStyle('item')}">🧪 道具</button>
                        <button onclick="window.switchBagTab('scroll')" style="${btnStyle('scroll')}">📜 羊皮紙</button>
                        <button onclick="window.switchBagTab('status')" style="${btnStyle('status')}">👤 状態</button>
                    </div>
                    <div id="bag-tab-body">${contentHtml}</div>
                `;
            }

            window.switchBagTab = function(t) {
                const zone = document.getElementById('camp-modal-content-zone');
                if (zone) zone.innerHTML = renderBagModalHtml(t);
            };

            window.useItemInBagTab = function(itemId) {
                if (typeof window.executeCampItemUse === 'function') {
                    window.executeCampItemUse(itemId);
                }
                const body = document.getElementById('bag-tab-body');
                if (body) {
                    const zone = document.getElementById('camp-modal-content-zone');
                    if (zone) zone.innerHTML = renderBagModalHtml('item');
                }
            };

            window.openCampModal("🎒 カバンの中身", renderBagModalHtml(initialTab));
        }
// 🍲 料理の焚火
        else if (mode === 'camp_fire') {
            window.openCampModal("🍲 焚き火と料理鍋", `
                <div style="text-align:center; padding:10px 0;">
                    <div style="font-size:2.5rem; margin-bottom:8px;">🍲</div>
                    <div style="color:#fde047; font-weight:bold; font-size:0.95rem; margin-bottom:8px;">温かな野営の煮込み鍋</div>
                    <div style="color:#cbd5e1; line-height:1.6;">
                        キノコや野菜、薬草を煮込んだ美味しいシチューをつくっている。
                    </div>
                </div>
            `);
        }

        // 🪵 樹の樽
        else if (mode === 'barrel') {
            window.openCampModal("🪵 古びた木樽", `
                <div style="text-align:center; padding:10px 0;">
                    <div style="font-size:2.5rem; margin-bottom:8px;">🛢️</div>
                    <div style="color:#94a3b8; font-weight:bold; font-size:0.95rem; margin-bottom:8px;">放置された樽</div>
                    <div style="color:#cbd5e1; line-height:1.6;">
                        樽の中や周りを調べたがなにもない。
                    </div>
                </div>
            `);
        }
        // 🪟 塔の窓（画像上の窓を直接タップしたとき）
        else if (mode === 'tower_window') {
            const healMp = 5;
            window.pMp = Math.min(window.pMaxMp, window.pMp + healMp);
            window.openCampModal("🪟 塔の細窓からの眺望", `
                <div style="text-align:center; padding:10px 0;">
                    <div style="font-size:2.5rem; margin-bottom:8px;">🌌</div>
                    <div style="color:#38bdf8; font-weight:bold; font-size:0.95rem; margin-bottom:6px;">第 ${targetFloor} 階層：窓の外</div>
                    <div style="color:#cbd5e1; margin-bottom:10px;">
                        冷たく澄んだ高空の風が吹き抜け、星々の光が眼下に広がる。<br>
                        深呼吸をして精神を研ぎ澄ました。塔壁を渡り歩く商人がいるという噂だが今は誰もいない。
                    </div>
                    <div style="background:#1e293b; border:1px solid #0284c7; padding:6px; border-radius:6px; color:#a7f3d0; font-weight:bold;">
                        ✨ 特になにもない。深呼吸をした！
                    </div>
                </div>
            `);
        }
    };
});

(function(){ window.applyCampStairsEffects = function(fl) { const sc = document.getElementById('camp-interactive-scene'); if (!sc) return; const ac = (typeof window.getAreaConfig === 'function' ? window.getAreaConfig(fl) : {}) || {}; const img = sc.querySelector('img'); if (img) { img.src = 'assets/ui/camp_stairsC01.png'; img.style.position = 'relative'; img.style.zIndex = '3'; img.style.filter = ac.campFilter || 'none'; img.style.transition = 'transform 0.35s cubic-bezier(0.25,0.8,0.25,1), filter 0.35s'; } let st = document.getElementById('camp-fx-css'); if (!st) { st = document.createElement('style'); st.id = 'camp-fx-css'; document.head.appendChild(st); } st.textContent = `@keyframes campFlameSoft{0%,100%{opacity:.15;filter:brightness(1.15) saturate(1.4)}50%{opacity:.78;filter:brightness(1.75) saturate(2.1)}}@keyframes campMiasma{0%{opacity:0;transform:translate(0,0) scale(0.7,0.6)}35%{opacity:.75}100%{opacity:0;transform:translate(-26px,14px) scale(1.45,1.15)}}@keyframes campCloudMove{0%{background-position:0 0}100%{background-position:-600px 0}}`; ['camp-bg-layer','camp-fx-layer','camp-miasma-layer'].forEach(id => { const el = document.getElementById(id); if (el) el.remove(); }); const bg = document.createElement('div'); bg.id = 'camp-bg-layer'; bg.style.cssText = `position:absolute;inset:0;pointer-events:none;z-index:1;background:${ac.campSky || 'linear-gradient(180deg,#050a18 0%,#0f2547 55%,#1d4ed8 100%)'};`; const cl = document.createElement('div'); cl.style.cssText = `position:absolute;inset:0;background:url("assets/stage/sky_cloud.png") repeat-x;background-size:auto 100%;opacity:${ac.campCloud ? '0.85' : '0.4'};animation:campCloudMove 18s linear infinite;`; bg.appendChild(cl); sc.prepend(bg); const glowImg = document.createElement('img'); glowImg.id = 'camp-fx-layer'; glowImg.src = 'assets/ui/camp_stairsC01.png'; const maskGrad = 'radial-gradient(circle at 8.5% 35%, #000 0%, transparent 9%), radial-gradient(circle at 60% 32%, #000 0%, transparent 7%), radial-gradient(circle at 92.5% 35%, #000 0%, transparent 9%), radial-gradient(circle at 38.5% 69%, #000 0%, transparent 11%), radial-gradient(circle at 42.5% 75%, #000 0%, transparent 6%)'; glowImg.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;z-index:4;mix-blend-mode:lighten;-webkit-mask-image:${maskGrad};mask-image:${maskGrad};animation:campFlameSoft 1.15s infinite ease-in-out;`; sc.insertBefore(glowImg, img ? img.nextSibling : null); const miasmaWrap = document.createElement('div'); miasmaWrap.id = 'camp-miasma-layer'; miasmaWrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:4;overflow:hidden;'; const isBoss = (fl % 10 === 0); const mColor = isBoss ? 'rgba(220,38,38,0.65)' : 'rgba(139,92,246,0.5)'; [0, 1.3, 2.6].forEach((delay, idx) => { const w = document.createElement('div'); w.style.cssText = `position:absolute;left:${74 + idx * 4}%;top:${59 + (idx % 2) * 2}%;width:44px;height:18px;border-radius:50%;background:radial-gradient(ellipse,${mColor} 0%,rgba(59,7,100,0) 75%);filter:blur(4px);animation:campMiasma 3.8s ${delay}s infinite ease-out;`; miasmaWrap.appendChild(w); }); sc.insertBefore(miasmaWrap, glowImg.nextSibling); sc.querySelectorAll('[onclick]').forEach(el => { el.style.zIndex = '5'; }); if (!window._campDoorHooked && typeof window.triggerEnterBattle === 'function') { window._campDoorHooked = true; const _origEnter = window.triggerEnterBattle; window.triggerEnterBattle = function() { const s = document.getElementById('camp-interactive-scene'), im = s && s.querySelector('img'); if (!im || im.dataset.zooming === '1') return _origEnter.apply(this, arguments); im.dataset.zooming = '1'; im.style.transformOrigin = '81% 45%'; im.style.transform = 'scale(1.38)'; im.style.filter = (im.style.filter === 'none' ? '' : im.style.filter + ' ') + 'brightness(0.15)'; setTimeout(() => { im.dataset.zooming = '0'; im.style.transform = 'scale(1)'; _origEnter.apply(this, arguments); }, 340); }; } window._visitedAreas = window._visitedAreas || {}; if (ac.id && ac.desc && !window._visitedAreas[ac.id]) { window._visitedAreas[ac.id] = true; if (ac.se && typeof playSE === 'function') playSE(typeof getAssetPath === 'function' ? getAssetPath('se_clean', ac.se) : ac.se); const banTxt = (ac.ban && ac.ban.length) ? `<div style="margin-top:8px;padding:6px 10px;background:rgba(239,68,68,0.18);border:1px solid #ef4444;border-radius:6px;color:#fca5a5;font-weight:bold;">🚫 封印呪文: ${ac.ban.map(k => (typeof SPELLS !== 'undefined' && SPELLS[k] ? SPELLS[k].name : k)).join('・')}</div>` : ''; setTimeout(() => { if (typeof window.openCampModal === 'function') window.openCampModal(`🧭 新エリア到達：${ac.name}`, `<div style="line-height:1.7;color:#e2e8f0;">${ac.desc}</div>${banTxt}<button onclick="document.getElementById('camp-popup-overlay').remove()" style="margin-top:12px;width:100%;background:#eab308;color:#000;border:none;padding:8px;border-radius:6px;font-weight:bold;cursor:pointer;">了解して進む</button>`); }, 150); } }; document.addEventListener('DOMContentLoaded', () => { const prev = window.buildIntermissionScreen; window.buildIntermissionScreen = function() { if (prev) prev.apply(this, arguments); window.applyCampStairsEffects((window.curIdx || 0) + 1); }; }); if (document.getElementById('camp-interactive-scene')) window.applyCampStairsEffects((window.curIdx || 0) + 1); })();



(function(){
  if(!document.querySelector('meta[name="viewport"]')){const m=document.createElement('meta');m.name='viewport';m.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';document.head.appendChild(m);}
  const s=document.createElement('style');
  s.textContent=`html,body,.master-wrapper,.game-container,#sq-board{max-width:100vw!important;overflow-x:hidden!important;touch-action:manipulation}@media(max-width:600px){.master-wrapper{padding:6px!important}#sq-board{padding:12px 8px 16px!important;border-radius:16px!important;outline-offset:-5px!important}#floor-indicator{font-size:.85rem!important;padding:2px 8px!important;margin-bottom:4px!important}#btn-mute{padding:4px 8px!important;font-size:.78rem!important}#p-name,#e-name{font-size:.88rem!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}#p-hp-txt,#e-hp-txt,#p-mp-text{font-size:.8rem!important}#player-status-row,#enemy-status-row{grid-template-columns:repeat(2,auto)!important;max-width:48%!important;gap:2px!important}.retro-status-tag{font-size:.65rem!important;padding:1px 4px!important}#cmd-panel{margin-top:8px!important}#panel-main-mode>div{gap:6px!important;padding:2px!important}#panel-main-mode button{padding:8px 4px!important;font-size:.85rem!important;height:auto!important;min-height:40px!important;border-radius:8px!important}#panel-magic-mode button,#item-bag-panel button{padding:6px 2px!important;font-size:.78rem!important;min-height:32px!important}#battle-log{font-size:.92rem!important;padding:10px!important;min-height:68px!important}}`;
  document.head.appendChild(s);
})();

