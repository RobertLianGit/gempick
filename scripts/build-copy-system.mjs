import fs from 'node:fs/promises';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const outputDir = '/Users/robertlianbo/AI 工作/GEMpick/outputs';
const outputPath = `${outputDir}/文案控制表.xlsx`;
const previewDir = '/private/tmp/gempick-copy-preview';

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const workbook = Workbook.create();
const guide = workbook.worksheets.add('使用说明');
const copy = workbook.worksheets.add('文案清单');
const glossary = workbook.worksheets.add('词汇替换');
const overview = workbook.worksheets.add('页面总览');

const colors = {
  night: '#171334',
  plum: '#3A2860',
  violet: '#8C62D9',
  lilac: '#EDE5FF',
  ivory: '#FFF9F0',
  muted: '#6B637B',
  line: '#D9D0E7',
  green: '#DDF4E7',
  yellow: '#FFF0C2',
  red: '#FDE2E2',
};

function styleTitle(sheet, range, value) {
  sheet.getRange(range).merge();
  sheet.getRange(range).values = [[value]];
  sheet.getRange(range).format = {
    fill: colors.night,
    font: { bold: true, color: colors.ivory, size: 18 },
    horizontalAlignment: 'left',
    verticalAlignment: 'center',
  };
  sheet.getRange(range).format.rowHeight = 34;
}

function styleHeader(sheet, range) {
  sheet.getRange(range).format = {
    fill: colors.plum,
    font: { bold: true, color: colors.ivory },
    horizontalAlignment: 'center',
    verticalAlignment: 'center',
    wrapText: true,
    borders: { preset: 'all', style: 'thin', color: colors.line },
  };
  sheet.getRange(range).format.rowHeight = 30;
}

function styleBody(sheet, range) {
  sheet.getRange(range).format = {
    font: { color: '#29223D', size: 11 },
    verticalAlignment: 'top',
    wrapText: true,
    borders: {
      insideHorizontal: { style: 'thin', color: colors.line },
      bottom: { style: 'thin', color: colors.line },
    },
  };
}

// 使用说明
styleTitle(guide, 'A1:F1', '心跳之间｜文案控制表');
guide.getRange('A3:B8').values = [
  ['怎么用', '只修改“文案清单”里的“建议文案”列；修改后把“状态”改为“已确认”。'],
  ['状态含义', '待讨论＝还可以改；已确认＝确定采用；待测试＝需要放进页面体验；已弃用＝不再使用。'],
  ['优先级', 'P0＝影响品牌和核心流程；P1＝影响体验；P2＝辅助信息。'],
  ['文案原则', '情绪文案负责让人想继续，操作文案负责让人看得懂，法律文案负责让人不误会。'],
  ['内部术语', '代码中可以继续使用 qualifier、wildcard、bye、bracket；用户界面统一使用“相遇、留下、继续、告别”。'],
  ['主视觉', '紫色星轨 / Purple Orbit；文案关键词：音乐宇宙、心跳、相遇、留下、旅程。'],
];
guide.getRange('A3:A8').format = { fill: colors.lilac, font: { bold: true, color: colors.night }, verticalAlignment: 'top', wrapText: true };
guide.getRange('B3:B8').format = { fill: colors.ivory, font: { color: '#29223D' }, verticalAlignment: 'top', wrapText: true };
guide.getRange('A3:B8').format.borders = { preset: 'all', style: 'thin', color: colors.line };
guide.getRange('A10:F10').merge();
guide.getRange('A10:F10').values = [['推荐工作顺序：先确认首页 → 核心对决 → 结果页 → 状态/错误 → 法律和 SEO。']];
guide.getRange('A10:F10').format = { fill: colors.yellow, font: { bold: true, color: '#5D4300' }, wrapText: true };
guide.getRange('A:A').format.columnWidth = 18;
guide.getRange('B:B').format.columnWidth = 75;
guide.getRange('C:F').format.columnWidth = 16;
guide.getRange('A1:F12').format.rowHeight = 25;
guide.getRange('A3:B8').format.rowHeight = 42;
guide.showGridLines = false;

