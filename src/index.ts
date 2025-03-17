#!/usr/bin/env node

import dayjs from 'dayjs';
import { z } from 'zod';
import { PluginLunar } from 'dayjs-plugin-lunar';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';

dayjs.extend(PluginLunar);

function handleDirection(direction: string) {
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

function getHourlyAlmanac(date: dayjs.Dayjs) {
  const lunarHour = date.toLunarHour();
  const sixtyCycle = lunarHour.getSixtyCycle();
  const heavenStem = sixtyCycle.getHeavenStem();
  const earthBranch = sixtyCycle.getEarthBranch();

  return {
    hour: date.format('LH'),
    content: [
      {
        key: '宜',
        value: lunarHour.getRecommends().join('、'),
      },
      {
        key: '忌',
        value: lunarHour.getAvoids().join('、'),
      },
      {
        key: '吉凶',
        value: lunarHour.getTwelveStar().getEcliptic().getLuck().toString(),
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
    content: [
      {
        key: '宜',
        value: lunarDay.getRecommends().join('、'),
      },
      {
        key: '忌',
        value: lunarDay.getAvoids().join('、'),
      },
      {
        key: '吉凶',
        value: lunarDay.getTwelveStar().getEcliptic().getLuck().toString(),
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

function formatToText(almanac: ReturnType<typeof getDailyAlmanac>) {
  let result = '<整体>\n';
  result += `<农历>${almanac.lunarDate}</农历>\n`;
  result += `<公历>${almanac.date}</公历>\n`;
  for (const item of almanac.content) {
    if (item.value) {
      result += `<${item.key}>${item.value}</${item.key}>\n`;
    }
  }
  result += '</整体>\n';

  for (const hour of almanac.hours) {
    result += `<${hour.hour}>\n`
    for (const item of hour.content) {
      if (item.value) {
        result += `<${item.key}>${item.value}</${item.key}>\n`;
      }
    }
    result += `</${hour.hour}>\n`;
  }
  return result;
}


const server = new Server(
  {
    name: 'Tung Shing',
    version: process.env.PACKAGE_VERSION ?? '0.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

const getTungShingParamsSchema = z.object({
  startDate: z
    .string()
    .optional()
    .default(dayjs().format('YYYY-MM-DD'))
    .describe('The start date as a string in the format "YYYY-MM-DD"'),
  days: z
    .union([
      z.number().int().min(1),
      z
        .string()
        .regex(/^\d+$/)
        .transform((val) => Number.parseInt(val)),
    ])
    .optional()
    .default(1)
    .describe('The number of consecutive days to retrieve'),
});

server.setRequestHandler(ListToolsRequestSchema, () => ({
  tools: [
    {
      name: 'get-tung-shing',
      description: 'Get the daily almanac from Tung Shing',
      inputSchema: zodToJsonSchema(getTungShingParamsSchema),
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case 'get-tung-shing': {
      const { startDate, days } = getTungShingParamsSchema.parse(
        request.params.arguments,
      );
      const start = dayjs(startDate);
      if (!start.isValid()) {
        throw new Error('Invalid date');
      }
      return {
        content: Array.from({ length: days }, (_, i) => ({
          type: 'text',
          text: formatToText(getDailyAlmanac(start.add(i, 'day'))),
        })),
      };
    }
    default: {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }
  }
});

(async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
