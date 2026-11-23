// ================================================================
// 🔊 【audio.js 構造・機能メモ】
// ================================================================
// * 【３】サウンドアセットマッピング
//   - 効果音 (SE)：属性魔法、キック、未定義だった毒や斬撃など全12種を定義。
//   - 背景音楽 (BGM)：全6曲の戦闘プレイリストとエンディング曲を格納。
//   - 再生機器：SE用・BGM用の独立したグローバルプレイヤーの初期化。
// * 【４】オーディオ制御コアロジック
//   - toggleMute：消音開通。戦闘中の解除時は停止位置から再生をその場で再開。
//   - playSE：404エラーを自動回避するパス解析を挟み、音量0.5で再生。
//   - startBGM / stopBGM：タイトル、ED、ランダム戦闘曲の選曲とループ・音量制御。
// ================================================================

// ==========================================================================================================
// 🔊 3. サウンドアセットマッピング (過去コードGG・最高峰完全有線版・バグ修正完了版)
// ==========================================
const SOUND_FIRE = getAssetPath('se_clean', 'se_fire_hit.mp3'); 
const SOUND_ICE = getAssetPath('se_clean', 'se_ice_hit.mp3');   
const SOUND_HOLY = getAssetPath('se_clean', 'se_holy_hit.mp3'); 
const SOUND_FREEZE_DEAD = getAssetPath('se_clean', 'se_freeze_hit.mp3'); 

// 🎯【体当たり専用SE登録：絶対アドレス直書きを廃止し、正規関数へ有線直結！】
const SOUND_KICK = getAssetPath('se_clean', 'se_lightkick.mp3');

// 🛠️【大修復：battle.jsで参照される未定義SE変数をすべて開通定義！】
const SOUND_POISON = getAssetPath('se_clean', 'se_poison01.mp3'); 
const SOUND_EARTHQUAKE = getAssetPath('se_clean', 'se_earthshake.mp3'); 
const SOUND_SLASH = getAssetPath('se_clean', 'se_sword01.mp3'); 
const SOUND_WIND = getAssetPath('se_clean', 'se_wind01.mp3'); 
const SOUND_THUNDER = getAssetPath('se_clean', 'se_lightning01.mp3'); 
const SOUND_DRAGON_CRY = getAssetPath('se_clean', 'se_ptrano_voice.mp3'); 
const SOUND_TENTACLE = getAssetPath('se_clean', 'se_tentacls.mp3'); 

const BGM_BATTLE_PLAYLIST = [
    getAssetPath('bgm_clean', 'bgm_battle_arch03.mp3'),
    getAssetPath('bgm_clean', 'bgm_battle_piano11.mp3'),
    getAssetPath('bgm_clean', 'bgm_battle_run15.mp3'),
    getAssetPath('bgm_clean', 'bgm_battle_senritsu04.mp3'),
    getAssetPath('bgm_clean', 'bgm_battle_tactics12.mp3'),
    getAssetPath('bgm_clean', 'bgm_explore_dark09.mp3')
];
const BGM_PEACE_GRAND_END = getAssetPath('bgm_clean', 'bgm_peace_fantasy14.mp3');

window.isMuted = false;

// ⚡ 音楽プレイヤーの固定の器を用意
if (!window._globalSePlayer)  window._globalSePlayer = new Audio();
if (!window._globalBgmPlayer) window._globalBgmPlayer = new Audio();

// ==========================================
// 🔊 4. オーディオ制御コアロジック
// ==========================================

function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById("btn-mute");
    if (btn) btn.innerText = isMuted ? "🔇 音声: OFF" : "🔊 音声: ON";
    
    if (isMuted) {
        if (window._globalBgmPlayer) window._globalBgmPlayer.pause();
        if (window._globalSePlayer) window._globalSePlayer.pause();
    } else {
        // 🌟【大開通】まだ戦闘前ならタイトル曲を、戦闘中なら一時停止していた曲をその場で再生再開！
        if (window.curIdx === -1) {
            startBGM("title");
        } else if (window._globalBgmPlayer) {
            window._globalBgmPlayer.play().catch(e => console.log("BGM resume blocked:", e));
        }
    }
}
       

