#!/usr/bin/env node

import dayjs from 'dayjs';
import { PluginLunar } from 'dayjs-plugin-lunar';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server';

// 初始化日期插件
dayjs.extend(PluginLunar);

// 启动服务器
(async () => {
  try {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Tung Shing MCP server started');
  } catch (error) {
    console.error('Failed to start Tung Shing MCP server:', error);
    process.exit(1);
  }
})();
