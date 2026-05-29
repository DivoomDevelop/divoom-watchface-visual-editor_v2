/**
 * Heuristic + curated descriptions for Divoom watchface fonts.
 * Used by gen-ai-docs.mjs → docs/generated/ai-font-guide.md
 */

/** @type {Record<number, { style: string, effect: string, useCases: string[], tags?: string[] }>} */
const CURATED_BY_ID = {
  6: {
    style: "几何无衬线，笔画干净、偏商务",
    effect: "稳重职业感，适合信息密度较高的界面",
    useCases: ["日期/星期", "辅助数据", "英文标签"],
    tags: ["无衬线", "英文"]
  },
  14: {
    style: "手写感粗体展示字，带冒险/旅行气质",
    effect: "标题醒目，有户外探索感",
    useCases: ["表盘主标题", "装饰性英文词"],
    tags: ["展示", "英文"]
  },
  16: {
    style: "OPPO Sans 中等字重，现代中文无衬线",
    effect: "清晰易读，中性百搭",
    useCases: ["中文正文", "日期说明", "天气文字"],
    tags: ["中文", "无衬线", "正文"]
  },
  18: {
    style: "Library 3 am，细线复古衬线/装饰混合",
    effect: "文艺、深夜阅读氛围",
    useCases: ["装饰标题", "英文短句"],
    tags: ["装饰", "英文"]
  },
  20: {
    style: "Keep Calm 风格，英式海报粗体",
    effect: "经典 Keep Calm 海报气质，稳重大字",
    useCases: ["英文主标题", "标语"],
    tags: ["展示", "英文"]
  },
  22: {
    style: "smooth line 7，细线几何无衬线",
    effect: "轻盈、现代",
    useCases: ["小号辅助文字", "数据标签"],
    tags: ["无衬线", "细体"]
  },
  24: {
    style: "DS Digital 经典七段数码管",
    effect: "LED/计算器数码显示，科技感强",
    useCases: ["时/分/秒数字", "倒计时", "步数"],
    tags: ["数码", "LED", "数字"]
  },
  26: {
    style: "思源黑体（Source Han Sans），标准中文无衬线",
    effect: "通用中文正文，可读性最佳之一",
    useCases: ["中文日期/星期", "天气/健康说明", "任意中文文本"],
    tags: ["中文", "无衬线", "正文", "通用"]
  },
  30: {
    style: "OPPO Sans Heavy 超粗中文无衬线",
    effect: "极粗、冲击力强",
    useCases: ["大号时间数字旁的中文", "主标题"],
    tags: ["中文", "粗体", "标题"]
  },
  38: {
    style: "阿里妈妈方圆体 VF Bold，圆角方块中文",
    effect: "活泼、圆润、偏潮流",
    useCases: ["可爱风表盘中文", "标题"],
    tags: ["中文", "圆体", "展示"]
  },
  48: {
    style: "Parisish，法式复古装饰体",
    effect: "优雅复古，略华丽",
    useCases: ["装饰英文", "艺术风表盘"],
    tags: ["装饰", "英文", "复古"]
  },
  50: {
    style: "Alpin Gothic，哥特式展示体",
    effect: "尖锐、中世纪哥特风",
    useCases: ["暗黑/哥特主题英文标题"],
    tags: ["哥特", "展示", "英文"]
  },
  54: {
    style: "HarmonyOS Sans SC Black 极粗",
    effect: "华为鸿蒙黑体，现代、厚重",
    useCases: ["大号中文标题", "强调数字旁文字"],
    tags: ["中文", "粗体", "系统"]
  },
  56: {
    style: "HarmonyOS Sans SC Bold 粗体",
    effect: "清晰有力，适合标题",
    useCases: ["中文标题", "星期/月份"],
    tags: ["中文", "粗体"]
  },
  58: {
    style: "HarmonyOS Sans SC Light 细体",
    effect: "轻盈通透",
    useCases: ["小号辅助中文", "次要信息"],
    tags: ["中文", "细体"]
  },
  60: {
    style: "HarmonyOS Sans SC Medium 中等",
    effect: "平衡的正文粗细",
    useCases: ["中文正文", "通用"],
    tags: ["中文", "正文"]
  },
  62: {
    style: "HarmonyOS Sans SC Regular 常规",
    effect: "标准鸿蒙正文",
    useCases: ["中文正文", "日期文字"],
    tags: ["中文", "正文", "通用"]
  },
  64: {
    style: "HarmonyOS Sans SC Thin 极细",
    effect: "极细线条，精致",
    useCases: ["小号注释", "极简风表盘"],
    tags: ["中文", "细体", "极简"]
  },
  66: {
    style: "Square pixel 12 简体像素字",
    effect: "8-bit 方块像素，复古游戏感",
    useCases: ["像素风表盘文字", "复古游戏主题"],
    tags: ["像素", "中文", "复古"]
  },
  90: {
    style: "Bebas Neue 超高窄体无衬线",
    effect: "经典海报大标题，仅适合大写英文",
    useCases: ["英文大标题", "时/分/秒旁英文标签"],
    tags: ["展示", "英文", "窄体"]
  },
  92: {
    style: "Pacifico 连笔手写体",
    effect: "轻松、度假、手写感",
    useCases: ["装饰英文", "休闲风表盘"],
    tags: ["手写", "英文", "休闲"]
  },
  98: {
    style: "8-bit Arcade Out 空心像素街机字",
    effect: "街机游戏空心像素轮廓",
    useCases: ["复古游戏表盘", "装饰英文"],
    tags: ["像素", "8-bit", "英文"]
  },
  100: {
    style: "思源黑体 CN Medium",
    effect: "中等粗细中文正文",
    useCases: ["中文正文", "通用文本"],
    tags: ["中文", "正文"]
  },
  102: {
    style: "Upheaval TT 像素破坏风",
    effect: "强烈像素/地震扭曲感",
    useCases: ["像素/赛博风英文标题"],
    tags: ["像素", "英文", "装饰"]
  },
  110: {
    style: "DS-Digital Bold 粗七段数码",
    effect: "比 id 24 更粗的 LED 数码管",
    useCases: ["大号时间数字", "主时钟"],
    tags: ["数码", "LED", "数字", "粗体"]
  },
  112: {
    style: "WebP 位图数码数字，预渲染七段/电子风格",
    effect: "固定位图外观，颜色/字号不可调；仅 0-9",
    useCases: ["主时间数字", "需要固定位图效果的时钟"],
    tags: ["位图", "数字", "数码"]
  },
  114: {
    style: "Big Shoulders Stencil 镂空展示体",
    effect: "工业Stencil镂空大标题",
    useCases: ["英文大标题", "运动/工业风"],
    tags: ["展示", "Stencil", "英文"]
  },
  116: {
    style: "Audiowide 宽体未来科技无衬线",
    effect: "科幻、宽间距",
    useCases: ["科技风英文", "数据标签"],
    tags: ["科技", "英文", "宽体"]
  },
  118: {
    style: "Train One 日文/拉丁展示圆体",
    effect: "圆润、列车/卡通气质",
    useCases: ["可爱风标题", "装饰文字"],
    tags: ["圆体", "展示"]
  },
  124: {
    style: "Bangers 漫画爆炸体",
    effect: "美漫风格，极粗圆角",
    useCases: ["漫画/波普风英文标题"],
    tags: ["漫画", "展示", "英文"]
  },
  126: {
    style: "全语言 Tahoma 系统无衬线",
    effect: "Windows 经典 UI 字体，多语言兼容",
    useCases: ["英文/数字正文", "通用 UI 文本"],
    tags: ["系统", "无衬线", "多语言"]
  },
  128: {
    style: "思源黑体 Bold 粗体",
    effect: "中文粗标题",
    useCases: ["中文标题", "强调文字"],
    tags: ["中文", "粗体"]
  },
  132: {
    style: "思源黑体 Heavy 超粗",
    effect: "极粗中文展示",
    useCases: ["大号中文标题"],
    tags: ["中文", "超粗"]
  },
  144: {
    style: "Silkscreen 像素无衬线",
    effect: "清晰小像素英文",
    useCases: ["像素风小号英文"],
    tags: ["像素", "英文"]
  },
  146: {
    style: "Dancing Script Bold 手写脚本粗体",
    effect: "优雅连笔手写",
    useCases: ["装饰英文", "女性/优雅风表盘"],
    tags: ["手写", "脚本", "英文"]
  },
  152: {
    style: "Playfair Display Black 高对比衬线",
    effect: "时尚杂志级衬线大标题",
    useCases: ["奢华/时尚风英文标题"],
    tags: ["衬线", "展示", "英文"]
  },
  156: {
    style: "Coiny 圆角漫画体",
    effect: "卡通硬币质感，圆润可爱",
    useCases: ["儿童/可爱风文字"],
    tags: ["圆体", "卡通"]
  },
  160: {
    style: "站酷快乐体，不规则手绘中文",
    effect: "活泼、年轻、趣味",
    useCases: ["可爱风中文标题", "趣味表盘"],
    tags: ["中文", "手写", "可爱"]
  },
  168: {
    style: "庞门正道标题体，粗方中文标题",
    effect: "商业级中文大标题，辨识度高",
    useCases: ["中文主标题", "海报风表盘"],
    tags: ["中文", "标题", "展示"]
  },
  176: {
    style: "Caveat  casual 手写",
    effect: "自然手写字，轻松",
    useCases: ["手写风英文/数字注释"],
    tags: ["手写", "英文"]
  },
  182: {
    style: "EmojiFont 彩色 Emoji 字体",
    effect: "渲染 Emoji 符号（非普通文字）",
    useCases: ["Emoji 装饰元素", "表情符号 disp"],
    tags: ["Emoji", "特殊"]
  },
  184: {
    style: "思源宋体 SemiBold 中文衬线",
    effect: "传统宋体，典雅书卷气",
    useCases: ["国风/文艺中文", "日期农历说明"],
    tags: ["中文", "衬线", "宋体"]
  },
  186: {
    style: "站酷高端黑，超粗中文标题",
    effect: "力量感、潮流黑体",
    useCases: ["中文大标题", "运动风"],
    tags: ["中文", "标题", "粗体"]
  },
  194: {
    style: "京东朗正体，品牌几何中文",
    effect: "现代、略窄的几何黑体",
    useCases: ["中文正文/标题"],
    tags: ["中文", "无衬线"]
  },
  196: {
    style: "站酷酷黑体，极粗展示黑体",
    effect: "硬朗、潮流",
    useCases: ["中文大标题"],
    tags: ["中文", "展示"]
  },
  200: {
    style: "阿里巴巴普惠体 Heavy",
    effect: "普惠超粗，电商/互联网风",
    useCases: ["中文强调标题"],
    tags: ["中文", "粗体"]
  },
  206: {
    style: "钉钉进步体，现代中文创意黑体",
    effect: "略带设计感的黑体",
    useCases: ["中文标题", "科技风表盘"],
    tags: ["中文", "展示"]
  },
  208: {
    style: "Nunito Regular 圆角英文无衬线",
    effect: "友好、圆润的 UI 字体",
    useCases: ["英文正文", "健康/生活类表盘"],
    tags: ["英文", "圆体", "正文"]
  },
  222: {
    style: "8-bit Arcade In 实心像素街机字",
    effect: "实心像素块，比 id 98 更实",
    useCases: ["复古游戏表盘英文"],
    tags: ["像素", "8-bit"]
  },
  228: {
    style: "League Gothic Condensed 窄体哥特展示",
    effect: "经典窄高英文大标题",
    useCases: ["英文大标题", "运动表盘"],
    tags: ["展示", "窄体", "英文"]
  },
  236: {
    style: "Shrikhand 复古装饰展示",
    effect: "70年代印度复古装饰体",
    useCases: ["复古装饰英文"],
    tags: ["装饰", "复古"]
  },
  238: {
    style: "思源宋体 SC Bold 粗宋体",
    effect: "粗衬线中文，庄重",
    useCases: ["国风标题", "正式中文"],
    tags: ["中文", "衬线"]
  },
  246: {
    style: "思源宋体 SC SemiBold",
    effect: "中等粗细宋体正文",
    useCases: ["国风中文正文"],
    tags: ["中文", "衬线", "宋体"]
  },
  252: {
    style: "优设标题黑，超粗中文标题黑体",
    effect: "网红级粗黑标题，极醒目",
    useCases: ["中文主标题", "大字号装饰"],
    tags: ["中文", "标题", "超粗"]
  },
  254: {
    style: "字制区喜脉喜欢体，手写感中文",
    effect: "活泼手写中文，偏少女/趣味",
    useCases: ["可爱风中文", "趣味表盘"],
    tags: ["中文", "手写", "可爱"]
  },
  256: {
    style: "70×86 像素位图大数字",
    effect: "超大块像素数字，固定位图；仅 0-9",
    useCases: ["大号主时钟数字"],
    tags: ["位图", "像素", "数字", "大号"]
  },
  258: {
    style: "20×26 像素位图小数字",
    effect: "紧凑像素数字；仅 0-9",
    useCases: ["小号时间/日期数字", "副时钟"],
    tags: ["位图", "像素", "数字", "小号"]
  },
  262: {
    style: "Blue time 蓝色主题位图数字",
    effect: "预渲染蓝色电子/艺术数字；仅 0-9",
    useCases: ["蓝色主题表盘主时钟"],
    tags: ["位图", "数字", "蓝色"]
  },
  268: {
    style: "Pixel Machine 像素机台数字（仅数字）",
    effect: "机械像素风固定位图；0-9",
    useCases: ["赛博/机械风时钟"],
    tags: ["位图", "像素", "数字"]
  },
  270: {
    style: "Pixel Machine 像素机台大写字母",
    effect: "同上系列，仅 A-Z 大写",
    useCases: ["像素风英文缩写/AM PM"],
    tags: ["位图", "像素", "英文"]
  },
  272: {
    style: "Arcade Classic 经典街机像素",
    effect: "80年代街机字母数字",
    useCases: ["复古游戏表盘"],
    tags: ["像素", "街机"]
  },
  276: {
    style: "ProggyClean 编程等宽像素",
    effect: "程序员终端风，等宽清晰",
    useCases: ["等宽数据", "黑客/终端风"],
    tags: ["等宽", "像素", "终端"]
  },
  278: {
    style: "Pastel Dream 粉彩梦幻位图数字",
    effect: "柔和粉彩渐变固定位图；0-9",
    useCases: ["少女/梦幻风主时钟"],
    tags: ["位图", "粉彩", "数字"]
  },
  280: {
    style: "波普艺术手写字体1 位图数字",
    effect: "波普风手绘数字，风格1；0-9",
    useCases: ["波普/艺术风表盘时钟"],
    tags: ["位图", "波普", "手写", "数字"]
  },
  282: {
    style: "波普艺术手写字体2 位图数字",
    effect: "波普风手绘数字，风格2（与 id 280 成对）；0-9",
    useCases: ["波普风表盘，可与 280 混用做层次"],
    tags: ["位图", "波普", "手写", "数字"]
  },
  286: {
    style: "Futura LT Bold 几何无衬线经典",
    effect: "现代主义几何，简洁永恒",
    useCases: ["极简/现代风英文标题"],
    tags: ["无衬线", "几何", "英文"]
  },
  290: {
    style: "像素霓城字体（紫）位图数字",
    effect: "紫色霓虹像素城市场景数字；0-9",
    useCases: ["赛博朋克/霓虹紫主题时钟"],
    tags: ["位图", "霓虹", "像素", "紫色"]
  },
  292: {
    style: "像素霓城字体（蓝）位图数字",
    effect: "蓝色霓虹像素数字；0-9",
    useCases: ["赛博朋克/霓虹蓝主题时钟"],
    tags: ["位图", "霓虹", "像素", "蓝色"]
  },
  294: {
    style: "警戒信号烟雾字体 位图数字",
    effect: "烟雾/警示风格艺术数字；0-9",
    useCases: ["工业/警示/军事风表盘"],
    tags: ["位图", "烟雾", "数字"]
  },
  296: {
    style: "海底泡泡屋时间字体 位图数字",
    effect: "气泡/水下主题可爱数字；0-9",
    useCases: ["海洋/儿童风主时钟"],
    tags: ["位图", "气泡", "可爱", "数字"]
  },
  298: {
    style: "Galmuri11 Bold 韩文像素无衬线（含拉丁）",
    effect: "11px 韩系像素字体，清晰等宽感；字符集有限",
    useCases: ["像素风英文/数字", "复古 UI"],
    tags: ["像素", "等宽", "Limited charset"]
  },
  300: {
    style: "Galmuri7 更小号韩文像素体",
    effect: "7px 像素，更紧凑；字符集有限",
    useCases: ["小号像素文字"],
    tags: ["像素", "小号", "Limited charset"]
  },
  302: {
    style: "咩咩好心情手写体1 位图数字",
    effect: "可爱羊主题手写数字；0-9",
    useCases: ["萌系/农场风表盘"],
    tags: ["位图", "手写", "可爱", "数字"]
  },
  304: {
    style: "咩咩好心情手写体2 位图数字",
    effect: "同系列变体2；0-9",
    useCases: ["与 id 302 搭配使用"],
    tags: ["位图", "手写", "可爱", "数字"]
  },
  306: {
    style: "咔滋一口不规则手绘位图数字",
    effect: "食物/零食风不规则手绘；0-9",
    useCases: ["美食/趣味风表盘"],
    tags: ["位图", "手绘", "不规则", "数字"]
  },
  308: {
    style: "波普艺术方形绿色位图数字",
    effect: "方形块面波普绿；0-9",
    useCases: ["波普/复古绿主题时钟"],
    tags: ["位图", "波普", "绿色", "数字"]
  },
  310: {
    style: "波普艺术方形粉色位图数字",
    effect: "方形块面波普粉；0-9",
    useCases: ["波普/复古粉主题时钟"],
    tags: ["位图", "波普", "粉色", "数字"]
  },
  314: {
    style: "黑色描边手绘位图数字",
    effect: "白底黑描边手绘风；0-9",
    useCases: ["手账/涂鸦风表盘"],
    tags: ["位图", "描边", "手绘", "数字"]
  },
  316: {
    style: "橙色铅笔手绘位图数字",
    effect: "铅笔质感橙色手绘；0-9",
    useCases: ["手账/文具风表盘"],
    tags: ["位图", "铅笔", "手绘", "数字"]
  },
  318: {
    style: "Great Vibes 华丽脚本",
    effect: "正式场合连笔花体",
    useCases: ["婚礼/优雅风装饰英文"],
    tags: ["脚本", "华丽", "英文"]
  },
  324: {
    style: "粉色玻璃质感位图数字",
    effect: "半透明玻璃材质渲染；0-9",
    useCases: ["玻璃拟态/粉色主题时钟"],
    tags: ["位图", "玻璃", "粉色", "数字"]
  },
  326: {
    style: "蒸汽波渐变位图数字",
    effect: "Vaporwave 渐变霓虹；0-9",
    useCases: ["蒸汽波/复古未来风时钟"],
    tags: ["位图", "蒸汽波", "渐变", "数字"]
  },
  330: {
    style: "粘土/黏土质感位图数字",
    effect: "3D 粘土材质可爱数字；0-9",
    useCases: ["3D 可爱/Claymorphism 风表盘"],
    tags: ["位图", "粘土", "3D", "数字"]
  },
  332: {
    style: "小虎购物日粉色位图数字",
    effect: "购物/零售主题粉色数字；0-9",
    useCases: ["购物节/促销风表盘"],
    tags: ["位图", "粉色", "主题", "数字"]
  },
  334: {
    style: "小虎购物日蓝色位图数字",
    effect: "同系列蓝色变体；0-9",
    useCases: ["与 id 332 成对使用"],
    tags: ["位图", "蓝色", "主题", "数字"]
  },
  340: {
    style: "彩虹手账时间位图数字",
    effect: "彩虹色手账风，专用于时间；0-9",
    useCases: ["手账风表盘主时钟"],
    tags: ["位图", "彩虹", "手账", "时间"]
  },
  342: {
    style: "彩虹手账温度位图数字",
    effect: "同系列，适合温度显示；0-9",
    useCases: ["手账风温度 disp"],
    tags: ["位图", "彩虹", "手账", "温度"]
  },
  344: {
    style: "彩虹手账日期位图数字",
    effect: "同系列，适合日期；0-9",
    useCases: ["手账风日期 disp"],
    tags: ["位图", "彩虹", "手账", "日期"]
  },
  346: {
    style: "跨年报纸倒计时位图字",
    effect: "报纸排版风，含数字+adoTy（day/today/yesterday 等缩写）；固定位图",
    useCases: ["倒计时", "报纸/新闻风表盘"],
    tags: ["位图", "报纸", "倒计时"]
  },
  348: {
    style: "节气画历温度/年月位图字",
    effect: "国风节气主题，含数字与 .-/；固定位图",
    useCases: ["温度", "年份", "月份显示"],
    tags: ["位图", "国风", "节气"]
  },
  350: {
    style: "节气画历日期位图数字",
    effect: "国风节气日期专用；0-9",
    useCases: ["日期 disp（节气主题）"],
    tags: ["位图", "国风", "日期"]
  },
  352: {
    style: "节气画历农历位图字",
    effect: "含农历用字 cdlnyz 等；固定位图",
    useCases: ["农历/节气说明文字"],
    tags: ["位图", "国风", "农历"]
  },
  354: {
    style: "几何拼贴小位图字",
    effect: "几何拼贴艺术风，含数字与 °-；固定位图",
    useCases: ["温度（带°）", "小型装饰数字"],
    tags: ["位图", "几何", "拼贴"]
  },
  356: {
    style: "几何拼贴小位图字（无名称变体）",
    effect: "与 id 354 同类，含 0-9 与 °-",
    useCases: ["与 354 类似，温度/小数字"],
    tags: ["位图", "几何", "拼贴"]
  },
  360: {
    style: "站酷庆科黄油体，圆润中文展示",
    effect: "黄油般顺滑圆角中文，可爱",
    useCases: ["可爱风中文标题", "趣味表盘"],
    tags: ["中文", "圆体", "可爱"]
  }
};

