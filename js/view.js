// ==================================================================
// 🎨 [VIEW SYSTEMS] バトル背景・グラフィック管理エンジン
// ==================================================================

console.log(
    "%c🎨 [VIEW] view.js loaded: バトル背景エンジン稼働",
    "color: #38bdf8; font-weight: bold;"
);

// ------------------------------------------------------------------
// 1. 定数・設定テーブル
// ------------------------------------------------------------------
window.BATTLE_BACKGROUNDS = {
    default: "assets/ui/floorA10.jpg",
    whiteB:  "assets/ui/floor_whiteB.jpg",
    pipe:    "assets/ui/floor_pipe.jpg",
    sky:     "assets/ui/floor_sky03.jpg"
};

// ------------------------------------------------------------------
// 2. 階層から背景キーを決定するロジック
// ------------------------------------------------------------------
/**
 * 階数に応じた背景キーを取得
 * @param {number} floor - 現在の階数 (1〜)
 * @returns {string} - BATTLE_BACKGROUNDS のキー
 */
window.getBattleBackgroundKeyByFloor = function(floor) {
    const f = (typeof floor === 'number') ? floor : ((window.curIdx || 0) + 1);

    // 40〜50階：floor_whiteB.jpg
    if (f >= 40 && f <= 50) {
        return 'whiteB';
    }
    // 50〜60階（51〜60階）：floor_pipe.jpg
    if (f > 50 && f <= 60) {
        return 'pipe';
    }
    // 60〜70階（61〜70階）：floor_sky.jpg
    if (f > 60 && f <= 70) {
        return 'sky';
    }

    // 基本・指示がない場合は floorA10.jpg
    return 'default';
};

// ------------------------------------------------------------------
// 3. 背景適用処理（新しいAREA_MASTER多重レイヤーエンジンへ連携）
// ------------------------------------------------------------------
window.applyBattleBackground = function(bgKey = null) {
    // 現在の階層を取得（window.curIdx が 0始まりなので +1）
    const currentFloor = (window.curIdx || 0) + 1;

    // もしテストやイベント等で bgKey が直接指定された場合のフォールバック
    if (bgKey && window.BATTLE_BACKGROUNDS[bgKey] && bgKey !== 'sky') {
        const effScr = document.getElementById('eff-scr');
        if (!effScr) return;
        const container = document.getElementById("stage-parallax-layers");
        if (container) container.innerHTML = "";
        Object.assign(effScr.style, {
            backgroundImage:    `url('${window.BATTLE_BACKGROUNDS[bgKey]}')`,
            backgroundSize:     "cover",
            backgroundPosition: "center",
            backgroundRepeat:   "no-repeat"
        });
        return;
    }

    // AREA_MASTER に基づいて1〜70階すべての背景・多重レイヤーを適用
    if (typeof window.updateStageBackground === 'function') {
        window.updateStageBackground(currentFloor);
    }
};

// ------------------------------------------------------------------
// 4. ライフサイクル連携（戦闘開始時のフック）
// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    if (typeof window.actualStartBattle !== 'function') return;

    const originalStartBattle = window.actualStartBattle;

    window.actualStartBattle = function(...args) {
        originalStartBattle.apply(this, args);

        // ⚔️ 現在の階層に合わせた背景を自動適用
        window.applyBattleBackground();
    };
});

/**
 * エリア定義マスターテーブル（横長1行レコード形式）
 * 1:名称 | 2:開始-終了階 | 3:特殊効果(禁止呪文) | 4:BGM[通常,ボス] | 5:演出(敵X,敵Y,倍率) | 6:画像レイヤー構成
 */