function playSE(url) {
    if (isMuted) return; 
    try { 
        let targetUrl = url;
        if (typeof window.getCleanAssetPath === 'function' && url && !url.startsWith('http')) {
            targetUrl = window.getCleanAssetPath(url);
        }
        
        window._globalSePlayer.src = targetUrl; 
        
        // 🟢 クエイク（se_earthquake）の時だけ音量を最大(1.0)にし、それ以外は通常(0.5)にする！
        if (url && url.includes("se_earthquake")) {
            window._globalSePlayer.volume = 3.0;
        } else {
            window._globalSePlayer.volume = 0.5;
        }
        
        window._globalSePlayer.play().catch(e => console.log("SE blocked/deferred:", e)); 
    } catch(e){}
}

function startBGM(mode) {
    stopBGM();
    if (isMuted) return;

    const currentFloor = (window.curIdx || 0) + 1;
    const area = (typeof window.getAreaConfig === 'function') ? window.getAreaConfig(currentFloor) : null;
    const guardBgm = "assets/bgm/Battle0A_Steel_Against_the_Altar.mp3";

    let url = "";
    if (mode === "title") {
        url = BGM_BATTLE_PLAYLIST[4];
    } else if (mode === "grand_end") {
        url = BGM_PEACE_GRAND_END;
    } else if (mode === "camp") {
        url = (area && area.campBgm) ? area.campBgm : "assets/bgm/Camping_withthedark.mp3";
    } else if (mode === "boss") {
        url = (area && Array.isArray(area.bgm) && area.bgm[1]) ? area.bgm[1] : getAssetPath('bgm_clean', 'bgm_mukizu.mp3');
    } else if (mode === "battle") {
        url = (area && Array.isArray(area.bgm) && area.bgm[0]) ? area.bgm[0] : guardBgm;
    }

    if (url) {
        try {
            let targetUrl = url;
            if (typeof window.getCleanAssetPath === 'function' && !url.startsWith('http')) {
                targetUrl = window.getCleanAssetPath(url);
            }
            window._globalBgmPlayer.src = targetUrl;
            window._globalBgmPlayer.loop = (mode !== "grand_end");
window._globalBgmPlayer.volume = (mode === "battle" && /Battle0Buptempo_Blade\.mp3|Battle0A_Steel_Against_the_Altar\.mp3/.test(url)) ? 0.13 : (mode === "camp" ? 0.35 : 0.1);
window._globalBgmPlayer.play().then(() => { if (mode === "camp") { window._globalBgmPlayer.volume = 0.35; try { window._globalBgmPlayer.currentTime = 10; } catch(e) {} } }).catch(e => console.log("BGM deferred:", e));


        } catch(e){}
    }
}

function stopBGM() {
    try {
        if (window._globalBgmPlayer) window._globalBgmPlayer.pause();
    } catch(e){}
}

