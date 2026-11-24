# Jacky 个人网站

`site/` 是可以直接发布的静态目录。打开 `site/index.html` 即可浏览，也可在工程根目录运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory site
```

浏览器打开 http://127.0.0.1:8000/。首页与关于页在 `site/index.html` 和 `site/about.html`。共享样式在 `site/site.css`，首屏构图在 `site/hero.css`，猫眼和作品卡滚动在 `site/motion.js`。Paws 的设备图和 Motion Atlas 纸卡有独立样式，首页可直接操作。

首屏复用 Task 15 的「指向讲解」角色与已有灰蓝缅因猫。笔记和问候沿用「共看屏幕」和「打招呼」素材。Paws 使用本站原有的双设备概念插图。Motion OPS 使用 Motion Atlas「共享元素无缝展开」案例的原图与原理。[完整案例](https://motion.paws.rodeo/gallery/demos/first/cases/03.html)

Page Review 的示例支持网页元素与整页批注，展开区附扩展真实截图与区域录制。作品卡内的操作都在当前页面完成，各项目入口提供实际作品地址。
