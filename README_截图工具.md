# 📱 Friends App 截图工具

一个基于 Playwright 的自动化截图工具，用于生成移动端页面的高质量截图。

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install playwright
npx playwright install chromium
```

### 2. 生成截图
```bash
# 生成单个页面截图
node generate_screenshot.js home

# 批量生成所有主要页面
./batch_screenshot.sh
```

## 📁 文件结构

```
Friends/
├── generate_screenshot.js          # 主截图脚本
├── batch_screenshot.sh            # 批量生成脚本
├── html/                          # HTML页面目录
│   ├── png/                       # 截图输出目录
│   │   ├── home.png
│   │   ├── login.png
│   │   └── ...
│   ├── home.html
│   ├── login.html
│   └── ...
└── docs/                          # 文档目录
    ├── 截图功能开发指南和使用.md
    └── 截图工具快速使用指南.md
```

## 📖 文档

- **[快速使用指南](docs/截图工具快速使用指南.md)** - 快速上手
- **[详细开发指南](docs/截图功能开发指南和使用.md)** - 完整技术文档

## 🛠️ 使用方法

### 单个页面截图
```bash
node generate_screenshot.js <页面名称>

# 示例
node generate_screenshot.js home
node generate_screenshot.js login
node generate_screenshot.js profile
```

### 批量生成
```bash
# 运行批量生成脚本
./batch_screenshot.sh
```

### 查看帮助
```bash
# 显示所有可用页面
node generate_screenshot.js
```

## 📱 输出规格

- **尺寸**: 393×852px (iPhone 12 Pro)
- **分辨率**: 2x (高清)
- **格式**: PNG
- **输出目录**: `html/png/`

## 🎯 主要特性

- ✅ 支持所有HTML页面自动截图
- ✅ 移动端尺寸优化
- ✅ 智能错误处理
- ✅ 批量生成支持
- ✅ 详细进度提示
- ✅ 自动目录创建

## 📋 可用页面

运行 `node generate_screenshot.js` 查看完整页面列表，包括：

- `home` - 首页
- `login` - 登录页
- `profile` - 个人资料
- `splash` - 启动页
- `settings` - 设置
- `chat` - 聊天
- `moments` - 动态
- `buddy-matching` - 伙伴匹配
- `offline-activity-list` - 线下活动列表
- `publish-buddy-activity` - 发布伙伴活动
- 更多...

## ❓ 常见问题

**Q: 截图模糊？**
A: 脚本已自动设置2x设备像素比，确保高清输出。

**Q: 页面加载不完整？**
A: 脚本会等待网络空闲，如有问题可增加等待时间。

**Q: 找不到页面？**
A: 确保HTML文件在 `html/` 目录下，文件名与参数一致。

## 🔧 技术栈

- **Node.js** - 运行环境
- **Playwright** - 浏览器自动化
- **Chromium** - 浏览器引擎

## 📊 性能

- 单个页面截图：约2-3秒
- 批量生成17个页面：约1-2分钟
- 输出文件大小：50-300KB/张

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个工具！

## 📄 许可证

MIT License

---

**💡 提示**: 首次使用需要安装 Playwright 浏览器，可能需要几分钟时间。
