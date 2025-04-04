import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import dayjs from 'dayjs';
import { ContentType, getTungShingParamsSchema } from './types';
import { getDailyAlmanac } from './almanac';

/**
 * 创建并配置MCP服务器
 */
export function createServer() {
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

  // 注册工具列表处理器
  server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: [
      {
        name: 'get-tung-shing',
        description: 'Get the daily almanac from Tung Shing',
        inputSchema: zodToJsonSchema(getTungShingParamsSchema),
      },
    ],
  }));

  // 注册工具调用处理器
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
      case 'get-tung-shing': {
        const { startDate, days, taboo, includeHours } =
          getTungShingParamsSchema.parse(request.params.arguments);
        const start = dayjs(startDate);
        if (!start.isValid()) {
          return {
            content: [
              {
                type: 'text',
                text: 'Invalid date',
              },
            ],
            isError: true,
          };
        }

        return {
          content: Array.from({ length: days }, (_, i) => {
            const almanac = getDailyAlmanac(start.add(i, 'day'), includeHours);

            // 如果没有指定taboo过滤，直接返回结果
            if (!taboo) {
              return {
                type: 'text',
                text: JSON.stringify(almanac),
              };
            }

            // 提取宜忌内容
            const recommends = almanac.当日[ContentType.宜] || [];
            const avoids = almanac.当日[ContentType.忌] || [];

            // 根据taboo类型进行过滤
            const matchesRecommends =
              taboo.type & 1 && recommends.includes(taboo.value);
            const matchesAvoids =
              taboo.type & 2 && avoids.includes(taboo.value);

            if (matchesRecommends || matchesAvoids) {
              return {
                type: 'text',
                text: JSON.stringify(almanac),
              };
            }
            return null;
          }).filter(Boolean),
        };
      }
      default: {
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${request.params.name}`,
            },
          ],
          isError: true,
        };
      }
    }
  });

  return server;
}