const CATEGORY_RULES = [
  {
    id: "image_digit",
    label: "位图数字（image_glyph）",
    test: (f) => f.type === 0,
    defaultStyle: "预渲染位图字图集，外观固定",
    defaultEffect: "颜色/字号/sep 等样式字段在编辑器中不生效，靠布局框 w×h 缩放",
    defaultUse: ["时/分/秒数字", "日期数字", "温度数字"]
  },
  {
    id: "digital_led",
    label: "数码/LED/电子",
    test: (f) => /DS.?Digital|digital|digit|数码|LED|七段|Arcade|8-bit|pixel|Pixel|像素|Galmuri|Proggy|Silkscreen|Square pixel/i.test(f.name),
    defaultStyle: "电子/像素/数码风格",
    defaultEffect: "科技感或复古游戏感",
    defaultUse: ["时钟数字", "倒计时", "数据"]
  },
  {
    id: "cn_sans",
    label: "中文无衬线",
    test: (f) =>
      /SourceHanSans|思源|HarmonyOS|OPPO|OPPOSans|普惠|朗正|钉钉|汇文|全语言|Alimama Square(?!.*VF)|方圆/i.test(
        f.name
      ) || /^00[1-9]-/.test(f.name),
    defaultStyle: "现代中文无衬线",
    defaultEffect: "清晰易读",
    defaultUse: ["中文正文", "日期/星期", "说明文字"]
  },
  {
    id: "cn_display",
    label: "中文展示/标题",
    test: (f) =>
      /站酷|优设|庞门|高端黑|酷黑|快乐|庆科|黄油|喜脉|京东|ZCOOL|GAODUAN|KuaiLe|标题/i.test(f.name),
    defaultStyle: "中文展示/标题黑体或创意体",
    defaultEffect: "醒目、有设计调性",
    defaultUse: ["中文主标题", "装饰大字"]
  },
  {
    id: "cn_serif",
    label: "中文衬线/宋体",
    test: (f) => /SourceHanSerif|思源宋|宋体|SoukouMincho|HanaMin|Mincho|Baskerville/i.test(f.name),
    defaultStyle: "衬线/宋体",
    defaultEffect: "典雅、书卷、传统",
    defaultUse: ["国风表盘", "农历/节气说明"]
  },
  {
    id: "handwriting",
    label: "手写/脚本",
    test: (f) =>
      /Caveat|Pacifico|Dancing|Script|hand|手写|Brush|Bukhari|Rock_Salt|Nickainley|Great Vibes|Oleo|Vibes|咩咩|铅笔/i.test(
        f.name
      ),
    defaultStyle: "手写或连笔脚本",
    defaultEffect: "轻松、人文、个性化",
    defaultUse: ["装饰文字", "休闲/艺术风表盘"]
  },
  {
    id: "en_display",
    label: "英文展示/海报",
    test: (f) =>
      /Bebas|League|Bangers|Audiowide|Stencil|Shoulders|Shrikhand|TrainOne|Keep Calm|Wander|Career|Absolute|Adrenaline|IMPRISHA|INFROMAN|Project Space|Mexican|Jack Armstrong|SuperFoods|Spectral|Playfair|Coiny|GLECB|Bitrimus|BAUHS|Alpin|Parisish|Fraktur|walbaum|Oxford|Messe|Futura/i.test(
        f.name
      ),
    defaultStyle: "英文展示/海报体",
    defaultEffect: "大标题冲击力强",
    defaultUse: ["英文标题", "装饰词"]
  },
  {
    id: "en_sans",
    label: "英文无衬线/UI",
    test: (f) =>
      /Open Sans|Nunito|Tahoma|Verdana|verdan|Trueno|trueno|Droid|Krungthep|Hisham|smooth line|Library|Source font|Roboto/i.test(
        f.name
      ),
    defaultStyle: "英文无衬线 UI 字体",
    defaultEffect: "通用可读",
    defaultUse: ["英文正文", "数据标签"]
  },
  {
    id: "gothic_special",
    label: "哥特/特殊",
    test: (f) => /GOST|Gothic|Emoji|Fraktur|Upheaval|Arcade|RL Madena|vinet/i.test(f.name),
    defaultStyle: "特殊风格字体",
    defaultEffect: "强主题性",
    defaultUse: ["主题表盘装饰"]
  }
];

