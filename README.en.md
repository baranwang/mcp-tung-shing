# Tung Shing MCP Server

[![smithery badge](https://smithery.ai/badge/@baranwang/mcp-tung-shing)](https://smithery.ai/server/@baranwang/mcp-tung-shing)
[![NPM Version](https://img.shields.io/npm/v/mcp-tung-shing.svg)](https://www.npmjs.com/package/mcp-tung-shing)
[![License](https://img.shields.io/npm/l/mcp-tung-shing.svg)](https://github.com/baranwang/mcp-tung-shing/blob/main/LICENSE)

[中文文档](./README.md) | English

> Chinese Traditional Almanac calculation service based on Model Context Protocol (MCP)

## ✨ Features

- 📅 **Calendar Conversion** - Convert between Gregorian and Chinese lunar calendar
- 🍀 **Daily Guidance** - Detailed information on recommended and avoided activities for each day
- 🕐 **Time Periods** - Fortune information for the twelve traditional Chinese time periods
- 🔮 **Metaphysical Elements** - Detailed data on five elements, deities, star constellations and other traditional metaphysical information

## 🚀 Installation & Usage

Add the following to your MCP configuration file:

```json
{
  "mcpServers": {
    "tung-shing": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-tung-shing@latest"
      ]
    }
  }
}
```

## ⚙️ Tools

### get-tung-shing

Get almanac information for specified date(s)

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `startDate` | String | No | Today | Start date, format: "YYYY-MM-DD" |
| `days` | Number | No | 1 | Number of days to retrieve |
| `includeHours` | Boolean | No | false | Whether to include hourly information |
| `tabooFilters` | Array | No | - | Filter for recommended and avoided activities, conditions are in OR relationship |
| `tabooFilters[].type` | 1 \| 2 | Yes | - | Filter type: recommends(1), avoids(2) |
| `tabooFilters[].value` | String | Yes | - | The activity to filter |

## 🤝 Contributing

Issues and Pull Requests are welcome to improve this project.
