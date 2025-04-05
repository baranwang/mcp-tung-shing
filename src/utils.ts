import { Taboo } from 'tyme4ts';

/**
 * 处理方向文本，对东南西北添加"正"前缀
 */
export function handleDirection(direction: string): string {
  const directions = {
    东: '正东',
    南: '正南',
    西: '正西',
    北: '正北',
  };

  return directions[direction as keyof typeof directions] || direction;
}

const IGNORE_DAY_TABOO_NAMES = [
  '齐醮',
  '酬神',
  '祀灶',
  '焚香',
  '订婚',
  '挽面',
  '开容',
  '开井开池',
  '作陂放水',
  '伐木做梁',
  '穿屏扇架',
  '盖屋合脊',
  '作厕',
  '造屋',
  '求财',
  '买车',
  '酝酿',
  '作染',
  '鼓铸',
  '见贵',
  '渡水',
  '剃头',
  '起基动土',
  '破屋坏垣',
  '造仓库',
  '立券交易',
  '安机',
  '会友',
  '求医疗病',
];

/**
 * 获取宜忌名称列表，排除了一些不会出现的宜忌名称
 */
export const getDayTabooNames = () => {
  return Taboo.NAMES.filter(
    (item) => !IGNORE_DAY_TABOO_NAMES.includes(item),
  ) as [string, ...string[]];
};