window.AREA_MASTER = [
    { id: "default1", name: "通常回廊エリア",   min: 1,  max: 20, ban: [],               bgm: ["assets/bgm/bgm_battle_arch03.mp3", "assets/bgm/bgm_mukizu.mp3"],                campBgm: "assets/bgm/Camping_withthedark.mp3", campFilter: "none",                                   campSky: "linear-gradient(180deg, #050a18 0%, #0f2547 55%, #1d4ed8 100%)", campCloud: false, desc: "", se: "", enemy: [0, 0, 1.0], drop: [{ id: "new_potion", weight: 50 }, { id: "new_mana", weight: 30 }, { id: "salted_meat", weight: 20 }], layers: ["assets/ui/floorA10.jpg"] },
    { id: "default2", name: "通常回廊・深部",   min: 21, max: 39, ban: [],               bgm: ["assets/bgm/bgm_battle_piano11.mp3", "assets/bgm/bgm_mukizu.mp3"],               campBgm: "assets/bgm/Camping_withthedark.mp3", campFilter: "hue-rotate(-12deg) saturate(1.15)",      campSky: "linear-gradient(180deg, #090518 0%, #1e1b4b 55%, #4338ca 100%)", campCloud: false, desc: "", se: "", enemy: [0, 0, 1.0], drop: [{ id: "new_potion", weight: 50 }, { id: "new_mana", weight: 30 }, { id: "salted_meat", weight: 20 }], layers: ["assets/ui/floorA10.jpg"] },
    { id: "whiteB",   name: "白亜の回廊エリア", min: 40, max: 50, ban: [],               bgm: ["assets/bgm/Battle0A_Steel_Against_the_Altar.mp3", "assets/bgm/bgm_mukizu.mp3"], campBgm: "assets/bgm/Camping_withthedark.mp3", campFilter: "brightness(1.18) saturate(0.75)",        campSky: "linear-gradient(180deg, #1e293b 0%, #64748b 50%, #e2e8f0 100%)", campCloud: false, desc: "純白の石柱が連なる静寂の回廊へ足を踏み入れた。強敵が待ち受ける中層領域だ。", se: "se_holy_hit.mp3", enemy: [0, 0, 1.0], drop: [{ id: "red_mushroom", weight: 40 }, { id: "new_bone", weight: 40 }, { id: "new_hipotion", weight: 20 }], layers: ["assets/ui/floor_whiteB.jpg"] },
    { id: "pipe",     name: "蒸気機関エリア",   min: 51, max: 60, ban: [],               bgm: ["assets/bgm/Battle0A_Steel_Against_the_Altar.mp3", "assets/bgm/bgm_mukizu.mp3"], campBgm: "assets/bgm/Camping_withthedark.mp3", campFilter: "sepia(0.35) hue-rotate(-15deg)",         campSky: "linear-gradient(180deg, #27150a 0%, #7c2d12 50%, #ea580c 100%)", campCloud: false, desc: "無数の配管と蒸気が噴き出す機械仕掛けの階層に到達した。魔導具の反応が鋭くなっている。", se: "se_earthshake.mp3", enemy: [0, 0, 1.0], drop: [{ id: "new_hipotion", weight: 50 }, { id: "new_manacrys", weight: 50 }], layers: ["assets/ui/floor_pipe.jpg"] },
{ id: "sky",      name: "天空回廊エリア",   min: 61, max: 70, ban: ["quak", "flod"], bgm: ["assets/bgm/SkywindDuel.mp3", "assets/bgm/Sky_BossDuel.mp3"],                    campBgm: "assets/bgm/Camping_withthedark.mp3", campFilter: "brightness(1.12) hue-rotate(15deg)",     campSky: "linear-gradient(180deg, #0284c7 0%, #38bdf8 55%, #bae6fd 100%)", campCloud: true,  desc: "雲海を貫く崩落した外廊へ出た！敵は高空に浮遊しているため杖攻撃は届かず、暴風により大地と水の呪文（クエイク・フラッド）も封じられる！", get se() { if (!window._skyMeleeHooked) { window._skyMeleeHooked = true; const isSky = () => (window.curIdx || 0) >= 61 && (window.curIdx || 0) <= 70; const d = Object.getOwnPropertyDescriptor(window, 'eHp'); if (d && d.configurable) { let _v = window.eHp; Object.defineProperty(window, 'eHp', { configurable: true, enumerable: true, get() { return _v; }, set(nv) { if (isSky() && window._skyAtkMiss && typeof nv === 'number' && typeof _v === 'number' && nv < _v) return; _v = nv; } }); } const origT = window.turn; if (typeof origT === 'function') { window.turn = function(m) { if (isSky() && String(m || '') === 'atk' && !(window._jamFeatherCnt > 0)) { window._skyAtkMiss = true; setTimeout(() => { window._skyAtkMiss = false; }, 450); const pre = window.eHp || 0, r = origT.apply(this, arguments); window.eHp = pre; if (typeof window.updateHpUI === 'function') window.updateHpUI(); const box = document.getElementById('msg-box') || document.getElementById('message-box') || document.getElementById('battle-msg') || document.getElementById('battle-log') || document.getElementById('log-box'); if (box) { const ln = document.createElement('div'); ln.style.cssText = 'color:#7dd3fc;font-weight:bold;margin-top:4px;'; ln.textContent = '🌪️ 敵は上空高くに浮いていて杖が届かない！ダメージ 0！'; box.appendChild(ln); box.scrollTop = box.scrollHeight; setTimeout(() => { if (!box.contains(ln)) { box.appendChild(ln); box.scrollTop = box.scrollHeight; } }, 45); } return r; } return origT.apply(this, arguments); }; } } return "se_wind01.mp3"; }, enemy: [40, -106, 1.0, 1.25], player: [0, 35], drop: [{ id: "new_potion", weight: 50 }, { id: "harpy_wing", weight: 50 }], layers: [
    { src: "assets/stage/sky_back.png",  z: 1,  spd: -0.25,       op: 1.0,  filter: "none" },
        { src: "assets/stage/sky_cloud.png", z: 2,  spd: -0.9,        op: 0.4,  filter: "none" },
        { src: "assets/stage/sky_tower.png", z: 3,  spd: 0,           op: 1.0,  filter: "none" },
        { src: "assets/stage/sky_lean.png",  z: 20, spd: 0,           op: 1.0,  filter: "none" },
        { src: "assets/stage/sky_mist.png",  z: 25, spd: [-4.8, 1.8], op: 0.32, filter: "none", mask: "diag_wind" }
    ]},
    { id: "deep",     name: "深淵回廊エリア",   min: 71, max: 80, ban: [],               bgm: ["assets/bgm/Battle0Buptempo_Blade.mp3", "assets/bgm/bgm_mukizu.mp3"],            campBgm: "assets/bgm/Camping_withthedark.mp3", campFilter: "hue-rotate(220deg) saturate(1.3)",       campSky: "linear-gradient(180deg, #1a051d 0%, #4c0519 55%, #9f1239 100%)", campCloud: true,  desc: "雲海を超え、果てなき深淵の領域へ突入した……！", se: "se_freeze_hit.mp3", enemy: [0, 0, 1.0], drop: [{ id: "new_hipotion", weight: 50 }, { id: "new_manacrys", weight: 50 }], layers: ["assets/ui/floorA10.jpg"] }
];


