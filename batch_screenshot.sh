#!/bin/bash

# 截图批量生成脚本
# 使用方法: ./batch_screenshot.sh

echo "📱 开始批量生成截图..."

# 定义要生成截图的页面列表
pages=(
    "splash"           # 启动页
    "login"            # 登录页
    "home"             # 首页
    "profile"          # 个人资料
    "settings"         # 设置
    "chat"             # 聊天
    "moments"          # 动态
    "buddy-matching"   # 伙伴匹配
    "offline-activity-list"      # 线下活动列表
    "publish-buddy-activity"     # 发布伙伴活动
    "my-favorites"     # 我的收藏
    "liked-me"         # 喜欢我的人
    "followers"        # 关注者
    "verification"     # 验证
    "payment"          # 支付
    "vip"              # VIP页面
)

# 统计信息
total=${#pages[@]}
success=0
failed=0

echo "📊 总共需要生成 $total 个页面截图"
echo ""

# 遍历页面列表
for page in "${pages[@]}"; do
    echo "🔄 正在生成 $page 页面截图..."
    
    # 检查文件是否存在
    if [ ! -f "html/$page.html" ]; then
        echo "❌ 文件不存在: html/$page.html"
        ((failed++))
        continue
    fi
    
    # 生成截图
    if node generate_screenshot.js "$page" > /dev/null 2>&1; then
        echo "✅ $page 截图生成成功"
        ((success++))
    else
        echo "❌ $page 截图生成失败"
        ((failed++))
    fi
    
    echo ""
done

# 输出统计结果
echo "📈 批量生成完成！"
echo "✅ 成功: $success 个"
echo "❌ 失败: $failed 个"
echo "📊 总计: $total 个"

# 显示生成的截图文件
echo ""
echo "📁 生成的截图文件："
ls -la html/png/*.png 2>/dev/null | awk '{print "  " $9 " (" $5 " bytes)"}'

echo ""
echo "🎉 批量截图任务完成！"
