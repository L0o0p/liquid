// 这里可以添加一些交互逻辑，比如点击图标的响应事件
const icons = document.querySelectorAll('.icon');
icons.forEach((icon) => {
    icon.addEventListener('click', function () {
        console.log('图标被点击了');
        // 在这里添加具体的点击处理逻辑，比如跳转到对应页面等
    });
});