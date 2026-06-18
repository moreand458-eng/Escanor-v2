const UPDATE_MSG = `جّـــــآريَ تٌحًمًــــيَلَ تٍــًحَـديْــٍثً الـٌبـوٌتَ
██████▓▓▒▒ 99% .....📲`;

const handler = async (m, { command }) => {
    if (command === 'وضع_التحديث') {
        global.updateMode = true;
        return m.reply('*✅ تم تفعيل وضع التحديث*\n> أي أمر هيتقاله البوت جاري تحديث');
    }
    if (command === 'ايقاف_التحديث') {
        global.updateMode = false;
        return m.reply('*✅ تم ايقاف وضع التحديث*\n> البوت شغال عادي');
    }
};

handler.usage = ['وضع_التحديث', 'ايقاف_التحديث'];
handler.category = 'owner';
handler.command = ['وضع_التحديث', 'ايقاف_التحديث'];
handler.owner = true;
export default handler;
