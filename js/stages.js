// ==========================================
// 🧱 リポジトリベースパス（製品配布・ストリーミング専用）
// ==========================================
const BASE_ASSETS = {
    repo1: "https://raw.githubusercontent.com/shadow-monk/game1/main/assets/",
    repo2Pages: "https://shadow-monk.github.io/spiral-tower2/assets/"
};

function getAssetPath(category, filename) {
    try {
        if (category === 'hero') return `${BASE_ASSETS.repo1}hero/${filename}`;
        if (category === 'se_clean') return `${BASE_ASSETS.repo2Pages}se/${filename}`; 
        if (category === 'bgm_clean') return `${BASE_ASSETS.repo2Pages}bgm/${filename}`; 
        if (category === 'enemy_legacy') return `${BASE_ASSETS.repo1}${filename}`;
        if (category === 'enemy_slime_new') return `${BASE_ASSETS.repo2Pages}enemies/slime/${filename}`;
        if (category === 'enemy_phantom_new') return `${BASE_ASSETS.repo2Pages}enemies/phantom/${filename}`;
        if (category === 'enemy_new') return `${BASE_ASSETS.repo2Pages}enemies/${filename}`;
        if (category === 'effect') return `${BASE_ASSETS.repo1}effect/${filename}`;
        return "";
    } catch(e) { return ""; }
}

const ATTR = {
    FIRE: "fire", ICE: "ice", HOLY: "holy", AERO: "aero", ELE: "ele", 
    WATER: "water", EARTH: "earth", MAGIC: "magic", MIND: "mind", 
    DARK: "dark", LIGHT: "light", POISON: "poison", TIME: "time", 
    STAR: "star", GRAVITY: "gravity" , DEF: "def"
};

const SPELLS = {
    fire: { id: 1,  name: "ファイア",     attr: ATTR.FIRE },
  wasp2: { id: 2,  name: "フリーズ", attr: ATTR.ICE }, 
    holy: { id: 3,  name: "ホーリー",     attr: ATTR.HOLY },
    wasp: { id: 4,  name: "ワスプ",       attr: ATTR.MAGIC }, 
    scre: { id: 5,  name: "スクリーム",   attr: ATTR.MIND },
    refl: { id: 6,  name: "リフレク",     attr: ATTR.MAGIC },
    wisp: { id: 7,  name: "ウィスプ",     attr: ATTR.HOLY },
    mmis: { id: 8,  name: "マジックミサイル", attr: ATTR.MAGIC },
    scis: { id: 9,  name: "シザース",     attr: ATTR.MAGIC },
    flas: { id: 10, name: "フラッシュ",   attr: ATTR.LIGHT },
    drai: { id: 11, name: "ドレイン",     attr: ATTR.DARK },
    slow: { id: 12, name: "スロウ",       attr: ATTR.TIME },
    flod: { id: 13, name: "フラッド", attr: [ATTR.WATER, ATTR.EARTH] },
    bio:  { id: 14, name: "バイオ",       attr: ATTR.POISON },
    quak: { id: 15, name: "クエイク",     attr: ATTR.EARTH },
    slee: { id: 16, name: "スリープ",     attr: ATTR.MIND },
    dead: { id: 17, name: "デス",         attr: ATTR.DARK },
    mete: { id: 18, name: "メテオ",       attr: ATTR.FIRE },
    aero: { id: 19, name: "エアロ",       attr: ATTR.AERO },
    come: { id: 20, name: "コメット",     attr: ATTR.STAR },
    grav: { id: 21, name: "グラビデ",     attr: ATTR.GRAVITY },
    anal: { id: 22, name: "アナライズ",   attr: ATTR.MAGIC },
    ulti: { id: 23, name: "アルテマ",     attr: ATTR.MAGIC },
    ele:  { id: 24, name: "ライトニング", attr: ATTR.ELE } , 
    ice:  { id: 25,  name: "アイス",       attr: ATTR.ICE },
    def: { id: 26,  name: "シールド", attr: ATTR.DEF    }, 
};

