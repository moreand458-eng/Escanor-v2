// ════════════════════════════════════════
//  db.js - قاعدة بيانات نظام القلعة
//  ESCANOR CLASH System
// ════════════════════════════════════════

// ══ الثوابت ══
export const MAX_LEVEL = 5;

export const DEFAULT_PLAYER = {
    // العملات
    gold:    100,
    elixir:  50,
    gems:    5,

    // المباني (مستوى كل مبنى)
    buildings: {
        castle:    1,  // 🏰 القلعة الرئيسية
        goldMine:  1,  // ⛏️ منجم الذهب
        elixirLab: 1,  // 🧪 مصنع الإكسير
        gemMine:   0,  // 💎 منجم الجواهر (0 = غير مبني)
        wall:      1,  // 🛡️ السور
        barracks:  1,  // 🏟️ الثكنة
        hospital:  0,  // 🏥 المستشفى
        lab:       0,  // 🔬 مركز البحث
    },

    // الجيش
    army: {
        infantry: 0,   // 🪖 مشاة
        archer:   0,   // 🏹 رماة
        knight:   0,   // 🐉 فرسان
        mage:     0,   // 🧙 سحرة
        giant:    0,   // 👹 جبابرة
    },

    // إحصائيات
    stats: {
        wins:       0,
        losses:     0,
        cmdCount:   0,
        lastDaily:  0,
        lastMission:0,
        lastMine:   0,  // آخر مرة جمع من المنجم
        registeredAt: 0,
    },

    // حماية من الهجوم (timestamp)
    shield: 0,
};

// ══ بيانات المباني ══
export const BUILDINGS_DATA = {
    castle: {
        emoji: '🏰',
        name:  'القلعة الرئيسية',
        desc:  'تحدد الحد الأقصى لمستوى باقي المباني',
        cost:  { gold: [0, 500, 1500, 4000, 10000], elixir: [0, 0, 0, 0, 0], gems: [0, 0, 0, 0, 0] },
        time:  [0, 0, 60, 180, 360], // دقائق للبناء
        maxUnlock: [1, 2, 3, 4, 5],  // أقصى مستوى للمباني التانية
    },
    goldMine: {
        emoji: '⛏️',
        name:  'منجم الذهب',
        desc:  'يولد ذهب تلقائياً كل ساعتين',
        cost:  { gold: [0, 100, 300, 800, 2000], elixir: [0, 0, 0, 0, 0], gems: [0, 0, 0, 0, 0] },
        time:  [0, 0, 30, 90, 180],
        production: [0, 20, 50, 120, 300], // ذهب كل ساعتين
    },
    elixirLab: {
        emoji: '🧪',
        name:  'مصنع الإكسير',
        desc:  'يولد إكسير تلقائياً كل ساعتين',
        cost:  { gold: [0, 150, 400, 1000, 2500], elixir: [0, 0, 0, 0, 0], gems: [0, 0, 0, 0, 0] },
        time:  [0, 0, 30, 90, 180],
        production: [0, 10, 25, 60, 150],
    },
    gemMine: {
        emoji: '💎',
        name:  'منجم الجواهر',
        desc:  'يولد جواهر نادرة كل 12 ساعة',
        cost:  { gold: [0, 2000, 5000, 12000, 30000], elixir: [0, 1000, 2500, 6000, 15000], gems: [0, 0, 0, 0, 0] },
        time:  [0, 120, 360, 720, 1440],
        production: [0, 1, 2, 4, 8],
        requiresCastle: [0, 3, 4, 5, 5],
    },
    wall: {
        emoji: '🛡️',
        name:  'السور',
        desc:  'يحمي % من مواردك عند الهجوم',
        cost:  { gold: [0, 200, 600, 1500, 4000], elixir: [0, 0, 0, 0, 0], gems: [0, 0, 0, 0, 0] },
        time:  [0, 0, 45, 120, 240],
        protection: [0, 10, 20, 35, 50], // % محمية
    },
    barracks: {
        emoji: '🏟️',
        name:  'الثكنة',
        desc:  'يحدد أنواع الجنود المتاحة للتجنيد',
        cost:  { gold: [0, 300, 800, 2000, 5000], elixir: [0, 0, 0, 0, 0], gems: [0, 0, 0, 0, 0] },
        time:  [0, 0, 60, 150, 300],
        unlocks: [
            [],
            ['infantry'],
            ['infantry','archer'],
            ['infantry','archer','knight'],
            ['infantry','archer','knight','mage'],
            ['infantry','archer','knight','mage','giant'],
        ],
    },
    hospital: {
        emoji: '🏥',
        name:  'المستشفى',
        desc:  'يحمي % من جنودك عند الخسارة',
        cost:  { gold: [0, 500, 1200, 3000, 7000], elixir: [0, 200, 500, 1200, 3000], gems: [0, 0, 0, 0, 0] },
        time:  [0, 60, 180, 360, 720],
        save:  [0, 15, 30, 45, 60], // % جنود بتتنقذ
        requiresCastle: [0, 2, 3, 4, 5],
    },
    lab: {
        emoji: '🔬',
        name:  'مركز البحث',
        desc:  'يحسن قوة الجنود بنسبة %',
        cost:  { gold: [0, 800, 2000, 5000, 12000], elixir: [0, 400, 1000, 2500, 6000], gems: [0, 0, 0, 0, 0] },
        time:  [0, 90, 240, 480, 960],
        boost: [0, 10, 20, 35, 50], // % تحسين
        requiresCastle: [0, 2, 3, 4, 5],
    },
};

