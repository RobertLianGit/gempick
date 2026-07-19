import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const filePath = '/Users/robertlianbo/AI 工作/GEMpick/outputs/文案控制表.xlsx';
const previewDir = '/private/tmp/gempick-copy-preview-v2';

await fs.mkdir(previewDir, { recursive: true });
const input = await FileBlob.load(filePath);
const workbook = await SpreadsheetFile.importXlsx(input);

const guide = workbook.worksheets.getItem('使用说明');
const copy = workbook.worksheets.getItem('文案清单');

guide.getRange('A1').values = [['心跳之间｜文案控制表']];
guide.getRange('A8:B8').values = [['主视觉', '紫色星轨 / Purple Orbit；文案关键词：音乐宇宙、心跳、相遇、留下、旅程。']];

copy.getRange('A1').values = [['心跳之间｜文案清单（逐行修改）']];

const used = copy.getUsedRange();
const values = used.values;
const idRow = new Map();
for (let r = 0; r < values.length; r += 1) {
  const id = values[r]?.[0];
  if (typeof id === 'string' && id.endsWith('-01') || typeof id === 'string' && id.startsWith('HOME-') || typeof id === 'string' && id.startsWith('SEO-')) {
    idRow.set(id, r);
  }
}

function setById(id, columnIndex, value) {
  const rowIndex = idRow.get(id);
  if (rowIndex === undefined) throw new Error(`Missing row ${id}`);
  values[rowIndex][columnIndex] = value;
}

// Current copy stays in column E; new decision goes in column F.
setById('HOME-01', 4, '最后一首');
setById('HOME-01', 5, '心跳之间');
setById('HOME-02', 5, '邓紫棋歌曲个人选择体验');
setById('HOME-03', 5, '在一首首歌之间，找到你最后想留下的那一首。');
setById('SEO-01', 5, '心跳之间｜邓紫棋歌曲个人选择体验');
setById('SEO-02', 5, '一个非官方粉丝项目：在一首首歌之间，通过一对一选择，找到你最后想留下的那一首。');

copy.getRange(used.address).values = values;

const preview = await workbook.render({ sheetName: '文案清单', range: 'A1:I8', scale: 1.2, format: 'png' });
await fs.writeFile(`${previewDir}/文案清单.png`, new Uint8Array(await preview.arrayBuffer()));
const guidePreview = await workbook.render({ sheetName: '使用说明', range: 'A1:F10', scale: 1.2, format: 'png' });
await fs.writeFile(`${previewDir}/使用说明.png`, new Uint8Array(await guidePreview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(filePath);
console.log(JSON.stringify({ filePath, previewDir }));