// 📊 全40階層・Excel仕様書完全同期型モンスターマスターデータ
const STAGES = [
  // 1〜12階（LV1）
 { floor: 1,  name: "ゴブリン",   hp: 70,  atk: 5,  lv: 1, weak: [], resist: [], type: "goblin", txt: "【妖精族】野蛮で乱暴な戦闘民族。こん棒や斧をもって暴れまわる！" },
 { floor: 2,  name: "リザードマン", hp: 90,  atk: 13,  lv: 1, weak: [ATTR.ICE], resist: [], type: "lizard", txt: "【獣人族】硬い鱗に覆われた蜥蜴人間。武器やかみつき、尻尾で襲い掛かる！" },
 { floor: 3,  name: "ゾンビ",   hp: 150, atk: 8,  lv: 1, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "zombi", txt: "【アンデッド族】歩き回る屍。痛覚がなくゆっくりと生者を追い求める！" },
  { floor: 4,  name: "ブラッドスパイダー", hp: 80,  atk: 13,  lv: 1, weak: [], resist: [], type: "spider", txt: "【虫族】無数の足が蠢く巨大蜘蛛。蜘蛛の糸（1ターン麻痺）に警戒せよ！" },
 { floor: 5,  name: "スケルトンナイト",   hp: 150, atk: 16,  lv: 1, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "skeleton", txt: "【アンデッド族】剣と盾を操る強固な骸骨騎士。火炎と聖力が大弱点！" },
 { floor: 6,  name: "ハーピィ",            hp: 170, atk: 19,  lv: 1, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", txt: "【飛行族】大気を操る怪鳥。風と雷に脆いが、飛行しているため大地振動は無効！" },
 { floor: 7,  name: "ヘドロスライム",   hp: 200,  atk: 20,  lv: 1, weak: [ATTR.FIRE], resist: [ATTR.ICE, ATTR.MIND], type: "slime", txt: "【粘液族】通路を塞ぐ粘液質の魔物。火炎が有効だが、打撃・氷雪・精神魔法は一切効かない！" },
 { floor: 8,  name: "ロックゴーレム",      hp: 210, atk: 22,  lv: 1, weak: [ATTR.ICE, ATTR.WATER], resist: [ATTR.FIRE, ATTR.MIND], type: "golem", txt: "【人形族】岩石巨兵。氷雪・水に非常に弱い。" },
 { floor: 9, name: "イビルアイ",          hp: 120, atk: 30,  lv: 1, weak: [ATTR.AERO,ATTR.HOLY], resist: [ATTR.FIRE, ATTR.ICE,ATTR.MIND, ATTR.DARK, ATTR.EARTH], type: "eyes", txt: "【悪魔族】浮遊する巨大魔眼。聖なる力が弱点！冷気による凍結や精神催眠は受け付けない。" },
 { floor: 10, name: "カリスドラゴン",      hp: 350, atk: 32,  lv: 1, weak: [], resist: [ATTR.FIRE], type: "dragon", txt: "【竜族】周辺の魔物を統べるフロアボスの1人。強力なブレス、さらに火炎魔法を完全無効化する。" },
   // ⚔️ ～16階　追加モンスター含む
 { floor: 11,  name: "ガーゴイル",          hp: 190, atk: 26,  lv: 1, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.MIND, ATTR.EARTH], type: "gargoyle", txt: "【魔族】守護霊獣。風と雷が直撃するが、精神魔法は効かない。" },
{ floor: 12,  name: "ホブゴブリン",   hp: 100,  atk: 15,  lv: 2, weak: [], resist: [], type: "goblin", txt: "【妖精族・LV2】大型のゴブリン種。耐久力と腕力が少し強い。メイスやクラブを使う！" },
  { floor: 13, name: "マイコニド",          hp: 230, atk: 26,  lv: 1, weak: [ATTR.FIRE], resist: [], type: "maiconid", txt: "【植物族】毒の胞子をまき散らすキノコ怪人。熱や火炎が苦手！" },
 { floor: 14, name: "ファントム",          hp: 280, atk: 30,  lv: 1, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "phantom", txt: "【アンデッド族】彷徨う亡霊。精神を揺さぶる催眠や即死は絶対無効。" },
 { floor: 15, name: "リビングブレード",    hp: 250, atk: 35,  lv: 1, weak: [ATTR.ELE], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "livingsword", txt: "【武器族】自律行動する大剣。電撃のみが弱点であり、精神・即死・猛毒を完全遮断。" },
 { floor: 16, name: "ウェアウルフ",        hp: 330, atk: 40,  lv: 1, weak: [], resist: [], type: "warewolf", txt: "【獣人族】圧倒的な身体能力を持つ。弱点も耐性もないが、月夜の咆哮による超火力特攻に警戒。" },
  { floor: 17,  name: "イグアナソルジャー", hp: 120,  atk: 20,  lv: 2, weak: [ATTR.ICE], resist: [], type: "lizard", txt: "【獣人族・LV2】剣術を使うイグアナの獣人族。反射神経がするどく狩りが得意！" },
 { floor: 18, name: "ブラックウィドウ",    hp: 650, atk: 75, lv: 2, weak: [], resist: [], type: "spider", txt: "【虫族・LV2】漆黒の甲殻を持つ巨大蜘蛛。強烈な麻痺の毒針を隠し持っている。" },
 { floor: 19, name: "オーカーゼリー",       hp: 450, atk: 55,  lv: 2, weak: [ATTR.ICE], resist: [ATTR.EARTH, ATTR.ELE, ATTR.MIND], type: "slime", txt: "【粘液族・LV2】不気味な黄土色に変異した粘液の怪物。床や天井をはいずり周り獲物を捕食する。" },
   { floor: 20, name: "ネクロブック",        hp: 420, atk: 40,  lv: 1, weak: [ATTR.FIRE], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "book", txt: "【書籍族】禁忌の魔導書。火炎に極めて脆いが、ページの中に恐怖の存在を隠している。" },
  
 // 🎨 17〜20階：LV2〜3 変異強化ルート）
  { floor: 21,  name: "リビングデッド",   hp: 300, atk: 20,  lv: 2, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "zombi", txt: "【アンデッド族】歩き回る屍。痛覚がなくゆっくりと生者を追い求める！" },
  { floor: 22, name: "ワーハウンド",        hp: 900, atk: 132, lv: 2, weak: [], resist: [], type: "warewolf", txt: "【獣人族・LV2】ウェアウルフの狂暴化亜種。牙による3段蹴り物理連撃を繰り出してくる。" },
    { floor: 23, name: "バードレディ",        hp: 1300, atk: 148, lv: 2, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", txt: "【飛行族・LV2】妖艶な漆黒とマゼンタを纏う鳥人。真空のかまいたちでプレイヤーを切り裂く。" },
   { floor: 24,  name: "レプティリアン", hp: 800,  atk: 90,  lv: 3, weak: [ATTR.ICE], resist: [], type: "lizard", txt: "【獣人族】硬い鱗に覆われた蜥蜴人間。武器やかみつき、尻尾で襲い掛かる！" },
 { floor: 25,  name: "グール",   hp: 1400, atk: 95,  lv: 3, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "zombi", txt: "【アンデッド族】歩き回る屍。痛覚がなくゆっくりと生者を追い求める！" },
 { floor: 26, name: "タロンバットム",      hp: 500, atk: 90,  lv: 2, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "gargoyle", txt: "【魔族・LV2】青銅の爪をもつ蝙蝠男。闇夜を飛び急降下からの一撃を狙う。" },
 { floor: 27, name: "マッシュノイド",      hp: 550, atk: 90,  lv: 2, weak: [ATTR.FIRE], resist: [ATTR.POISON], type: "maiconid", txt: "【植物族・LV2】胞子毒がより凶悪に変異した歩行菌類。火炎で一気に焼き尽くせ。" },
  { floor: 28, name: "オクトアイズ",        hp: 650, atk: 40, lv: 3, weak: [ATTR.HOLY], resist: [ATTR.ICE,ATTR.MIND], type: "eyes", txt: "【悪魔族・LV3】八つの邪眼を持つ異形。全ての魔力を遮断する「オクトレーザー」を照射。" },
  { floor: 29, name: "グリモワール",        hp: 900, atk: 150, lv: 2, weak: [ATTR.FIRE], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "book", txt: "【書籍族・LV2】死霊術が綴られた黒魔導書。魂を吸い取る挿絵の男を詠唱。" },
  { floor: 30, name: "ブロブ",              hp: 900, atk: 30, lv: 3, weak: [ATTR.DARK, ATTR.MAGIC, ATTR.EARTH, ATTR.AERO, ATTR.ELE, ATTR.FIRE], resist: [ATTR.ICE, ATTR.MIND, ], type: "slime", txt: "【粘液族・LV3】フロアボス。無限に分裂増殖し、全てを飲み込む最悪の巨大アメーバ！" },

   // 🎨 17〜20階：LV2〜3 変異強化ルート）
 { floor: 31, name: "アイスファング",      hp: 1400, atk: 174, lv: 3, weak: [ATTR.FIRE], resist: [ATTR.ICE], type: "warewolf", txt: "【獣人族・LV3】氷の世界に住まう魔狼。俊敏な攻撃が獲物を始末する！" },
  { floor: 32, name: "スパイドラ",          hp: 1400, atk: 180, lv: 3, weak: [], resist: [], type: "spider", txt: "【虫族・LV3】最深層の巣に潜む超巨大蜘蛛。多くの人間を捕獲してきた。" },
  { floor: 33, name: "ブラッディボーン",    hp: 1200, atk: 140, lv: 2, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "skeleton", txt: "【アンデッド・LV2】血の魔力で再構成された骨騎士。恐るべき「毒血ブレス」を構える。" },
 { floor: 34, name: "ストーンゴーレム",    hp: 1500, atk: 158, lv: 2, weak: [ATTR.ICE, ATTR.WATER], resist: [ATTR.POISON, ATTR.ELE, ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "golem", txt: "【人形族・LV2】高密度の魔結晶岩で造られた巨像。激しい大地震でチャージを粉砕する。" },
  { floor: 35, name: "スライサー",          hp: 1500, atk: 190, lv: 2, weak: [ATTR.ELE], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "livingsword", txt: "【武器族・LV2】空間を切り刻む呪いの超大剣。即死級の威力を誇る「断頭台の一撃」を放つ。" },
  { floor: 36, name: "レイス",        hp: 1600, atk: 190,  lv: 2, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "phantom", txt: "【アンデット族・LV2】深層の冷気に適応した下級魔霊。火炎と聖力が大弱点。" },
  { floor: 37, name: "ハンターホーク",      hp: 1600, atk: 190, lv: 3, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", txt: "【飛行族・LV3】中ボス。必中の狙撃能力を持つ変異鳥獣。回避不能の「狙撃弓」を放ってくる。" },
  { floor: 38,  name: "ドラコニアン", hp: 1700,  atk: 200,  lv: 4, weak: [ATTR.ICE], resist: [], type: "lizard", txt: "【獣人族】硬い鱗に覆われた蜥蜴人間。武器やかみつき、尻尾で襲い掛かる！" },
 { floor: 39,  name: "ガスト",   hp: 1700, atk: 200,  lv: 4, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "zombi", txt: "【アンデッド族】歩き回る屍。痛覚がなくゆっくりと生者を追い求める！" },
   { floor: 40 , name: "サイコパピル",        hp: 720, atk: 260, lv: 2, weak: [ATTR.HOLY], resist: [ATTR.ICE, ATTR.MIND], type: "eyes", txt: "【悪魔族・LV2】精神崩壊を誘発する魔眼種。極大の聖光ホーリーのみがその防壁を抉じ開ける。" },
    // 🎨 LV2〜3 変異強化ルート）
  { floor: 41, name: "死霊騎士ワイト",        hp: 1610, atk: 200, lv: 3, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "skeleton", txt: "【アンデッド・LV3】無数の怨念集結した巨大骨魔人。強力なカウンターシールドを展開。" },
  { floor: 42, name: "フレイムドラゴン",    hp: 1800, atk: 200, lv: 2, weak: [ATTR.ICE], resist: [ATTR.FIRE], type: "dragon", txt: "【竜族・LV2】フロアボス。塔の中層を守護する灼熱の巨竜。全てを灰にする高火力の「フレイムブレス」を放つ。" },
  { floor: 43, name: "オブシニアン",        hp: 2100, atk: 200, lv: 3, weak: [], resist: [ATTR.POISON, ATTR.ELE, ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "golem", txt: "【人形族・LV3】黒曜石で構成された超重量ゴーレム。プレイヤーの全身を完全に結晶化させにくる。" },
  { floor: 44, name: "プレシオライト",      hp: 1500, atk: 210, lv: 3, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "gargoyle", txt: "【魔族・LV3】結晶化した翼を持つ最深層ガルゴイル。「ニードルマシンガン」でハチの巣にする。" },
   { floor: 45, name: "アイアンゴーレム",    hp: 4000, atk: 210, lv: 4, weak: [], resist: [ATTR.POISON, ATTR.ELE, ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "golem", txt: "【人形族・LV4】タワー最上階を守る鉄血の巨神。全ての被ダメージを確定「1ポイント」に軽減する無敵の防御形態を持つ。" },
   { floor: 46,  name: "ゴブリンガード",   hp: 400,  atk: 30,  lv: 3, weak: [], resist: [], type: "goblin", txt: "【妖精族】ゴブリン族の精鋭。特殊訓練を受けた衛兵部隊！" },
   { floor: 47, name: "スポアロード",        hp: 2000, atk: 220, lv: 3, weak: [ATTR.FIRE], resist: [ATTR.POISON], type: "maiconid", txt: "【植物族・LV3】キノコ族の貴族。吸い込むと魔法威力を激減させる「魔の胞子」を拡散。" },
{ floor: 48, name: "タブーノート",        hp: 1850, atk: 220, lv: 3, weak: [ATTR.FIRE], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "book", txt: "【書籍族・LV3】神に禁じられた黙示録。強力な「ブックマーク」でこちらの全戦術を封印する。" },
   { floor: 49, name: "ゴーストヘッド",      hp: 1800, atk: 220, lv: 3, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "phantom", txt: "【亡霊族・LV3】宙を彷徨う巨大な怨霊の生首。狂気の発狂ガスを噴射し、道具カバンをロックする。" },
   { floor: 50, name: "ブルードラゴン",      hp: 3000, atk: 300, lv: 3, weak: [], resist: [ATTR.ELE, ], type: "dragon", actions: ["電撃ブレス", "ele20","尻尾攻撃"],txt: "【竜族・LV3】空気を割る咆哮を上げ、獲物を排除する電撃竜。高電圧「電撃ブレス」を放つ迷宮の青竜。" },
 
   { floor: 51, name: "ダンシングブレイド",  hp: 2150, atk: 200, lv: 3, weak: [ATTR.ELE], resist: [ATTR.MIND, ATTR.DARK, ATTR.POISON], type: "livingsword", txt: "【武器族・LV3】乱舞する無数の魔剣。見るものを幻惑する「処刑の舞」は回避が極めて困難。" },
   { floor: 52,  name: "タランチュラ", hp: 1900,  atk: 200,  lv: 4, weak: [], resist: [], type: "spider", txt: "【虫族】腕力も強く素早い凶悪な毒蜘蛛、毒牙の奇襲に警戒せよ！" },
 {floor: 53,  name: "ゴブリン？",   hp: 4500,  atk: 300,  lv: 4, weak: [], resist: [], type: "goblin", txt: "【？族】野蛮で乱暴な戦闘民族ゴブリンのようだが、なにか様子がおかしい。" },

  { floor: 54,  name: "スカルソード",   hp: 2000, atk:250,  lv: 4, weak: [ATTR.FIRE, ATTR.HOLY], resist: [ATTR.MIND, ATTR.DARK], type: "skeleton", txt: "【アンデッド族】剣と盾を操る強固な骸骨騎士。火炎と聖力が大弱点！" },
 { floor: 55,  name: "ハルピュイア",    hp: 2220, atk: 280,  lv: 4, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", txt: "【飛行族】大気を操る怪鳥。風と雷に脆いが、飛行しているため大地振動は無効！" },
 { floor: 56,  name: "ゼラチナスキューブ",   hp: 3000,  atk: 280,  lv: 4, weak: [ATTR.FIRE], resist: [ATTR.ICE, ATTR.MIND], type: "slime", txt: "【粘液族】通路を塞ぐ粘液質の魔物。火炎が有効だが、打撃・氷雪・精神魔法は一切効かない！" },
 { floor: 59, name: "グリムキャップ", hp: 3200, atk: 250, int: 180, lv: 59, weak: [ATTR.ICE], resist: [ATTR.FIRE], type: "goblin", actions: ["カバン強奪","猛毒の牙"], txt: "【妖精族】特殊な魔力を宿した魔導ゴブリン。妖精族直伝の呪文や技を使用する！" },
{ floor: 60, name: "スキャナーズ", hp: 3200, atk: 250, int: 180, lv: 59, weak: [ATTR.ICE], resist: [ATTR.FIRE], type: "eyes", actions: ["グラビデ", "クエイク", "アナライズ"], txt: "【妖精族】特殊ン。妖精族直伝の呪文や使用する！" },

  // 🎨 レイブン空挺部隊）
{ floor: 61, name: "レイブンファム", hp: 2300, atk: 245, int: 175, lv: 61, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", animPattern: [1, 3, 1, 2], actions: ["金切声", "体当たり", "スピンアタック"], txt: "【飛行族】高層階の暴風を自在に操る漆黒の鳥人。鋭利な風の刃と怪音波で獲物を追い詰める！" },
{ floor: 62, name: "レイブンフェザー", hp: 2350, atk: 248, int: 180, lv: 62, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", actions: ["麻痺爪", "ファイア", "ナイフ投げ"], txt: "【飛行族】眩い白銀の翼を持つ怪鳥。閃光で視界を奪い、高空から無数の羽手裏剣を射出する！" },
{ floor: 63, name: "グレゴリー", hp: 2400, atk: 260, int: 165, lv: 63, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "gargoyle", actions: ["攻撃アップ術", "魔力の妖盾", "体当たり"], txt: "【魔族】崩落テラスの外壁に張り付く重装石翼獣。重力波を放ち、侵入者の足場を粉砕する！" },
{ floor: 64, name: "レイブン３姉妹次女", hp: 2850, atk: 230, int: 195, lv: 64, filter: "none",weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", actions: ["スピンアタック", "ジャミングフェザーⅠ","3連撃"],animPattern:"MC", atkFrame: "C04", txt: "【飛行族】塔の外空を飛び交う凶鳥３姉妹の妹。ハルバードや怪力攻撃を得意とする。" },
{ floor: 65, name: "レイブン３姉妹長女", hp: 2520, atk: 255, int: 185, lv: 65, filter: "none",weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", actions: ["4連斬り", "エックス斬り", "ジャミングフェザーⅡ"],animPattern: ["B01", "B02", "B01", "B03", "B02", "B01"], atkFrame: "B04", txt: "【飛行族】３姉妹の長女。呪文で撹乱し、螺旋剣で貫く" },
{ floor: 66, name: "レイブン３姉妹三女", hp: 2200, atk: 290, int: 210, lv: 66, filter: "none",weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", actions: ["スナイプボウガン","スイッチフェザー","灼熱火炎弾"], animPattern: ["A01", "A02", "A01", "A03", "A02", "A01"], atkFrame: "A04", txt: "【飛行族】３姉妹の隠れリーダー格。高空から星屑の礫を降り注がせ、狂気の咆哮で敵の神経を麻痺させる。" },
{ floor: 67, name: "レイブンバトラー", hp: 2650, atk: 265, int: 170, lv: 67, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "gargoyle", actions: ["ドレイン", "金切声", "体当たり"], txt: "【魔族】青銅の皮膜翼を広げて滑空する吸血ガーゴイル。夜空の暗がりから音もなく急襲してくる！" },
{ floor: 68, name: "レイブンズペット", hp: 2680, atk: 235, int: 220, lv: 68, weak: [ATTR.HOLY], resist: [ATTR.ICE, ATTR.MIND], type: "eyes", actions: ["アナライズ", "サイコキネシス", "グラビデ"], txt: "【悪魔族】虚空を浮遊する巨大な千里眼。あらゆる死角を暴き立て、重力光線で侵入者を落下死させる。" },
{ floor: 69, name: "ガーグライダー", hp: 2720, atk: 275, int: 160, lv: 69, weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.MIND, ATTR.EARTH, ATTR.DARK], type: "gargoyle", actions: ["斧投げ", "バブルブレス", "体当たり"], txt: "【魔族】上昇気流に乗って高速滑空する鋼鉄石獣。強固な魔力障壁を張りつつ猛スピードで激突する！" },
{ floor: 70, name: "レイブンクイーン", hp: 2800, atk: 280, int: 230, lv: 70, filter: "none",weak: [ATTR.AERO, ATTR.ELE], resist: [ATTR.EARTH], type: "harpy", actions: ["ジャミングフェザーⅠ", "ジャミングフェザーⅡ", "スイッチフェザー"], animPattern: ["D01", "D02", "D01", "D03", "D02", "D01"], atkFrame: "D04",txt: "【飛行族】フロアボス。上層の暴風雲海を統べる大翼の魔女王。嵐を呼び、死の呪詛を羽に乗せて放つ！" },


{ floor: 71, name: "スキャナーズ", hp: 3200, atk: 250, int: 180, lv: 59, weak: [ATTR.ICE], resist: [ATTR.FIRE], type: "eyes", actions: ["グラビデ", "クエイク", "アナライズ"], txt: "【妖精族】特殊ン。妖精族直伝の呪文や使用する！" },
{ floor: 72, name: "モルグページ", hp: 3200, atk: 250, int: 180, lv: 59, weak: [ATTR.ICE], resist: [ATTR.FIRE], type: "book", actions: ["バイオ", "ドレイン", "マジックミサイル"], txt: "【妖な魔力を宿した魔導ゴブリン。妖精族直伝の呪文や技を使用する！" },
{ floor: 73, name: "レブナント", hp: 3200, atk: 250, int: 180, lv: 59, weak: [ATTR.ICE], resist: [ATTR.FIRE], type: "skeleton", actions: ["コメット", "フラッシュ", "デス"], txt: "【妖精力を宿した魔導ゴブリン。妖精族直伝の呪文や技を使用する！" },


]



// ==========================================
// 🌀 無限回廊・未記載階層の動的自動生成エンジン (50階刻み仕様)
// ==========================================

function getStageData(targetFloor) {
    // 1. 【ステージ生成】既存の STAGES 配列に定義があるか検索（1〜55階）
    const fixedStage = STAGES.find(s => s.floor === targetFloor);
    if (fixedStage) return fixedStage;

    // 2. 50階ごとにデバッグログを出力
    if (targetFloor % 50 === 0) {
        console.log(`[DEBUG] 🌀 無限回廊: 第${targetFloor}階層の敵を自動生成しました。`);
    }


// 3. 【種族呼び出し】疑似ランダムハッシュによる固定モンスター選出処理（ワープ画面と戦闘の100%完全一致）
        const raceMaster = window.MONSTER_RACE_MASTER || {};
        const raceValues = Object.keys(raceMaster)
            .filter(k => !isNaN(k) && raceMaster[k] && raceMaster[k].id)
            .map(k => raceMaster[k]);

        let race = { id: "goblin", name: "ゴブリン", hp: 70, atk: 5, weak: [], res: [], actions: [1] };

        if (raceValues.length > 0) {
            // 💡 階数(targetFloor)から一意の数字を計算し、配列の数で割った余りで確定させる
            const hash = Math.abs((targetFloor * 2654435761) ^ (targetFloor >> 16));
            const selectedIndex = hash % raceValues.length;
            race = raceValues[selectedIndex];
            // ★ここに1行追加するだけ！
if (race.cp === 5 && (hash % 100) >= 65) race = raceValues.find(r => r.cp === 1) || race;
        }

// 4. 【HPなどステータス数値】階層に応じたステータスの倍率計算(種族に数式HPやATK
// 1. 倍率・決定論的擬似乱数・一括計算ヘルパー
// 🌟 57〜60階は51階相当の強さからスタートし、10階ごとに+0.7倍するマイルド計算式
const diffFloor = Math.max(0, targetFloor - 57);
const block10   = Math.floor(diffFloor / 10);
const intra10   = diffFloor % 10;
const scale     = 9.0 + (block10 * 0.7) + (intra10 * 0.02);

const seededRandom = seed => Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000);
const calcStat = (val, offset) => Math.max(1, Math.round((val || 1) * scale * (0.8 + seededRandom(targetFloor * 3 + offset) * 0.4)));

// 2. ステータス一括算出
const finalHp = calcStat(race.hp, 1), finalAtk = calcStat(race.atk, 2), finalInt = calcStat(race.int ?? race.atk, 3);

// 3. 行動パターン拡張（50階/70階）
let finalActions = [...(race.actions || [1])];

// 4. 生成オブジェクト返却
// 動的フレーバーテキスト取得
    const generatedTxt = (typeof window.generateFlavorText === 'function') 
        ? window.generateFlavorText(race, targetFloor) 
        : "深層に潜む強力な変異体。";
// --------------------------------------------------
    // 💡【追加箇所】階以降のモンスター名（N2＋区切り＋N3）決定処理
    // --------------------------------------------------
let enemyName = race.name || "魔物";
if (!fixedStage && typeof window.generateEnemyName === 'function') {
    enemyName = window.generateEnemyName(race.id, targetFloor);
}

    // 確定敵オブジェクト返却
    return {
        id: race.id || "goblin",
        floor: targetFloor,
        name: enemyName,
        cp: race.cp || 1,
        hp: finalHp,
        maxHp: finalHp,
        atk: finalAtk,
        int: finalInt,
        lv: targetFloor,
        weak: race.weak || [],
        resist: race.res || race.resist || [],
        type: race.id || race.type || "goblin",
        txt: race.txt || generatedTxt, // 👈 ここで生成されたフレーバーテキストをセット
        actions: finalActions,
        selectedActions: finalActions.slice().sort(() => 0.5 - seededRandom(targetFloor)).slice(0, 3)
    };
}

window.STAGES = STAGES;