// ══ بيانات الجنود ══
export const ARMY_DATA = {
    infantry: {
        emoji: '🪖',
        name:  'مشاة',
        cost:  { elixir: 10 },
        power: { atk: 10, def: 8 },
        requiresBarracks: 1,
        trainTime: 1, // دقيقة
    },
    archer: {
        emoji: '🏹',
        name:  'رماة',
        cost:  { elixir: 20 },
        power: { atk: 18, def: 5 },
        requiresBarracks: 2,
        trainTime: 2,
    },
    knight: {
        emoji: '🐉',
        name:  'فرسان',
        cost:  { elixir: 50, gold: 20 },
        power: { atk: 35, def: 30 },
        requiresBarracks: 3,
        trainTime: 5,
    },
    mage: {
        emoji: '🧙',
        name:  'سحرة',
        cost:  { elixir: 80, gold: 30 },
        power: { atk: 60, def: 15 },
        requiresBarracks: 4,
        trainTime: 8,
    },
    giant: {
        emoji: '👹',
        name:  'جبابرة',
        cost:  { elixir: 150, gold: 50, gems: 1 },
        power: { atk: 100, def: 100 },
        requiresBarracks: 5,
        trainTime: 15,
    },
};

// ══ DB Helpers ══
export const getDB = () => {
    if (!global._gs)          global._gs = {};
    if (!global._gs.__clash)  global._gs.__clash = {};
    return global._gs.__clash;
};

export const getPlayer = (jid) => {
    const db = getDB();
    if (!db[jid]) return null;
    return db[jid];
};

export const createPlayer = (jid, name = '') => {
    const db = getDB();
    if (db[jid]) return db[jid];
    db[jid] = JSON.parse(JSON.stringify(DEFAULT_PLAYER));
    db[jid].name = name;
    db[jid].stats.registeredAt = Date.now();
    return db[jid];
};

export const isRegistered = (jid) => !!getDB()[jid];

// حساب القوة الكلية للجيش
export const calcPower = (p) => {
    let total = 0;
    const labBoost = 1 + ((BUILDINGS_DATA.lab.boost[p.buildings.lab] || 0) / 100);
    for (const [type, count] of Object.entries(p.army)) {
        if (!count || !ARMY_DATA[type]) continue;
        const { atk, def } = ARMY_DATA[type].power;
        total += (atk + def) * count * labBoost;
    }
    return Math.floor(total);
};

// حساب الموارد المحمية من السور
export const calcProtected = (p) => {
    return BUILDINGS_DATA.wall.protection[p.buildings.wall] || 0;
};

// حساب إنتاج المنجم
export const calcMineProduction = (p) => ({
    gold:  BUILDINGS_DATA.goldMine.production[p.buildings.goldMine]   || 0,
    elixir:BUILDINGS_DATA.elixirLab.production[p.buildings.elixirLab] || 0,
    gems:  BUILDINGS_DATA.gemMine.production[p.buildings.gemMine]     || 0,
});

// التحقق من إمكانية بناء/ترقية
export const canUpgrade = (p, building) => {
    const data  = BUILDINGS_DATA[building];
    if (!data) return { ok: false, reason: 'مبنى غير موجود' };

    const curLvl = p.buildings[building];
    if (curLvl >= MAX_LEVEL) return { ok: false, reason: 'وصلت الحد الأقصى' };

    const nextLvl = curLvl + 1;

    // تحقق من مستوى القلعة
    const reqCastle = data.requiresCastle?.[nextLvl] || 0;
    if (p.buildings.castle < reqCastle) {
        return { ok: false, reason: `محتاج القلعة مستوى ${reqCastle} الأول` };
    }

    // تحقق من التكاليف
    const cost = {
        gold:   data.cost.gold[nextLvl]   || 0,
        elixir: data.cost.elixir[nextLvl] || 0,
        gems:   data.cost.gems[nextLvl]   || 0,
    };

    if (p.gold   < cost.gold)   return { ok: false, reason: `محتاج ${cost.gold} ذهب - عندك ${p.gold}` };
    if (p.elixir < cost.elixir) return { ok: false, reason: `محتاج ${cost.elixir} إكسير - عندك ${p.elixir}` };
    if (p.gems   < cost.gems)   return { ok: false, reason: `محتاج ${cost.gems} جواهر - عندك ${p.gems}` };

    return { ok: true, cost, nextLvl };
};

// خصم التكلفة
export const deductCost = (p, cost) => {
    p.gold   -= cost.gold   || 0;
    p.elixir -= cost.elixir || 0;
    p.gems   -= cost.gems   || 0;
};

// اسم المبنى عربي
export const getBuildingName = (key) => BUILDINGS_DATA[key]?.name || key;
export const getBuildingEmoji = (key) => BUILDINGS_DATA[key]?.emoji || '🏗️';

// تحويل اسم عربي لـ key
export const BUILDING_ALIASES = {
    'قلعة':         'castle',
    'القلعة':       'castle',
    'منجم':         'goldMine',
    'منجم_الذهب':   'goldMine',
    'مصنع':         'elixirLab',
    'مصنع_الاكسير': 'elixirLab',
    'مصنع_الإكسير': 'elixirLab',
    'جواهر':        'gemMine',
    'منجم_الجواهر': 'gemMine',
    'سور':          'wall',
    'ثكنة':         'barracks',
    'مستشفى':       'hospital',
    'بحث':          'lab',
    'مركز_البحث':   'lab',
};

export const ARMY_ALIASES = {
    'مشاة':    'infantry',
    'رماة':    'archer',
    'فرسان':   'knight',
    'سحرة':    'mage',
    'جبابرة':  'giant',
};

// handler فاضي - الملف ده data فقط
const handler = async () => {};
handler.command  = [];
handler.category = 'dev';
export default handler;