const copyHeaders = ['ID', '页面', '位置', '文案类型', '当前文案/现状', '建议文案', '状态', '优先级', '备注'];
const rows = [
  ['HOME-01', '首页', '主标题', '品牌', '心跳之间', '心跳之间', '已确认', 'P0', '保持不变'],
  ['HOME-02', '首页', '副标题', '情绪', '邓紫棋歌曲非官方粉丝淘汰赛', '邓紫棋歌曲个人选择体验', '已确认', 'P0', '主视觉核心句'],
  ['HOME-03', '首页', '介绍', '说明', '从32首到唯一冠军，选出你最喜欢的邓紫棋歌曲', '在一首首歌之间，找到你最后想留下的那一首。', '已确认', 'P0', '避免“客观排名”感'],
  ['HOME-04', '首页', '主按钮', '操作', '开始游戏', '开始选择', '待讨论', 'P0', '全站主 CTA 统一'],
  ['HOME-05', '首页', '步骤一', '说明', '选专辑', '先从起点十首开始', '已确认', 'P1', '首页流程说明'],
  ['HOME-06', '首页', '步骤二', '说明', '抽签', '让歌曲开始相遇', '待讨论', 'P1', '首页流程说明'],
  ['HOME-07', '首页', '步骤三', '说明', '一对一对决', '一次次选择，直到最后一首', '待讨论', 'P1', '首页流程说明'],
  ['HOME-08', '首页/页脚', '非官方声明', '信任', '非官方粉丝项目', '非官方粉丝项目｜与艺人本人及相关团队不存在隶属或授权关系', '待确认', 'P0', '正式法律声明另放法律页'],
  ['SELECT-01', '轻量选歌', '页面标题', '情绪', '选择专辑', '先留下你想带上的歌', '已确认', 'P0', '页面主标题'],
  ['SELECT-02', '轻量选歌', '页面说明', '说明', '选择你想参加的专辑', '起点十首已经替你准备好；接下来可以按专辑逐首挑选，也可以整张加入。', '已确认', 'P1', '避免第一次选择过重'],
  ['SELECT-03', '专辑卡片', '整张加入', '操作', '整张专辑参赛', '整张加入', '已确认', 'P1', '与逐首加入并列'],
  ['SELECT-04', '专辑卡片', '整张撤下', '操作', '暂不参加', '撤下整张专辑', '已确认', 'P2', '避免“拒绝”语气'],
  ['SELECT-05', '专辑卡片', '展开按钮', '操作', '查看歌曲', '看看这张专辑里有什么', '待讨论', 'P2', ''],
  ['SELECT-06', '专辑选择', '数量提示', '进度', '当前已选 47 首', '你已经留下 47 首', '待讨论', 'P0', '数字动态替换'],
  ['SELECT-07', '专辑选择', '场数提示', '进度', '正式赛预计 46 场选择', '接下来还要做 46 次选择', '待讨论', 'P1', '用户更容易理解'],
  ['SELECT-08', '轻量选歌', '继续按钮', '操作', '下一步', '开始相遇', '已确认', 'P1', '至少留下16首后可用'],
  ['SELECT-09', '起点十首', '区块标题', '情绪', '推荐歌曲', '先从这十首开始', '已确认', 'P0', '十首是低压力起点，不是比赛规模'],
  ['SELECT-10', '起点十首', '区块说明', '说明', '系统推荐歌曲', '已经自动留下，可随时放下或换歌', '已确认', 'P1', ''],
  ['SELECT-11', '专辑曲目', '逐首按钮', '操作', '选择歌曲', '逐首加入', '已确认', 'P1', '与整张加入并列'],
  ['SELECT-12', '轻量选歌', '未达数量', '进度', '还需要更多歌曲', '距离 16 首还差 {16-N} 首', '已确认', 'P0', '16首后进入相遇页'],
  ['WILD-01', '逐首挑选兼容入口', '页面标题', '情绪', '外卡歌曲', '还想带上哪几首？', '已弃用', 'P0', '主流程已并入专辑页'],
  ['WILD-02', '逐首挑选兼容入口', '页面说明', '说明', '当前有26首歌曲，还需要选择6首', '目前有 26 首歌曲，还需要留下 6 首，才能开始这段选择。', '待测试', 'P0', ''],
  ['WILD-03', '逐首挑选兼容入口', '数量提示', '进度', '还需要补入6首', '还差 6 首，才能开始这段旅程。', '待测试', 'P1', ''],
  ['WILD-04', '单曲列表', '添加按钮', '操作', '添加外卡', '加入这首', '待讨论', 'P1', ''],
  ['WILD-05', '单曲列表', '移除按钮', '操作', '移除', '先放下', '待讨论', 'P2', ''],
  ['WILD-06', '逐首挑选兼容入口', '继续按钮', '操作', '进入比赛', '开始相遇', '待测试', 'P1', ''],
  ['DRAW-01', '抽签', '页面标题', '情绪', '抽签结果', '让歌曲开始相遇', '待讨论', 'P0', ''],
  ['DRAW-02', '抽签', '页面说明', '说明', '随机生成签表', '有些歌曲会先遇见，有些歌曲会稍后登场。', '待讨论', 'P1', ''],
  ['DRAW-03', '抽签', '主按钮', '操作', '生成本次签表', '生成这次相遇', '待讨论', 'P0', ''],
  ['DRAW-04', '抽签', '编号标签', '信息', '本次抽签编号', '本次旅程编号', '待讨论', 'P2', '编号仍保留 GEM-XXXX 格式'],
  ['DRAW-05', '抽签', '随机模式', '选项', '完全随机', '自由相遇', '待讨论', 'P2', ''],
  ['DRAW-06', '抽签', '轮空说明', '说明', '部分歌曲直接轮空', '有些歌曲会稍后登场，直接进入下一轮。', '待讨论', 'P1', '避免用户不懂“轮空”'],
  ['MATCH-01', '歌曲对决', '轮次标签', '信息', '32强·第7场', '32 首中｜第 7 次相遇', '待讨论', 'P1', '保留轮次数字'],
  ['MATCH-02', '歌曲对决', '页面标题', '情绪', '选择你更喜欢的歌', '这一轮，你更想留下哪一首？', '待讨论', 'P0', '核心文案'],
  ['MATCH-03', '歌曲对决', '选择按钮', '操作', '选择歌曲A / 选择歌曲B', '留下这首', '待讨论', 'P0', '两边按钮完全一致'],
  ['MATCH-04', '歌曲对决', '收听链接', '外链', '前往官方平台收听', '去正规平台听听', '待讨论', 'P1', '可在辅助信息中注明平台名称'],
  ['MATCH-05', '歌曲对决', '不熟悉提示', '操作', '两首都不熟，听完再选', '先去听听，再回来选择', '待讨论', 'P1', '如果允许跳出外链'],
  ['MATCH-06', '歌曲对决', '进度提示', '进度', '当前进度：17/63', '你已经做出了 17 次选择', '待讨论', 'P1', ''],
  ['MATCH-07', '歌曲对决', '选择后提示', '反馈', '胜者进入下一轮', '它会继续留下。', '待讨论', 'P1', ''],
  ['BRACKET-01', '晋级路线', '页面标题', '情绪', '比赛进度', '看看它走到了哪里', '待讨论', 'P0', ''],
  ['BRACKET-02', '晋级路线', '当前轮次', '信息', '当前轮次：八强赛', '当前走到：最后八首', '待讨论', 'P1', ''],
  ['BRACKET-03', '晋级路线', '完整签表', '导航', '查看完整签表', '看看完整旅程', '待讨论', 'P2', ''],
  ['BRACKET-04', '晋级路线', '继续按钮', '操作', '继续比赛', '继续选择', '待讨论', 'P1', ''],
  ['RESULT-01', '结果页', '主标题', '情绪', '冠军歌曲', '最后留下的，是这一首。', '待讨论', 'P0', ''],
  ['RESULT-02', '结果页', '结果标签', '信息', '我的冠军单曲', '我的最后一首', '待讨论', 'P0', '分享卡同步使用'],
  ['RESULT-03', '结果页', '统计标签', '信息', '参赛歌曲 / 完成比赛 / 决赛对手', '这次从 / 你做出了 / 最后一次遇见', '待讨论', 'P1', '需要配合实际数字排版'],
  ['RESULT-04', '结果页', '路线标题', '情绪', '冠军晋级路线', '它走过的路', '待讨论', 'P1', ''],
  ['RESULT-05', '结果页', '结果说明', '解释', '无', '这不是哪首歌“最好”，只是这一刻，你最想留下它。', '待讨论', 'P0', '避免公开排名误解'],
  ['RESULT-06', '结果页', '分享文案', '分享', '我的邓紫棋冠军单曲', '我的最后一首｜从 64 首歌曲开始，经过 63 次选择，最后留下了《歌曲名》。', '待讨论', 'P0', '不使用“第一名”'],
  ['STATE-01', '状态', '自动保存', '反馈', '已自动保存', '这段选择已经替你保存好了', '待讨论', 'P1', ''],
  ['STATE-02', '状态', '恢复进度', '操作', '继续比赛', '继续刚才的选择', '待讨论', 'P1', ''],
  ['STATE-03', '状态', '清除确认', '确认', '重新开始后之前选择会清除', '重新开始后，之前的选择会被清除。确定要从头来吗？', '待确认', 'P0', '风险提示必须清楚'],
  ['ERROR-01', '错误', '加载失败', '错误', '加载失败', '这片星轨暂时没有连上', '待讨论', 'P1', '下面配“再试一次”'],
  ['ERROR-02', '错误', '重试按钮', '操作', '重试', '再试一次', '待讨论', 'P1', ''],
  ['LEGAL-01', '法律页', '页面标题', '信任', '非官方声明', '关于这个非官方粉丝项目', '待讨论', 'P0', '法律正文保持正式'],
  ['LEGAL-02', '法律页', '联系入口', '信任', '版权联系邮箱：待补充', '发现内容问题？请通过版权联系邮箱联系我们。', '待确认', 'P0', '部署前补真实邮箱'],
  ['SEO-01', 'SEO', '页面标题', 'SEO', '邓紫棋歌曲淘汰赛', '最后一首｜邓紫棋歌曲个人选择体验', '待讨论', 'P1', '避免“官方排名”'],
  ['SEO-02', 'SEO', '页面描述', 'SEO', '选出你最喜欢的邓紫棋歌曲', '一个非官方粉丝项目：从你愿意留下的邓紫棋歌曲开始，通过一对一选择，找到最后一首。', '待讨论', 'P1', ''],
];