window.getAreaConfig = function(floor) {
    const f = Number(floor) || 1;
    return window.AREA_MASTER.find(a => f >= a.min && f <= a.max) || { id: "guard", name: "未知の回廊", min: 81, max: 9999, ban: [], bgm: ["assets/bgm/Battle0A_Steel_Against_the_Altar.mp3", "assets/bgm/bgm_mukizu.mp3"], campBgm: "assets/bgm/Camping_withthedark.mp3", enemy: [0, 0, 1.0], layers: ["assets/ui/floorA10.jpg"] };
};


/**
 * 指定階層のエリア設定を取得する共通ヘルパー
 */

/**
 * 指定階層のドロップ候補テーブルを取得（view.js 側で完全制御）
 */
window.getAreaLootTable = function(floor) {
    const area = window.getAreaConfig(floor);
    // エリア固有ドロップが設定されている場合、item.js の定義から名前・アイコンを自動取得
    if (area && Array.isArray(area.drop) && area.drop.length > 0) {
        return area.drop.map(d => {
            const id = typeof d === 'string' ? d : d.id;
            const weight = typeof d === 'object' && d.weight ? d.weight : 50;
            const def = (Array.isArray(window.NEW_ITEMS) && window.NEW_ITEMS.find(i => i.id === id))
                     || (Array.isArray(window.EXTRA_CAMP_ITEMS) && window.EXTRA_CAMP_ITEMS.find(i => i.id === id));
            return {
                id: id,
                weight: weight,
                name: def ? def.name : id,
                icon: def ? def.icon : "🎁"
            };
        });
    }
    // 未設定エリア（1〜60階）のデフォルトドロップ
// 未設定エリアのデフォルトドロップ（新アイテム統一）
    return [
        { id: 'new_potion',  weight: 50, name: "ポーション",   icon: "🧪" },
        { id: 'new_mana',    weight: 30, name: "魔力の結晶",   icon: "🔷" },
        { id: 'salted_meat', weight: 20, name: "塩漬け肉",     icon: "🥓" }
    ];
};

