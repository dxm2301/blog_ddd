---
title: recording-blog 
date: 2024-04-16 22:53:08
categories:
- Note
tags:
- dxm_recording
---

<div style="text-align: center; font-size: 30px; font-weight: bold; font-family: 'Courier New', Courier, monospace; color: lightseagreen;">
    TECH OTAKUS SAVE THE WORLD
</div>

![001_wp](001_wp.png)
## 2024
### 04
#### 24.04.16：创建blog
> Welcome to [Hexo](https://hexo.io/)! This is your very first post. Check [documentation](https://hexo.io/docs/) for more info. If you get any problems when using Hexo, you can find the answer in [troubleshooting](https://hexo.io/docs/troubleshooting.html) or you can ask me on [GitHub](https://github.com/hexojs/hexo/issues).

```bash
hexo new post -p path/to/file/    # 在source/_posts/目录下创建同名文件/夹
hexo generate                     # Generate static files
hexo server                       # Run server
hexo deploy                       # Deploy to remote sites
```

- More info: <a href="https://hexo.io/docs/generating.html">Generating</a>
- More info: [Server](https://hexo.io/docs/server.html)
- More info: [Deployment](https://hexo.io/docs/one-command-deployment.html)

```bash
# 添加超链接的两种方式
More info: <a href="https://hexo.io/docs/generating.html">Generating</a>
More info: [Server](https://hexo.io/docs/server.html)
```

#### 24.04.17：hexo显示图片
> <a href="https://zhuanlan.zhihu.com/p/645679541">网页显示图片教程</a>
```bash
post_asset_folder: true
marked:
  prependRoot: true
  postAsset: true
```

#### 24.04.18：表格美化
```bash
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Styled Table</title>
<link rel="stylesheet" href="styles.css">
<style>
    .custom-table {
        width: 100%;
        border-collapse: collapse;
    }
    .custom-table th, .custom-table td {
        padding: 8px;
        text-align: center;
        border-bottom: 1px solid #ddd;
    }
    .custom-table tr:nth-child(even) {
        background-color: #f2f2f2;
    }
    .custom-table tr:hover {
        background-color: #f5f5f5;
    }
    .custom-table thead {
        position: sticky;
        top: 0;
        background-color: #808080;
        color: white;
    }
    .custom-table thead tr:hover {
        background-color: #a9a9a9;
        color: black;
    }
    .custom-table, .custom-table th, .custom-table td {
        border: 1px solid black;
    }
</style>
</head>
<body>
<!-- 你的HTML内容将在这里，比如具体的表格数据 -->
</body>
</html>
```

#### 24.04.19：新增resume