styleTitle(copy, 'A1:I1', '心跳之间｜文案清单（逐行修改）');
copy.getRange('A2:I2').merge();
copy.getRange('A2:I2').values = [['提示：主要修改 F 列“建议文案”；修改完成后把 G 列状态改成“已确认”。']];
copy.getRange('A2:I2').format = { fill: colors.yellow, font: { bold: true, color: '#5D4300' }, wrapText: true };
copy.getRange('A3:I3').values = [copyHeaders];
copy.getRange(`A4:I${rows.length + 3}`).values = rows;
styleHeader(copy, 'A3:I3');
styleBody(copy, `A4:I${rows.length + 3}`);
copy.getRange(`G4:G${rows.length + 3}`).dataValidation = { rule: { type: 'list', values: ['待讨论', '已确认', '待测试', '已弃用'] } };
copy.getRange(`H4:H${rows.length + 3}`).dataValidation = { rule: { type: 'list', values: ['P0', 'P1', 'P2'] } };
copy.getRange(`G4:G${rows.length + 3}`).conditionalFormats.add('containsText', { text: '已确认', format: { fill: colors.green, font: { color: '#1D5B35', bold: true } } });
copy.getRange(`G4:G${rows.length + 3}`).conditionalFormats.add('containsText', { text: '待讨论', format: { fill: colors.yellow } });
copy.getRange(`G4:G${rows.length + 3}`).conditionalFormats.add('containsText', { text: '已弃用', format: { fill: colors.red, font: { color: '#8D2C2C' } } });
copy.getRange(`H4:H${rows.length + 3}`).conditionalFormats.add('containsText', { text: 'P0', format: { fill: colors.red, font: { bold: true, color: '#8D2C2C' } } });
copy.tables.add(`A3:I${rows.length + 3}`, true, 'CopyInventory');
copy.freezePanes.freezeRows(3);
copy.showGridLines = false;
const widths = [12, 13, 16, 12, 36, 46, 12, 9, 28];
widths.forEach((width, index) => copy.getRangeByIndexes(0, index, rows.length + 3, 1).format.columnWidth = width);
copy.getRange(`A4:I${rows.length + 3}`).format.rowHeight = 38;