// ============================================================================
// 多重パララックス背景・描画エンジン
// ============================================================================
(function initStageParallaxSystem() {
    let activeAreaId = null;
    let layerStates = [];
    let rafId = null;

    // 1. 必要な基本CSS（Zオーダーとクリック貫通設定）を一度だけ注入
    function injectBaseStyles() {
        if (document.getElementById("stage-parallax-style")) return;
        const style = document.createElement("style");
        style.id = "stage-parallax-style";
        style.textContent = `
            #eff-scr {
                position: relative;
                overflow: hidden;
            }
#stage-parallax-layers {
                position: static !important;
                pointer-events: none;
            }
            .stage-layer-item {
                position: absolute !important;
                inset: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                will-change: background-position;
            }
            /* プレイヤーと敵に position を付けて z-index を有効化 */
            #p-sprite-container { position: relative !important; z-index: 10 !important; }
            #e-sprite-container { position: relative !important; z-index: 11 !important; }
            #status-badge-header { z-index: 40 !important; }
        `;
        document.head.appendChild(style);
    }

// 2. スクロールアニメーションループ（60fps・斜め対応）
    function tickParallax() {
        for (let i = 0; i < layerStates.length; i++) {
            const st = layerStates[i];
            
            // X方向のスクロール
            if (st.spd[0] !== 0) {
                st.x += st.spd[0];
                if (st.x <= -100000 || st.x >= 100000) st.x = 0;
            }
            // Y方向のスクロール（斜め）
            if (st.spd[1] !== 0) {
                st.y += st.spd[1];
                if (st.y <= -100000 || st.y >= 100000) st.y = 0;
            }

            if (st.spd[0] !== 0 || st.spd[1] !== 0) {
                st.el.style.backgroundPosition = `${st.x.toFixed(2)}px ${st.y.toFixed(2)}px`;
            }
        }
        rafId = requestAnimationFrame(tickParallax);
    }

    // 3. 背景更新メイン関数（既存コードから呼ばれるエントリポイント）
    window.updateStageBackground = function(floor) {
        injectBaseStyles();
        const scr = document.getElementById("eff-scr");
        if (!scr) return;

        const area = window.getAreaConfig(floor);

        // 同じエリア内での階層移動ならDOMを再生成せず維持（チラつき防止）
        if (activeAreaId === area.id) return;
        activeAreaId = area.id;

        // 既存のアニメーションとレイヤーをクリア
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        layerStates = [];

        let container = document.getElementById("stage-parallax-layers");
        if (!container) {
            container = document.createElement("div");
            container.id = "stage-parallax-layers";
            scr.prepend(container);
        }
        container.innerHTML = "";

        // 従来の単一背景指定をリセット
        scr.style.backgroundImage = "none";

        // レイヤー生成
        let hasMovingLayer = false;
        area.layers.forEach((layerDef) => {
            // 文字列1つだけの簡易指定（1〜60階）にも対応
            const cfg = (typeof layerDef === "string")
                ? { src: layerDef, z: 1, spd: 0, op: 1.0, filter: "none" }
                : layerDef;

            const div = document.createElement("div");
            div.className = "stage-layer-item";
            div.style.backgroundImage = `url("${cfg.src}")`;
            div.style.zIndex = cfg.z;
            div.style.opacity = cfg.op !== undefined ? cfg.op : 1.0;
            if (cfg.filter && cfg.filter !== "none") {
                div.style.filter = cfg.filter;
            }
if (cfg.mask === "diag_wind") {
                // ① 上部35%を完全に透明にし、45%〜80%の中腹〜下部だけを表示する縦マスク
                // ② 右上から左下へ斜めに走る帯を作る斜めマスク
                const grad = "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,1) 60%, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 96%), " +
                             "linear-gradient(155deg, rgba(0,0,0,0) 20%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 68%, rgba(0,0,0,0) 85%)";
                div.style.webkitMaskImage = grad;
                div.style.webkitMaskComposite = "source-in";
                div.style.maskImage = grad;
                div.style.maskComposite = "intersect";
            }

const sx = Array.isArray(cfg.spd) ? Number(cfg.spd[0]) : (Number(cfg.spd) || 0);
            const sy = Array.isArray(cfg.spd) ? Number(cfg.spd[1]) : 0;

            if (sx === 0 && sy === 0) {
                div.style.backgroundRepeat = "no-repeat";
                div.style.backgroundSize = "cover";
                div.style.backgroundPosition = "center bottom";
            } else {
                div.style.backgroundRepeat = sy !== 0 ? "repeat" : "repeat-x";
                div.style.backgroundSize = "auto 100%";
                hasMovingLayer = true;
            }

            container.appendChild(div);
            layerStates.push({ el: div, spd: [sx, sy], x: 0, y: 0 });

        });

        // 敵キャラのエリア固有オフセットをカスタム属性として反映（ui.js等と連携用）
        const [ex, ey, escale] = area.enemy || [0, 0, 1.0];
        scr.dataset.areaEnemyX = ex;
        scr.dataset.areaEnemyY = ey;
        scr.dataset.areaEnemyScale = escale;

        if (hasMovingLayer) {
            rafId = requestAnimationFrame(tickParallax);
        }
    };
})();