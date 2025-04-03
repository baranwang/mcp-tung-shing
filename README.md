# 通胜 MCP 服务

[![smithery badge](https://smithery.ai/badge/@baranwang/mcp-tung-shing)](https://smithery.ai/server/@baranwang/mcp-tung-shing)
[![NPM Version](https://img.shields.io/npm/v/mcp-tung-shing.svg)](https://www.npmjs.com/package/mcp-tung-shing)
[![License](https://img.shields.io/npm/l/mcp-tung-shing.svg)](https://github.com/baranwang/mcp-tung-shing/blob/main/LICENSE)

简体中文 | [English](./README.en.md)

> 中国传统黄历（通胜）计算服务，基于 Model Context Protocol (MCP)

## ✨ 功能特点

- 📅 **公历农历转换** - 支持公历与农历日期的相互转换
- 🍀 **每日宜忌** - 提供每日吉凶、宜忌活动的详细信息
- 🕐 **时辰信息** - 十二时辰（子、丑、寅等）的吉凶宜忌
- 🔮 **命理元素** - 五行、神煞、星宿等传统命理学详细数据

## 🚀 安装与使用

在你的 MCP 配置文件中添加以下内容：

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

## 📖 API 文档

### get-tung-shing

获取指定日期的黄历信息

**参数:**

| 参数名 | 类型 | 必填 | 默认值 | 描述 |
|--------|------|------|--------|------|
| `startDate` | String | 是 | - | 开始日期，格式："YYYY-MM-DD" |
| `days` | Number | 否 | 1 | 获取天数 |

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests 来完善此项目。