// 词汇替换
const glossaryRows = [
  ['淘汰赛', '个人选择体验 / 歌曲旅程', '降低体育赛事感', '全站主叙事'],
  ['冠军', '最后留下的这一首', '避免像公开排名', '结果页主标题'],
  ['投票', '选择', '强调个人偏好，而不是民主排名', '按钮和说明'],
  ['击败对手', '继续留下', '保留竞争感但更温和', '结果反馈'],
  ['淘汰', '暂时告别', '保留情绪，不制造失败感', '赛后提示'],
  ['外卡', '逐首挑选', '用户更容易理解', '页面标题和按钮'],
  ['轮空', '直接进入下一轮', '解释真实行为', '赛制说明'],
  ['资格赛', '预选对决', '减少专业术语', '用户界面'],
  ['抽签结果', '这次相遇', '让随机过程更有情绪', '抽签页'],
  ['开始游戏', '开始选择', '更符合产品本质', '首页按钮'],
  ['最强歌曲', '我最想留下的歌', '避免客观判断', '结果分享'],
  ['正确答案', '你的答案', '尊重个人选择', '说明文案'],
  ['官方排名', '非官方个人结果', '明确项目边界', '结果页和分享卡'],
  ['比赛进度', '选择进度 / 它走到了哪里', '更符合音乐旅程', '进度页'],
  ['重新开始', '重新开始一段选择', '保留动作清晰度和情绪', '结果页'],
];
glossary.getRange('A1:D1').values = [['原词', '推荐词', '修改理由', '主要使用位置']];
glossary.getRange(`A2:D${glossaryRows.length + 1}`).values = glossaryRows;
styleHeader(glossary, 'A1:D1');
styleBody(glossary, `A2:D${glossaryRows.length + 1}`);
glossary.freezePanes.freezeRows(1);
glossary.showGridLines = false;
[22, 30, 38, 26].forEach((width, index) => glossary.getRangeByIndexes(0, index, glossaryRows.length + 1, 1).format.columnWidth = width);
glossary.getRange(`A2:D${glossaryRows.length + 1}`).format.rowHeight = 34;

