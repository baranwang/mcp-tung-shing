# Tung Shing MCP Server

中国传统黄历 MCP 服务 | Chinese Traditional Almanac MCP Service

<a href="https://glama.ai/mcp/servers/vylgy8vab2"><img width="380" height="200" src="https://glama.ai/mcp/servers/vylgy8vab2/badge" alt="mcp-tung-shing MCP server" /></a>

## 简介 | Introduction

这是一个基于 Model Context Protocol (MCP) 的中国传统黄历（通胜）计算服务。它能够提供日期、时辰的吉凶、宜忌等传统历法信息。

This is a Chinese Traditional Almanac (Tung Shing) calculation service based on Model Context Protocol (MCP). It provides traditional calendar information such as auspicious/inauspicious times, suitable/unsuitable activities for specific dates and hours.

## 功能特点 | Features

- 支持公历转农历日期 | Support conversion between Gregorian and Lunar calendar
- 提供每日吉凶宜忌 | Daily auspicious/inauspicious activities
- 十二时辰信息 | Twelve double-hour periods information
- 五行、神煞、星宿等详细信息 | Detailed information about Five Elements, Gods, Stars, etc.

## 使用方法 | Usage

### NPX 方式 | Using NPX

在你的 MCP 配置中添加以下内容：
Add the following to your MCP configuration:

```json
{
  "mcpServers": {
    "tung-shing": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-tung-shing"
      ]
    }
  }
}
```

### CLI 方式 | Using CLI

全局安装包：
Install the package globally:

```bash
npm install -g mcp-tung-shing
```

然后在 MCP 配置中添加：
Then add to your MCP configuration:

```json
{
  "mcpServers": {
    "tung-shing": {
      "command": "mcp-tung-shing"
    }
  }
}
```

## API 参数 | API Parameters

### get-tung-shing

获取指定日期的黄历信息 | Get almanac information for specified dates

- `startDate`: 开始日期，格式为 "YYYY-MM-DD" | Start date in "YYYY-MM-DD" format
- `days`: 获取天数，默认为 1 | Number of days to retrieve, defaults to 1