// ==========================================
// 🦇 悪魔城ドラキュラ風 ダークゴシック戦闘BGMエンジン（Web Audio API）
// ==========================================
(function() {
    let bgmCtx = null;
    let bgmTimer = null;
    let isPlaying = false;
    let stepIndex = 0;

    // 音名 → 周波数変換テーブル
    const NOTE_FREQ = {
        "R": 0,
        "A1": 55.00, "Bb1": 58.27, "B1": 61.74,
        "C2": 65.41, "Cs2": 69.30, "D2": 73.42, "Eb2": 77.78, "E2": 82.41, "F2": 87.31, "Fs2": 92.50, "G2": 98.00, "Gs2": 103.83, "A2": 110.00, "Bb2": 116.54, "B2": 123.47,
        "C3": 130.81, "Cs3": 138.59, "D3": 146.83, "Eb3": 155.56, "E3": 164.81, "F3": 174.61, "Fs3": 185.00, "G3": 196.00, "Gs3": 207.65, "A3": 220.00, "Bb3": 233.08, "B3": 246.94,
        "C4": 261.63, "Cs4": 277.18, "D4": 293.66, "Eb4": 311.13, "E4": 329.63, "F4": 349.23, "Fs4": 369.99, "G4": 392.00, "Gs4": 415.30, "A4": 440.00, "Bb4": 466.16, "B4": 493.88,
        "C5": 523.25, "Cs5": 554.37, "D5": 587.33, "Eb5": 622.25, "E5": 659.25, "F5": 698.46, "Fs5": 739.99, "G5": 783.99, "Gs5": 830.61, "A5": 880.00, "Bb5": 932.33
    };

    // 🎵 曲データ定義（16分音符単位・64ステップループ）
    const GOTHIC_TRACKS = {
        // 【1曲目】王道ゴシック疾走曲（Dマイナー / BPM 152）
        1: {
            bpm: 152,
            lead: [
                "D4","F4","A4","D5", "Cs5","A4","F4","E4", "D4","F4","A4","D5", "E5","F5","E5","Cs5",
                "D5","A4","Bb4","G4", "A4","F4","G4","E4", "F4","D4","E4","Cs4", "D4","R","A4","R",
                "Bb4","D5","G5","F5", "E5","C5","G4","E4", "A4","C5","F5","E5", "D5","Bb4","F4","D4",
                "G4","Bb4","E5","D5", "Cs5","A4","E4","Cs4", "D4","F4","A4","Cs5", "D5","R","D5","R"
            ],
            organ: [
                "D3","R","F3","R", "A3","R","F3","R", "D3","R","F3","R", "A3","R","Cs4","R",
                "D3","R","G3","R", "F3","R","E3","R", "D3","R","Cs3","R", "D3","R","R","R",
                "Bb2","R","D3","R", "C3","R","E3","R", "A2","R","C3","R", "Bb2","R","D3","R",
                "G2","R","Bb2","R", "A2","R","Cs3","R", "D3","R","A3","R", "D3","R","R","R"
            ],
            bass: [
                "D2","D3","D2","D3", "D2","D3","D2","D3", "D2","D3","D2","D3", "A1","A2","A1","A2",
                "Bb1","Bb2","Bb1","Bb2", "A1","A2","A1","A2", "G1","G2","A1","A2", "D2","D3","D2","R",
                "G1","G2","G1","G2", "C2","C3","C2","C3", "F1","F2","F1","F2", "Bb1","Bb2","Bb1","Bb2",
                "E1","E2","E1","E2", "A1","A2","A1","A2", "D2","D3","A2","F2", "D2","R","D2","R"
            ],
            drum: [
                "K","H","S","H", "K","H","S","H", "K","H","S","H", "K","K","S","S",
                "K","H","S","H", "K","H","S","H", "K","H","S","H", "K","S","K","S",
                "K","H","S","H", "K","H","S","H", "K","H","S","H", "K","K","S","S",
                "K","H","S","H", "K","H","S","H", "K","S","K","S", "K","K","S","R"
            ]
        },

        // 【2曲目】重厚オルガン＆不穏ボス戦曲（Aマイナー / BPM 138）
        2: {
            bpm: 138,
            lead: [
                "A4","E4","F4","E4", "Gs4","E4","A4","E4", "Bb4","F4","G4","F4", "A4","E4","Gs4","E4",
                "C5","A4","B4","Gs4", "A4","E4","F4","D4", "E4","C4","D4","B3", "E4","R","Gs4","R",
                "A4","C5","E5","D5", "Cs5","A4","E4","Cs4", "D4","F4","A4","G4", "Fs4","D4","A3","Fs3",
                "F4","A4","D5","C5", "B4","Gs4","E4","B3", "C5","A4","Gs4","E4", "A4","R","A4","R"
            ],
            organ: [
                "A3","R","C4","R", "E4","R","Gs3","R", "Bb3","R","D4","R", "A3","R","Gs3","R",
                "A3","R","E4","R", "C4","R","A3","R", "Gs3","R","B3","R", "E3","R","E4","R",
                "A3","R","Cs4","R", "E4","R","Cs4","R", "D3","R","Fs3","R", "A3","R","Fs3","R",
                "D3","R","F3","R", "E3","R","Gs3","R", "A3","R","E3","R", "A3","R","R","R"
            ],
            bass: [
                "A1","A1","A2","A1", "Gs1","Gs1","Gs2","Gs1", "G1","G1","G2","G1", "Fs1","Fs1","F1","E1",
                "A1","A2","G1","G2", "F1","F2","D1","D2", "E1","E2","E1","E2", "E1","B1","E2","R",
                "A1","A2","A1","A2", "A1","A2","G1","G2", "Fs1","Fs2","Fs1","Fs2", "D1","D2","C1","C2",
                "Bb1","Bb2","Bb1","Bb2", "E1","E2","Gs1","Gs2", "A1","E2","C2","E1", "A1","R","A1","R"
            ],
            drum: [
                "K","R","S","H", "K","K","S","H", "K","R","S","H", "K","S","S","H",
                "K","R","S","H", "K","K","S","H", "K","H","S","H", "K","S","K","S",
                "K","H","S","H", "K","H","S","H", "K","H","S","H", "K","K","S","S",
                "K","H","S","H", "K","S","K","S", "K","K","S","S", "K","R","K","R"
            ]
        }
    };

    // 🎹 チェンバロ／リード音（鋭いノコギリ波＋矩形波の重ねがけ）
    function playLeadTone(ctx, freq, time, dur, vol = 0.08) {
        if (!freq) return;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "sawtooth";
        osc2.type = "square";
        osc1.frequency.setValueAtTime(freq, time);
        osc2.frequency.setValueAtTime(freq * 2, time); // 1オクターブ上の倍音でチェンバロ感

        gain.gain.setValueAtTime(vol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 1.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + dur * 1.45);
        osc2.stop(time + dur * 1.45);
    }

    // ⛪ パイプオルガン音（三角波＋正弦波の重厚コード）
    function playOrganTone(ctx, freq, time, dur, vol = 0.07) {
        if (!freq) return;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "triangle";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(freq, time);
        osc2.frequency.setValueAtTime(freq * 0.5, time); // サブオクターブの重み

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(vol, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 2.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + dur * 2.3);
        osc2.stop(time + dur * 2.3);
    }

    // 🎸 重低音ゴシックベース
    function playBassTone(ctx, freq, time, dur, vol = 0.11) {
        if (!freq) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(vol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + dur * 1.25);
    }

    // 🥁 ドラム（バスドラ・スネア・ハイハット）
    function playDrumHit(ctx, type, time) {
        if (!type || type === "R") return;
        if (type === "K") {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(130, time);
            osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);
            gain.gain.setValueAtTime(0.18, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.13);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.14);
        } else {
            const bufSize = ctx.sampleRate * (type === "S" ? 0.11 : 0.04);
            const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(type === "S" ? 0.09 : 0.035, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + (type === "S" ? 0.11 : 0.04));
            noise.connect(gain);
            gain.connect(ctx.destination);
            noise.start(time);
        }
    }

    // ▶️ 再生関数（trackNo = 1 または 2）
    window.playGothicBGM = function(trackNo = 1) {
        window.stopGothicBGM();
        const track = GOTHIC_TRACKS[trackNo] || GOTHIC_TRACKS[1];
        if (!bgmCtx) bgmCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (bgmCtx.state === "suspended") bgmCtx.resume();

        isPlaying = true;
        stepIndex = 0;
        const stepSec = (60 / track.bpm) / 4; // 16分音符の長さ

        function tick() {
            if (!isPlaying) return;
            const now = bgmCtx.currentTime;
            const i = stepIndex % track.lead.length;

            playLeadTone(bgmCtx, NOTE_FREQ[track.lead[i]], now, stepSec);
            playOrganTone(bgmCtx, NOTE_FREQ[track.organ[i]], now, stepSec);
            playBassTone(bgmCtx, NOTE_FREQ[track.bass[i]], now, stepSec);
            playDrumHit(bgmCtx, track.drum[i], now);

            stepIndex++;
            bgmTimer = setTimeout(tick, stepSec * 1000);
        }
        tick();
    };

    // ⏹️ 停止関数
    window.stopGothicBGM = function() {
        isPlaying = false;
        if (bgmTimer) {
            clearTimeout(bgmTimer);
            bgmTimer = null;
        }
    };
})();