function inferCategory(font) {
  if (font.type === 0) return "image_digit";
  for (const rule of CATEGORY_RULES) {
    if (rule.id !== "image_digit" && rule.test(font)) return rule.id;
  }
  return "en_sans";
}

function getCategoryMeta(catId) {
  return CATEGORY_RULES.find((r) => r.id === catId) || CATEGORY_RULES[CATEGORY_RULES.length - 1];
}

/**
 * @param {{ id: number, type: number, typeLabel: string, name: string, charsetPreview: string }} font
 */
export function describeFont(font) {
  const curated = CURATED_BY_ID[font.id];
  if (curated) {
    return {
      category: inferCategory(font),
      style: curated.style,
      effect: curated.effect,
      useCases: curated.useCases,
      tags: curated.tags || [],
      styling: stylingNote(font)
    };
  }

  const catId = inferCategory(font);
  const cat = getCategoryMeta(catId);
  const name = font.name || `(未命名 id ${font.id})`;

  let style = cat.defaultStyle;
  let effect = cat.defaultEffect;
  const useCases = [...cat.defaultUse];
  const tags = [cat.label.replace(/（.*?）/, "")];

  if (/Bold|Heavy|Black|粗|超粗|Blod/i.test(name)) {
    style += "，粗体/Heavy 字重";
    effect += "，更醒目";
    tags.push("粗体");
  } else if (/Light|Thin|细|Regular|Medium/i.test(name)) {
    style += "，较轻字重";
    tags.push("轻量");
  }

  if (font.type === 0 && font.charsetPreview) {
    style += `；字符集：${font.charsetPreview}`;
    if (font.charsetPreview.length <= 12 && /^0123456789$/.test(font.charsetPreview)) {
      useCases.length = 0;
      useCases.push("仅数字时钟/日期/温度", "不可用于字母或中文");
      tags.push("仅数字");
    }
  }

  return {
    category: catId,
    style: `${name}：${style}`,
    effect,
    useCases,
    tags,
    styling: stylingNote(font)
  };
}

