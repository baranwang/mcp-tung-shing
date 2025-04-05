import dayjs from 'dayjs';
import { PluginLunar } from 'dayjs-plugin-lunar';
import type { AlmanacContentItem, DailyAlmanac } from './types';
import { ContentType } from './types';
import { handleDirection } from './utils';
import 'dayjs/locale/zh-cn.js';

dayjs.extend(PluginLunar);

/**
 * 获取时辰黄历信息
 */
export function getHourlyAlmanac(date: dayjs.Dayjs): AlmanacContentItem {
  const lunarHour = date.toLunarHour();
  const sixtyCycle = lunarHour.getSixtyCycle();
  const heavenStem = sixtyCycle.getHeavenStem();
  const earthBranch = sixtyCycle.getEarthBranch();

  return {
    [ContentType.宜]: lunarHour.getRecommends().map((item) => item.getName()),
    [ContentType.忌]: lunarHour.getAvoids().map((item) => item.getName()),
    [ContentType.吉凶]: lunarHour
      .getTwelveStar()
      .getEcliptic()
      .getLuck()
      .toString(),
    [ContentType.值神]: lunarHour.getTwelveStar().toString(),
    [ContentType.五行]: sixtyCycle.getSound().toString(),
    [ContentType.冲煞]: `冲${earthBranch.getOpposite().getZodiac()}煞${earthBranch.getOminous()}`,
    [ContentType.方位]: [
      `喜神${handleDirection(heavenStem.getJoyDirection().toString())}`,
      `财神${handleDirection(heavenStem.getWealthDirection().toString())}`,
      `福神${handleDirection(heavenStem.getMascotDirection().toString())}`,
    ],
  };
}

/**
 * 获取每日黄历信息
 */
export function getDailyAlmanac(
  date: dayjs.Dayjs,
  includeHours = false,
): DailyAlmanac {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) {
    throw new Error('Invalid date');
  }

  const lunarDay = parsedDate.toLunarDay();
  const solarDay = lunarDay.getSolarDay();
  const sixtyCycle = lunarDay.getSixtyCycle();
  const earthBranch = sixtyCycle.getEarthBranch();
  const twentyEightStar = lunarDay.getTwentyEightStar();
  const gods = lunarDay.getGods().reduce(
    (acc, god) => {
      const category =
        god.getLuck().getName() === '吉' ? 'auspicious' : 'inauspicious';
      acc[category].push(god.getName());
      return acc;
    },
    { auspicious: [] as string[], inauspicious: [] as string[] },
  );

  const result: DailyAlmanac = {
    公历: parsedDate.locale('zh-cn').format('YYYY 年 M 月 D日（ddd）'),
    农历: parsedDate.format('LY年LMLD'),
    节日: lunarDay.getFestival()?.getName(),
    节气: solarDay.getTermDay().toString(),
    七十二候: solarDay.getPhenologyDay().toString(),
    当日: {
      [ContentType.宜]: lunarDay.getRecommends().map((item) => item.getName()),
      [ContentType.忌]: lunarDay.getAvoids().map((item) => item.getName()),
      [ContentType.吉凶]: lunarDay
        .getTwelveStar()
        .getEcliptic()
        .getLuck()
        .toString(),
      [ContentType.五行]: sixtyCycle.getSound().toString(),
      [ContentType.冲煞]: `冲${earthBranch.getOpposite().getZodiac()}煞${earthBranch.getOminous()}`,
      [ContentType.值神]: lunarDay.getTwelveStar().toString(),
      [ContentType.建除十二神]: lunarDay.getDuty().toString(),
      [ContentType.二十八星宿]: `${twentyEightStar}${twentyEightStar.getSevenStar()}${twentyEightStar.getAnimal()}（${twentyEightStar.getLuck()}）`,
      [ContentType.吉神宜趋]: gods.auspicious,
      [ContentType.凶煞宜忌]: gods.inauspicious,
      [ContentType.彭祖百忌]: `${sixtyCycle.getHeavenStem().getPengZuHeavenStem()} ${earthBranch.getPengZuEarthBranch()}`,
    },
  };

  if (includeHours) {
    result.分时 = {};
    for (let i = 0; i < 12; i++) {
      const hour = parsedDate.addLunar(i, 'dual-hour');
      result.分时[hour.format('LH')] = getHourlyAlmanac(hour);
    }
  }

  return result;
}
