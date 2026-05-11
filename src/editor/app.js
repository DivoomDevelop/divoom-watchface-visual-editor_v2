import {
  LANGUAGE_OPTIONS,
  DEFAULT_LANGUAGE_ENUM,
  resolveInitialLanguageEnum,
  normalizeLanguageEnum,
  setLanguage,
  getLanguage,
  getLocaleCode,
  t
} from "../i18n/index.js";

const BASE_URL = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
const withBase = (rel) => BASE_URL + String(rel || "").replace(/^\//, "");

const APP_BUILD_TAG = "2026-05-11 12:00";

  const DISP_NAME_MAP = Object.freeze({
    1: "SECOND",
    2: "MIN",
    3: "HOUR",
    4: "HOUR_MIN",
    5: "HOUR_MIN_SEC",
    6: "ENG_WEEK",
    7: "YEAR",
    8: "DAY",
    9: "MON",
    12: "CHINA_WEEK",
    13: "NET_PIC",
    14: "APP_PIC_DATA",
    15: "TIME_AM_PM",
    16: "APP_ITEM_DATA1",
    17: "APP_ITEM_NAME1",
    18: "WEATHER_GIF16",
    19: "NOISE",
    20: "CHINA_DAY",
    21: "CHINA_YEAR",
    22: "CHINA_MON",
    23: "CHINA_JIEQI",
    24: "CHINA_GOOD",
    25: "CHINA_BAD",
    26: "CHINA_CONST",
    27: "ENG_MON",
    31: "ENG_WEEK_ALL",
    32: "TEMP_DIGIT",
    33: "NOISE_DIGIT",
    34: "NOISE_IMAGE",
    35: "APP_TITLE",
    36: "MON_YEAR",
    37: "ENG_WEEK_THREE",
    38: "APP_ITEM_DATA2",
    39: "ENG_MONTH_DOT_DAY",
    40: "APP_ITEM_DATA3",
    41: "APP_ITEM_DATA4",
    42: "APP_CON_DATA",
    45: "APP_PICTURE",
    46: "LEFT16_PICTURE",
    47: "RIGHT16_PICTURE",
    48: "MID32_PICTURE",
    49: "TEXT_MESSAGE",
    50: "EQ_EFFECT",
    51: "COUNT_DOWN_DAY",
    53: "DATE_WEEK_YEAR",
    54: "WEATHER_WORD",
    55: "WEATHER_GIF32",
    56: "MUL_TEXT_MESSAGE",
    57: "HOUR_IMAGE",
    58: "MIN_IMAGE",
    59: "HOUR_DECADE_IMAGE",
    60: "HOUR_UNIT_IMAGE",
    61: "MIN_DECADE_IMAGE",
    62: "MIN_UNIT_IMAGE",
    63: "WEATHER_GIF64",
    64: "WEATHER_GIF8",
    66: "WEEK_GIF",
    67: "HOUR_ACTIVE_GIF",
    68: "SECOND_GIF",
    69: "MON_DECADE_IMAGE",
    70: "MON_UNIT_IMAGE",
    71: "MDAY_DECADE_IMAGE",
    72: "MDAY_UNIT_IMAGE",
    73: "AM_PM_IMAGE",
    74: "WIFI_SIGNAL_IMAGE",
    75: "SINGLE_WORLD_TIME_HOUR",
    76: "SINGLE_WORLD_TIME_MIN",
    77: "SINGLE_WORLD_TIME_CITY",
    78: "USER_HEAD_IMG",
    79: "MON_ALL_IMAGE",
    80: "TOMMOROW_WEEK_TWO",
    81: "TOMMOROW_WEATHER",
    82: "TOMMOROW_MAX_TEMP",
    83: "TOMMOROW_MIN_TEMP",
    84: "AFTER_TOM_WEEK_TWO",
    85: "AFTER_TOM_WEATHER",
    86: "AFTER_TOM_MAX_TEMP",
    87: "AFTER_TOM_MIN_TEMP",
    88: "THREE_DAY_WEEK_TWO",
    89: "THREE_DAY_WEATHER",
    90: "THREE_DAY_MAX_TEMP",
    91: "THREE_DAY_MIN_TEMP",
    92: "FOUR_DAY_WEEK_TWO",
    93: "FOUR_DAY_WEATHER",
    94: "FOUR_DAY_MIN_TEMP",
    95: "FOUR_DAY_MAX_TEMP",
    96: "TODAY_MAX_TEMP",
    97: "TODAY_MIN_TEMP",
    98: "SPOTIFY_EQ_INFO",
    99: "APP_ITEM_DATA5",
    100: "APP_ITEM_DATA6",
    104: "RSS_NEWS_INFO",
    105: "DAY_NIGHT_FLAG",
    107: "HOUR_ACTIVE_GIF_NO_TIME",
    108: "FIVE_MIN_ACTIVE_GIF",
    110: "QR_CODE_PIC",
    111: "WEATHER_LOCAL_GIF",
    112: "APP_ITEM_DATA7",
    113: "APP_ITEM_DATA8",
    114: "APP_ITEM_DATA9",
    115: "APP_ITEM_DATA10",
    116: "APP_ITEM_DATA11",
    117: "APP_ITEM_DATA12",
    118: "APP_NET_DATA1",
    119: "APP_NET_DATA2",
    120: "APP_NET_DATA3",
    121: "APP_NET_DATA4",
    122: "APP_NET_DATA5",
    123: "APP_NET_DATA6",
    124: "WEATHER_GIF_CUSTOM",
    125: "NET5_PIC",
    126: "NET6_PIC",
    127: "NET7_PIC",
    128: "NET8_PIC",
    129: "NET9_PIC",
    130: "NET10_PIC",
    131: "HOUR_POINT_IMAGE",
    132: "MIN_POINT_IMAGE",
    133: "PIXEL_EQ_DIAL",
    134: "PIXEL_CLOUD1_DIAL",
    147: "WIND_SPEED",
    148: "VISIBILITY",
    149: "NOISE_HUMI_OUT",
    153: "YEAR_MON_DAY",
    154: "NET_TEXT_MESSAGE",
    155: "USER_TEXT_MESSAGE",
    156: "MON_DAY",
    157: "LOWEST_TO_HIGHEST_TEMP",
    166: "NOISE_DB",
    169: "FIRST_DAY_WEEK",
    170: "SMALL_WEEK_DAT",
    171: "WEEK_GIF_CUSTOM",
    172: "TEMP_PIC",
    173: "NET2_PIC",
    174: "NET3_PIC",
    175: "NET4_PIC",
    176: "SUNRISE_TIME",
    177: "SUNSET_TIME",
    178: "CALENDAR_EVENT_NAME",
    179: "CALENDAR_EVENT_TIME",
    180: "ENG_MON_ALL",
    182: "ALARM_ICON",
    183: "HOUR_GIF",
    184: "MIN_GIF",
    190: "PIXEL_VARIABLE_DIAL",
    191: "TIDAL_MOMENT",
    192: "DAY_NIGHT_FLAG2",
    193: "MONTH_DAY_YEAR",
    194: "MONTH_ABBREVIATIONS",
    195: "WEEK_ABBREVIATIONS",
    196: "YEAR_TWO_DIGITS",
    198: "DAYS_OF_LOVE",
    199: "HOUR_OF_LOVE",
    200: "MIN_OF_LOVE",
    201: "SEC_OF_LOVE",
    204: "SUNRISE_SUNSET_TIME",
    205: "SUNRISE_SUNSET_COUNTDOWN",
    206: "SUNRISE_SUNSET_PIC",
    207: "PHASE_MOON",
    208: "PHASE_MOON_NAME",
    209: "PHASE_MOON2",
    210: "PHASE_MOON3",
    211: "PHASE_MOON_NAME2",
    212: "PHASE_MOON_NAME3",
    217: "PHASE_MOON_NAME1",
    218: "SUNRISE_SUNSET_PIC2",
    219: "MUSIC_TITLE",
    220: "MUSIC_WORD",
    232: "DIVOOM_APP_ANIMATION",
    233: "SECOND_POINT_IMAGE",
    234: "PHOTO_ALBUM",
    238: "TODAY_MAX_TEMP_H",
    239: "TODAY_MIN_TEMP_L",
    240: "WEBP_WEATHER",
    241: "CALENDAR_DATES",
    242: "HOUR_MIN_COLOR",
    245: "CALENDAR_WATCH",
    246: "APP_ITEM_DATA13",
    247: "APP_ITEM_DATA14",
    248: "APP_ITEM_DATA15",
    260: "WEBP_FULL_WEATHER",
    261: "DIAL_COMPONENT_START",
    279: "DIAL_COMPONENT_END"
  });

  const DISP_COMMENT_ZH_MAP = Object.freeze({
    1: "时间秒",
    2: "时间分",
    3: "时间小时",
    4: "小时：分钟",
    5: "小时:分钟:钞",
    6: "星期英文",
    7: "年　（数字）",
    8: "日（数字）",
    9: "月（数字）",
    12: "星期中文",
    13: "网络图库",
    14: "app图片加数据",
    15: "此标记只有在１２小时制才能显示,上下午标记",
    16: "app单元项数据",
    17: "app单元项标题",
    18: "天气16的图",
    19: "噪音",
    20: "农历日 天干地支",
    21: "农历年　天干地支",
    22: "农历月　　天干地支",
    23: "农历节气",
    24: "农历宜做",
    25: "农历忌",
    26: "星座",
    27: "英文    jan",
    31: "星期英文(全字母)",
    32: "温度数字显示",
    33: "噪音数字显示",
    34: "噪音图像显示",
    35: "app显示主题,人名或者文章标题",
    36: "月－年（数字）",
    37: "星期英文三个字母缩写)",
    38: "app单元项数据",
    39: "英文月点数字日",
    40: "app单元项数据",
    41: "app单元项数据",
    42: "app显示数据轮播",
    45: "app显示图片信息",
    46: "显示图片信息　对应config里面的LeftPic              id = 0",
    47: "显示图片信息        对应config里面的RightPic       id = 1",
    48: "显示图片３２信息          对应config里面的MidPic       id = 2",
    49: "文字提醒框           对应config里面的UserMessage",
    50: "EQ效果",
    51: "倒计时天数据显示           对应config里面的CountDownDate",
    53: "数字日期-三位英文月份-年份",
    54: "天气文字",
    55: "天气32的图",
    56: "多行文字提醒框           对应config里面的UserMessage",
    57: "时间小时图像       id = 3",
    58: "时间分钟图像",
    59: "时间小时十位图像",
    60: "时间小时个位图像",
    61: "时间分钟十位图像",
    62: "时间分钟个位图像",
    63: "天气64的图",
    64: "天气8的图",
    66: "星期用图形表示",
    67: "整点报时",
    68: "时间秒图像",
    69: "时间月十位图像",
    70: "时间月个位图像",
    71: "时间日十位图像",
    72: "时间日个位图像",
    73: "ＡＭ-ＰＭ显示图像",
    74: "wifi信号强度",
    75: "某个世界时间小时",
    76: "某个世界时间分钟",
    77: "某个世界时间城市名",
    78: "用户头像",
    79: "日期月的图像",
    80: "明天的星期二英文字母",
    81: "明天的天气",
    82: "明天的最高气温",
    83: "明天的最低气温",
    84: "后天星期两字母",
    85: "后天的天气",
    86: "后天最高温度",
    87: "后天最低温度",
    88: "大后天星期两字母",
    89: "大后天的天气",
    90: "大后天最高温度",
    91: "大后天最低温度",
    92: "后后天星期两字母",
    93: "后后天的天气",
    94: "后后天的最低温度",
    95: "后后天的最高温度",
    96: "当天最高气温",
    97: "当天最低气温",
    98: "spotify音乐ＥＱ",
    99: "app单元项数据",
    100: "app单元项数据",
    104: "RSS新闻显示",
    105: "白天黑夜模式",
    107: "整点报时, 不显示时间",
    108: "五分钟间隔显示",
    110: "二维码显示",
    111: "本地天气GIF",
    112: "app单元项数据7",
    113: "app单元项数据8",
    114: "app单元项数据9",
    115: "app单元项数据10",
    116: "app单元项数据11",
    117: "app单元项数据12",
    118: "app网络数据1",
    119: "app网络数据2",
    120: "app网络数据3",
    121: "app网络数据4",
    122: "app网络数据5",
    123: "app网络数据6",
    124: "用户天气表盘",
    125: "网络图库5",
    126: "网络图库6",
    127: "网络图库7",
    128: "网络图库8",
    129: "网络图库9",
    130: "网络图库10",
    131: "时间小时指针",
    132: "时间分钟指针",
    133: "eq律动表盘",
    134: "云图推荐1表盘",
    147: "风速",
    148: "可见度",
    149: "室外湿度",
    153: "年/月/日",
    154: "用户网络数据",
    155: "用户自定义数据",
    156: "月/日",
    157: "当日最低温度到最高温度 12C-23C",
    166: "噪音数字+db",
    169: "今天",
    170: "星期大小写",
    171: "用户星期显示",
    172: "摄氏度/华氏度图片",
    173: "网络图库2",
    174: "网络图库3",
    175: "网络图库4",
    178: "日历活动标题",
    179: "日历活动时间",
    180: "月份全拼",
    182: "闹钟图标显示",
    183: "时间小时图像  不适配底图     id = 3",
    184: "时间分钟图像 不适配底图",
    190: "边框表盘中的像素艺术位置",
    191: "潮汐曲线",
    192: "白天黑夜模式",
    193: "月日年（年两位数字）",
    194: "月份大小写缩写",
    195: "星期大小写两位",
    196: "年份两位数字",
    198: "恋爱天数",
    199: "恋爱小时",
    200: "恋爱分钟",
    201: "恋爱秒",
    204: "日出日落时间，日出时间到立马显示日落时间，反之亦然",
    205: "日出日落倒计时",
    206: "日出日落显示图",
    207: "月相图",
    208: "月相名称",
    209: "明天月相图",
    210: "后天月相图",
    211: "明天月相名称",
    212: "后天月相名称",
    217: "今天月相名称",
    218: "日出日落显示图2",
    219: "歌名",
    220: "歌词",
    232: "DIVOOM APP发过来的动画",
    233: "时间秒钟指针",
    234: "相册显示",
    238: "当天最高气温H",
    239: "当天最低气温L",
    240: "webp天气图",
    241: "日历号数 1~17",
    242: "小时/冒号/分钟单独调色",
    245: "日历表1显示(370*230、不带星期)",
    246: "app单元项数据13",
    247: "app单元项数据14",
    248: "app单元项数据15",
    260: "webp全屏天气，10张图",
    261: "子表盘组件开始ID",
    279: "子表盘组件结束ID"
  });

  const IMAGE_DISP_IDS = new Set([
    13, 14, 18, 34, 45, 46, 47, 48, 55, 57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 68, 69, 70, 71, 72, 73, 74, 78, 79,
    81, 85, 89, 93, 98, 105, 107, 108, 110, 111, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137,
    138, 139, 140, 141, 142, 143, 144, 145, 146, 150, 151, 152, 171, 172, 173, 174, 175, 182, 183, 184, 185, 186, 187,
    188, 189, 190, 206, 207, 208, 209, 210, 211, 212, 217, 218, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231,
    232, 233, 234, 240, 245, 260
  ]);

  const POINTER_DISP_IDS = new Set([131, 132, 233]);
  const NETWORK_TEXT_DISP_IDS = new Set([118, 119, 120, 121, 122, 123, 154, 155]);
  const MULTI_LINE_DISP_IDS = new Set([56, 154, 155, 104, 220]);
  const APP_DATA_DISP_IDS = new Set([16, 38, 40, 41, 42, 99, 100, 112, 113, 114, 115, 116, 117, 246, 247, 248]);
  const PREVIEW_TICK_MS = 100;
  const TEMPLATE_IMAGE_SLOT_COUNT = 128;
  const TEMPLATE_SCAN_CONCURRENCY = 16;
  const TEMPLATE_NAME_SCAN_CONCURRENCY = 8;
  const TEMPLATE_SCAN_MIN_ID = 1;
  const TEMPLATE_SCAN_DEFAULT_MAX_ID = 2000;
  const TEMPLATE_CONFIG_DIR = withBase("template/config/");
  const TEMPLATE_DIR_15 = withBase("template/15/");
  const TEMPLATE_DIR_29 = withBase("template/29/");
  const TEMPLATE_ORGANIZE_REPORT_PATH = withBase("template/organize-report.json");
  const TEMPLATE_BG_EXT_CANDIDATES = [".bin", ".png", ".jpg", ".jpeg", ".webp", ".gif"];
  const TEMPLATE_IMG_EXT_CANDIDATES = [".bin", ".png", ".webp", ".gif", ".jpg", ".jpeg"];
  const TEMPLATE_CLASSIFY_DATA = Object.freeze({
    ReturnCode: 0,
    ReturnMessage: "",
    ClassifyList: [
      {
        ClassifyId: 58,
        ClassifyNameEn: "Styled Photo Frames",
        ClassifyName: "风格相框",
        clockid: [999, 997, 863, 840, 874, 873, 648, 757, 761, 467, 459, 748, 428, 542, 540, 541, 539, 543, 544, 545, 362, 466, 286, 833, 568, 839, 1200, 1096, 976, 975, 974, 952, 951, 843, 844, 778, 684, 842, 644, 977, 978, 979, 980, 982, 981, 830, 770, 773, 652, 749, 650, 832, 831, 457, 574, 577, 444, 849, 848, 760, 1000, 973, 1198, 772, 1107, 546, 1432]
      },
      {
        ClassifyId: 116,
        ClassifyNameEn: "Artists’ Gallery",
        ClassifyName: "艺术家联名",
        clockid: [679, 693, 698, 704, 705, 712, 732, 735, 745, 737, 709, 708, 710, 747, 721, 729, 752, 736, 734, 875, 941, 998]
      },
      {
        ClassifyId: 4,
        ClassifyNameEn: "Classic",
        ClassifyName: "通用",
        clockid: [1564, 865, 446, 257, 335, 285, 469, 447, 1202, 270, 1493, 341, 339, 348, 1424, 345, 337, 309, 284, 282, 32, 347, 288, 12, 1397, 1425, 342, 343, 283, 1399, 440, 750, 771, 417, 427, 429, 430, 1401, 601, 938, 939, 579, 600, 655, 667, 253, 767, 845, 1201, 27, 1199, 841, 846, 847, 290, 291, 364, 310, 31, 34, 25, 26, 33, 344, 271, 289, 28, 263, 441, 261, 306, 346, 255, 262, 836, 336, 5, 308, 256, 1398, 1491, 1505]
      },
      {
        ClassifyId: 48,
        ClassifyNameEn: "Festival",
        ClassifyName: "节日",
        clockid: [1503, 1504, 1499, 1500, 1501, 1502, 1496, 1497, 1498, 99, 1508, 1507, 1509, 1506, 1440, 1436, 1444, 1437, 1438, 1439, 1144, 450, 1143, 1142, 454, 367, 707, 1510, 1511, 838, 453, 451, 572, 573, 768, 769, 1001, 984, 959, 960, 961, 100, 954, 955, 994, 452, 837, 442, 366, 98, 97, 465, 365, 996, 958, 956, 995, 953, 1151, 1150, 1149, 1148, 1147, 1146, 1152, 1145]
      },
      {
        ClassifyId: 118,
        ClassifyNameEn: "Anniversaries",
        ClassifyName: "纪念日",
        clockid: [460, 461, 535, 706, 738, 739, 945, 946, 947, 576, 681, 682, 774, 775, 776, 777, 779, 443, 472, 473, 528, 531, 536, 683, 983, 474, 534, 688, 699, 567, 458, 477, 476, 834, 835]
      },
      {
        ClassifyId: 120,
        ClassifyNameEn: "City Tour",
        ClassifyName: "旅拍",
        clockid: [643, 866, 867, 868, 858, 857, 649, 647, 646, 645, 850, 851, 854, 855, 856, 626, 627, 628, 630, 629, 872, 871, 869, 870, 740, 691, 690, 689, 687, 686, 685]
      },
      {
        ClassifyId: 2,
        ClassifyNameEn: "Social",
        ClassifyName: "社交",
        clockid: [803, 512, 514, 614, 617, 618, 379, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 957, 470]
      },
      {
        ClassifyId: 10,
        ClassifyNameEn: "Financial",
        ClassifyName: "金融",
        clockid: [258, 259, 260, 264, 1181, 1217, 113, 56, 52, 53, 877, 269, 382, 78, 265, 267, 266, 117, 114, 115, 116, 1215, 1216]
      },
      {
        ClassifyId: 30,
        ClassifyNameEn: "Weather",
        ClassifyName: "天气",
        clockid: [523, 529, 532, 533, 537, 91, 92, 93, 95, 96, 101, 102]
      },
      {
        ClassifyId: 12,
        ClassifyNameEn: "Tools",
        ClassifyName: "工具",
        clockid: [1478, 1127, 1135, 794, 1153, 1154, 548, 1197, 620, 478, 448, 950, 948, 598, 962, 659]
      },
      {
        ClassifyId: 28,
        ClassifyNameEn: "Smart Hardware",
        ClassifyName: "智能硬件",
        clockid: [302, 303, 305, 415, 449, 456, 468]
      },
      {
        ClassifyId: 122,
        ClassifyNameEn: "AI-Styled Photo Frames",
        ClassifyName: "AI风格相框",
        clockid: [1109, 1472, 1125, 1126, 1426, 1427, 1428, 1429, 1430, 1431, 1473, 1474, 1475, 1476, 1124, 1123, 1110, 1111, 1112, 1113, 1114, 1115, 1116, 1117, 1118, 1119, 1120, 1121, 1122, 1477]
      }
    ],
    DeviceId: 300344410,
    PacketFlag: 1745214910
  });

  // 固件映射：disp -> slot offset（来源 src/middle/divoom_clock_manage.c 的 gdivoom_disp_image_item_table）
  const TEMPLATE_DISP_OFFSET_TABLE = Object.freeze({
    13: 29,
    18: 11,
    46: 0,
    47: 1,
    48: 2,
    55: 10,
    57: 3,
    58: 4,
    59: 5,
    60: 6,
    61: 7,
    62: 8,
    63: 9,
    64: 12,
    66: 13,
    67: 14,
    68: 16,
    69: 17,
    70: 18,
    71: 19,
    72: 20,
    73: 21,
    74: 22,
    78: 23,
    79: 24,
    81: 25,
    85: 26,
    89: 27,
    93: 28,
    98: 30,
    105: 31,
    107: 32,
    108: 33,
    124: 34,
    125: 39,
    126: 40,
    127: 41,
    128: 42,
    129: 43,
    130: 44,
    131: 46,
    132: 47,
    171: 35,
    172: 72,
    173: 36,
    174: 37,
    175: 38,
    182: 58,
    206: 48,
    207: 49,
    208: 50,
    209: 51,
    210: 52,
    211: 53,
    212: 54,
    217: 55,
    218: 56,
    233: 45,
    234: 79,
    240: 57,
    260: 59,
    281: 60,
    282: 61,
    283: 62,
    284: 63,
    285: 64,
    286: 65,
    287: 66,
    288: 67,
    289: 68,
    290: 69,
    297: 70,
    298: 71,
    310: 73,
    348: 74,
    349: 75,
    350: 76,
    352: 77,
    359: 78,
    364: 82,
    390: 80,
    391: 81,
    394: 86,
    395: 87,
    396: 88,
    403: 83,
    421: 84,
    423: 85,
    429: 92,
    430: 93,
    431: 94,
    432: 95,
    433: 96,
    434: 97,
    435: 98,
    436: 99,
    437: 100,
    438: 101,
    439: 102,
    440: 103,
    441: 104,
    442: 105,
    443: 106,
    444: 107,
    445: 89,
    446: 90,
    447: 91,
    454: 109,
    455: 108,
    456: 110,
    459: 111,
    461: 112,
    462: 113,
    463: 114,
    464: 115,
    470: 117,
    471: 116,
    472: 119,
    473: 118,
    475: 120
  });

  const LOCAL_ASSET_DISP_RULES = new Map([
    [13, { mode: "any" }],
    [55, { mode: "multiple", value: 10 }],
    [57, { mode: "multiple", value: 12 }],
    [58, { mode: "multiple", value: 12 }],
    [59, { mode: "multiple", value: 10 }],
    [60, { mode: "multiple", value: 10 }],
    [61, { mode: "multiple", value: 10 }],
    [62, { mode: "multiple", value: 10 }],
    [63, { mode: "multiple", value: 10 }],
    [64, { mode: "multiple", value: 10 }],
    [66, { mode: "multiple", value: 7 }],
    [67, { mode: "any" }],
    [68, { mode: "exact", value: 60 }],
    [69, { mode: "multiple", value: 10 }],
    [70, { mode: "multiple", value: 10 }],
    [71, { mode: "multiple", value: 10 }],
    [72, { mode: "multiple", value: 10 }],
    [73, { mode: "multiple", value: 2 }],
    [79, { mode: "multiple", value: 12 }],
    [105, { mode: "multiple", value: 2 }],
    [124, { mode: "multiple", value: 10 }],
    [125, { mode: "any" }],
    [126, { mode: "any" }],
    [127, { mode: "any" }],
    [128, { mode: "any" }],
    [129, { mode: "any" }],
    [130, { mode: "any" }],
    [131, { mode: "pointer", value: 1 }],
    [132, { mode: "pointer", value: 1 }],
    [233, { mode: "pointer", value: 1 }],
    [173, { mode: "any" }],
    [174, { mode: "any" }],
    [175, { mode: "any" }],
    [182, { mode: "multiple", value: 2 }],
    [206, { mode: "multiple", value: 2 }],
    [207, { mode: "multiple", value: 30 }],
    [209, { mode: "multiple", value: 30 }],
    [210, { mode: "multiple", value: 30 }],
    [218, { mode: "multiple", value: 2 }],
    [240, { mode: "multiple", value: 20 }],
    [260, { mode: "exact", value: 10 }]
  ]);

  const DEFAULT_ITEM = Object.freeze({
    size: 64,
    disp: 4,
    font: 0,
    color_1: "#ffffff",
    color_2: "#000000",
    image_id: 0,
    image_addr: "",
    sep: 0,
    x: 100,
    y: 500,
    w: 600,
    h: 120,
    alig: 3,
    angle: 0,
    hier: 0,
    transp: 100,
    animation: 0
  });

  function byId(id) {
    return document.getElementById(id);
  }

  function toNum(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function ensureColorHex(value, fallback = "#ffffff") {
    if (typeof value !== "string") return fallback;
    const v = value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
    if (/^#[0-9a-fA-F]{3}$/.test(v)) {
      return "#" + v.slice(1).split("").map((c) => c + c).join("");
    }
    return fallback;
  }

  function colorToRgba(hex, alpha = 1) {
    const c = ensureColorHex(hex, "#ffffff");
    const r = parseInt(c.slice(1, 3), 16);
    const g = parseInt(c.slice(3, 5), 16);
    const b = parseInt(c.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${clamp(alpha, 0, 1)})`;
  }

  function normalizeCharSpacing(value, fallback = 0) {
    return clamp(Math.round(toNum(value, fallback)), -20, 200);
  }

  function measureTextWithSpacing(ctx, text, spacingPx = 0) {
    const chars = [...String(text ?? "")];
    if (!chars.length) return 0;
    let width = 0;
    for (const ch of chars) width += ctx.measureText(ch).width;
    if (chars.length > 1) width += spacingPx * (chars.length - 1);
    return width;
  }

  function drawTextWithSpacing(ctx, text, startX, y, spacingPx = 0) {
    const chars = [...String(text ?? "")];
    let x = startX;
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      ctx.fillText(ch, x, y);
      const w = ctx.measureText(ch).width;
      if (i < chars.length - 1) x += w + spacingPx;
      else x += w;
    }
    return x - startX;
  }

  function basename(pathLike) {
    if (!pathLike || typeof pathLike !== "string") return "";
    const p = pathLike.replace(/\\/g, "/");
    const idx = p.lastIndexOf("/");
    return idx >= 0 ? p.slice(idx + 1) : p;
  }

  function stripExt(name) {
    if (!name) return "";
    const i = name.lastIndexOf(".");
    return i > 0 ? name.slice(0, i) : name;
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatDate(now) {
    return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  }

  function formatBytes(bytes) {
    const n = Math.max(0, toNum(bytes, 0));
    if (n < 1024) return `${Math.round(n)} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  }

  function getLocalAssetRule(disp) {
    return LOCAL_ASSET_DISP_RULES.get(toNum(disp, 0)) || null;
  }

  function isLocalAssetDisp(disp) {
    return !!getLocalAssetRule(disp);
  }

  function getRuleText(rule) {
    if (!rule) return "";
    if (rule.mode === "any") return t("editor.asset.ruleAny");
    if (rule.mode === "multiple") return t("editor.asset.ruleMultiple", { n: rule.value });
    if (rule.mode === "exact") return t("editor.asset.ruleExact", { n: rule.value });
    if (rule.mode === "pointer") return t("editor.asset.rulePointer");
    return "";
  }

  function getRuleExpectText(rule) {
    if (!rule) return "-";
    if (rule.mode === "any") return "any";
    if (rule.mode === "multiple") return `${rule.value}n`;
    if (rule.mode === "exact") return String(rule.value);
    if (rule.mode === "pointer") return "1";
    return "-";
  }

  function inferImageFormat(fileName, mimeType) {
    const name = String(fileName || "").toLowerCase();
    const mime = String(mimeType || "").toLowerCase();
    if (mime.includes("gif") || name.endsWith(".gif")) return "gif";
    if (mime.includes("webp") || name.endsWith(".webp")) return "webp";
    return "";
  }

  function readAscii(bytes, start, len) {
    let s = "";
    for (let i = 0; i < len; i++) s += String.fromCharCode(bytes[start + i] || 0);
    return s;
  }

  function parseGifFrameCount(buf) {
    const bytes = new Uint8Array(buf);
    if (bytes.length < 14) return null;
    const sig = readAscii(bytes, 0, 6);
    if (sig !== "GIF87a" && sig !== "GIF89a") return null;
    let pos = 13;
    const packed = bytes[10] || 0;
    if (packed & 0x80) {
      const tableSize = 3 * (1 << ((packed & 0x07) + 1));
      pos += tableSize;
    }
    let frameCount = 0;
    while (pos < bytes.length) {
      const blockId = bytes[pos++];
      if (blockId === 0x3B) break;
      if (blockId === 0x2C) {
        if (pos + 9 > bytes.length) break;
        const localPacked = bytes[pos + 8] || 0;
        pos += 9;
        if (localPacked & 0x80) {
          const localSize = 3 * (1 << ((localPacked & 0x07) + 1));
          pos += localSize;
        }
        if (pos >= bytes.length) break;
        pos += 1; // LZW min code size
        while (pos < bytes.length) {
          const size = bytes[pos++];
          if (size === 0) break;
          pos += size;
        }
        frameCount += 1;
        continue;
      }
      if (blockId === 0x21) {
        if (pos >= bytes.length) break;
        pos += 1; // extension label
        while (pos < bytes.length) {
          const size = bytes[pos++];
          if (size === 0) break;
          pos += size;
        }
        continue;
      }
      break;
    }
    if (!Number.isFinite(frameCount) || frameCount <= 0) return 1;
    return frameCount;
  }

  function parseWebpFrameCount(buf) {
    const bytes = new Uint8Array(buf);
    const view = new DataView(buf);
    if (bytes.length < 16) return null;
    if (readAscii(bytes, 0, 4) !== "RIFF" || readAscii(bytes, 8, 4) !== "WEBP") return null;
    let pos = 12;
    let anmfCount = 0;
    while (pos + 8 <= bytes.length) {
      const chunkTag = readAscii(bytes, pos, 4);
      const chunkSize = view.getUint32(pos + 4, true);
      if (chunkTag === "ANMF") anmfCount += 1;
      pos += 8 + chunkSize + (chunkSize % 2);
      if (chunkSize < 0) break;
    }
    return anmfCount > 0 ? anmfCount : 1;
  }

  function inferImageMimeFromBuffer(buf, fileName = "", mimeHint = "") {
    const mime = String(mimeHint || "").split(";")[0].trim().toLowerCase();
    if (mime.startsWith("image/")) return mime;

    const bytes = new Uint8Array(buf);
    if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
    if (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    ) {
      return "image/png";
    }
    const sig6 = bytes.length >= 6 ? readAscii(bytes, 0, 6) : "";
    if (sig6 === "GIF87a" || sig6 === "GIF89a") return "image/gif";
    if (bytes.length >= 12 && readAscii(bytes, 0, 4) === "RIFF" && readAscii(bytes, 8, 4) === "WEBP") return "image/webp";
    if (bytes.length >= 2 && bytes[0] === 0x42 && bytes[1] === 0x4d) return "image/bmp";

    const lower = String(fileName || "").toLowerCase();
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
    if (lower.endsWith(".gif")) return "image/gif";
    if (lower.endsWith(".webp")) return "image/webp";
    if (lower.endsWith(".bmp")) return "image/bmp";
    return "application/octet-stream";
  }

  function loadImageByObjectUrl(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("image decode failed"));
      img.src = url;
    });
  }

  async function loadLocalAssetFromFile(file) {
    const fmt = inferImageFormat(file?.name, file?.type);
    if (!fmt) throw new Error(t("editor.asset.formatError"));
    const mimeType = String(file.type || `image/${fmt}`);
    const buf = await file.arrayBuffer();
    let frameCount = null;
    try {
      if (fmt === "gif") frameCount = parseGifFrameCount(buf);
      else if (fmt === "webp") frameCount = parseWebpFrameCount(buf);
    } catch (e) {
      frameCount = null;
    }
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await loadImageByObjectUrl(objectUrl);
      const decodedFrames = await tryDecodeAnimationFrames(buf, mimeType);
      const finalFrameCount = Number.isFinite(frameCount)
        ? frameCount
        : (decodedFrames.length ? decodedFrames.length : null);
      return {
        name: String(file.name || ""),
        fromLocalPick: true,
        sourceUrl: "",
        size: toNum(file.size, 0),
        mimeType,
        format: fmt,
        frameCount: finalFrameCount,
        frames: decodedFrames,
        objectUrl,
        image
      };
    } catch (e) {
      URL.revokeObjectURL(objectUrl);
      throw e;
    }
  }

  function releaseStandaloneAsset(asset) {
    if (!asset) return;
    if (Array.isArray(asset.frames)) {
      for (const frame of asset.frames) {
        if (frame && typeof frame.close === "function") {
          try {
            frame.close();
          } catch (e) {
            // ignore
          }
        }
      }
    }
    if (asset.objectUrl) {
      try {
        URL.revokeObjectURL(asset.objectUrl);
      } catch (e) {
        // ignore
      }
    }
  }

  async function loadLocalAssetFromUrl(url, displayName = "") {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const mimeHint = String(res.headers.get("content-type") || "");
    const buf = await res.arrayBuffer();
    const parsedName = displayName || (() => {
      try {
        const u = new URL(url, window.location.href);
        return basename(u.pathname || "");
      } catch (e) {
        return basename(url);
      }
    })();
    const mimeType = inferImageMimeFromBuffer(buf, parsedName, mimeHint);
    const format = inferImageFormat(parsedName, mimeType);
    const blob = mimeType === "application/octet-stream"
      ? new Blob([buf])
      : new Blob([buf], { type: mimeType });
    const objectUrl = URL.createObjectURL(blob);
    try {
      const image = await loadImageByObjectUrl(objectUrl);
      let frameCount = null;
      if (format === "gif") frameCount = parseGifFrameCount(buf);
      else if (format === "webp") frameCount = parseWebpFrameCount(buf);
      const decodedFrames = await tryDecodeAnimationFrames(buf, mimeType);
      const finalFrameCount = Number.isFinite(frameCount)
        ? frameCount
        : (decodedFrames.length ? decodedFrames.length : 1);
      return {
        name: parsedName || basename(url),
        fromLocalPick: false,
        sourceUrl: absoluteUrlFromResolvedPath(url),
        size: toNum(buf.byteLength, 0),
        mimeType,
        format,
        frameCount: finalFrameCount,
        frames: decodedFrames,
        objectUrl,
        image
      };
    } catch (e) {
      URL.revokeObjectURL(objectUrl);
      throw e;
    }
  }

  async function loadFirstTemplateAsset(baseDir, baseName, extCandidates) {
    const base = ensureSlash(baseDir);
    const tried = [];
    for (const ext of extCandidates) {
      const rel = `${base}${baseName}${ext}`;
      tried.push(rel);
      try {
        const asset = await loadLocalAssetFromUrl(rel, `${baseName}${ext}`);
        return { asset, path: rel, tried };
      } catch (e) {
        // try next extension
      }
    }
    return { asset: null, path: "", tried };
  }

  function validateLocalAssetRule(rule, frameCount) {
    if (!rule) return { level: "ok", text: t("editor.asset.validationAny") };
    if (rule.mode === "any") return { level: "ok", text: t("editor.asset.validationAny") };
    if (!Number.isFinite(frameCount) || frameCount <= 0) {
      return { level: "warn", text: t("editor.asset.validationUnknown") };
    }
    const frames = toNum(frameCount, 0);
    if (rule.mode === "pointer") {
      if (frames === 1) return { level: "ok", text: t("editor.asset.validationPass") };
      return {
        level: "bad",
        text: t("editor.asset.validationFail", { rule: getRuleExpectText(rule), actual: frames })
      };
    }
    if (rule.mode === "exact") {
      if (frames === toNum(rule.value, 0)) return { level: "ok", text: t("editor.asset.validationPass") };
      return {
        level: "bad",
        text: t("editor.asset.validationFail", { rule: getRuleExpectText(rule), actual: frames })
      };
    }
    if (rule.mode === "multiple") {
      const base = Math.max(1, toNum(rule.value, 1));
      if (frames % base === 0) return { level: "ok", text: t("editor.asset.validationPass") };
      return {
        level: "bad",
        text: t("editor.asset.validationFail", { rule: getRuleExpectText(rule), actual: frames })
      };
    }
    return { level: "warn", text: t("editor.asset.validationUnknown") };
  }

  async function tryDecodeAnimationFrames(buf, mimeType) {
    if (typeof ImageDecoder === "undefined") return [];
    const type = String(mimeType || "").toLowerCase();
    if (!type.includes("gif") && !type.includes("webp")) return [];
    let decoder = null;
    try {
      decoder = new ImageDecoder({ data: buf, type: mimeType });
      await decoder.tracks.ready;
      const track = decoder.tracks.selectedTrack;
      const frameCount = Math.max(1, toNum(track?.frameCount, 1));
      if (frameCount <= 1 || frameCount > 240) return [];
      const frames = [];
      for (let i = 0; i < frameCount; i++) {
        const result = await decoder.decode({ frameIndex: i });
        if (result?.image) frames.push(result.image);
      }
      return frames;
    } catch (e) {
      return [];
    } finally {
      if (decoder) {
        try {
          decoder.close();
        } catch (e) {
          // ignore
        }
      }
    }
  }

  function getDispFrameSlot(disp, now = new Date()) {
    const mon = now.getMonth() + 1;
    const day = now.getDate();
    switch (toNum(disp, 0)) {
      case 55:
      case 63:
      case 64:
      case 124:
      case 260:
        return Math.floor(now.getSeconds() / 6) % 10;
      case 57:
        return now.getHours() % 12;
      case 58:
        return Math.floor(now.getMinutes() / 5) % 12;
      case 59:
        return Math.floor(now.getHours() / 10);
      case 60:
        return now.getHours() % 10;
      case 61:
        return Math.floor(now.getMinutes() / 10);
      case 62:
        return now.getMinutes() % 10;
      case 66:
        return now.getDay();
      case 68:
        return now.getSeconds();
      case 69:
        return Math.floor(mon / 10);
      case 70:
        return mon % 10;
      case 71:
        return Math.floor(day / 10);
      case 72:
        return day % 10;
      case 73:
        return now.getHours() >= 12 ? 1 : 0;
      case 79:
        return now.getMonth();
      case 105:
      case 206:
      case 218:
        return now.getHours() >= 6 && now.getHours() < 18 ? 0 : 1;
      case 182:
        return now.getSeconds() % 2;
      case 207:
      case 209:
      case 210:
        return (day - 1) % 30;
      case 240:
        return now.getSeconds() % 20;
      default:
        return -1;
    }
  }

  function resolveFrameIndexForDisp(disp, frameCount, now = new Date()) {
    const rule = getLocalAssetRule(disp);
    if (!rule || !Number.isFinite(frameCount) || frameCount <= 1) return 0;
    const total = Math.max(1, Math.floor(frameCount));
    const slot = getDispFrameSlot(disp, now);
    if (slot < 0) return Math.floor((Date.now() / 120) % total);

    if (rule.mode === "exact") {
      return clamp(slot, 0, total - 1);
    }
    if (rule.mode === "multiple") {
      const base = Math.max(1, toNum(rule.value, 1));
      const slotNorm = ((slot % base) + base) % base;
      const step = total / base;
      const idx = Math.floor(slotNorm * step);
      return clamp(idx, 0, total - 1);
    }
    if (rule.mode === "pointer") {
      return 0;
    }
    return Math.floor((Date.now() / 120) % total);
  }

  function downloadTextFile(fileName, text, mimeType) {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function readFileAsJson(file) {
    const txt = await file.text();
    return parseJsonText(txt);
  }

  function parseJsonText(txt) {
    const cleaned = String(txt ?? "").replace(/^\uFEFF/, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      // 兼容部分环境下只提供 `"FontList":[...]` 片段的情况
      if (!cleaned.startsWith("{") && /"FontList"\s*:/.test(cleaned)) {
        return JSON.parse(`{${cleaned}}`);
      }
      throw e;
    }
  }

  async function fetchJson(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("text/html")) throw new Error("unexpected HTML (SPA fallback?)");
    const txt = await res.text();
    return parseJsonText(txt);
  }

  async function fetchText(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  }

  async function loadJsonByIframe(path, timeoutMs = 4500) {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.referrerPolicy = "no-referrer";
      let done = false;
      const finish = (ok, payload) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        iframe.remove();
        if (ok) resolve(payload);
        else reject(payload instanceof Error ? payload : new Error(String(payload)));
      };

      const timer = setTimeout(() => {
        finish(false, new Error("iframe load timeout"));
      }, timeoutMs);

      iframe.onload = () => {
        try {
          const doc = iframe.contentDocument;
          const text = doc?.body?.textContent || doc?.documentElement?.textContent || "";
          if (!text.trim()) {
            finish(false, new Error("iframe empty"));
            return;
          }
          finish(true, parseJsonText(text));
        } catch (e) {
          finish(false, e);
        }
      };

      iframe.onerror = () => {
        finish(false, new Error("iframe load error"));
      };

      document.body.appendChild(iframe);
      iframe.src = path;
    });
  }

  async function loadFirstJson(paths) {
    for (const p of paths) {
      try {
        return await fetchJson(p);
      } catch (e) {
        // try next strategy
      }
    }
    for (const p of paths) {
      try {
        return await loadJsonByIframe(p);
      } catch (e) {
        // continue
      }
    }
    return null;
  }

  function errorToText(err) {
    if (!err) return "unknown error";
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message || String(err);
    try {
      return JSON.stringify(err);
    } catch (e) {
      return String(err);
    }
  }

  function ensureSlash(pathLike) {
    const p = String(pathLike || "");
    if (!p) return "";
    return p.endsWith("/") ? p : `${p}/`;
  }

  function absoluteUrlFromResolvedPath(resolvedPath) {
    const s = String(resolvedPath || "").trim();
    if (!s) return "";
    try {
      return new URL(s, window.location.href).href;
    } catch (e) {
      return s;
    }
  }

  function refreshBackgroundSourceLabel() {
    syncTemplateDomRefs();
    if (!dom.txtBgSourcePath) return;
    dom.txtBgSourcePath.value = state.backgroundSourceLabel || "";
    dom.txtBgSourcePath.title = state.backgroundSourceLabel || "";
  }

  function fontBaseFromCfgPath(cfgPath) {
    const raw = String(cfgPath || "");
    if (!raw) return "";
    const marker = "font_info.cfg";
    const idx = raw.toLowerCase().lastIndexOf(marker);
    if (idx < 0) return "";
    return ensureSlash(raw.slice(0, idx));
  }

  async function loadFirstJsonWithTrace(paths, onTrace) {
    const trace = typeof onTrace === "function" ? onTrace : () => {};
    for (const p of paths) {
      try {
        const data = await fetchJson(p);
        trace(`fetch 成功: ${p}`);
        return { data, path: p, via: "fetch" };
      } catch (e) {
        trace(`fetch 失败: ${p} -> ${errorToText(e)}`);
      }
    }
    for (const p of paths) {
      try {
        const data = await loadJsonByIframe(p);
        trace(`iframe 成功: ${p}`);
        return { data, path: p, via: "iframe" };
      } catch (e) {
        trace(`iframe 失败: ${p} -> ${errorToText(e)}`);
      }
    }
    return { data: null, path: "", via: "" };
  }

  function guessAlign(value) {
    const v = toNum(value, 0);
    if (v === 1 || v === 0) return "left";
    if (v === 2) return "right";
    if (v === 3) return "center";
    return "left";
  }

  function dispName(disp) {
    return DISP_NAME_MAP[disp] || `DISP_${disp}`;
  }

  const ZH_COMMENT_EN_REPLACERS = [
    ["整点报时", "hourly chime"],
    ["潮汐曲线", "tidal curve"],
    ["恋爱天数", "days in love"],
    ["星座", "zodiac"],
    ["单元项", "item"],
    ["标题", "title"],
    ["数据轮播", "data carousel"],
    ["最高气温", "max temperature"],
    ["最低气温", "min temperature"],
    ["白天黑夜模式", "day/night mode"],
    ["全字母", "full letters"],
    ["三个字母缩写", "three-letter abbreviation"],
    ["两字母", "two letters"],
    ["小时制", "hour mode"],
    ["上下午", "AM/PM"],
    ["分钟", "minute"],
    ["小时", "hour"],
    ["秒钟", "second"],
    ["时间", "time "],
    ["秒", "second"],
    ["数字", "number"],
    ["中文", "Chinese"],
    ["英文", "English"],
    ["天气", "weather"],
    ["图像", "image"],
    ["图片", "image"],
    ["图", "icon"],
    ["指针", "pointer"],
    ["网络图库", "online gallery"],
    ["网络", "network"],
    ["用户", "user"],
    ["显示", "display"],
    ["月相", "moon phase"],
    ["星期", "week"],
    ["月", "month"],
    ["日", "day"],
    ["年", "year"],
    ["农历", "lunar"],
    ["最高气温", "max temperature"],
    ["最低气温", "min temperature"],
    ["温度", "temperature"],
    ["闹钟", "alarm"],
    ["日历", "calendar"],
    ["歌曲", "song"],
    ["歌名", "song title"],
    ["歌词", "lyrics"],
    ["白天黑夜模式", "day/night mode"],
    ["倒计时", "countdown"],
    ["相册", "album"],
    ["子表盘组件开始ID", "sub-dial component start ID"],
    ["子表盘组件结束ID", "sub-dial component end ID"],
    ["子表盘", "sub-dial"],
    ["组件", "component"],
    ["开始", "start"],
    ["结束", "end"],
    ["表盘", "watchface"],
    ["噪音", "noise"],
    ["风速", "wind speed"],
    ["可见度", "visibility"],
    ["湿度", "humidity"],
    ["英文字母", "english letters"],
    ["大后天", "in three days"],
    ["后后天", "in four days"],
    ["后天", "tomorrow+1"],
    ["明天", "tomorrow"],
    ["当天", "today"],
    ["今天", "today"],
    ["本地", "local"],
    ["二维码", "QR code"],
    ["号", "date"],
    ["月份", "month"],
    ["星期", "week"],
    ["日期", "date"],
    ["农历", "lunar"],
    ["显示", "display"],
    ["主题", "theme"],
    ["提醒框", "reminder box"],
    ["倒计时", "countdown"],
    ["间隔", "interval"],
    ["强度", "strength"],
    ["头像", "avatar"],
    ["用户", "user"],
    ["网络", "network"],
    ["世界", "world"],
    ["城市", "city"],
    ["可见度", "visibility"],
    ["湿度", "humidity"],
    ["风速", "wind speed"],
    ["闹钟", "alarm"],
    ["日出", "sunrise"],
    ["日落", "sunset"],
    ["月相", "moon phase"],
    ["名称", "name"],
    ["歌名", "song title"],
    ["歌词", "lyrics"],
    ["动画", "animation"],
    ["相册", "album"],
    ["适配底图", "fits background"],
    ["不适配底图", "not fit background"],
    ["边框表盘中的像素艺术位置", "pixel art position in framed watchface"],
    ["年", "year"],
    ["月", "month"],
    ["日", "day"],
    ["分", "minute"],
    ["制", "mode"]
  ];

  function translateZhCommentToEnglish(zhComment, id) {
    let out = String(zhComment || "");
    out = out
      .replace(/[０-９]/g, (ch) => String(ch.charCodeAt(0) - 65248))
      .replace(/（/g, "(")
      .replace(/）/g, ")")
      .replace(/，/g, ",")
      .replace(/：/g, ":");
    for (const [from, to] of ZH_COMMENT_EN_REPLACERS) {
      out = out.split(from).join(to);
    }
    out = out
      .replace(/[\u4e00-\u9fa5]/g, " ")
      .replace(/[，。；、【】《》“”‘’]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\s*([,:;()\-])\s*/g, "$1 ")
      .trim();
    if (!out) return `Element ${id}`;
    return out.replace(/^./, (c) => c.toUpperCase());
  }

  function dispComment(disp) {
    const id = toNum(disp, NaN);
    if (!Number.isFinite(id)) return "";
    const zhText = String(DISP_COMMENT_ZH_MAP[id] || "").trim();
    const locale = String(getLocaleCode() || "").toLowerCase();
    if (locale.startsWith("zh")) {
      return zhText || `显示元素 ${id}`;
    }
    if (!zhText) return `Element ${id}`;
    return translateZhCommentToEnglish(zhText, id);
  }

  function formatDispOptionText(disp) {
    const id = toNum(disp, 0);
    return `${id} | ${dispComment(id)}`;
  }

  const DISP_CATEGORY_ORDER = [
    "disp.cat.timeDate",
    "disp.cat.weather",
    "disp.cat.lunar",
    "disp.cat.audio",
    "disp.cat.appNet",
    "disp.cat.image",
    "disp.cat.pointerComponent",
    "disp.cat.text",
    "disp.cat.other"
  ];

  function dispCategoryKey(disp, name) {
    const upper = String(name || "").toUpperCase();
    if (disp >= 261 && disp <= 279) return "disp.cat.pointerComponent";
    if (POINTER_DISP_IDS.has(disp) || /POINT|DIAL|COMPONENT|CALENDAR_WATCH/.test(upper)) return "disp.cat.pointerComponent";
    if (/CHINA_|JIEQI|CONST|GOOD|BAD|LUNAR/.test(upper)) return "disp.cat.lunar";
    if (/WEATHER|TEMP|WIND|VISIBILITY|HUMI|DAY_NIGHT|SUNRISE|SUNSET|TIDAL|PHASE_MOON/.test(upper)) return "disp.cat.weather";
    if (/MUSIC|SPOTIFY|EQ|ALARM|NOISE/.test(upper)) return "disp.cat.audio";
    if (/APP_ITEM|APP_NET|APP_CON|APP_PIC|APP_TITLE|NET\d+_|NET_PIC|NET_TEXT|USER_TEXT|CALENDAR_EVENT|QR_CODE/.test(upper)) {
      return "disp.cat.appNet";
    }
    if (IMAGE_DISP_IDS.has(disp) || /IMAGE|GIF|PIC|PHOTO|ALBUM|HEAD_IMG/.test(upper)) return "disp.cat.image";
    if (/TEXT|WORD|NEWS|TITLE|COUNT_DOWN|DAYS_OF_LOVE/.test(upper)) return "disp.cat.text";
    if (/HOUR|MIN|SECOND|WEEK|YEAR|MON|DAY|DATE|TIME|AM_PM/.test(upper)) return "disp.cat.timeDate";
    return "disp.cat.other";
  }

  class FontStore {
    constructor(onStatus, onChanged) {
      this.onStatus = onStatus;
      this.onChanged = onChanged;
      this.fontMeta = new Map();
      this.fontFilesByName = new Map();
      this.fontFileById = new Map();
      this.ttfFamilies = new Map();
      this.imageBuffers = new Map();
      this.imageGlyphCache = new Map();
      this.imageGlyphPending = new Map();
      this.fetchAttempted = new Set();
      this.logs = [];
    }

    log(msg) {
      const t = `[${new Date().toLocaleTimeString()}] ${msg}`;
      this.logs.push(t);
      if (this.logs.length > 90) this.logs.shift();
      if (this.onStatus) this.onStatus(this.logs.join("\n"));
    }

    getMeta(id) {
      return this.fontMeta.get(id) || null;
    }

    getAllMetas() {
      return [...this.fontMeta.values()].sort((a, b) => a.id - b.id);
    }

    getFamily(id) {
      this.ensureOnDemandFetch(id);
      return this.ttfFamilies.get(id) || "";
    }

    parseFontListLike(raw) {
      const list = Array.isArray(raw?.font_list)
        ? raw.font_list
        : Array.isArray(raw?.FontList)
          ? raw.FontList
          : Array.isArray(raw)
            ? raw
            : [];
      if (!list.length) return 0;

      let count = 0;
      for (const item of list) {
        const id = toNum(item.id ?? item.ID, NaN);
        if (!Number.isFinite(id)) continue;
        const prev = this.fontMeta.get(id) || { id };
        const merged = {
          id,
          type: toNum(item.type ?? item.Type, prev.type ?? 1),
          url: String(item.url ?? item.Url ?? prev.url ?? ""),
          charset: String(item.charset ?? item.Charset ?? prev.charset ?? ""),
          name: String(item.name ?? item.Name ?? item.NameEn ?? item.NameCn ?? prev.name ?? "")
        };
        this.fontMeta.set(id, merged);
        count++;
      }
      this.log(`已合并字体元数据 ${count} 条。`);
      this.bindFilesToMetas();
      this.onChanged?.();
      return count;
    }

    parseFontNamesLike(raw) {
      const list = Array.isArray(raw?.font_list) ? raw.font_list : [];
      if (!list.length) return 0;
      let c = 0;
      for (const row of list) {
        const id = toNum(row.id ?? row.ID, NaN);
        if (!Number.isFinite(id)) continue;
        const meta = this.fontMeta.get(id) || { id, type: 1, url: "", charset: "" };
        meta.name = String(row.name ?? row.Name ?? meta.name ?? "");
        this.fontMeta.set(id, meta);
        c++;
      }
      this.log(`已合并字体名称 ${c} 条。`);
      this.onChanged?.();
      return c;
    }

    putFile(file) {
      const lower = file.name.toLowerCase();
      this.fontFilesByName.set(lower, file);
      const base = stripExt(lower);
      const match = base.match(/(^|[_\-])(\d{1,5})(?=$|[_\-])/);
      if (match) {
        const fileNum = toNum(match[2], NaN);
        // 当前规则：文件名 = 字体ID + 1，例如 289.bin -> font id 288
        const mappedId = fileNum - 1;
        if (Number.isFinite(mappedId) && mappedId >= 0 && !this.fontFileById.has(mappedId)) {
          this.fontFileById.set(mappedId, file);
        }
      }
    }

    async addFiles(fileList) {
      const files = [...fileList];
      files.forEach((f) => this.putFile(f));
      this.log(`已读入文件 ${files.length} 个。`);
      await this.bindFilesToMetas();
      this.onChanged?.();
    }

    async bindFilesToMetas() {
      for (const meta of this.fontMeta.values()) {
        if (!this.fontFileById.has(meta.id)) {
          const fileId = toNum(meta.id, NaN) + 1;
          const candidates = Number.isFinite(fileId) && fileId >= 0
            ? [`${fileId}.bin`, `${fileId}.BIN`]
            : [];
          let found = null;
          for (const n of candidates) {
            if (!n) continue;
            found = this.fontFilesByName.get(n.toLowerCase());
            if (found) break;
          }
          if (found) this.fontFileById.set(meta.id, found);
        }

        if (this.fontFileById.has(meta.id)) {
          const file = this.fontFileById.get(meta.id);
          if (meta.type === 1) {
            await this.ensureTtfFamily(meta.id, file);
          } else {
            await this.ensureImageBuffer(meta.id, file);
          }
        }
      }
      this.onChanged?.();
    }

    async ensureTtfFamily(id, file) {
      if (this.ttfFamilies.has(id)) return this.ttfFamilies.get(id);
      try {
        const ab = await file.arrayBuffer();
        const family = `wf-font-${id}`;
        const face = new FontFace(family, ab);
        await face.load();
        document.fonts.add(face);
        this.ttfFamilies.set(id, family);
        this.log(`TTF 字体可用: id=${id}, file=${file.name}`);
        return family;
      } catch (e) {
        const reason = e && e.message ? e.message : String(e);
        this.log(`TTF 字体加载失败: id=${id}, file=${file.name}, reason=${reason}`);
        return "";
      }
    }

    async ensureImageBuffer(id, file) {
      if (this.imageBuffers.has(id)) return this.imageBuffers.get(id);
      try {
        const ab = await file.arrayBuffer();
        this.imageBuffers.set(id, ab);
        this.log(`图像字体缓冲已加载: id=${id}, file=${file.name}, size=${ab.byteLength}`);
        return ab;
      } catch (e) {
        this.log(`图像字体缓冲加载失败: id=${id}, file=${file.name}`);
        return null;
      }
    }

    ensureOnDemandFetch(id) {
      const fontId = toNum(id, NaN);
      if (!Number.isFinite(fontId)) return;
      if (this.fontFileById.has(fontId)) return;
      if (this.fetchAttempted.has(fontId)) return;
      const meta = this.getMeta(fontId);
      if (!meta) return;

      this.fetchAttempted.add(fontId);
      const candidates = [];
      const seen = new Set();
      const add = (name) => {
        if (!name) return;
        const n = String(name).trim();
        if (!n) return;
        const key = n.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        candidates.push(n);
      };
      const localFileId = fontId + 1;
      add(`${localFileId}.bin`);
      add(`${localFileId}.BIN`);
      if (!candidates.length) return;

      (async () => {
        const basePaths = Array.isArray(runtime.fontBasePaths) && runtime.fontBasePaths.length
          ? runtime.fontBasePaths
          : [withBase("font/")];
        for (const local of candidates) {
          for (const base of basePaths) {
            try {
              const url = `${ensureSlash(base)}${local}`;
              const res = await fetch(url, { cache: "no-store" });
              if (!res.ok) continue;
              const blob = await res.blob();
              const file = new File([blob], local, { type: blob.type || "application/octet-stream" });
              this.putFile(file);
              this.fontFileById.set(fontId, file);
              if (toNum(meta.type, 1) === 1) await this.ensureTtfFamily(fontId, file);
              else await this.ensureImageBuffer(fontId, file);
              this.log(`按需读取字体成功: id=${fontId}, file=${local}, base=${base}`);
              this.onChanged?.();
              return;
            } catch (e) {
              // keep trying other base paths
            }
          }
        }
        this.log(`按需读取字体失败: id=${fontId}（已按 ID+1.BIN 规则尝试）`);
      })();
    }

    isImageFont(id) {
      const meta = this.getMeta(id);
      return !!meta && toNum(meta.type, 1) === 0;
    }

    async ensureGlyph(meta, char) {
      const key = `${meta.id}:${char}`;
      if (this.imageGlyphCache.has(key)) return this.imageGlyphCache.get(key);
      if (this.imageGlyphPending.has(key)) return null;
      const pending = (async () => {
        try {
          const buffer = this.imageBuffers.get(meta.id);
          if (!buffer) return null;
          if (!meta.charset) return null;
          const pos = meta.charset.indexOf(char);
          if (pos < 0) return null;

          const tableOff = 2 + pos * 4;
          if (tableOff + 4 > buffer.byteLength) return null;
          const dv = new DataView(buffer);
          const start = dv.getUint32(tableOff, true);
          let end = buffer.byteLength;
          if (pos < meta.charset.length - 1) {
            if (tableOff + 8 > buffer.byteLength) return null;
            end = dv.getUint32(tableOff + 4, true);
          }
          if (start >= end || end > buffer.byteLength) return null;

          const blob = new Blob([buffer.slice(start, end)], { type: "image/webp" });
          const url = URL.createObjectURL(blob);
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
          });
          URL.revokeObjectURL(url);
          this.imageGlyphCache.set(key, img);
          return img;
        } catch (e) {
          return null;
        } finally {
          this.imageGlyphPending.delete(key);
        }
      })();
      this.imageGlyphPending.set(key, pending);
      return null;
    }

    drawImageFontText(ctx, text, item, rect) {
      const fontId = toNum(item.font, 0);
      const meta = this.getMeta(fontId);
      if (!meta || toNum(meta.type, 1) !== 0) return false;
      if (!meta.charset) return false;
      if (!this.imageBuffers.has(fontId)) {
        this.ensureOnDemandFetch(fontId);
        return false;
      }

      const chars = [...String(text ?? "")];
      if (!chars.length) return true;

      const spacingPx = normalizeCharSpacing(item.sep, 0);
      const glyphs = chars.map((ch) => {
        const g = this.imageGlyphCache.get(`${fontId}:${ch}`) || null;
        if (!g) this.ensureGlyph(meta, ch);
        return g;
      });
      let maxGlyphH = 0;
      let sumGlyphW = 0;
      let loadedGlyphCount = 0;
      for (const glyph of glyphs) {
        if (!glyph) continue;
        const glyphW = Math.max(1, glyph.width);
        const glyphH = Math.max(1, glyph.height);
        sumGlyphW += glyphW;
        maxGlyphH = Math.max(maxGlyphH, glyphH);
        loadedGlyphCount++;
      }
      const fallbackH = maxGlyphH > 0
        ? maxGlyphH
        : Math.max(10, Math.round(Math.max(12, rect.h * 0.8)));
      const estimatedW = loadedGlyphCount > 0
        ? Math.max(8, Math.round(sumGlyphW / loadedGlyphCount))
        : Math.max(8, Math.round(fallbackH * 0.62));
      let totalW = 0;
      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];
        if (g) {
          totalW += Math.max(1, g.width);
        } else {
          totalW += estimatedW;
        }
        if (i < glyphs.length - 1) totalW += spacingPx;
      }

      let x = rect.x + 2;
      const align = guessAlign(item.alig ?? item.align);
      if (align === "center") x = rect.x + Math.max(0, (rect.w - totalW) / 2);
      if (align === "right") x = rect.x + Math.max(0, rect.w - totalW - 2);
      const lineH = Math.max(maxGlyphH, fallbackH);
      const lineTop = rect.y + (rect.h - lineH) / 2;

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const img = glyphs[i];
        if (img) {
          const glyphW = Math.max(1, img.width);
          const glyphH = Math.max(1, img.height);
          const glyphY = lineTop + (lineH - glyphH) / 2;
          ctx.drawImage(img, x, glyphY, glyphW, glyphH);
          x += glyphW;
        } else {
          // Keep logical advance width while glyph is missing/not ready, no color fallback.
          x += estimatedW;
        }
        if (i < chars.length - 1) x += spacingPx;
      }
      return true;
    }
  }

  const dom = {
    selectLang: byId("select-lang"),
    appTitle: byId("app-title"),
    appSubtitle: byId("app-subtitle"),
    lblLang: byId("lbl-lang"),
    secConfigTitle: byId("sec-config-title"),
    secTemplateTitle: byId("sec-template-title"),
    secCanvasTitle: byId("sec-canvas-title"),
    secBackgroundTitle: byId("sec-background-title"),
    secItemlistTitle: byId("sec-itemlist-title"),
    secEditorTitle: byId("sec-editor-title"),
    lblInputConfigFile: byId("lbl-input-config-file"),
    lblTxtConfigJson: byId("lbl-txt-config-json"),
    lblTemplateCategory: byId("lbl-template-category"),
    lblTemplateFilter: byId("lbl-template-filter"),
    lblInputWidth: byId("lbl-input-width"),
    lblInputHeight: byId("lbl-input-height"),
    lblInputZoom: byId("lbl-input-zoom"),
    lblInputBgFile: byId("lbl-input-bg-file"),
    lblBgSourcePath: byId("lbl-bg-source-path"),
    lblCurrentClock: byId("lbl-current-clock"),
    lblClockId: byId("lbl-clock-id"),
    lblItemCount: byId("lbl-item-count"),
    legendImage: byId("legend-image"),
    legendText: byId("legend-text"),
    legendPointer: byId("legend-pointer"),
    inputConfigFile: byId("input-config-file"),
    txtConfigJson: byId("txt-config-json"),
    btnApplyJson: byId("btn-apply-json"),
    btnClearJson: byId("btn-clear-json"),
    selectTemplateCategory: byId("select-template-category"),
    inputTemplateFilter: byId("input-template-filter"),
    btnReloadTemplates: byId("btn-reload-templates"),
    templateHint: byId("template-hint"),
    templateList: byId("template-list"),
    inputWidth: byId("input-width"),
    inputHeight: byId("input-height"),
    inputZoom: byId("input-zoom"),
    txtZoom: byId("txt-zoom"),
    inputBgFile: byId("input-bg-file"),
    txtBgSourcePath: byId("txt-bg-source-path"),
    btnClearBg: byId("btn-clear-bg"),
    btnFitResolution: byId("btn-fit-resolution"),
    btnLoadDefaults: byId("btn-load-defaults"),
    btnLoadSample: byId("btn-load-sample"),
    btnExportConfig: byId("btn-export-config"),
    // Left font resource panel is removed, keep these optional for compatibility.
    inputFontFilter: byId("input-font-filter"),
    builtinFontList: byId("builtin-font-list"),
    selectFontPreview: byId("select-font-preview"),
    inputFontPreviewText: byId("input-font-preview-text"),
    fontPreviewCanvas: byId("font-preview-canvas"),
    fontStatus: byId("font-status"),
    txtClockTitle: byId("txt-clock-title"),
    txtClockId: byId("txt-clock-id"),
    txtItemCount: byId("txt-item-count"),
    canvas: byId("watchface-canvas"),
    previewStage: byId("preview-stage"),
    itemList: byId("item-list"),
    btnAddItem: byId("btn-add-item"),
    btnDupItem: byId("btn-dup-item"),
    btnDelItem: byId("btn-del-item"),
    btnItemUp: byId("btn-item-up"),
    btnItemDown: byId("btn-item-down"),
    itemEditor: byId("item-editor"),
    fileProtocolBanner: byId("file-protocol-banner"),
    fileBannerTitle: byId("file-banner-title"),
    fileBannerBody: byId("file-banner-body"),
    btnDismissFileBanner: byId("btn-dismiss-file-banner")
  };

  /** 模板列表依赖的节点：避免极少数环境下脚本早于节点插入导致 byId 为 null。 */
  function syncTemplateDomRefs() {
    const sel = byId("select-template-category");
    const hint = byId("template-hint");
    const list = byId("template-list");
    const bgPath = byId("txt-bg-source-path");
    const lblBgPath = byId("lbl-bg-source-path");
    if (sel) dom.selectTemplateCategory = sel;
    if (hint) dom.templateHint = hint;
    if (list) dom.templateList = list;
    if (bgPath) dom.txtBgSourcePath = bgPath;
    if (lblBgPath) dom.lblBgSourcePath = lblBgPath;
  }

  const watchCtx = dom.canvas.getContext("2d");
  const fontPreviewCtx = dom.fontPreviewCanvas?.getContext("2d") || null;
  let currentLanguageEnum = DEFAULT_LANGUAGE_ENUM;

  const state = {
    width: 800,
    height: 1280,
    zoom: 55,
    config: {
      ClockId: 0,
      NameCn: "Untitled",
      ItemList: [],
      ItemIdList: []
    },
    selectedIndex: -1,
    previewTextOverrides: new Map(),
    backgroundImage: null,
    backgroundName: "",
    backgroundObjectUrl: "",
    /** 模板底图等：只读框展示的绝对 URL 或本地上传说明（浏览器无法取得真实磁盘路径） */
    backgroundSourceLabel: "",
    tickHandle: null
  };

  const templateState = {
    ids: [],
    metaById: new Map(),
    classifyRows: [],
    selectedClassifyId: null,
    activeClockId: null,
    loading: false,
    error: "",
    source: "",
    loadToken: 0
  };

  const runtime = {
    fontCfgPath: "",
    fontBasePaths: [
      withBase("font/"),
      "./font/",
      "font/",
      "./html/font/",
      "../font/",
      "../html/font/",
      "/font/",
      "/html/font/"
    ]
  };

  const localDispAssets = new Map();

  function getLocalDispAsset(item) {
    return item ? (localDispAssets.get(item) || null) : null;
  }

  function clearLocalDispAsset(item) {
    if (!item) return;
    const old = localDispAssets.get(item);
    if (Array.isArray(old?.frames)) {
      for (const frame of old.frames) {
        if (frame && typeof frame.close === "function") {
          try {
            frame.close();
          } catch (e) {
            // ignore
          }
        }
      }
    }
    if (old?.objectUrl) {
      try {
        URL.revokeObjectURL(old.objectUrl);
      } catch (e) {
        // ignore
      }
    }
    localDispAssets.delete(item);
  }

  function setLocalDispAsset(item, asset) {
    if (!item) return;
    clearLocalDispAsset(item);
    if (asset) localDispAssets.set(item, asset);
  }

  function clearAllLocalDispAssets() {
    for (const asset of localDispAssets.values()) {
      if (Array.isArray(asset?.frames)) {
        for (const frame of asset.frames) {
          if (frame && typeof frame.close === "function") {
            try {
              frame.close();
            } catch (e) {
              // ignore
            }
          }
        }
      }
      if (asset?.objectUrl) {
        try {
          URL.revokeObjectURL(asset.objectUrl);
        } catch (e) {
          // ignore
        }
      }
    }
    localDispAssets.clear();
  }

  function clearBackgroundObjectUrl() {
    if (!state.backgroundObjectUrl) return;
    try {
      URL.revokeObjectURL(state.backgroundObjectUrl);
    } catch (e) {
      // ignore
    }
    state.backgroundObjectUrl = "";
  }

  function setBackgroundFromAsset(asset) {
    clearBackgroundObjectUrl();
    if (!asset?.image) {
      state.backgroundImage = null;
      state.backgroundName = "";
      return;
    }
    state.backgroundImage = asset.image;
    state.backgroundName = asset.name || "";
    state.backgroundObjectUrl = String(asset.objectUrl || "");
  }

  function isTemplateImageItem(item) {
    const disp = toNum(item?.disp, 0);
    return (
      POINTER_DISP_IDS.has(disp) ||
      IMAGE_DISP_IDS.has(disp) ||
      isLocalAssetDisp(disp) ||
      toNum(item?.image_id, 0) > 0 ||
      !!String(item?.image_addr || "")
    );
  }

  function getTemplateSlotByItem(clockId, item) {
    const disp = toNum(item?.disp, 0);
    const offset = TEMPLATE_DISP_OFFSET_TABLE[disp];
    if (Number.isFinite(offset) && offset >= 0) {
      return clockId * TEMPLATE_IMAGE_SLOT_COUNT + offset + 1;
    }
    const imageId = toNum(item?.image_id, 0);
    if (imageId > 0 && imageId <= TEMPLATE_IMAGE_SLOT_COUNT) {
      // image_id 在部分配置中可能直接是 1..128 槽位编号。
      return clockId * TEMPLATE_IMAGE_SLOT_COUNT + imageId;
    }
    if (imageId > TEMPLATE_IMAGE_SLOT_COUNT) {
      return imageId;
    }
    return null;
  }

  function parseTemplateIdsFromDirectoryText(text) {
    const src = String(text || "");
    const set = new Set();
    const re = /(\d+)\.cfg/ig;
    let m = null;
    while ((m = re.exec(src)) !== null) {
      const id = toNum(m[1], NaN);
      if (Number.isFinite(id) && id >= 0) set.add(id);
    }
    return [...set].sort((a, b) => a - b);
  }

  function collectTemplateCandidateIdsFromReport(report) {
    const set = new Set();
    const stats = report?.stats || {};
    const push = (v) => {
      const id = toNum(v, NaN);
      if (Number.isFinite(id) && id >= 0) set.add(id);
    };
    for (const id of Array.isArray(stats.configMissing) ? stats.configMissing : []) push(id);
    for (const row of Array.isArray(stats.dir15Missing) ? stats.dir15Missing : []) push(row?.id);
    for (const row of Array.isArray(stats.dir29MissingById) ? stats.dir29MissingById : []) push(row?.id);
    return [...set];
  }

  /** 内置模板分类表中的 clockId，用于扩充探测上界（report 里只有「缺失」id 时不得作为探测下界）。 */
  function collectClassifyCatalogClockIds() {
    const set = new Set();
    const classifyList = Array.isArray(TEMPLATE_CLASSIFY_DATA?.ClassifyList) ? TEMPLATE_CLASSIFY_DATA.ClassifyList : [];
    for (const row of classifyList) {
      for (const id of Array.isArray(row.clockid) ? row.clockid : []) {
        const n = toNum(id, NaN);
        if (Number.isFinite(n) && n > 0) set.add(n);
      }
    }
    return [...set];
  }

  const fontStore = new FontStore(
    (txt) => {
      if (dom.fontStatus) dom.fontStatus.textContent = txt || "";
    },
    () => {
      refreshFontPreviewSelect();
      refreshItemListUi();
      rebuildItemEditor();
      renderWatchface();
      renderFontPreview();
    }
  );

  const editorFields = [
    { key: "item_id", type: "text", labelKey: "editor.itemId", full: true },
    { key: "disp", type: "disp-select", labelKey: "editor.disp" },
    { key: "font", type: "font-select", labelKey: "editor.font" },
    { key: "__preview_text__", type: "text", labelKey: "editor.previewText", full: true },
    { key: "size", type: "number", labelKey: "editor.size" },
    { key: "x", type: "number", labelKey: "editor.x" },
    { key: "y", type: "number", labelKey: "editor.y" },
    { key: "w", type: "number", labelKey: "editor.w" },
    { key: "h", type: "number", labelKey: "editor.h" },
    { key: "alig", type: "align-select", labelKey: "editor.align" },
    { key: "sep", type: "number", labelKey: "editor.sep" },
    { key: "transp", type: "number", labelKey: "editor.transp" },
    { key: "color_1", type: "color-palette", labelKey: "editor.color1" },
    { key: "color_2", type: "color-palette", labelKey: "editor.color2" }
  ];

  const PRESET_COLORS = [
    "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00",
    "#ff00ff", "#00ffff", "#ff8c00", "#8a2be2", "#00bcd4", "#8fd2ff",
    "#90ee90", "#ffd700", "#ffa7c4", "#7f8c8d", "#2c3e50", "#e74c3c"
  ];
  const IMAGE_EDITOR_HIDDEN_FIELDS = new Set(["font", "size", "sep", "alig", "color_1", "color_2", "transp"]);

  function setNodeText(node, value) {
    if (node) node.textContent = String(value ?? "");
  }

  function applyStaticI18n() {
    document.documentElement.lang = getLocaleCode();
    document.title = t("ui.appTitle");
    setNodeText(dom.appTitle, t("ui.appTitle"));
    setNodeText(dom.appSubtitle, t("ui.appSubtitle"));
    setNodeText(dom.lblLang, t("ui.language"));

    setNodeText(dom.secConfigTitle, t("ui.sec.config"));
    setNodeText(dom.secTemplateTitle, t("ui.sec.template"));
    setNodeText(dom.secCanvasTitle, t("ui.sec.canvas"));
    setNodeText(dom.secBackgroundTitle, t("ui.sec.background"));
    setNodeText(dom.secItemlistTitle, t("ui.sec.items"));
    setNodeText(dom.secEditorTitle, t("ui.sec.editor"));

    setNodeText(dom.lblInputConfigFile, t("ui.label.loadConfig"));
    setNodeText(dom.lblTxtConfigJson, t("ui.label.pasteJson"));
    setNodeText(dom.lblTemplateCategory, getTemplateCategoryLabelText());
    setNodeText(dom.lblTemplateFilter, t("ui.label.templateFilter"));
    setNodeText(dom.lblInputWidth, t("ui.label.width"));
    setNodeText(dom.lblInputHeight, t("ui.label.height"));
    setNodeText(dom.lblInputZoom, t("ui.label.zoom"));
    setNodeText(dom.lblInputBgFile, t("ui.label.bgFile"));
    if (dom.lblBgSourcePath) setNodeText(dom.lblBgSourcePath, t("ui.label.bgSourcePath"));
    if (dom.txtConfigJson) dom.txtConfigJson.placeholder = t("ui.placeholder.configJson");
    if (dom.inputTemplateFilter) dom.inputTemplateFilter.placeholder = t("ui.placeholder.templateFilter");

    setNodeText(dom.btnApplyJson, t("ui.btn.applyJson"));
    setNodeText(dom.btnClearJson, t("ui.btn.clearJson"));
    setNodeText(dom.btnReloadTemplates, t("ui.btn.reloadTemplates"));
    setNodeText(dom.btnClearBg, t("ui.btn.clearBg"));
    setNodeText(dom.btnFitResolution, t("ui.btn.applyResolution"));
    setNodeText(dom.btnLoadDefaults, t("ui.btn.reloadFonts"));
    setNodeText(dom.btnLoadSample, t("ui.btn.loadSample"));
    setNodeText(dom.btnExportConfig, t("ui.btn.export"));

    setNodeText(dom.btnAddItem, t("ui.btn.add"));
    setNodeText(dom.btnDupItem, t("ui.btn.dup"));
    setNodeText(dom.btnDelItem, t("ui.btn.del"));
    setNodeText(dom.btnItemUp, t("ui.btn.up"));
    setNodeText(dom.btnItemDown, t("ui.btn.down"));

    setNodeText(dom.lblCurrentClock, t("ui.toolbar.currentClock"));
    setNodeText(dom.lblClockId, t("ui.toolbar.clockId"));
    setNodeText(dom.lblItemCount, t("ui.toolbar.itemCount"));
    setNodeText(dom.legendImage, t("ui.legend.image"));
    setNodeText(dom.legendText, t("ui.legend.text"));
    setNodeText(dom.legendPointer, t("ui.legend.pointer"));

    setNodeText(dom.fileBannerTitle, t("ui.fileProtocol.title"));
    setNodeText(dom.fileBannerBody, t("ui.fileProtocol.body"));
    setNodeText(dom.btnDismissFileBanner, t("ui.fileProtocol.dismiss"));

    if (!state.config?.ItemList?.length) setNodeText(dom.txtClockTitle, t("ui.default.clockNotLoaded"));
    else setNodeText(dom.txtClockTitle, getClockDisplayName(state.config));
  }

  function rebuildLanguageSelector() {
    if (!dom.selectLang) return;
    const old = normalizeLanguageEnum(dom.selectLang.value) || currentLanguageEnum;
    dom.selectLang.innerHTML = "";
    for (const row of LANGUAGE_OPTIONS) {
      const opt = document.createElement("option");
      opt.value = row.value;
      opt.textContent = row.label;
      dom.selectLang.appendChild(opt);
    }
    dom.selectLang.value = normalizeLanguageEnum(old) || DEFAULT_LANGUAGE_ENUM;
  }

  function applyLanguage(nextLanguageEnum, shouldPersist = true) {
    const normalized = normalizeLanguageEnum(nextLanguageEnum) || DEFAULT_LANGUAGE_ENUM;
    currentLanguageEnum = setLanguage(normalized, shouldPersist);
    rebuildLanguageSelector();
    applyStaticI18n();
    refreshFontPreviewSelect();
    refreshBuiltinFontList();
    refreshItemListUi();
    refreshTemplateCategorySelectorUi();
    refreshTemplateListUi();
    rebuildItemEditor();
    renderWatchface();
    renderFontPreview();
  }

  function createDefaultItem(index) {
    const first = fontStore.getAllMetas()[0];
    const fontId = first ? first.id : 0;
    return {
      ...DEFAULT_ITEM,
      font: fontId,
      hier: index,
      item_id: `item_${index + 1}`
    };
  }

  function normalizeItem(raw, index) {
    const item = { ...createDefaultItem(index), ...(raw || {}) };
    if (!item.item_id) item.item_id = `item_${index + 1}`;
    item.color_1 = ensureColorHex(item.color_1, "#ffffff");
    item.color_2 = ensureColorHex(item.color_2, "#000000");
    item.disp = toNum(item.disp ?? item.type, item.disp ?? 4);
    item.font = toNum(item.font, 0);
    item.size = toNum(item.size ?? item.font_size, toNum(item.size, 32));
    item.x = toNum(item.x, 0);
    item.y = toNum(item.y, 0);
    item.w = toNum(item.w, 100);
    item.h = toNum(item.h, 40);
    item.alig = toNum(item.alig ?? item.align, 0);
    item.sep = toNum(item.sep, 0);
    item.angle = toNum(item.angle, 0);
    item.hier = toNum(item.hier, index);
    item.transp = toNum(item.transp, 100);
    item.animation = toNum(item.animation, 0);
    item.image_id = toNum(item.image_id, 0);
    item.image_addr = String(item.image_addr || "");
    return item;
  }

  function normalizeConfig(raw) {
    let base;
    if (Array.isArray(raw)) {
      base = { ItemList: raw };
    } else if (raw && typeof raw === "object") {
      if (Array.isArray(raw.ItemList)) base = { ...raw };
      else if (Array.isArray(raw.CmdData?.ItemList)) base = { ...raw.CmdData };
      else if (Array.isArray(raw.data?.ItemList)) base = { ...raw.data };
      else base = { ...raw, ItemList: [] };
    } else {
      base = { ItemList: [] };
    }

    const itemList = (Array.isArray(base.ItemList) ? base.ItemList : []).map((it, idx) => normalizeItem(it, idx));
    const itemIdList = itemList.map((it, idx) => String(it.item_id || `item_${idx + 1}`));
    return {
      ...base,
      NameCn: String(base.NameCn ?? base.NameEn ?? "Untitled"),
      NameEn: String(base.NameEn ?? base.NameCn ?? "Untitled"),
      ClockId: toNum(base.ClockId, 0),
      ItemList: itemList,
      ItemIdList: itemIdList
    };
  }

  function syncItemIdList() {
    state.config.ItemIdList = state.config.ItemList.map((it, idx) => String(it.item_id || `item_${idx + 1}`));
  }

  function getClockDisplayName(config) {
    if (!config) return t("ui.default.untitled");
    const locale = getLocaleCode();
    if (locale === "en-US") return config.NameEn || config.NameCn || t("ui.default.untitled");
    return config.NameCn || config.NameEn || t("ui.default.untitled");
  }

  function normalizeTemplateClassifyClockIds(rawIds) {
    const set = new Set();
    for (const v of Array.isArray(rawIds) ? rawIds : []) {
      const id = toNum(v, NaN);
      if (Number.isFinite(id) && id > 0) set.add(id);
    }
    return [...set];
  }

  function buildTemplateClassifyRowsByAvailableIds(availableTemplateIds) {
    const availableSet = new Set();
    for (const id of Array.isArray(availableTemplateIds) ? availableTemplateIds : []) {
      const normalized = toNum(id, NaN);
      if (Number.isFinite(normalized) && normalized > 0) availableSet.add(normalized);
    }

    const rows = [];
    const classifyList = Array.isArray(TEMPLATE_CLASSIFY_DATA?.ClassifyList) ? TEMPLATE_CLASSIFY_DATA.ClassifyList : [];
    for (const row of classifyList) {
      const classifyId = toNum(row?.ClassifyId, NaN);
      if (!Number.isFinite(classifyId)) continue;
      const allClockIds = normalizeTemplateClassifyClockIds(row?.clockid);
      rows.push({
        ClassifyId: classifyId,
        ClassifyName: String(row?.ClassifyName || "").trim(),
        ClassifyNameEn: String(row?.ClassifyNameEn || "").trim(),
        clockid: allClockIds,
        availableIds: allClockIds.filter((id) => availableSet.has(id))
      });
    }
    return rows;
  }

  function getTemplateCategoryLabelText() {
    const locale = String(getLocaleCode() || "").toLowerCase();
    if (locale.startsWith("en")) return "Template Category";
    return "模板分类";
  }

  function getTemplateClassifyDisplayName(row) {
    const locale = String(getLocaleCode() || "").toLowerCase();
    const nameCn = String(row?.ClassifyName || "").trim();
    const nameEn = String(row?.ClassifyNameEn || "").trim();
    const fallbackId = toNum(row?.ClassifyId, 0);
    const fallback = fallbackId > 0 ? `Classify ${fallbackId}` : t("ui.default.untitled");
    if (locale.startsWith("zh")) return nameCn || nameEn || fallback;
    if (locale.startsWith("en")) return nameEn || nameCn || fallback;
    return nameCn || nameEn || fallback;
  }

  function getSelectedTemplateClassifyRow() {
    if (!templateState.classifyRows.length) return null;
    const selected = toNum(templateState.selectedClassifyId, NaN);
    if (Number.isFinite(selected)) {
      const row = templateState.classifyRows.find((item) => item.ClassifyId === selected);
      if (row) return row;
    }
    return templateState.classifyRows[0] || null;
  }

  function refreshTemplateCategorySelectorUi() {
    syncTemplateDomRefs();
    if (!dom.selectTemplateCategory) return;
    const previousSelected = toNum(templateState.selectedClassifyId, NaN);
    dom.selectTemplateCategory.innerHTML = "";

    if (!templateState.classifyRows.length) {
      const emptyOpt = document.createElement("option");
      emptyOpt.value = "";
      emptyOpt.textContent = t("template.hint.empty");
      dom.selectTemplateCategory.appendChild(emptyOpt);
      dom.selectTemplateCategory.disabled = true;
      templateState.selectedClassifyId = null;
      return;
    }

    for (const row of templateState.classifyRows) {
      const opt = document.createElement("option");
      opt.value = String(row.ClassifyId);
      opt.textContent = `${getTemplateClassifyDisplayName(row)} (${row.availableIds.length})`;
      dom.selectTemplateCategory.appendChild(opt);
    }

    const hasPrevious = templateState.classifyRows.some((row) => row.ClassifyId === previousSelected);
    templateState.selectedClassifyId = hasPrevious
      ? previousSelected
      : templateState.classifyRows[0].ClassifyId;
    dom.selectTemplateCategory.value = String(templateState.selectedClassifyId);
    dom.selectTemplateCategory.disabled = false;
  }

  function rebuildTemplateClassifyRows() {
    templateState.classifyRows = buildTemplateClassifyRowsByAvailableIds(templateState.ids);
    const selected = toNum(templateState.selectedClassifyId, NaN);
    const hasSelected = templateState.classifyRows.some((row) => row.ClassifyId === selected);
    if (!hasSelected) {
      templateState.selectedClassifyId = templateState.classifyRows[0]?.ClassifyId ?? null;
    }
    refreshTemplateCategorySelectorUi();
  }

  function normalizeTemplateNameMeta(raw, id) {
    const fallbackId = toNum(id, 0);
    return {
      NameCn: String(raw?.NameCn ?? "").trim(),
      NameEn: String(raw?.NameEn ?? "").trim(),
      ClockId: toNum(raw?.ClockId, fallbackId)
    };
  }

  function getTemplateListItemName(id) {
    const meta = templateState.metaById.get(id) || normalizeTemplateNameMeta(null, id);
    const nameCn = String(meta.NameCn || "").trim();
    const nameEn = String(meta.NameEn || "").trim();
    const locale = String(getLocaleCode() || "").toLowerCase();
    const fallbackClockId = toNum(meta.ClockId, toNum(id, 0));
    const fallback = fallbackClockId > 0
      ? `ClockId ${fallbackClockId}`
      : (toNum(id, 0) > 0 ? String(toNum(id, 0)) : t("ui.default.untitled"));
    if (locale.startsWith("zh")) return nameCn || nameEn || fallback;
    if (locale.startsWith("en")) return nameEn || nameCn || fallback;
    return nameCn || nameEn || fallback;
  }

  async function loadTemplateNameMetaByIds(ids, concurrency = TEMPLATE_NAME_SCAN_CONCURRENCY) {
    const idList = Array.isArray(ids) ? ids : [];
    const map = new Map();
    let cursor = 0;
    const workerCount = Math.max(1, Math.min(idList.length || 1, toNum(concurrency, TEMPLATE_NAME_SCAN_CONCURRENCY)));
    const workers = [];
    for (let i = 0; i < workerCount; i++) {
      workers.push((async () => {
        while (true) {
          const index = cursor;
          cursor += 1;
          if (index >= idList.length) break;
          const id = toNum(idList[index], NaN);
          if (!Number.isFinite(id)) continue;
          let raw = null;
          try {
            raw = await loadTemplateConfigByClockId(id);
          } catch (e) {
            raw = null;
          }
          map.set(id, normalizeTemplateNameMeta(raw, id));
        }
      })());
    }
    await Promise.all(workers);
    return map;
  }

  function applyConfig(raw, sourceLabel) {
    clearAllLocalDispAssets();
    state.config = normalizeConfig(raw);
    state.previewTextOverrides.clear();
    state.selectedIndex = state.config.ItemList.length ? 0 : -1;
    syncItemIdList();
    dom.txtClockTitle.textContent = getClockDisplayName(state.config);
    dom.txtClockId.textContent = String(toNum(state.config.ClockId, 0));
    refreshItemListUi();
    rebuildItemEditor();
    renderWatchface();
    fontStore.log(t("log.configApplied", { source: sourceLabel }));
  }

  function refreshTemplateListUi() {
    syncTemplateDomRefs();
    if (!dom.templateList || !dom.templateHint) return;
    const selectedClassify = getSelectedTemplateClassifyRow();
    const categoryTemplateIds = selectedClassify ? selectedClassify.availableIds : [];
    const keyword = String(dom.inputTemplateFilter?.value || "").trim();
    const filtered = keyword
      ? categoryTemplateIds.filter((id) => String(id).includes(keyword))
      : [...categoryTemplateIds];

    dom.templateList.innerHTML = "";
    if (!filtered.length) {
      const li = document.createElement("li");
      li.className = "template-list-empty";
      li.textContent = templateState.loading ? t("template.hint.loading") : t("template.hint.empty");
      dom.templateList.appendChild(li);
    } else {
      for (const id of filtered) {
        const li = document.createElement("li");
        if (templateState.activeClockId === id) li.classList.add("active");
        const name = document.createElement("span");
        name.className = "template-id";
        name.textContent = getTemplateListItemName(id);
        li.append(name);
        li.addEventListener("click", () => {
          applyTemplateByClockId(id);
        });
        dom.templateList.appendChild(li);
      }
    }

    if (templateState.loading) {
      dom.templateHint.textContent = t("template.hint.loading");
    } else if (templateState.error) {
      dom.templateHint.textContent = t("template.hint.error", { message: templateState.error });
    } else if (selectedClassify && filtered.length) {
      dom.templateHint.textContent = t("template.hint.loaded", { count: filtered.length });
    } else {
      dom.templateHint.textContent = t("template.hint.empty");
    }
  }

  async function doesTemplateConfigExist(id) {
    try {
      const path = `${TEMPLATE_CONFIG_DIR}${id}.cfg`;
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) return false;
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      // Vite dev / preview：不存在的 public 文件会 200 返回 index.html，不能仅看 res.ok。
      if (ct.includes("text/html")) return false;
      const reader = res.body?.getReader?.();
      if (!reader) return false;
      const first = await reader.read();
      try {
        await reader.cancel();
      } catch (e) {
        // ignore
      }
      if (first.done || !first.value?.length) return false;
      let head = "";
      for (let i = 0; i < Math.min(first.value.length, 40); i++) {
        head += String.fromCharCode(first.value[i]);
      }
      return head.trimStart().startsWith("{");
    } catch (e) {
      return false;
    }
  }

  async function probeTemplateConfigIds(minId, maxId, concurrency = TEMPLATE_SCAN_CONCURRENCY) {
    const found = [];
    let cursor = Math.max(TEMPLATE_SCAN_MIN_ID, toNum(minId, TEMPLATE_SCAN_MIN_ID));
    const upper = Math.max(cursor, toNum(maxId, TEMPLATE_SCAN_DEFAULT_MAX_ID));
    const workers = [];
    const workerCount = Math.max(1, toNum(concurrency, TEMPLATE_SCAN_CONCURRENCY));

    for (let i = 0; i < workerCount; i++) {
      workers.push((async () => {
        while (true) {
          const id = cursor;
          cursor += 1;
          if (id > upper) break;
          if (await doesTemplateConfigExist(id)) found.push(id);
        }
      })());
    }
    await Promise.all(workers);
    found.sort((a, b) => a - b);
    return found;
  }

  async function resolveTemplateConfigIds() {
    const scanPaths = [
      withBase("template/config/"),
      "./template/config/",
      "template/config/",
      "./html/template/config/",
      "../html/template/config/",
      "/html/template/config/"
    ];

    for (const p of scanPaths) {
      try {
        const txt = await fetchText(p);
        const ids = parseTemplateIdsFromDirectoryText(txt);
        if (ids.length) return { ids, source: `${p} (dir)` };
      } catch (e) {
        // continue
      }
    }

    let report = null;
    try {
      report = await fetchJson(TEMPLATE_ORGANIZE_REPORT_PATH);
    } catch (e) {
      // ignore
    }
    const reportHints = collectTemplateCandidateIdsFromReport(report);
    const catalogIds = collectClassifyCatalogClockIds();
    const spanHints = [...new Set([...reportHints, ...catalogIds])];
    // 浏览器/Vite 下无法列出目录；若仅用 report 里「缺失」id 算 min，会漏掉 1..(min-1) 等真实存在的 cfg（例如 ClockId 17）。
    const minCandidate = TEMPLATE_SCAN_MIN_ID;
    const maxCandidate = spanHints.length
      ? Math.max(TEMPLATE_SCAN_DEFAULT_MAX_ID, ...spanHints)
      : TEMPLATE_SCAN_DEFAULT_MAX_ID;
    const probed = await probeTemplateConfigIds(minCandidate, maxCandidate, TEMPLATE_SCAN_CONCURRENCY);
    if (probed.length) return { ids: probed, source: "probe" };
    return { ids: [], source: "none" };
  }

  async function loadTemplateConfigIds() {
    syncTemplateDomRefs();
    templateState.loading = true;
    templateState.error = "";
    templateState.metaById = new Map();
    rebuildTemplateClassifyRows();
    refreshTemplateListUi();
    try {
      const result = await resolveTemplateConfigIds();
      templateState.ids = Array.isArray(result.ids) ? result.ids : [];
      templateState.source = result.source || "";
      templateState.metaById = await loadTemplateNameMetaByIds(templateState.ids);
      rebuildTemplateClassifyRows();
      fontStore.log(t("log.templateListLoaded", { count: templateState.ids.length, source: templateState.source || "unknown" }));
    } catch (err) {
      templateState.ids = [];
      templateState.metaById = new Map();
      templateState.source = "";
      templateState.error = errorToText(err);
      rebuildTemplateClassifyRows();
      fontStore.log(t("log.templateListFailed", { message: templateState.error }));
    } finally {
      templateState.loading = false;
      refreshTemplateListUi();
    }
  }

  async function loadTemplateConfigByClockId(clockId) {
    const id = toNum(clockId, NaN);
    if (!Number.isFinite(id)) return null;
    const paths = [
      `${TEMPLATE_CONFIG_DIR}${id}.cfg`,
      withBase(`template/config/${id}.cfg`),
      `template/config/${id}.cfg`,
      `./html/template/config/${id}.cfg`,
      `../html/template/config/${id}.cfg`,
      `/html/template/config/${id}.cfg`
    ];
    return loadFirstJson(paths);
  }

  async function loadTemplateBackgroundByClockId(clockId) {
    const bgFileId = toNum(clockId, 0) + 1;
    return loadFirstTemplateAsset(TEMPLATE_DIR_15, String(bgFileId), TEMPLATE_BG_EXT_CANDIDATES);
  }

  async function applyTemplateImageAssetsByClockId(clockId, token) {
    const id = toNum(clockId, 0);
    let total = 0;
    let loaded = 0;
    let missing = 0;
    let unmapped = 0;
    const list = state.config.ItemList || [];

    for (const item of list) {
      if (token !== templateState.loadToken) return { aborted: true, total, loaded, missing, unmapped };
      if (!isTemplateImageItem(item)) continue;
      total += 1;
      const slot = getTemplateSlotByItem(id, item);
      if (!Number.isFinite(slot) || slot <= 0) {
        unmapped += 1;
        continue;
      }
      const result = await loadFirstTemplateAsset(TEMPLATE_DIR_29, String(slot), TEMPLATE_IMG_EXT_CANDIDATES);
      if (token !== templateState.loadToken) {
        releaseStandaloneAsset(result.asset);
        return { aborted: true, total, loaded, missing, unmapped };
      }
      if (result.asset) {
        setLocalDispAsset(item, result.asset);
        item.image_addr = result.asset.name || `${slot}.bin`;
        loaded += 1;
      } else {
        missing += 1;
      }
    }
    return { aborted: false, total, loaded, missing, unmapped };
  }

  async function applyTemplateByClockId(clockId) {
    const id = toNum(clockId, NaN);
    if (!Number.isFinite(id)) return;

    const token = ++templateState.loadToken;
    templateState.activeClockId = id;
    refreshTemplateListUi();
    fontStore.log(t("log.templateApplying", { id }));

    let raw = null;
    try {
      raw = await loadTemplateConfigByClockId(id);
    } catch (e) {
      raw = null;
    }
    if (token !== templateState.loadToken) return;
    if (!raw) {
      state.backgroundSourceLabel = "";
      refreshBackgroundSourceLabel();
      fontStore.log(t("log.templateConfigLoadFailed", { id }));
      return;
    }

    clearBackgroundObjectUrl();
    state.backgroundImage = null;
    state.backgroundName = "";
    state.backgroundSourceLabel = "";
    refreshBackgroundSourceLabel();
    applyConfig(raw, t("source.templateConfig", { id }));

    const [bgResult, imageResult] = await Promise.all([
      loadTemplateBackgroundByClockId(id),
      applyTemplateImageAssetsByClockId(id, token)
    ]);
    if (token !== templateState.loadToken) {
      releaseStandaloneAsset(bgResult.asset);
      return;
    }

    const summaryParts = [];
    if (bgResult.asset) {
      setBackgroundFromAsset(bgResult.asset);
      const rel = String(bgResult.path || "").trim();
      state.backgroundSourceLabel = rel ? absoluteUrlFromResolvedPath(rel) : "";
    } else {
      state.backgroundSourceLabel = "";
      summaryParts.push(t("template.resource.bgMissing"));
    }
    refreshBackgroundSourceLabel();
    if (imageResult && !imageResult.aborted) {
      summaryParts.push(t("template.resource.imageSummary", { ok: imageResult.loaded, total: imageResult.total }));
      if (imageResult.missing > 0) {
        summaryParts.push(t("template.resource.imageMissing", { count: imageResult.missing }));
      }
      if (imageResult.unmapped > 0) {
        summaryParts.push(t("template.resource.imageUnmapped", { count: imageResult.unmapped }));
      }
    }

    renderWatchface();
    fontStore.log(t("log.templateApplied", { id, resourceSummary: summaryParts.join(" ") }));
    refreshTemplateListUi();
  }

  function refreshItemListUi() {
    dom.itemList.innerHTML = "";
    const list = state.config.ItemList || [];
    dom.txtItemCount.textContent = String(list.length);
    list.forEach((item, idx) => {
      const li = document.createElement("li");
      if (idx === state.selectedIndex) li.classList.add("active");
      const i = document.createElement("span");
      i.className = "idx";
      i.textContent = `#${idx}`;
      const label = document.createElement("div");
      label.className = "disp-label";
      label.textContent = `${item.item_id || "-"} | ${formatDispOptionText(toNum(item.disp, 0))}`;
      const meta = fontStore.getMeta(toNum(item.font, 0));
      const tag = document.createElement("span");
      tag.className = "font-tag";
      tag.textContent = `${t("common.fontPrefix")}${toNum(item.font, 0)}${meta ? ` ${meta.type === 0 ? "[IMG]" : "[TTF]"} ${meta.name || ""}` : ""}`;
      li.append(i, label, tag);
      li.addEventListener("click", () => {
        state.selectedIndex = idx;
        refreshItemListUi();
        rebuildItemEditor();
        renderWatchface();
      });
      dom.itemList.appendChild(li);
    });
    dom.btnDupItem.disabled = state.selectedIndex < 0;
    dom.btnDelItem.disabled = state.selectedIndex < 0;
    dom.btnItemUp.disabled = state.selectedIndex <= 0;
    dom.btnItemDown.disabled = state.selectedIndex < 0 || state.selectedIndex >= list.length - 1;
  }

  function buildFontSelectForEditor(currentFontId) {
    const select = document.createElement("select");
    select.dataset.key = "font";
    const currentId = toNum(currentFontId, 0);
    const metas = fontStore.getAllMetas();
    if (!metas.length) {
      const opt = document.createElement("option");
      opt.value = String(currentId);
      opt.textContent = t("font.select.noMetaCurrent", { id: currentId });
      select.appendChild(opt);
      select.disabled = true;
      return select;
    }
    let hasCurrent = false;
    for (const meta of metas) {
      const opt = document.createElement("option");
      opt.value = String(meta.id);
      opt.textContent = `${meta.id} ${toNum(meta.type, 1) === 0 ? "[IMG]" : "[TTF]"} ${meta.name || `(${t("common.unnamed")})`}`;
      if (meta.id === currentId) hasCurrent = true;
      select.appendChild(opt);
    }
    if (!hasCurrent) {
      const opt = document.createElement("option");
      opt.value = String(currentId);
      opt.textContent = t("font.select.unknownCurrent", { id: currentId });
      select.appendChild(opt);
    }
    select.value = String(currentId);
    return select;
  }

  function buildDispSelectForEditor(currentDisp) {
    const select = document.createElement("select");
    select.dataset.key = "disp";
    const currentId = toNum(currentDisp, 0);
    const dispEntries = Object.entries(DISP_NAME_MAP)
      .map(([id, name]) => ({ id: toNum(id, NaN), name: String(name || "") }))
      .filter((x) => Number.isFinite(x.id))
      .sort((a, b) => a.id - b.id);

    let hasCurrent = false;
    const groups = new Map();
    for (const row of dispEntries) {
      const category = dispCategoryKey(row.id, row.name);
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category).push(row);
      if (row.id === currentId) hasCurrent = true;
    }
    const orderedCats = DISP_CATEGORY_ORDER.filter((c) => groups.has(c));
    const extraCats = [...groups.keys()].filter((c) => !DISP_CATEGORY_ORDER.includes(c)).sort();
    for (const cat of [...orderedCats, ...extraCats]) {
      const optgroup = document.createElement("optgroup");
      const rows = groups.get(cat) || [];
      optgroup.label = `${t(cat)} (${rows.length})`;
      for (const row of rows) {
        const opt = document.createElement("option");
        opt.value = String(row.id);
        opt.textContent = formatDispOptionText(row.id);
        optgroup.appendChild(opt);
      }
      select.appendChild(optgroup);
    }
    if (!hasCurrent) {
      const optgroup = document.createElement("optgroup");
      optgroup.label = t("disp.cat.currentValue");
      const opt = document.createElement("option");
      opt.value = String(currentId);
      opt.textContent = `${formatDispOptionText(currentId)} (${t("disp.cat.currentValue")})`;
      optgroup.appendChild(opt);
      select.appendChild(optgroup);
    }
    select.value = String(currentId);
    return select;
  }

  function buildAlignSelectForEditor(currentAlign) {
    const select = document.createElement("select");
    select.dataset.key = "alig";
    const currentId = toNum(currentAlign, 0);
    const options = [
      { value: 1, label: t("editor.align.left") },
      { value: 2, label: t("editor.align.right") },
      { value: 3, label: t("editor.align.center") }
    ];
    let hasCurrent = false;
    for (const row of options) {
      const opt = document.createElement("option");
      opt.value = String(row.value);
      opt.textContent = t("editor.align.option", { label: row.label, value: row.value });
      if (row.value === currentId) hasCurrent = true;
      select.appendChild(opt);
    }
    if (!hasCurrent) {
      const opt = document.createElement("option");
      opt.value = String(currentId);
      const guess =
        guessAlign(currentId) === "left"
          ? t("editor.align.left")
          : guessAlign(currentId) === "right"
            ? t("editor.align.right")
            : t("editor.align.center");
      opt.textContent = t("editor.align.current", { label: guess, value: currentId });
      select.appendChild(opt);
    }
    select.value = String(currentId);
    return select;
  }

  function buildColorPaletteInputForEditor(currentColor) {
    const normalized = ensureColorHex(currentColor, "#ffffff");
    const box = document.createElement("div");
    box.className = "color-palette-editor";

    const pickerRow = document.createElement("div");
    pickerRow.className = "color-picker-row";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.className = "color-picker";
    colorInput.value = normalized;

    const hexValue = document.createElement("span");
    hexValue.className = "color-hex-value";
    hexValue.textContent = normalized.toUpperCase();
    pickerRow.append(colorInput, hexValue);

    const swatches = document.createElement("div");
    swatches.className = "color-swatch-list";
    const swatchButtons = [];
    for (const color of PRESET_COLORS) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "color-swatch-btn";
      btn.title = color.toUpperCase();
      btn.style.background = color;
      btn.addEventListener("click", () => {
        colorInput.value = color;
        colorInput.dispatchEvent(new Event("input", { bubbles: true }));
      });
      swatches.appendChild(btn);
      swatchButtons.push(btn);
    }

    const refreshSwatchActive = () => {
      const current = ensureColorHex(colorInput.value, normalized).toLowerCase();
      for (const btn of swatchButtons) {
        if (btn.title.toLowerCase() === current) btn.classList.add("active");
        else btn.classList.remove("active");
      }
    };
    colorInput.addEventListener("input", () => {
      const v = ensureColorHex(colorInput.value, normalized);
      hexValue.textContent = v.toUpperCase();
      refreshSwatchActive();
    });
    refreshSwatchActive();

    box.append(pickerRow, swatches);
    return { input: colorInput, node: box };
  }

  function buildLocalAssetEditor(item) {
    const disp = toNum(item?.disp, 0);
    const rule = getLocalAssetRule(disp);
    if (!rule) return null;

    const wrap = document.createElement("div");
    wrap.className = "editor-field full asset-file-editor";

    const head = document.createElement("div");
    head.className = "asset-file-head";

    const title = document.createElement("span");
    title.className = "k";
    title.textContent = `${t("editor.asset.title")} (${formatDispOptionText(disp)})`;

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.textContent = t("editor.asset.clear");

    head.append(title, clearBtn);

    const pickHint = document.createElement("div");
    pickHint.className = "asset-pick-hint";
    pickHint.textContent = t("editor.asset.pickHint");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".gif,.webp,image/gif,image/webp";

    const infoGrid = document.createElement("div");
    infoGrid.className = "asset-info-grid";

    const fileInfoBox = document.createElement("div");
    fileInfoBox.className = "asset-info-box";
    const fileInfoTitle = document.createElement("div");
    fileInfoTitle.className = "asset-info-title";
    fileInfoTitle.textContent = t("editor.asset.fileInfoTitle");
    const fileInfoBody = document.createElement("div");
    fileInfoBody.className = "asset-info-body";
    fileInfoBox.append(fileInfoTitle, fileInfoBody);

    const ruleInfoBox = document.createElement("div");
    ruleInfoBox.className = "asset-info-box";
    const ruleInfoTitle = document.createElement("div");
    ruleInfoTitle.className = "asset-info-title";
    ruleInfoTitle.textContent = t("editor.asset.ruleInfoTitle");
    const ruleInfoBody = document.createElement("div");
    ruleInfoBody.className = "asset-info-body";
    ruleInfoBox.append(ruleInfoTitle, ruleInfoBody);

    infoGrid.append(fileInfoBox, ruleInfoBox);

    const refresh = () => {
      const asset = getLocalDispAsset(item);
      const left = [];
      fileInfoBox.classList.remove("asset-status-ok", "asset-status-bad", "asset-status-warn");
      if (!asset) {
        left.push(t("editor.asset.empty"));
      } else {
        const pathText = String(asset.sourceUrl || "").trim()
          ? String(asset.sourceUrl).trim()
          : asset.fromLocalPick
            ? t("editor.asset.localUploadPathHint", { name: asset.name || "-" })
            : (asset.name || "-");
        left.push(t("editor.asset.filePath", { path: pathText }));
        left.push(t("editor.asset.fileSize", { size: formatBytes(asset.size) }));
        left.push(t("editor.asset.fileType", { type: asset.mimeType || asset.format || "-" }));
        if (Number.isFinite(asset.frameCount)) left.push(t("editor.asset.frameCount", { count: asset.frameCount }));
        else left.push(t("editor.asset.frameUnknown"));
        const status = validateLocalAssetRule(rule, asset.frameCount);
        left.push(status.text);
        if (status.level === "ok") fileInfoBox.classList.add("asset-status-ok");
        else if (status.level === "bad") fileInfoBox.classList.add("asset-status-bad");
        else fileInfoBox.classList.add("asset-status-warn");
      }
      fileInfoBody.textContent = left.join("\n");

      const right = [];
      right.push(t("editor.asset.support"));
      right.push(getRuleText(rule));
      if (rule.mode === "pointer") right.push(t("editor.asset.pointerHint"));
      else right.push(t("editor.asset.applyHint"));
      ruleInfoBody.textContent = right.join("\n");

      clearBtn.disabled = !asset;
    };

    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const asset = await loadLocalAssetFromFile(file);
        setLocalDispAsset(item, asset);
        item.image_addr = file.name || "";
        refreshItemListUi();
        renderWatchface();
      } catch (err) {
        alert(t("alert.localAssetLoadFailed", { message: errorToText(err) }));
      } finally {
        fileInput.value = "";
        refresh();
      }
    });

    clearBtn.addEventListener("click", () => {
      clearLocalDispAsset(item);
      item.image_addr = "";
      refreshItemListUi();
      renderWatchface();
      refresh();
    });

    refresh();
    wrap.append(head, pickHint, fileInput, infoGrid);
    return wrap;
  }

  function rebuildItemEditor() {
    dom.itemEditor.innerHTML = "";
    const item = state.config.ItemList[state.selectedIndex];
    if (!item) {
      const tip = document.createElement("div");
      tip.className = "hint";
      tip.textContent = t("editor.tipSelectItem");
      dom.itemEditor.appendChild(tip);
      return;
    }
    const currentDisp = toNum(item.disp, 0);
    const isImageLikeDisp = IMAGE_DISP_IDS.has(currentDisp) || POINTER_DISP_IDS.has(currentDisp) || isLocalAssetDisp(currentDisp);
    const isImageFont = fontStore.isImageFont(toNum(item.font, 0));

    editorFields.forEach((field) => {
      const isColorField = field.key === "color_1" || field.key === "color_2";
      const hideByImageDisp = isImageLikeDisp && IMAGE_EDITOR_HIDDEN_FIELDS.has(field.key);
      const hideByImageFont = isColorField && (isImageLikeDisp || isImageFont);
      if (hideByImageDisp || hideByImageFont) return;
      const wrap = document.createElement("label");
      wrap.className = "editor-field";
      if (field.full) wrap.classList.add("full");
      const k = document.createElement("span");
      k.className = "k";
      let keyLabel = t(field.labelKey);
      if (field.key === "disp") keyLabel += ` (${dispComment(toNum(item.disp, 0))})`;
      if (field.key === "font") {
        const meta = fontStore.getMeta(toNum(item.font, 0));
        keyLabel += meta ? ` (${meta.name || t("common.unnamed")} #${meta.id})` : ` (#${toNum(item.font, 0)})`;
      }
      k.textContent = keyLabel;
      let input;
      let controlNode;
      if (field.key === "disp") {
        input = buildDispSelectForEditor(item.disp);
        controlNode = input;
      } else if (field.key === "alig") {
        input = buildAlignSelectForEditor(item.alig);
        controlNode = input;
      } else if (field.key === "font") {
        input = buildFontSelectForEditor(item.font);
        controlNode = input;
      } else if (field.type === "color-palette") {
        const c = buildColorPaletteInputForEditor(item[field.key]);
        input = c.input;
        controlNode = c.node;
      } else {
        input = document.createElement("input");
        input.type = field.type;
        input.dataset.key = field.key;
        if (field.key === "__preview_text__") {
          input.value = state.previewTextOverrides.get(state.selectedIndex) || "";
          const disp = toNum(item.disp, 0);
          if (IMAGE_DISP_IDS.has(disp) || POINTER_DISP_IDS.has(disp)) {
            input.placeholder = t("editor.previewText.imageHint");
          } else {
            input.placeholder = t("editor.previewText.default", { text: getPlaceholderText(disp, item) });
          }
        } else {
          input.value = item[field.key] ?? "";
        }
        controlNode = input;
      }
      const onFieldChange = () => {
        const current = state.config.ItemList[state.selectedIndex];
        if (!current) return;
        if (field.key === "__preview_text__") {
          const val = input.value.trim();
          if (val) state.previewTextOverrides.set(state.selectedIndex, val);
          else state.previewTextOverrides.delete(state.selectedIndex);
        } else if (field.key === "disp") {
          current[field.key] = toNum(input.value, toNum(current[field.key], 0));
        } else if (field.key === "font") {
          current[field.key] = toNum(input.value, toNum(current[field.key], 0));
        } else if (field.key === "alig") {
          current[field.key] = toNum(input.value, toNum(current[field.key], 0));
        } else if (field.type === "number") {
          current[field.key] = toNum(input.value, 0);
        } else {
          current[field.key] = input.value;
          if (field.key === "color_1" || field.key === "color_2") {
            current[field.key] = ensureColorHex(current[field.key], field.key === "color_1" ? "#ffffff" : "#000000");
          }
        }
        syncItemIdList();
        refreshItemListUi();
        renderWatchface();
        // 连续输入时不要重建表单，否则会丢焦点导致“只能输入一次”。
        // 仅在切换需要重排编辑项的字段后重建。
        if (field.key === "disp" || field.key === "font") {
          rebuildItemEditor();
        }
      };
      input.addEventListener(
        field.key === "font" || field.key === "disp" || field.key === "alig" ? "change" : "input",
        onFieldChange
      );
      wrap.append(k, controlNode || input);
      dom.itemEditor.appendChild(wrap);
    });

    const localAssetEditor = buildLocalAssetEditor(item);
    if (localAssetEditor) dom.itemEditor.appendChild(localAssetEditor);
  }

  function getPlaceholderText(disp, item) {
    const now = new Date();
    const hour2 = pad2(now.getHours());
    const min2 = pad2(now.getMinutes());
    const weekdayEn = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const weekdayCn = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const monEn = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    if (APP_DATA_DISP_IDS.has(disp)) return "42";
    if (NETWORK_TEXT_DISP_IDS.has(disp)) return "NET:OK";
    if (disp >= 261 && disp < 280) return "SUB DIAL";

    switch (disp) {
      case 1:
        return pad2(now.getSeconds());
      case 2:
        return min2;
      case 3:
        return hour2;
      case 4:
        return `${hour2}:${min2}`;
      case 5:
        return `${hour2}:${min2}:${pad2(now.getSeconds())}`;
      case 406:
        return hour2[0];
      case 407:
        return hour2[1];
      case 408:
        return min2[0];
      case 409:
        return min2[1];
      case 6:
      case 37:
      case 170:
      case 195:
      case 213:
      case 214:
        return weekdayEn[now.getDay()];
      case 12:
        return weekdayCn[now.getDay()];
      case 7:
      case 196:
        return String(now.getFullYear());
      case 8:
      case 215:
      case 216:
        return pad2(now.getDate());
      case 9:
        return pad2(now.getMonth() + 1);
      case 15:
        return now.getHours() >= 12 ? "PM" : "AM";
      case 19:
      case 33:
      case 166:
        return "45dB";
      case 20:
      case 29:
        return "初五";
      case 21:
      case 30:
        return "甲辰";
      case 22:
      case 28:
        return "三月";
      case 23:
        return "谷雨";
      case 24:
        return "宜 出行";
      case 25:
        return "忌 熬夜";
      case 26:
        return "天秤座";
      case 27:
      case 180:
      case 194:
        return monEn[now.getMonth()];
      case 31:
        return ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][now.getDay()];
      case 32:
      case 82:
      case 83:
      case 86:
      case 87:
      case 90:
      case 91:
      case 94:
      case 95:
      case 96:
      case 97:
      case 147:
      case 148:
      case 149:
      case 157:
      case 238:
      case 239:
        return "23°C";
      case 35:
        return "Divoom";
      case 36:
      case 158:
        return `${pad2(now.getMonth() + 1)}-${now.getFullYear()}`;
      case 39:
        return `${monEn[now.getMonth()]}.${pad2(now.getDate())}`;
      case 49:
      case 56:
      case 104:
      case 154:
      case 155:
      case 219:
      case 220:
        return "HELLO DIVOOM";
      case 51:
      case 109:
      case 198:
      case 202:
      case 203:
        return "12";
      case 53:
        return `${pad2(now.getDate())} ${monEn[now.getMonth()]} ${now.getFullYear()}`;
      case 54:
      case 81:
      case 85:
      case 89:
      case 93:
      case 240:
        return "Sunny";
      case 75:
      case 76:
        return `${pad2((now.getHours() + 8) % 24)}:${pad2(now.getMinutes())}`;
      case 77:
        return "TOKYO";
      case 80:
      case 84:
      case 88:
      case 92:
      case 169:
        return "FRI";
      case 101:
        return "甲辰年 三月初五";
      case 102:
        return "宜运动 忌拖延";
      case 103:
        return "三月 初五";
      case 153:
        return formatDate(now);
      case 156:
        return `${pad2(now.getMonth() + 1)}/${pad2(now.getDate())}`;
      case 176:
        return "06:08";
      case 177:
        return "18:42";
      case 178:
        return "Team Sync";
      case 179:
        return "10:00";
      case 182:
        return "ALARM";
      case 191:
        return "TIDE";
      case 193:
        return `${pad2(now.getMonth() + 1)}/${pad2(now.getDate())}/${String(now.getFullYear()).slice(-2)}`;
      case 199:
        return String(now.getHours());
      case 200:
        return String(now.getMinutes());
      case 201:
        return String(now.getSeconds());
      case 204:
        return "06:08 / 18:42";
      case 205:
        return "01:25:10";
      case 208:
      case 211:
      case 212:
      case 217:
        return "Waxing";
      case 241:
        return String(now.getDate());
      default:
        return item.item_id ? String(item.item_id) : `DISP_${disp}`;
    }
  }

  function drawBackground(ctx) {
    ctx.clearRect(0, 0, state.width, state.height);
    const g = ctx.createLinearGradient(0, 0, state.width, state.height);
    g.addColorStop(0, "#05080f");
    g.addColorStop(1, "#0c1220");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, state.width, state.height);
    if (!state.backgroundImage) return;
    const img = state.backgroundImage;
    const sw = img.width || 1;
    const sh = img.height || 1;
    const scale = Math.max(state.width / sw, state.height / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    const dx = (state.width - dw) / 2;
    const dy = (state.height - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function getPointerDegree(disp, now = new Date()) {
    let deg = 0;
    if (disp === 131) {
      deg = ((now.getHours() % 12) + now.getMinutes() / 60) * 30;
    } else if (disp === 132) {
      deg = (now.getMinutes() + now.getSeconds() / 60) * 6;
    } else {
      deg = now.getSeconds() * 6;
    }
    return deg;
  }

  function drawPointer(ctx, item, disp) {
    const now = new Date();
    const x = toNum(item.x, 0);
    const y = toNum(item.y, 0);
    const w = Math.max(8, toNum(item.w, 50));
    const h = Math.max(8, toNum(item.h, 50));
    const cx = x + w / 2;
    const cy = y + h / 2;
    const radius = Math.min(w, h) / 2;
    const deg = getPointerDegree(disp, now);
    const rad = (deg - 90) * Math.PI / 180;
    const ex = cx + Math.cos(rad) * (radius * 0.9);
    const ey = cy + Math.sin(rad) * (radius * 0.9);

    ctx.strokeStyle = colorToRgba(item.color_1, 1);
    ctx.lineWidth = Math.max(2, Math.round(toNum(item.size, 18) / 12));
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    ctx.fillStyle = colorToRgba(item.color_2, 0.8);
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(2, ctx.lineWidth), 0, Math.PI * 2);
    ctx.fill();
  }

  function drawLocalDispAsset(ctx, item, disp) {
    if (!isLocalAssetDisp(disp)) return false;
    const asset = getLocalDispAsset(item);
    if (!asset?.image) return false;
    const now = new Date();
    const frames = Array.isArray(asset.frames) && asset.frames.length ? asset.frames : null;
    const frameSource = frames
      ? (frames[resolveFrameIndexForDisp(disp, frames.length, now)] || frames[0] || asset.image)
      : asset.image;
    const x = toNum(item.x, 0);
    const y = toNum(item.y, 0);
    const w = Math.max(8, toNum(item.w, 50));
    const h = Math.max(8, toNum(item.h, 50));
    if (disp === 131 || disp === 132 || disp === 233) {
      const deg = getPointerDegree(disp, now);
      const cx = x + w / 2;
      const cy = y + h / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(deg * Math.PI / 180);
      ctx.drawImage(frameSource, -w / 2, -h / 2, w, h);
      ctx.restore();
      return true;
    }
    ctx.drawImage(frameSource, x, y, w, h);
    return true;
  }

  function drawImagePlaceholder(ctx, item, disp, labelText) {
    const x = toNum(item.x, 0);
    const y = toNum(item.y, 0);
    const w = Math.max(12, toNum(item.w, 60));
    const h = Math.max(12, toNum(item.h, 60));
    ctx.fillStyle = colorToRgba(item.color_2, 0.28);
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(122,173,255,0.85)";
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    ctx.setLineDash([]);
    ctx.fillStyle = colorToRgba(item.color_1, 1);
    const title = labelText || `IMG ${disp}`;
    ctx.font = `${Math.max(10, Math.floor(Math.min(h * 0.28, 18)))}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, x + w / 2, y + h / 2);
    if (item.image_addr) {
      ctx.fillStyle = "rgba(210,226,255,0.85)";
      ctx.font = "11px monospace";
      ctx.fillText(basename(item.image_addr), x + w / 2, y + h - 10);
    }
  }

  function resolveTextBackgroundFill(item) {
    // Keep canvas preview closer to device behavior: text background is opt-in.
    const enabled = toNum(
      item.bg_fill ?? item.fill_bg ?? item.preview_bg_fill ?? item.previewFillBg,
      0
    ) === 1;
    if (!enabled) return null;
    const alpha = clamp(
      toNum(item.bg_alpha ?? item.fill_alpha ?? item.preview_bg_alpha, 22) / 100,
      0,
      1
    );
    if (alpha <= 0) return null;
    return {
      color: ensureColorHex(item.color_2, "#000000"),
      alpha
    };
  }

  function drawTextItem(ctx, item, disp, text, index) {
    const x = toNum(item.x, 0);
    const y = toNum(item.y, 0);
    const w = Math.max(8, toNum(item.w, 120));
    const h = Math.max(8, toNum(item.h, 40));
    const angle = toNum(item.angle, 0);
    const fontSize = Math.max(8, toNum(item.size ?? item.font_size, Math.min(60, Math.round(h * 0.8))));
    const fontId = toNum(item.font, 0);
    const isImageFont = fontStore.isImageFont(fontId);
    const spacingPx = normalizeCharSpacing(item.sep, 0);
    const color1 = ensureColorHex(item.color_1, "#ffffff");
    const textBackgroundFill = isImageFont ? null : resolveTextBackgroundFill(item);

    const drawMain = () => {
      if (isImageFont) {
        fontStore.drawImageFontText(ctx, text, item, { x, y, w, h });
        return;
      }
      if (textBackgroundFill) {
        ctx.fillStyle = colorToRgba(textBackgroundFill.color, textBackgroundFill.alpha);
        ctx.fillRect(x, y, w, h);
      }

      const family = fontStore.getFamily(fontId);
      const align = guessAlign(item.alig ?? item.align);
      ctx.font = `${fontSize}px ${family ? `"${family}"` : "sans-serif"}`;
      ctx.fillStyle = colorToRgba(color1, 1);
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      let tx = x + 2;
      const ty = y + h / 2;

      if (MULTI_LINE_DISP_IDS.has(disp) && text.length > 12) {
        const lines = wrapTextByWidth(ctx, text, Math.max(12, w - 6), spacingPx);
        const lineH = Math.max(12, fontSize * 1.12);
        const startY = y + (h - lineH * lines.length) / 2 + lineH / 2;
        lines.forEach((line, i) => {
          const lw = spacingPx === 0 ? ctx.measureText(line).width : measureTextWithSpacing(ctx, line, spacingPx);
          let lineX = x + 2;
          if (align === "center") lineX = x + Math.max(0, (w - lw) / 2);
          if (align === "right") lineX = x + Math.max(0, w - lw - 2);
          if (spacingPx === 0) ctx.fillText(line, lineX, startY + i * lineH);
          else drawTextWithSpacing(ctx, line, lineX, startY + i * lineH, spacingPx);
        });
      } else {
        if (spacingPx === 0) {
          if (align === "center") tx = x + w / 2;
          if (align === "right") tx = x + w - 2;
          ctx.textAlign = align;
          ctx.fillText(text, tx, ty);
        } else {
          const lw = measureTextWithSpacing(ctx, text, spacingPx);
          if (align === "center") tx = x + Math.max(0, (w - lw) / 2);
          if (align === "right") tx = x + Math.max(0, w - lw - 2);
          drawTextWithSpacing(ctx, text, tx, ty, spacingPx);
        }
      }
    };

    if (angle !== 0) {
      const cx = x + w / 2;
      const cy = y + h / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle * Math.PI / 180);
      ctx.translate(-cx, -cy);
      drawMain();
      ctx.restore();
    } else {
      drawMain();
    }

    if (state.selectedIndex === index) {
      ctx.strokeStyle = "rgba(106,161,255,0.85)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    }
  }

  function wrapTextByWidth(ctx, text, maxWidth, spacingPx = 0) {
    const chars = [...text];
    const lines = [];
    let cur = "";
    for (const ch of chars) {
      const next = cur + ch;
      const nextWidth = spacingPx === 0 ? ctx.measureText(next).width : measureTextWithSpacing(ctx, next, spacingPx);
      if (nextWidth > maxWidth && cur) {
        lines.push(cur);
        cur = ch;
      } else {
        cur = next;
      }
    }
    if (cur) lines.push(cur);
    return lines.slice(0, 6);
  }

  function renderWatchface() {
    dom.canvas.width = state.width;
    dom.canvas.height = state.height;
    drawBackground(watchCtx);

    const list = state.config.ItemList || [];
    const indexed = list.map((item, idx) => ({ item, idx }));
    indexed.sort((a, b) => toNum(a.item.hier, a.idx) - toNum(b.item.hier, b.idx));

    for (const { item, idx } of indexed) {
      const disp = toNum(item.disp, 0);
      const alpha = clamp(toNum(item.transp, 100) / 100, 0, 1);
      watchCtx.save();
      watchCtx.globalAlpha = alpha;
      if (POINTER_DISP_IDS.has(disp)) {
        if (!drawLocalDispAsset(watchCtx, item, disp)) drawPointer(watchCtx, item, disp);
      } else if (IMAGE_DISP_IDS.has(disp) || item.image_id > 0 || !!item.image_addr) {
        if (!drawLocalDispAsset(watchCtx, item, disp)) {
          const lbl = item.image_addr ? `IMG ${disp}` : `PLACEHOLDER ${disp}`;
          drawImagePlaceholder(watchCtx, item, disp, lbl);
        }
      } else {
        const txt = state.previewTextOverrides.get(idx) || getPlaceholderText(disp, item);
        drawTextItem(watchCtx, item, disp, txt, idx);
      }
      watchCtx.restore();
    }

    applyCanvasZoom();
    renderFontPreview();
  }

  function applyCanvasZoom() {
    const z = clamp(toNum(state.zoom, 55), 20, 220);
    dom.canvas.style.width = `${Math.round(state.width * z / 100)}px`;
    dom.canvas.style.height = `${Math.round(state.height * z / 100)}px`;
    dom.txtZoom.textContent = `${Math.round(z)}%`;
  }

  function matchesFontFilter(meta, keyword) {
    if (!keyword) return true;
    const parts = keyword.toLowerCase().split(/\s+/).filter(Boolean);
    if (!parts.length) return true;
    const typeTag = toNum(meta.type, 1) === 0 ? "img type0" : "ttf type1";
    const haystack = [
      String(meta.id),
      String(meta.name || ""),
      String(meta.url || ""),
      String(meta.charset || ""),
      typeTag
    ].join(" ").toLowerCase();
    return parts.every((p) => haystack.includes(p));
  }

  function refreshBuiltinFontList() {
    if (!dom.builtinFontList || !dom.selectFontPreview) return;
    const all = fontStore.getAllMetas();
    const keyword = String(dom.inputFontFilter?.value || "").trim();
    const filtered = all.filter((meta) => matchesFontFilter(meta, keyword));
    const activeId = String(dom.selectFontPreview.value || "");
    dom.builtinFontList.innerHTML = "";
    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "builtin-font-empty";
      empty.textContent = all.length ? t("font.empty.filtered") : t("font.empty.meta");
      dom.builtinFontList.appendChild(empty);
      return;
    }
    for (const meta of filtered) {
      const row = document.createElement("div");
      row.className = "builtin-font-row";
      if (String(meta.id) === activeId) row.classList.add("active");
      const loaded = fontStore.fontFileById.has(meta.id) ? "✔" : "…";
      const idEl = document.createElement("span");
      idEl.className = "builtin-font-id";
      idEl.textContent = `#${meta.id}`;
      const metaEl = document.createElement("span");
      metaEl.className = "builtin-font-meta";
      metaEl.textContent = `${toNum(meta.type, 1) === 0 ? "[IMG]" : "[TTF]"} ${meta.name || `(${t("common.unnamed")})`} ${loaded}`;
      row.append(idEl, metaEl);
      row.addEventListener("click", () => {
        dom.selectFontPreview.value = String(meta.id);
        refreshBuiltinFontList();
        renderFontPreview();
      });
      dom.builtinFontList.appendChild(row);
    }
  }

  function refreshFontPreviewSelect() {
    if (!dom.selectFontPreview) return;
    const old = dom.selectFontPreview.value;
    dom.selectFontPreview.innerHTML = "";
    const list = fontStore.getAllMetas();
    if (!list.length) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = t("font.select.noMeta");
      dom.selectFontPreview.appendChild(opt);
      refreshBuiltinFontList();
      return;
    }
    for (const meta of list) {
      const opt = document.createElement("option");
      opt.value = String(meta.id);
      const loaded = fontStore.fontFileById.has(meta.id);
      opt.textContent = `${meta.id} ${meta.type === 0 ? "[IMG]" : "[TTF]"} ${meta.name || ""} ${loaded ? "✔" : "…"}`;
      dom.selectFontPreview.appendChild(opt);
    }
    if ([...dom.selectFontPreview.options].some((o) => o.value === old)) {
      dom.selectFontPreview.value = old;
    } else if (dom.selectFontPreview.options.length > 0) {
      dom.selectFontPreview.selectedIndex = 0;
    }
    refreshBuiltinFontList();
  }

  function renderFontPreview() {
    if (!fontPreviewCtx || !dom.fontPreviewCanvas || !dom.selectFontPreview || !dom.inputFontPreviewText) return;
    const ctx = fontPreviewCtx;
    const w = dom.fontPreviewCanvas.width;
    const h = dom.fontPreviewCanvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0a111f";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#2e3f61";
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

    const id = toNum(dom.selectFontPreview.value, NaN);
    const text = dom.inputFontPreviewText.value || "0123456789";
    if (!Number.isFinite(id)) {
      ctx.fillStyle = "#8fa5ce";
      ctx.font = "14px sans-serif";
      ctx.fillText(t("font.preview.waitCfg"), 12, 26);
      return;
    }

    const meta = fontStore.getMeta(id);
    if (!meta) {
      ctx.fillStyle = "#ff9aa8";
      ctx.font = "14px sans-serif";
      ctx.fillText(t("font.preview.metaMissing"), 12, 26);
      return;
    }

    const item = {
      font: id,
      size: 44,
      alig: 1,
      color_1: "#ffffff",
      color_2: "#000000",
      transp: 100
    };
    const isImageFontPreview = toNum(meta.type, 1) === 0;
    if (isImageFontPreview) {
      fontStore.drawImageFontText(ctx, text, item, { x: 12, y: 36, w: w - 24, h: 64 });
    } else {
      const family = fontStore.getFamily(id);
      ctx.font = `44px ${family ? `"${family}"` : "sans-serif"}`;
      ctx.fillStyle = "#f2f7ff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 12, 70);
    }

    ctx.fillStyle = "#9fb2d8";
    ctx.font = "12px monospace";
    const charset = meta.charset ? `charset=${meta.charset}` : "charset=<none>";
    ctx.fillText(`id=${meta.id} type=${meta.type} ${charset}`, 12, 110);
  }

  async function loadSampleConfig() {
    const paths = [
      withBase("examples/sample_watchface.json"),
      "../examples/sample_watchface.json",
      "./examples/sample_watchface.json",
      "../docs/EXAMPLE/api_responses/example/Device_GetLocalClockInfo_response.example.json"
    ];
    const json = await loadFirstJson(paths);
    if (json) {
      applyConfig(json, t("source.sampleConfig"));
      return;
    }
    fontStore.log(t("log.sampleLoadFailed"));
  }

  async function loadDefaultFontConfigs() {
    try {
      const cfgCandidates = [];
      const pushUnique = (list, value) => {
        if (!value) return;
        if (!list.includes(value)) list.push(value);
      };
      const staticCfg = [
        withBase("font/font_info.cfg"),
        "./font/font_info.cfg",
        "font/font_info.cfg",
        "./html/font/font_info.cfg",
        "../font/font_info.cfg",
        "../html/font/font_info.cfg",
        "/font/font_info.cfg",
        "/html/font/font_info.cfg"
      ];
      staticCfg.forEach((p) => pushUnique(cfgCandidates, p));
      try {
        pushUnique(cfgCandidates, new URL(withBase("font/font_info.cfg"), window.location.origin + BASE_URL).toString());
        pushUnique(cfgCandidates, new URL("./font/font_info.cfg", window.location.href).toString());
        pushUnique(cfgCandidates, new URL("./html/font/font_info.cfg", window.location.href).toString());
        pushUnique(cfgCandidates, new URL("../font/font_info.cfg", window.location.href).toString());
        pushUnique(cfgCandidates, new URL("../html/font/font_info.cfg", window.location.href).toString());
      } catch (e) {
        // ignore url build errors
      }

      let appScript = null;
      try {
        appScript = Array.from(document.scripts || []).find((s) => /\/(main|app)\.js(\?|$)/.test(s.src || ""));
      } catch (e) {
        fontStore.log(`读取 document.scripts 失败: ${errorToText(e)}`);
      }
      if (appScript?.src) {
        const base = appScript.src.replace(/\/(main|app)\.js(\?.*)?$/, "/");
        pushUnique(cfgCandidates, `${base}font/font_info.cfg`);
        pushUnique(cfgCandidates, `${base}../font/font_info.cfg`);
      }

      fontStore.log(`字体配置调试: location=${window.location.href}`);
      fontStore.log(`[font_info] 候选路径数量: ${cfgCandidates.length}`);
      const result = await loadFirstJsonWithTrace(cfgCandidates, (line) => fontStore.log(`[font_info] ${line}`));

      let loaded = false;
      let count = 0;
      if (result.data) {
        try {
          count = fontStore.parseFontListLike(result.data);
          loaded = count > 0;
        } catch (e) {
          fontStore.log(`font_info.cfg 解析失败: ${errorToText(e)}`);
        }
      }

      if (loaded) {
        runtime.fontCfgPath = result.path;
        const baseFromCfg = fontBaseFromCfgPath(result.path);
        if (baseFromCfg) {
          runtime.fontBasePaths = [baseFromCfg, ...runtime.fontBasePaths.filter((p) => p !== baseFromCfg)];
          fontStore.log(`字体文件基路径: ${baseFromCfg}`);
        }
        fontStore.log(`已读取字体配置(${count}条): ${result.path} [${result.via}]（字体文件按 ID+1.BIN 规则映射）`);
      } else {
        if (result.data) {
          fontStore.log("font_info.cfg 已读取，但未找到有效 FontList 数组。");
        }
        if (window.location.protocol === "file:") {
          fontStore.log("当前是 file:// 协议，浏览器通常会拦截跨文件读取；请改用本地 HTTP 打开页面。");
        }
        fontStore.log("未读取到 html/font/font_info.cfg。请优先用本地 HTTP 打开页面，或确认预览环境可访问该文件。");
      }
    } catch (e) {
      fontStore.log(`loadDefaultFontConfigs 异常中断: ${errorToText(e)}`);
    }
  }

  function exportCurrentConfig() {
    syncItemIdList();
    const out = {
      ...state.config,
      ItemList: state.config.ItemList.map((item) => {
        const clone = { ...item };
        return clone;
      }),
      ItemIdList: [...state.config.ItemIdList]
    };
    const name = `watchface_preview_${Date.now()}.json`;
    downloadTextFile(name, JSON.stringify(out, null, 2), "application/json;charset=utf-8");
    fontStore.log(t("log.configExported", { name }));
  }

  function onAddItem() {
    const idx = state.config.ItemList.length;
    state.config.ItemList.push(createDefaultItem(idx));
    syncItemIdList();
    state.selectedIndex = idx;
    refreshItemListUi();
    rebuildItemEditor();
    renderWatchface();
  }

  function onDupItem() {
    if (state.selectedIndex < 0) return;
    const src = state.config.ItemList[state.selectedIndex];
    if (!src) return;
    const clone = normalizeItem({ ...src, item_id: `${src.item_id || "item"}_copy` }, state.config.ItemList.length);
    clone.y += 20;
    clone.hier = state.config.ItemList.length;
    state.config.ItemList.push(clone);
    syncItemIdList();
    state.selectedIndex = state.config.ItemList.length - 1;
    refreshItemListUi();
    rebuildItemEditor();
    renderWatchface();
  }

  function onDeleteItem() {
    if (state.selectedIndex < 0) return;
    const deleted = state.config.ItemList[state.selectedIndex];
    if (deleted) clearLocalDispAsset(deleted);
    state.config.ItemList.splice(state.selectedIndex, 1);
    state.previewTextOverrides.delete(state.selectedIndex);
    const remap = new Map();
    for (const [k, v] of state.previewTextOverrides.entries()) {
      remap.set(k > state.selectedIndex ? k - 1 : k, v);
    }
    state.previewTextOverrides = remap;
    state.selectedIndex = Math.min(state.selectedIndex, state.config.ItemList.length - 1);
    syncItemIdList();
    refreshItemListUi();
    rebuildItemEditor();
    renderWatchface();
  }

  function moveItem(step) {
    const idx = state.selectedIndex;
    const list = state.config.ItemList;
    if (idx < 0 || idx >= list.length) return;
    const target = idx + step;
    if (target < 0 || target >= list.length) return;
    const tmp = list[idx];
    list[idx] = list[target];
    list[target] = tmp;
    state.selectedIndex = target;
    syncItemIdList();
    refreshItemListUi();
    rebuildItemEditor();
    renderWatchface();
  }

  function bindEvents() {
    if (dom.btnApplyJson && dom.txtConfigJson) {
      dom.btnApplyJson.addEventListener("click", () => {
        try {
          const raw = JSON.parse(dom.txtConfigJson.value);
          applyConfig(raw, t("source.pastedJson"));
        } catch (e) {
          alert(t("alert.jsonParseFailed", { message: e.message }));
        }
      });
    }

    if (dom.btnClearJson && dom.txtConfigJson) {
      dom.btnClearJson.addEventListener("click", () => {
        dom.txtConfigJson.value = "";
      });
    }

    if (dom.selectTemplateCategory) {
      dom.selectTemplateCategory.addEventListener("change", () => {
        const nextClassifyId = toNum(dom.selectTemplateCategory.value, NaN);
        templateState.selectedClassifyId = Number.isFinite(nextClassifyId) ? nextClassifyId : null;
        refreshTemplateListUi();
      });
    }

    if (dom.inputTemplateFilter) {
      dom.inputTemplateFilter.addEventListener("input", refreshTemplateListUi);
    }
    if (dom.btnReloadTemplates) {
      dom.btnReloadTemplates.addEventListener("click", async () => {
        await loadTemplateConfigIds();
      });
    }

    dom.inputConfigFile.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const raw = await readFileAsJson(file);
        applyConfig(raw, file.name);
        if (dom.txtConfigJson) {
          dom.txtConfigJson.value = JSON.stringify(raw, null, 2);
        }
      } catch (err) {
        alert(t("alert.readConfigFailed", { message: err.message }));
      }
    });

    dom.btnFitResolution.addEventListener("click", () => {
      state.width = clamp(toNum(dom.inputWidth.value, 800), 64, 4000);
      state.height = clamp(toNum(dom.inputHeight.value, 1280), 64, 4000);
      renderWatchface();
    });

    dom.inputZoom.addEventListener("input", () => {
      state.zoom = clamp(toNum(dom.inputZoom.value, 55), 20, 220);
      applyCanvasZoom();
    });

    dom.inputBgFile.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          clearBackgroundObjectUrl();
          state.backgroundImage = img;
          state.backgroundName = file.name;
          state.backgroundSourceLabel = t("ui.bg.localFileHint", { name: file.name });
          refreshBackgroundSourceLabel();
          renderWatchface();
          fontStore.log(t("log.backgroundLoaded", { name: file.name }));
        };
        img.onerror = () => alert(t("alert.backgroundLoadFailed"));
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });

    dom.btnClearBg.addEventListener("click", () => {
      clearBackgroundObjectUrl();
      state.backgroundImage = null;
      state.backgroundName = "";
      state.backgroundSourceLabel = "";
      if (dom.inputBgFile) dom.inputBgFile.value = "";
      refreshBackgroundSourceLabel();
      renderWatchface();
    });

    dom.btnLoadDefaults.addEventListener("click", async () => {
      await loadDefaultFontConfigs();
      refreshFontPreviewSelect();
      renderWatchface();
      renderFontPreview();
    });

    dom.btnLoadSample.addEventListener("click", async () => {
      await loadSampleConfig();
    });

    dom.btnExportConfig.addEventListener("click", exportCurrentConfig);

    if (dom.inputFontFilter) {
      dom.inputFontFilter.addEventListener("input", refreshBuiltinFontList);
    }
    if (dom.selectFontPreview) {
      dom.selectFontPreview.addEventListener("change", () => {
        refreshBuiltinFontList();
        renderFontPreview();
      });
    }
    if (dom.inputFontPreviewText) {
      dom.inputFontPreviewText.addEventListener("input", renderFontPreview);
    }

    if (dom.selectLang) {
      dom.selectLang.addEventListener("change", () => {
        applyLanguage(dom.selectLang.value, true);
      });
    }

    dom.btnAddItem.addEventListener("click", onAddItem);
    dom.btnDupItem.addEventListener("click", onDupItem);
    dom.btnDelItem.addEventListener("click", onDeleteItem);
    dom.btnItemUp.addEventListener("click", () => moveItem(-1));
    dom.btnItemDown.addEventListener("click", () => moveItem(1));

    if (dom.btnDismissFileBanner && dom.fileProtocolBanner) {
      dom.btnDismissFileBanner.addEventListener("click", () => {
        dom.fileProtocolBanner.hidden = true;
      });
    }
  }

  async function warnIfFileProtocolBlocked() {
    if (location.protocol !== "file:") return;
    try {
      const u = withBase("font/font_info.cfg");
      const r = await fetch(u, { cache: "no-store" });
      if (!r.ok) throw new Error("bad");
      const ct = (r.headers.get("content-type") || "").toLowerCase();
      if (ct.includes("text/html")) throw new Error("html");
      try {
        if (r.body?.cancel) await r.body.cancel();
      } catch (e) {
        /* ignore */
      }
    } catch (e) {
      if (dom.fileProtocolBanner) dom.fileProtocolBanner.hidden = false;
    }
  }

  function init() {
    syncTemplateDomRefs();
    currentLanguageEnum = resolveInitialLanguageEnum();
    setLanguage(currentLanguageEnum, false);
    currentLanguageEnum = getLanguage();
    rebuildLanguageSelector();
    applyStaticI18n();
    rebuildTemplateClassifyRows();

    bindEvents();
    applyCanvasZoom();
    refreshFontPreviewSelect();
    refreshTemplateListUi();
    fontStore.log(t("log.uiBuildVersion", { tag: APP_BUILD_TAG }));
    refreshBackgroundSourceLabel();
    applyConfig({
      ClockId: 0,
      NameCn: t("ui.default.untitled"),
      NameEn: "Untitled",
      ItemList: [createDefaultItem(0)]
    }, t("source.init"));
    if (state.tickHandle) clearInterval(state.tickHandle);
    state.tickHandle = setInterval(() => renderWatchface(), PREVIEW_TICK_MS);
    window.addEventListener("beforeunload", () => {
      clearAllLocalDispAssets();
      clearBackgroundObjectUrl();
    }, { once: true });
    loadDefaultFontConfigs();
    loadTemplateConfigIds();
    loadSampleConfig();
    void warnIfFileProtocolBlocked();
  }

function boot() {
  try {
    init();
  } catch (err) {
    console.error("[watchface-editor] init failed:", err);
    try {
      syncTemplateDomRefs();
      const hint = dom.templateHint || byId("template-hint");
      if (hint) {
        hint.textContent = String(err?.message || err || "init failed");
      }
    } catch (e) {
      /* ignore */
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