function stylingNote(font) {
  if (font.type === 0) {
    return "位图字图集：仅调整 x,y,w,h,alig；size/color/sep 等无效";
  }
  return "矢量 TTF：可用 size、color_r/g/b、a、sep、alig 等完整文本样式";
}

const SCENARIO_INDEX = [
  {
    title: "主时钟大数字（时/分/秒）",
    prefer: "digital_led / image_digit",
    fontIds: [24, 110, 112, 256, 262, 268, 290, 292, 326, 340],
    note: "需要固定位图外观选 image_glyph；需要可调颜色选 DS Digital (24/110)"
  },
  {
    title: "中文日期/星期/说明",
    prefer: "cn_sans",
    fontIds: [26, 62, 100, 126, 16, 60],
    note: "思源黑体(26)与 HarmonyOS Regular(62) 最通用"
  },
  {
    title: "中文大标题/海报风",
    prefer: "cn_display",
    fontIds: [252, 186, 168, 196, 160, 360],
    note: "优设标题黑(252)、站酷系列辨识度高"
  },
  {
    title: "国风/农历/节气",
    prefer: "cn_serif + image_digit",
    fontIds: [184, 238, 246, 348, 350, 352],
    note: "宋体配节气画历位图字(id 348-352) 成套"
  },
  {
    title: "像素/复古游戏",
    prefer: "digital_led",
    fontIds: [66, 98, 222, 272, 276, 298, 300, 268, 270],
    note: "8-bit Arcade、ArcadeClassic、Galmuri 系列"
  },
  {
    title: "可爱/少女/手账",
    prefer: "handwriting + image_digit",
    fontIds: [160, 254, 360, 278, 302, 304, 340, 342, 344, 330],
    note: "手写体 + 彩虹手账/粘土/粉彩位图数字"
  },
  {
    title: "英文大标题",
    prefer: "en_display",
    fontIds: [90, 228, 114, 124, 116, 152],
    note: "Bebas Neue(90) 最常用；League Gothic(228) 窄高"
  },
  {
    title: "英文正文/UI",
    prefer: "en_sans",
    fontIds: [126, 208, 96, 328],
    note: "Tahoma(126)、Nunito(208)"
  },
  {
    title: "蒸汽波/霓虹/赛博",
    prefer: "image_digit + en_display",
    fontIds: [326, 290, 292, 116, 102],
    note: "蒸汽波渐变(326)、像素霓城(290/292)"
  },
  {
    title: "Emoji 符号",
    prefer: "特殊",
    fontIds: [182],
    note: "仅 EmojiFont(182)，配合 Emoji 类 disp"
  }
];

