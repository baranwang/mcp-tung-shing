import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { beforeAll, expect, test } from 'vitest';

const transport = new StdioClientTransport({
  command: "node",
  args: ["."]
});

const client = new Client({
  name: 'test-client',
  version: '0.0.0',
});

beforeAll(async () => {
  await client.connect(transport);
});

test('get-tung-shing', async () => {
  const resp = await client.callTool({
    name: 'get-tung-shing',
    arguments: {
      startDate: '2025-01-21'
    }
  })

  expect(resp.content).toBeInstanceOf(Array);
});
