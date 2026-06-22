// أمر الاستثمار - تجميد مبلغ لمدة معينة، ربح ثابت مضمون (مخاطرة منخفضة)
const formatNumber = (n) => Number(n || 0).toLocaleString('en');

const saveUser = (sender, data) => {
    if (!global.db?.users) return;
    global.db.users[sender] = Object.assign(global.db.users[sender] || {}, data);
};

const getUser = (sender) => {
    const u = global.db?.users?.[sender] || {};
    return {
        xp: Number(u.xp) || 0, coins: Number(u.coins) || 0,
        diamonds: Number(u.diamonds) || 0, dollars: Number(u.dollars) || 0,
        level: Number(u.level) || 0, msgcount: Number(u.msgcount) || 0,
        investments: Array.isArray(u.investments) ? u.investments : [],
        ...u
    };
};

// خطط الاستثمار - مدة بالساعات + نسبة ربح ثابتة
const PLANS = {
    1: { hours: 6,  rate: 0.10, label: '6 ساعات' },   // 10%
    2: { hours: 24, rate: 0.25, label: '24 ساعة' },   // 25%
    3: { hours: 72, rate: 0.60, label: '3 أيام' },    // 60%
};

const MIN_INVEST = 100;

const handler = async (m, { conn, text }) => {
    if (!m?.sender) return;
    if (!global.db?.users) return m.reply('*❌ قاعدة البيانات غير متاحة*');

    const user = getUser(m.sender);
    const args = (text || '').trim().split(/\s+/).filter(Boolean);

    // ─ عرض الاستثمارات الحالية ─
    if (!args.length || args[0] === 'حالتي' || args[0] === 'status') {
        if (!user.investments.length) {
            return m.reply(
                `*💼 محفظة الاستثمار فاضية*\n\n` +
                `ابدأ استثمار:\n` +
                `*.استثمار <المبلغ> <رقم الخطة>*\n\n` +
                `*الخطط المتاحة:*\n` +
                `*1* ← 6 ساعات (ربح 10%)\n` +
                `*2* ← 24 ساعة (ربح 25%)\n` +
                `*3* ← 3 أيام (ربح 60%)\n\n` +
                `مثال: *.استثمار 1000 2*`
            );
        }

        const now = Date.now();
        const lines = user.investments.map((inv, i) => {
            const plan = PLANS[inv.plan];
            const matures = inv.startedAt + plan.hours * 3600 * 1000;
            const remaining = matures - now;
            const ready = remaining <= 0;
            const status = ready
                ? '✅ جاهز للسحب! اكتب *.استثمار سحب*'
                : `⏳ متبقي ${Math.ceil(remaining / 3600000)} ساعة`;
            return `${i + 1}. 💰 ${formatNumber(inv.amount)} 🪙 ← ربح متوقع ${formatNumber(Math.round(inv.amount * plan.rate))} 🪙\n   ${status}`;
        }).join('\n\n');

        return m.reply(`*💼 استثماراتك الحالية:*\n\n${lines}`);
    }

    // ─ سحب كل الاستثمارات المكتملة ─
    if (args[0] === 'سحب' || args[0] === 'withdraw') {
        const now = Date.now();
        let totalReturn = 0;
        let count = 0;

        user.investments = user.investments.filter(inv => {
            const plan = PLANS[inv.plan];
            const matures = inv.startedAt + plan.hours * 3600 * 1000;
            if (now >= matures) {
                totalReturn += inv.amount + Math.round(inv.amount * plan.rate);
                count++;
                return false; // شيله من القائمة
            }
            return true; // لسه ما استحقش
        });

        if (!count) return m.reply('*❌ مفيش استثمارات جاهزة للسحب دلوقتي*');

        user.coins = (user.coins || 0) + totalReturn;
        saveUser(m.sender, user);

        return m.reply(
            `*✅ تم سحب ${count} استثمار${count > 1 ? 'ات' : ''}!*\n\n` +
            `💰 إجمالي المسترد: ${formatNumber(totalReturn)} 🪙\n` +
            `💳 رصيدك الآن: ${formatNumber(user.coins)} 🪙`
        );
    }

    // ─ استثمار جديد ─
    const amount = parseInt(args[0]);
    const planId = parseInt(args[1]) || 1;

    if (!amount || amount < MIN_INVEST) {
        return m.reply(`*❌ أقل مبلغ للاستثمار ${formatNumber(MIN_INVEST)} 🪙*\nمثال: *.استثمار 1000 2*`);
    }
    if (!PLANS[planId]) {
        return m.reply('*❌ رقم خطة غير صحيح*\nالخطط: *1* (6س) | *2* (24س) | *3* (3 أيام)');
    }
    if ((user.coins || 0) < amount) {
        return m.reply(`*❌ رصيدك غير كافٍ!*\n💳 رصيدك: ${formatNumber(user.coins)} 🪙`);
    }
    if (user.investments.length >= 5) {
        return m.reply('*❌ أقصى عدد استثمارات مفتوحة في نفس الوقت: 5*');
    }

    user.coins -= amount;
    user.investments.push({ amount, plan: planId, startedAt: Date.now() });
    saveUser(m.sender, user);

    const plan = PLANS[planId];
    const expectedProfit = Math.round(amount * plan.rate);

    return m.reply(
        `*✅ تم فتح استثمار جديد!*\n\n` +
        `💰 المستثمر: ${formatNumber(amount)} 🪙\n` +
        `⏳ المدة: ${plan.label}\n` +
        `📈 الربح المتوقع: ${formatNumber(expectedProfit)} 🪙\n` +
        `💳 رصيدك الآن: ${formatNumber(user.coins)} 🪙\n\n` +
        `استخدم *.استثمار* لمتابعة حالة استثماراتك`
    );
};

handler.usage    = ['استثمار <مبلغ> <خطة>', 'استثمار سحب', 'استثمار حالتي'];
handler.category = 'bank';
handler.command  = ['استثمار', 'invest'];

export default handler;