const CATEGORY_LABELS = {
  image_digit: "位图字图集（image_glyph）",
  digital_led: "数码 / LED / 像素",
  cn_sans: "中文无衬线正文",
  cn_display: "中文展示标题",
  cn_serif: "中文衬线 / 宋体",
  handwriting: "手写 / 脚本",
  en_display: "英文展示 / 海报",
  en_sans: "英文无衬线 / UI",
  gothic_special: "哥特 / 特殊主题"
};

/**
 * @param {Array<{ id: number, type: number, typeLabel: string, name: string, charsetPreview: string, charsetLength: number }>} fonts
 */
export function buildFontGuideMarkdown(fonts, generatedAt) {
  const described = fonts.map((f) => ({ font: f, desc: describeFont(f) }));
  const byCategory = new Map();
  for (const row of described) {
    const cat = row.desc.category;
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat).push(row);
  }

  const vectorCount = fonts.filter((f) => f.type !== 0).length;
  const imageCount = fonts.filter((f) => f.type === 0).length;

  const lines = [];
  lines.push("# Divoom 表盘字体 AI 使用指南");
  lines.push("");
  lines.push(`> 自动生成于 \`${generatedAt}\`，数据源 \`public/font/font_info.cfg\`。`);
  lines.push(`> 共 **${fonts.length}** 款字体：矢量 TTF **${vectorCount}** 款，位图字图集 **${imageCount}** 款。`);
  lines.push(`> 机器可读 ID 列表见同目录 \`ai-font-catalog.json\`。`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 一、AI 必须遵守的字体规则");
  lines.push("");
  lines.push("1. **`font` 字段必须是整数 ID**，只能使用本文档或 `ai-font-catalog.json` 中 `allowedFontIds` 列出的值，禁止臆造。");
  lines.push("2. **矢量 TTF（type=1 / `vector_ttf`）**：可自由使用 `size`、`color_r/g/b`、`color_a`、`sep`（字间距）、`alig`（对齐）等文本样式。");
  lines.push("3. **位图字图集（type=0 / `image_glyph`）**：字形外观已烘焙进位图，**颜色与字号样式无效**；通过 `x,y,w,h,alig` 布局框缩放。字符集有限，见各字体 `charset`。");
  lines.push("4. **同一 `name` 可能对应多个 ID**（不同字重/文件版本），选 ID 时以本文档条目为准，不要只凭名称。");
  lines.push("5. **成套主题字体**（如彩虹手账 340/342/344、节气画历 348-352、像素霓城 290/292）应整套使用以保持风格统一。");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 二、按场景快速选字体");
  lines.push("");
  lines.push("| 场景 | 推荐 font ID | 说明 |");
  lines.push("|------|-------------|------|");
  for (const s of SCENARIO_INDEX) {
    const ids = s.fontIds.join(", ");
    lines.push(`| ${s.title} | ${ids} | ${s.note} |`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 三、字体类型对比");
  lines.push("");
  lines.push("| 类型 | type 值 | 可调样式 | 典型用途 | 代表 ID |");
  lines.push("|------|---------|----------|----------|---------|");
  lines.push("| 矢量 TTF | 1 | size, color, sep, alig 等 | 任意文本、中文说明、可调色数字 | 26, 62, 24, 90 |");
  lines.push("| 位图字图集 | 0 | 仅 x,y,w,h,alig | 预设计数字/艺术字，风格固定 | 112, 340, 326, 348 |");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 四、按分类详述");
  lines.push("");

  const categoryOrder = [
    "image_digit",
    "digital_led",
    "cn_sans",
    "cn_display",
    "cn_serif",
    "handwriting",
    "en_display",
    "en_sans",
    "gothic_special"
  ];

  for (const catId of categoryOrder) {
    const rows = byCategory.get(catId);
    if (!rows?.length) continue;
    lines.push(`### ${CATEGORY_LABELS[catId] || catId}`);
    lines.push("");
    for (const { font, desc } of rows) {
      const displayName = font.name || `(未命名)`;
      lines.push(`#### font=${font.id} · ${displayName}`);
      lines.push("");
      lines.push(`- **类型**：${font.typeLabel}${font.type === 0 ? "（位图）" : "（矢量）"}`);
      if (font.charsetPreview) {
        lines.push(`- **字符集**：\`${font.charsetPreview}\`（${font.charsetLength} 字符）`);
      }
      lines.push(`- **视觉特点**：${desc.style}`);
      lines.push(`- **效果/气质**：${desc.effect}`);
      lines.push(`- **推荐用途**：${desc.useCases.join("；")}`);
      lines.push(`- **样式字段**：${desc.styling}`);
      if (desc.tags.length) {
        lines.push(`- **标签**：${desc.tags.map((t) => `\`${t}\``).join(", ")}`);
      }
      lines.push("");
    }
  }

  lines.push("---");
  lines.push("");
  lines.push("## 五、完整 ID 速查表");
  lines.push("");
  lines.push("| ID | 类型 | 名称 | 字符集 | 一句话 |");
  lines.push("|----|------|------|--------|--------|");
  for (const { font, desc } of described) {
    const name = (font.name || "—").replace(/\|/g, "\\|");
    const charset = font.charsetPreview ? `\`${font.charsetPreview}\`` : "—";
    const oneLiner = desc.effect.replace(/\|/g, "\\|").slice(0, 60);
    lines.push(`| ${font.id} | ${font.typeLabel} | ${name} | ${charset} | ${oneLiner} |`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## 六、与表盘 JSON 的配合示例");
  lines.push("");
  lines.push("```json");
  lines.push('{');
  lines.push('  "font": 24,');
  lines.push('  "size": 72,');
  lines.push('  "color_r": 0, "color_g": 255, "color_b": 128,');
  lines.push('  "x": 200, "y": 400, "w": 400, "h": 100,');
  lines.push('  "alig": 1,');
  lines.push('  "disp": 1');
  lines.push("}");
  lines.push("```");
  lines.push("");
  lines.push("上例：DS Digital 矢量数码字 + 自定义颜色/字号，用于时间类 `disp`。");
  lines.push("");
  lines.push("```json");
  lines.push('{');
  lines.push('  "font": 340,');
  lines.push('  "x": 180, "y": 350, "w": 440, "h": 120,');
  lines.push('  "alig": 1,');
  lines.push('  "disp": 1');
  lines.push("}");
  lines.push("```");
  lines.push("");
  lines.push("上例：彩虹手账位图数字，仅用布局框，不传 size/color。");
  lines.push("");

  return lines.join("\n");
}
