import { z } from 'zod';
import { Taboo } from 'tyme4ts';

export enum ContentType {
  宜 = '宜',
  忌 = '忌',
  吉凶 = '吉凶',
  五行 = '五行',
  冲煞 = '冲煞',
  值神 = '值神',
  建除十二神 = '建除十二神',
  二十八星宿 = '二十八星宿',
  吉神宜趋 = '吉神宜趋',
  凶煞宜忌 = '凶煞宜忌',
  彭祖百忌 = '彭祖百忌',
  星神 = '星神',
  方位 = '方位',
}

export enum TabooType {
  宜 = 1,
  忌 = 2,
  宜忌 = 3,
}

export interface AlmanacContentItem {
  [key: string]: string | string[];
}

export interface DailyAlmanac {
  公历: string;
  农历: string;
  当日: AlmanacContentItem;
  分时?: Record<string, AlmanacContentItem>;
}

export const tabooFilterSchema = z.object({
  type: z
    .nativeEnum(TabooType)
    .describe('过滤类型：宜(1)、忌(2)或两者都包含(3)'),
  value: z
    .enum(Taboo.NAMES as [string, ...string[]])
    .describe('要筛选的宜忌事项'),
});

export const getTungShingParamsSchema = z.object({
  startDate: z
    .string()
    .optional()
    .default(new Date().toISOString().split('T')[0])
    .describe('开始日期，格式为"YYYY-MM-DD"的字符串'),
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
    .describe('要获取的连续天数'),
  includeHours: z
    .boolean()
    .optional()
    .default(false)
    .describe('是否包含时辰信息'),
  taboo: tabooFilterSchema.optional().describe('筛选宜忌事项'),
});