// 页面总览
const overviewRows = [
  ['首页', '让用户理解这是一个有情绪的个人选择体验', '浪漫、想开始', '开始选择', '非官方说明不要压过主情绪'],
  ['轻量选歌', '让用户从起点十首开始，再自由逐首或整张加入', '熟悉、收藏', '开始相遇', '至少留下16首即可开始'],
  ['逐首挑选兼容入口', '让旧入口用户自然补足歌曲', '补充、期待', '开始相遇', '主流程已并入专辑页'],
  ['抽签', '让随机生成感觉像歌曲相遇', '期待、仪式感', '生成这次相遇', '结果生成后必须稳定'],
  ['歌曲对决', '让用户快速理解并完成一次选择', '犹豫、投入', '留下这首', '两边文案必须对称'],
  ['晋级路线', '让用户回看选择过程', '见证、回忆', '继续选择', '少用体育术语'],
  ['结果页', '把个人选择转成值得分享的纪念结果', '抵达、余韵', '分享结果', '不暗示全站排名'],
  ['法律/隐私', '降低误认和运营风险', '透明、可信', '返回首页', '正文保持正式清楚'],
];
overview.getRange('A1:E1').values = [['页面', '页面任务', '用户情绪', '主按钮', '文案注意事项']];
overview.getRange(`A2:E${overviewRows.length + 1}`).values = overviewRows;
styleHeader(overview, 'A1:E1');
styleBody(overview, `A2:E${overviewRows.length + 1}`);
overview.freezePanes.freezeRows(1);
overview.showGridLines = false;
[18, 45, 22, 22, 42].forEach((width, index) => overview.getRangeByIndexes(0, index, overviewRows.length + 1, 1).format.columnWidth = width);
overview.getRange(`A2:E${overviewRows.length + 1}`).format.rowHeight = 44;

const sheets = [guide, copy, glossary, overview];
for (const sheet of sheets) {
  sheet.getUsedRange()?.format.verticalAlignment && (sheet.getUsedRange().format.verticalAlignment = 'top');
}

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);

for (const [sheetName, range] of [['使用说明', 'A1:F10'], ['文案清单', 'A1:I16'], ['词汇替换', 'A1:D16'], ['页面总览', 'A1:E9']]) {
  const preview = await workbook.render({ sheetName, range, scale: 1.2, format: 'png' });
  await fs.writeFile(`${previewDir}/${sheetName}.png`, new Uint8Array(await preview.arrayBuffer()));
}

console.log(JSON.stringify({ outputPath, previewDir, rows: rows.length }));
