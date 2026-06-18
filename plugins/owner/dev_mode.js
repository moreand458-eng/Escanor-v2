const handler = async (m, { conn, command }) => {
    if (command === 'مغلق') {
        global.devStatus = 'closed';
        return m.reply('*🔴 تم تفعيل وضع المغلق*\n> أمر .المطور هيرد بـ "مش فاضي"');
    }
    if (command === 'مفتوح') {
        global.devStatus = 'open';
        return m.reply('*🟢 تم تفعيل وضع المفتوح*\n> أمر .المطور هيرد عادي');
    }
};

handler.usage = ['مغلق', 'مفتوح'];
handler.category = 'owner';
handler.command = ['مغلق', 'مفتوح'];
handler.owner = true;
export default handler;
