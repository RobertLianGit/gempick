type ResultImageInput = {
  title: string;
  titleEn?: string;
  albumTitle: string;
  releaseYear: number;
  selectedCount: number;
  choiceCount: number;
  routeCount: number;
};

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, startSize: number, minSize: number) {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `500 ${size}px "Songti SC", "STSong", serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  }
  return size;
}

function drawCentered(ctx: CanvasRenderingContext2D, text: string, y: number) {
  ctx.fillText(text, 800, y);
}

export async function createResultImage(input: ResultImageInput) {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("当前浏览器无法生成结果图片");

  const background = ctx.createLinearGradient(0, 0, 1600, 1200);
  background.addColorStop(0, "#090821");
  background.addColorStop(0.55, "#15103a");
  background.addColorStop(1, "#21123d");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1600, 1200);

  ctx.save();
  ctx.strokeStyle = "rgba(198,167,243,.16)";
  ctx.lineWidth = 2;
  [[800, 550, 720, 230, -.16], [780, 570, 520, 150, .08], [850, 600, 310, 105, -.3]].forEach(([x, y, rx, ry, rotation]) => {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();

  const stars = [[95, 108], [345, 205], [1290, 102], [1450, 330], [1230, 930], [220, 870], [730, 1030], [1020, 215]];
  stars.forEach(([x, y], index) => {
    ctx.beginPath();
    ctx.fillStyle = index % 3 === 0 ? "#f5d99b" : "rgba(198,167,243,.65)";
    ctx.arc(x, y, index % 3 === 0 ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f5d99b";
  ctx.font = "600 30px Inter, PingFang SC, sans-serif";
  drawCentered(ctx, "我最 Pick 的 G.E.M. 邓紫棋的歌", 160);

  const titleSize = fitText(ctx, input.title, 1250, 172, 88);
  ctx.font = `500 ${titleSize}px "Songti SC", "STSong", serif`;
  ctx.shadowColor = "rgba(245,217,155,.2)";
  ctx.shadowBlur = 40;
  drawCentered(ctx, input.title, 350);
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#c5bdd7";
  ctx.font = "36px Inter, PingFang SC, sans-serif";
  if (input.titleEn && input.titleEn !== input.title) drawCentered(ctx, input.titleEn, 475);
  ctx.font = "32px Inter, PingFang SC, sans-serif";
  drawCentered(ctx, `${input.albumTitle} · ${input.releaseYear}`, input.titleEn && input.titleEn !== input.title ? 535 : 485);

  ctx.fillStyle = "#fff7ea";
  ctx.font = "500 38px \"Songti SC\", \"STSong\", serif";
  drawCentered(ctx, "这是这一刻，我最想留下的那一首。", 655);

  ctx.fillStyle = "rgba(31,22,66,.82)";
  ctx.strokeStyle = "rgba(245,217,155,.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(265, 740, 1070, 165, 32);
  ctx.fill();
  ctx.stroke();

  const stats = [
    [`${input.selectedCount} 首`, "这次从"],
    [`${input.choiceCount} 次`, "你做出了"],
    [`${input.routeCount} 次`, "它继续留下"],
  ];
  stats.forEach(([value, label], index) => {
    const x = 445 + index * 355;
    ctx.fillStyle = "#f5d99b";
    ctx.font = "500 42px \"Songti SC\", \"STSong\", serif";
    ctx.fillText(value, x, 800);
    ctx.fillStyle = "#aaa2bf";
    ctx.font = "22px Inter, PingFang SC, sans-serif";
    ctx.fillText(label, x, 855);
  });

  ctx.fillStyle = "#fff7ea";
  ctx.font = "500 24px \"Songti SC\", \"STSong\", serif";
  drawCentered(ctx, "心跳之间", 1030);
  ctx.fillStyle = "#8f87a4";
  ctx.font = "18px Inter, PingFang SC, sans-serif";
  drawCentered(ctx, "非官方粉丝项目｜结果只代表个人当下的选择", 1080);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("结果图片生成失败")), "image/png");
  });
}
