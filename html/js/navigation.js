// 导航和交互功能
class NavigationManager {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupBottomNavigation();
        this.setupPageInteractions();
        this.setupMockData();
    }

    // 底部导航栏功能
    setupBottomNavigation() {
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = button.dataset.page;
                if (targetPage) {
                    this.navigateToPage(targetPage);
                }
            });
        });
    }

    // 页面导航
    navigateToPage(pageName) {
        const pages = {
            'home': 'home.html',
            'chat': 'chat.html', 
            'moments': 'moments.html',
            'profile': 'profile.html'
        };

        if (pages[pageName]) {
            window.location.href = pages[pageName];
        }
    }

    // 设置页面交互
    setupPageInteractions() {
        // 匹配操作按钮
        this.setupMatchingActions();
        // 聊天列表交互
        this.setupChatInteractions();
        // 动态广场交互
        this.setupMomentsInteractions();
        // 个人中心交互
        this.setupProfileInteractions();
    }

    // 匹配操作功能
    setupMatchingActions() {
        // 喜欢按钮
        const likeBtn = document.querySelector('.like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                this.handleLike();
            });
        }

        // 跳过按钮
        const passBtn = document.querySelector('.pass-btn');
        if (passBtn) {
            passBtn.addEventListener('click', () => {
                this.handlePass();
            });
        }

        // 超级喜欢按钮
        const superLikeBtn = document.querySelector('.super-like-btn');
        if (superLikeBtn) {
            superLikeBtn.addEventListener('click', () => {
                this.handleSuperLike();
            });
        }
    }

    // 处理喜欢操作
    handleLike() {
        this.showToast('已喜欢！');
        this.updateMatchCount();
        this.loadNextProfile();
    }

    // 处理跳过操作
    handlePass() {
        this.showToast('已跳过');
        this.loadNextProfile();
    }

    // 处理超级喜欢操作
    handleSuperLike() {
        this.showToast('超级喜欢已发送！');
        this.updateMatchCount();
        this.loadNextProfile();
    }

    // 聊天列表交互
    setupChatInteractions() {
        const chatItems = document.querySelectorAll('.chat-item');
        chatItems.forEach(item => {
            item.addEventListener('click', () => {
                const chatId = item.dataset.chatId;
                if (chatId) {
                    window.location.href = `chat-detail.html?id=${chatId}`;
                }
            });
        });
    }

    // 动态广场交互
    setupMomentsInteractions() {
        // 点赞功能
        const likeButtons = document.querySelectorAll('.like-btn');
        likeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLike(btn);
            });
        });

        // 发布动态按钮
        const publishBtn = document.querySelector('.publish-btn');
        if (publishBtn) {
            publishBtn.addEventListener('click', () => {
                window.location.href = 'publish-moment.html';
            });
        }
    }

    // 个人中心交互
    setupProfileInteractions() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                if (action) {
                    this.handleProfileAction(action);
                }
            });
        });
    }

    // 处理个人中心操作
    handleProfileAction(action) {
        const actions = {
            'edit-profile': () => window.location.href = 'edit-profile.html',
            'vip-center': () => window.location.href = 'vip.html',
            'liked-me': () => window.location.href = 'liked-me.html',
            'my-favorites': () => window.location.href = 'favorites.html',
            'settings': () => window.location.href = 'settings.html',
            'privacy': () => window.location.href = 'privacy.html',
            'notifications': () => window.location.href = 'notifications.html',
            'help': () => window.location.href = 'help.html'
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    // 切换点赞状态
    toggleLike(button) {
        const icon = button.querySelector('i');
        const countSpan = button.querySelector('span');
        let count = parseInt(countSpan.textContent);

        if (button.classList.contains('liked')) {
            button.classList.remove('liked');
            icon.classList.remove('fas');
            icon.classList.add('far');
            count--;
        } else {
            button.classList.add('liked');
            icon.classList.remove('far');
            icon.classList.add('fas');
            count++;
        }

        countSpan.textContent = count;
    }

    // 更新匹配次数
    updateMatchCount() {
        const matchCountElement = document.querySelector('.match-count');
        if (matchCountElement) {
            const currentCount = parseInt(matchCountElement.textContent.split('/')[0]);
            const newCount = Math.max(0, currentCount - 1);
            matchCountElement.textContent = `今日剩余匹配次数: ${newCount}/3`;
        }
    }

    // 加载下一个用户资料
    loadNextProfile() {
        // 模拟加载下一个用户
        setTimeout(() => {
            this.showToast('正在加载下一个用户...');
            // 这里可以添加加载新用户资料的逻辑
        }, 1000);
    }

    // 显示提示消息
    showToast(message, type = 'info') {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = `fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-white text-sm font-medium z-50 transition-all duration-300`;
        
        // 根据类型设置样式
        const styles = {
            'info': 'bg-blue-500',
            'success': 'bg-green-500',
            'error': 'bg-red-500',
            'warning': 'bg-yellow-500'
        };
        
        toast.className += ` ${styles[type] || styles['info']}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, 0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, -20px)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    // 设置模拟数据
    setupMockData() {
        // 模拟用户数据
        this.mockUsers = [
            {
                id: 1,
                name: '李明',
                age: 28,
                distance: '2.3km',
                height: '175cm',
                education: '本科',
                job: '设计师',
                tags: ['摄影', '旅行'],
                photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face'],
                description: '热爱生活，喜欢摄影和旅行。希望能找到一个志同道合的人，一起探索这个世界的美好。'
            },
            {
                id: 2,
                name: '小雨',
                age: 25,
                distance: '1.2km',
                height: '165cm',
                education: '硕士',
                job: '产品经理',
                tags: ['美食', '电影'],
                photos: ['https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face'],
                description: '喜欢尝试新事物，热爱美食和电影。希望能遇到有趣的人。'
            }
        ];

        // 模拟聊天数据
        this.mockChats = [
            {
                id: 1,
                name: '小雨',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
                lastMessage: '你好，很高兴认识你！',
                time: '刚刚',
                unread: 2,
                online: true
            },
            {
                id: 2,
                name: '李明',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
                lastMessage: '周末有空一起去看电影吗？',
                time: '5分钟前',
                unread: 0,
                online: false
            }
        ];

        // 模拟动态数据
        this.mockMoments = [
            {
                id: 1,
                user: '小雨',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
                time: '2小时前',
                distance: '1.2km',
                content: '今天的夕阳特别美，分享给大家～希望每个人都能找到属于自己的那份美好 ✨',
                images: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop',
                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop'
                ],
                likes: 12,
                comments: 3,
                liked: false
            }
        ];
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
});
