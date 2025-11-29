document.addEventListener('DOMContentLoaded', function() {
    // 获取当前页面的文件名
    const currentPage = window.location.pathname.split('/').pop();

    // 获取所有的导航按钮
    const navButtons = document.querySelectorAll('.nav-button');

    // 遍历按钮，设置 active 状态
    navButtons.forEach(button => {
        const buttonPage = button.dataset.page;
        if (buttonPage === currentPage) {
            button.classList.add('active');
            button.classList.remove('text-gray-600', 'opacity-70');
            button.classList.add('text-purple-600');
        } else {
            button.classList.remove('active', 'text-purple-600');
            button.classList.add('text-gray-600', 'opacity-70');
        }

        // 添加点击事件监听
        button.addEventListener('click', () => {
            if (window.parent && window.parent !== window) {
                // 如果在 iframe 中，通过 postMessage 通知父页面
                window.parent.postMessage({
                    type: 'navigation',
                    page: buttonPage
                }, '*');
            } else {
                // 否则直接跳转
                window.location.href = buttonPage;
            }
        });
    });
});
