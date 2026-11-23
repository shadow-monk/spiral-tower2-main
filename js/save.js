// ==================================================================
// 目次
// 【１】セーブ機能
// 【２】その他

// ==================================================================// ==================================================================
// 【１】🪶 [SAVE SYSTEM] save.js: トト神の羽根ペン＆パスワードセーブ・ロード機構
// ==================================================================
// 【１】🪶 [SAVE SYSTEM] save.js: トト神の羽根ペン＆パスワードセーブ・ロード機構
// ==================================================================

(function() {
    // Base62用文字セット（大文字・小文字・数字：計62種）
    const B62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    // 保存対象とする主要呪文リスト（全12種）
    const TARGET_SPELLS = [
        'fire', 'ice', 'scre', 'wasp', 'wasp2', 'scis', 
        'flod', 'quak', 'drai', 'mete', 'come', 'ulti'
    ];

    // 職業マッピング
    const STYLES = ['WIZARD', 'SORCERER', 'WARMAGE', 'MASTER', 'ALCHEMIST'];

    /**
     * 数値をBase62文字列に変換（パディング付き）
     */
    function toBase62(num, length) {
        let str = "";
        let n = BigInt(num);
        const base = BigInt(62);
        while (n > 0n) {
            str = B62_CHARS[Number(n % base)] + str;
            n = n / base;
        }
        while (str.length < length) {
            str = "0" + str;
        }
        return str;
    }

    /**
     * Base62文字列を数値に復元
     */
    function fromBase62(str) {
        let n = 0n;
        const base = BigInt(62);
        for (let i = 0; i < str.length; i++) {
            const val = BigInt(B62_CHARS.indexOf(str[i]));
            if (val === -1n) return null;
            n = n * base + val;
        }
        return n;
    }

    /**
     * 簡易チェックサム計算（1バイト）
     */
    function calcChecksum(numBigInt) {
        let sum = 0n;
        let temp = numBigInt;
        while (temp > 0n) {
            sum += temp & 0xFFn;
            temp >>= 8n;
        }
        return Number(sum & 0xFFn);
    }

    /**
     * 🎮 現在の進行状況を16文字パスワードに変換（エンコード）
     */
    window.generateSavePassword = function() {
        const floor = BigInt(Math.max(1, (window.curIdx !== undefined ? window.curIdx + 1 : 1)) & 0x7F); // 7bit
        const level = BigInt(Math.max(1, (window.pLevel || 1)) & 0x7F); // 7bit
        
        let styleIdx = STYLES.indexOf(window.pStyle);
        if (styleIdx === -1) styleIdx = 0;
        const style = BigInt(styleIdx & 0x07); // 3bit

        // 主要アイテム（ポーション、マナ、爆弾、ワープロッド：各4bit）
        const inv = window.itemInventory || {};
        const pot = BigInt(Math.min(15, inv['potion'] || 0));
        const man = BigInt(Math.min(15, inv['mana'] || 0));
        const bmb = BigInt(Math.min(15, inv['bomb'] || 0));
        const wrp = BigInt(Math.min(15, inv['warp'] || 0));

        // 呪文レベル（12種 × 各3bit = 36bit）
        let spellBits = 0n;
        TARGET_SPELLS.forEach((key, idx) => {
            let lv = 0;
            if (window.spellLevels && typeof window.spellLevels[key] === 'number') {
                lv = window.spellLevels[key];
            } else if (window.playerSpells && window.playerSpells.includes(key)) {
                lv = 1;
            }
            lv = Math.min(7, Math.max(0, lv));
            spellBits |= (BigInt(lv) << BigInt(idx * 3));
        });

        // ビット詰め（合計 7+7+3+16+36 = 69bit）
        let packed = 0n;
        packed |= floor;
        packed |= (level << 7n);
        packed |= (style << 14n);
        packed |= (pot << 17n);
        packed |= (man << 21n);
        packed |= (bmb << 25n);
        packed |= (wrp << 29n);
        packed |= (spellBits << 33n);

        // チェックサム付与（8bit）
        const checksum = BigInt(calcChecksum(packed));
        packed |= (checksum << 69n); // 合計 77bit

        // 16文字のBase62へ変換
        const rawCode = toBase62(packed, 16);
        return `${rawCode.slice(0,4)}-${rawCode.slice(4,8)}-${rawCode.slice(8,12)}-${rawCode.slice(12,16)}`;
    };

    /**
     * 📜 パスワードを読み込んでゲームデータを復元（デコード）
     */
    window.loadFromSavePassword = function(inputStr) {
        const cleanStr = (inputStr || "").replace(/[^0-9A-Za-z]/g, "");
        if (cleanStr.length !== 16) {
            return { success: false, msg: "文字数が正しくありません（16文字必要です）" };
        }

        const packed = fromBase62(cleanStr);
        if (packed === null) {
            return { success: false, msg: "不正な文字が含まれています" };
        }

        // チェックサム照合
        const dataBits = packed & ((1n << 69n) - 1n);
        const storedChecksum = Number((packed >> 69n) & 0xFFn);
        const expectedChecksum = calcChecksum(dataBits);

        if (storedChecksum !== expectedChecksum) {
            return { success: false, msg: "パスワードに誤りがあります（照合失敗）" };
        }

        // データの展開
        const floor = Number(dataBits & 0x7Fn);
        const level = Number((dataBits >> 7n) & 0x7Fn);
        const styleIdx = Number((dataBits >> 14n) & 0x07n);
        const pot = Number((dataBits >> 17n) & 0x0Fn);
        const man = Number((dataBits >> 21n) & 0x0Fn);
        const bmb = Number((dataBits >> 25n) & 0x0Fn);
        const wrp = Number((dataBits >> 29n) & 0x0Fn);
        const spellBits = dataBits >> 33n;

        // グローバル変数へ注入
        window.curIdx = Math.max(0, floor - 1);
        window.pLevel = level;
        window.pSavedLevel = level;
        window.pStyle = STYLES[styleIdx] || 'WIZARD';

        if (!window.itemInventory) window.itemInventory = {};
        window.itemInventory['potion'] = pot;
        window.itemInventory['mana'] = man;
        window.itemInventory['bomb'] = bmb;
        window.itemInventory['warp'] = wrp;
        window.itemInventory['quill'] = 1; // ペンは必ず復帰

        if (!window.spellLevels) window.spellLevels = {};
        if (!window.playerSpells) window.playerSpells = [];

        TARGET_SPELLS.forEach((key, idx) => {
            const lv = Number((spellBits >> BigInt(idx * 3)) & 0x07n);
            if (lv > 0) {
                window.spellLevels[key] = lv;
                if (!window.playerSpells.includes(key)) {
                    window.playerSpells.push(key);
                }
            } else {
                delete window.spellLevels[key];
                window.playerSpells = window.playerSpells.filter(k => k !== key);
            }
        });
        window.pSavedSpells = [...window.playerSpells];

        // 基礎ステータスを全快再計算
        if (typeof window.recalculateCoreStats === 'function') {
            window.recalculateCoreStats();
        }
        window.pHp = window.pMaxHp;
        window.pMp = window.pMaxMp;

        return { success: true, floor: floor, level: level };
    };

    // ==================================================================
    // 🖥️ UIモーダル生成・制御
    // ==================================================================

    /**
     * 🪶 パスワード発行モーダル（キャンプで使用時）
     */
    window.openSavePasswordModal = function() {
        const pwd = window.generateSavePassword();
        let modal = document.getElementById('save-password-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'save-password-modal';
            modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2,6,23,0.85); display:flex; align-items:center; justify-content:center; z-index:99999; font-family:monospace;";
            document.body.appendChild(modal);
        }
        modal.innerHTML = `
            <div style="background:#0f172a; border:2px solid #6366f1; border-radius:12px; padding:20px; width:90%; max-width:400px; text-align:center; box-shadow:0 0 25px rgba(99,102,241,0.4); color:#fff;">
                <div style="color:#eab308; font-size:1.2rem; font-weight:bold; margin-bottom:8px;">🪶 トト神の筆記（記録完了）</div>
                <div style="color:#94a3b8; font-size:0.85rem; margin-bottom:15px;">現在の進行状況が血文字にて刻まれました。<br>この合言葉を控えておけば、いつでも再開できます。</div>
                <div id="pwd-display-text" style="background:#1e1b4b; border:1px dashed #818cf8; color:#38bdf8; font-size:1.3rem; font-weight:bold; padding:12px; border-radius:8px; letter-spacing:2px; margin-bottom:15px; user-select:all;">${pwd}</div>
                <div style="display:flex; gap:10px;">
                    <button id="copy-pwd-btn" onclick="navigator.clipboard.writeText('${pwd}').then(()=>{ this.innerText='📋 コピー完了！'; setTimeout(()=>{ this.innerText='📋 合言葉をコピー'; }, 1500); })" style="flex:1; background:#4338ca; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">📋 合言葉をコピー</button>
                    <button onclick="document.getElementById('save-password-modal').style.display='none'" style="flex:1; background:#334155; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">閉じる</button>
                </div>
            </div>
        `;
        modal.style.display = 'flex';
        if (typeof playSE === 'function') playSE(SOUND_HOLY);
    };

    /**
     * 📜 パスワードロードモーダル（タイトル画面で使用時）
     */
    window.openLoadPasswordModal = function() {
        let modal = document.getElementById('load-password-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'load-password-modal';
            modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2,6,23,0.85); display:flex; align-items:center; justify-content:center; z-index:99999; font-family:monospace;";
            document.body.appendChild(modal);
        }
        modal.innerHTML = `
            <div style="background:#0f172a; border:2px solid #6366f1; border-radius:12px; padding:20px; width:90%; max-width:400px; text-align:center; box-shadow:0 0 25px rgba(99,102,241,0.4); color:#fff;">
                <div style="color:#eab308; font-size:1.2rem; font-weight:bold; margin-bottom:8px;">📜 記憶の復元（つづきから）</div>
                <div style="color:#94a3b8; font-size:0.85rem; margin-bottom:15px;">16文字のパスワードを入力してください。<br>（ハイフンは自動で無視されます）</div>
                <input id="input-load-pwd" type="text" maxlength="19" placeholder="XXXX-XXXX-XXXX-XXXX" style="width:100%; padding:10px; font-size:1.1rem; text-align:center; background:#1e293b; color:#fff; border:1px solid #475569; border-radius:6px; letter-spacing:2px; box-sizing:border-box; margin-bottom:8px; font-family:monospace;">
                <div id="load-pwd-err" style="color:#ef4444; font-size:0.8rem; min-height:20px; margin-bottom:12px;"></div>
                <div style="display:flex; gap:10px;">
                    <button onclick="document.getElementById('load-password-modal').style.display='none'" style="flex:1; background:#334155; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">戻る</button>
                    <button onclick="window.confirmLoadPassword()" style="flex:1; background:#059669; color:#fff; border:none; padding:10px; border-radius:6px; font-weight:bold; cursor:pointer;">再開する</button>
                </div>
            </div>
        `;
        modal.style.display = 'flex';
        if (typeof playSE === 'function') playSE(SOUND_HOLY);
    };

    /**
     * 確定ボタン押下時の実行処理
     */
    window.confirmLoadPassword = function() {
        const inputEl = document.getElementById('input-load-pwd');
        const errEl = document.getElementById('load-pwd-err');
        if (!inputEl) return;

        const res = window.loadFromSavePassword(inputEl.value);
        if (!res.success) {
            if (errEl) errEl.innerText = res.msg;
            if (typeof playSE === 'function') playSE(SOUND_ICE);
            return;
        }

        // ロード成功：モーダルを閉じてキャンプ画面（入場前広場）へ直撃
        document.getElementById('load-password-modal').style.display = 'none';
        
        ['scr-start', 'scr-intro', 'scr-battle', 'scr-result', 'scr-setting'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        if (typeof playSE === 'function') playSE(SOUND_HOLY);
        
        if (typeof window.buildIntermissionScreen === 'function') {
            window.buildIntermissionScreen();
        }
    };
})();