const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * 通用截图生成脚本
 * 使用方法: node generate_screenshot.js <页面名称>
 * 例如: node generate_screenshot.js login
 *      node generate_screenshot.js home
 *      node generate_screenshot.js profile
 */

async function generateScreenshot(pageName) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // 设置视口为iPhone尺寸
    await page.setViewportSize({ width: 393, height: 852 });
    
    // 设置设备像素比
    await page.evaluate(() => {
        Object.defineProperty(window, 'devicePixelRatio', {
            get: () => 2
        });
    });
    
    // 构建文件路径
    const filePath = path.resolve(__dirname, 'html', `${pageName}.html`);
    const fileUrl = `file://${filePath}`;
    
    console.log(`正在加载页面: ${pageName}.html`);
    console.log(`文件路径: ${fileUrl}`);
    
    try {
        // 导航到目标页面
        await page.goto(fileUrl, { waitUntil: 'networkidle' });
        
        // 等待页面完全加载
        await page.waitForTimeout(2000);
        
        // 确保png目录存在
        const pngDir = path.join(__dirname, 'html', 'png');
        if (!fs.existsSync(pngDir)) {
            fs.mkdirSync(pngDir, { recursive: true });
            console.log('已创建png目录');
        }
        
        // 截图
        const screenshotPath = path.join(pngDir, `${pageName}.png`);
        await page.screenshot({ 
            path: screenshotPath,
            fullPage: false,
            type: 'png'
        });
        
        console.log(`✅ 截图已保存到: ${screenshotPath}`);
        
        // 显示文件信息
        const stats = fs.statSync(screenshotPath);
        const fileSizeKB = Math.round(stats.size / 1024);
        console.log(`📁 文件大小: ${fileSizeKB}KB`);
        
    } catch (error) {
        console.error('❌ 截图生成失败:', error.message);
        console.log('💡 请检查页面名称是否正确，确保HTML文件存在');
    } finally {
        await browser.close();
    }
}

// 获取命令行参数
const pageName = process.argv[2];

if (!pageName) {
    console.log('📱 通用截图生成工具');
    console.log('');
    console.log('使用方法:');
    console.log('  node generate_screenshot.js <页面名称>');
    console.log('');
    console.log('示例:');
    console.log('  node generate_screenshot.js login     # 生成login.html的截图');
    console.log('  node generate_screenshot.js home      # 生成home.html的截图');
    console.log('  node generate_screenshot.js profile   # 生成profile.html的截图');
    console.log('  node generate_screenshot.js splash    # 生成splash.html的截图');
    console.log('');
    console.log('可用的页面:');
    
    // 列出html目录下的所有HTML文件
    const htmlDir = path.join(__dirname, 'html');
    if (fs.existsSync(htmlDir)) {
        const files = fs.readdirSync(htmlDir)
            .filter(file => file.endsWith('.html'))
            .map(file => file.replace('.html', ''))
            .sort();
        
        files.forEach(file => {
            console.log(`  - ${file}`);
        });
    }
    
    process.exit(1);
}

// 检查文件是否存在
const filePath = path.resolve(__dirname, 'html', `${pageName}.html`);
if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在: ${pageName}.html`);
    console.log('💡 请检查页面名称是否正确');
    process.exit(1);
}

// 生成截图
generateScreenshot(pageName).catch(console.error);
