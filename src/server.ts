import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import dayjs from 'dayjs';
import { Taboo } from 'tyme4ts';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { getDailyAlmanac } from './almanac';
import { ContentType, TabooType, getTungShingParamsSchema } from './types';

/**
 * 创建并配置MCP服务器
 */
export function createServer() {
  const mcpServer = new McpServer(
    {
      name: 'Tung Shing',
      version: process.env.PACKAGE_VERSION ?? '0.0.0',
    },
    {
      capabilities: {
        tools: {},
        prompts: {},
      },
    },
  );

  // 注册工具列表处理器
  mcpServer.server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: [
      {
        name: 'get-tung-shing',
        description: '获取通胜黄历，包括公历、农历、宜忌、吉凶、冲煞等信息',
        inputSchema: zodToJsonSchema(getTungShingParamsSchema),
      },
    ],
  }));

  // 注册工具调用处理器
  mcpServer.server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
      case 'get-tung-shing': {
        const {
          startDate,
          days,
          includeHours,
          tabooFilters = [],
        } = getTungShingParamsSchema.parse(request.params.arguments);
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
            if (!tabooFilters.length) {
              return {
                type: 'text',
                text: JSON.stringify(almanac),
              };
            }

            // 提取宜忌内容
            const recommends = (almanac.当日[ContentType.宜] as string[]) || [];
            const avoids = (almanac.当日[ContentType.忌] as string[]) || [];

            // 根据tabooFilters进行过滤，条件之间为或的关系
            const hasMatch = tabooFilters.some((filter) => {
              // 宜事项过滤
              if (filter.type === TabooType.宜) {
                return recommends.includes(filter.value);
              }
              // 忌事项过滤
              if (filter.type === TabooType.忌) {
                return avoids.includes(filter.value);
              }
              return false;
            });

            if (hasMatch) {
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

  mcpServer.server.setRequestHandler(ListPromptsRequestSchema, () => ({
    prompts: [
      {
        name: 'get-taboo',
        description: '获取宜忌事项类型',
      },
    ],
  }));

  mcpServer.server.setRequestHandler(GetPromptRequestSchema, (request) => {
    switch (request.params.name) {
      case 'get-taboo': {
        return {
          messages: [
            {
              role: 'assistant',
              content: {
                type: 'text',
                text: `宜忌事项类型清单\n${Taboo.NAMES.map((name) => `- ${name}`).join('\n')}`,
              },
            },
          ],
        };
      }
      default: {
        return {
          messages: [],
        };
      }
    }
  });

  return mcpServer;
}
