import { z } from 'zod';
import { getDayTabooNames } from './utils';

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
  方位 = '方位',
}

export enum TabooType {
  宜 = 1,
  忌 = 2,
}

export interface AlmanacContentItem {
  [key: string]: string | string[];
}

export interface DailyAlmanac {
  公历: string;
  农历: string;
  当日: AlmanacContentItem;
  分时?: Record<string, AlmanacContentItem>;
  [key: string]:
    | string
    | AlmanacContentItem
    | Record<string, AlmanacContentItem>
    | undefined;
}


export const tabooFilterSchema = z.object({
  type: z.nativeEnum(TabooType).describe('过滤类型：宜(1)、忌(2)'),
  value: z.enum(getDayTabooNames()).describe('要筛选的宜忌事项'),
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
  tabooFilters: z
    .array(tabooFilterSchema)
    .optional()
    .describe('多个筛选宜忌事项，条件之间为或关系'),
});
