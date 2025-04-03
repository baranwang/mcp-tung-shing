# Tung Shing MCP Server

[![NPM Version](https://img.shields.io/npm/v/mcp-tung-shing.svg)](https://www.npmjs.com/package/mcp-tung-shing)
[![License](https://img.shields.io/npm/l/mcp-tung-shing.svg)](https://github.com/username/mcp-tung-shing/blob/main/LICENSE)

[中文文档](./README.md) | English

> Chinese Traditional Almanac calculation service based on Model Context Protocol (MCP)

## ✨ Features

- 📅 **Calendar Conversion** - Convert between Gregorian and Chinese lunar calendar
- 🍀 **Daily Guidance** - Detailed information on auspicious and inauspicious activities for each day
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

## 📖 API Documentation

### get-tung-shing

Get almanac information for specified date(s)

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `startDate` | String | Yes | - | Start date, format: "YYYY-MM-DD" |
| `days` | Number | No | 1 | Number of days to retrieve |

## 🤝 Contributing

Issues and Pull Requests are welcome to improve this project.
