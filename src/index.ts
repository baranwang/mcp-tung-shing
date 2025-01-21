#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import dayjs from 'dayjs';
import { z } from 'zod';
import { PluginLunar } from 'dayjs-plugin-lunar';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

dayjs.extend(PluginLunar);

function getHourlyAlmanac(date: dayjs.Dayjs) {
  const lunarHour = date.toLunarHour();
  const sixtyCycle = lunarHour.getSixtyCycle();
  const heavenStem = sixtyCycle.getHeavenStem();
  const earthBranch = sixtyCycle.getEarthBranch();

  const handleDirection = (direction: string) => {
    const result = direction;
    switch (result) {
      case '东':
      case '南':
      case '西':
      case '北':
        return `正${result}`;
      default:
        return result;
    }
  };

  return {
    hour: date.format('LH'),
    recommends: lunarHour.getRecommends().map(String),
    avoids: lunarHour.getAvoids().map(String),
    content: [
      {
        key: '吉凶',
        value: lunarHour.getMinorRen().getLuck().toString(),
      },
      {
        key: '星神',
        value: lunarHour.getTwelveStar().toString(),
      },
      {
        key: '五行',
        value: sixtyCycle.getSound().toString(),
      },
      {
        key: '冲煞',
        value: `冲${earthBranch.getOpposite().getZodiac()} 煞${earthBranch.getOminous()}`,
      },
      {
        key: '方位',
        value: `喜神${handleDirection(heavenStem.getJoyDirection().toString())} 财神${handleDirection(heavenStem.getWealthDirection().toString())} 福神${handleDirection(heavenStem.getMascotDirection().toString())}`,
      },
    ],
  };
}

function getDailyAlmanac(date?: dayjs.Dayjs) {
  const parsedDate = dayjs(date);
  if (!parsedDate.isValid()) {
    throw new Error('Invalid date');
  }

  const lunarDay = parsedDate.toLunarDay();
  const sixtyCycle = lunarDay.getSixtyCycle();
  const earthBranch = sixtyCycle.getEarthBranch();
  const twentyEightStar = lunarDay.getTwentyEightStar();
  const gods = lunarDay.getGods();
  const goodGods: string[] = [];
  const badGods: string[] = [];
  for (const god of gods) {
    god.getLuck().getName() === '吉'
      ? goodGods.push(god.getName())
      : badGods.push(god.getName());
  }

  return {
    date: parsedDate.format('YYYY-MM-DD'),
    lunarDate: parsedDate.format('LY年LMLD'),
    hours: Array.from({ length: 12 }, (_, i) =>
      getHourlyAlmanac(parsedDate.addLunar(i, 'dual-hour')),
    ),
    recommends: lunarDay.getRecommends().map(String),
    avoids: lunarDay.getAvoids().map(String),
    content: [
      {
        key: '吉凶',
        value: lunarDay.getMinorRen().getLuck().toString(),
      },
      {
        key: '五行',
        value: sixtyCycle.getSound().toString(),
      },
      {
        key: '冲煞',
        value: `冲${earthBranch.getOpposite().getZodiac()}煞${earthBranch.getOminous()}`,
      },
      {
        key: '值神',
        value: lunarDay.getTwelveStar().toString(),
      },
      {
        key: '建除十二神',
        value: lunarDay.getDuty().toString(),
      },
      {
        key: '二十八星宿',
        value: `${twentyEightStar}${twentyEightStar.getSevenStar()}${twentyEightStar.getAnimal()}（${twentyEightStar.getLuck()}）`,
      },
      {
        key: '吉神宜趋',
        value: goodGods.join(' '),
      },
      {
        key: '凶煞宜忌',
        value: badGods.join(' '),
      },
      {
        key: '彭祖百忌',
        value: `${sixtyCycle.getHeavenStem().getPengZuHeavenStem()} ${earthBranch.getPengZuEarthBranch()}`,
      },
    ],
  };
}

function formatToMarkdown(almanac: ReturnType<typeof getDailyAlmanac>) {
  let result = `# ${almanac.lunarDate}\n`;
  result += `> ${almanac.date}\n\n`;
  result += '## 宜忌\n\n';
  result += '### 宜\n\n';
  for (const item of almanac.recommends) {
    result += `- ${item}\n`;
  }
  result += '\n### 忌\n\n';
  for (const item of almanac.avoids) {
    result += `- ${item}\n`;
  }
  result += '\n## 详细信息\n\n';
  for (const item of almanac.content) {
    result += `\n### ${item.key}\n\n`;
    result += `${item.value}\n`;
  }
  result += '\n## 时辰\n\n';
  for (const hour of almanac.hours) {
    result += `### ${hour.hour}\n\n`;
    result += '#### 宜\n\n';
    for (const item of hour.recommends) {
      result += `- ${item}\n`;
    }
    result += '\n#### 忌\n\n';
    for (const item of hour.avoids) {
      result += `- ${item}\n`;
    }
    for (const item of hour.content) {
      result += `\n#### ${item.key}\n\n`;
      result += `${item.value}\n`;
    }
  }
  return result;
}

const server = new McpServer({
  name: 'Tung Shing',
  version: process.env.PACKAGE_VERSION ?? '0.0.0',
});

server.tool(
  'get-tung-shing',
  {
    startDate: z
      .string()
      .describe('The start date as a string in the format "YYYY-MM-DD"'),
    days: z
      .number()
      .int()
      .min(1)
      .optional()
      .default(1)
      .describe('The number of consecutive days to retrieve'),
  },
  async ({ startDate, days }) => {
    const start = dayjs(startDate);
    if (!start.isValid()) {
      throw new Error('Invalid date');
    }

    return {
      content: Array.from({ length: days }, (_, i) =>
      ({
        type: 'text',
        text: formatToMarkdown(getDailyAlmanac(start.add(i, 'day')))
      }),
      )
    };
  },
);

(async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})()