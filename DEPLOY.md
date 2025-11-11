# 快速部署指南

## 🚀 部署到GitHub Pages

### 步骤1：上传到GitHub

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 环景导览系统"

# 添加远程仓库（替换成你的GitHub仓库地址）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送到GitHub
git push -u origin main
```

### 步骤2：启用GitHub Pages

1. 访问你的GitHub仓库页面
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Pages**
4. 在 **Source** (来源) 下拉菜单中选择：
   - Branch: `main`
   - Folder: `/ (root)`
5. 点击 **Save** (保存)
6. 等待1-2分钟，页面会显示你的网站地址：
   ```
   https://你的用户名.github.io/你的仓库名/
   ```

### 步骤3：访问网站

在浏览器中打开上面的地址，就可以看到你的环景导览系统了！

## 📝 更新网站

每次修改文件后，推送到GitHub即可自动更新：

```bash
git add .
git commit -m "更新描述"
git push
```

等待1-2分钟，网站会自动更新。

## 🎯 添加自定义域名（可选）

如果你有自己的域名：

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容写入你的域名，如：`www.yourdomain.com`
3. 在域名服务商处添加CNAME记录，指向 `你的用户名.github.io`
4. 推送到GitHub
5. 在GitHub Pages设置中输入自定义域名并保存

## 🔧 本地测试

在推送到GitHub之前，建议先本地测试：

### 使用Python（推荐）
```bash
python -m http.server 8000
```
然后访问 http://localhost:8000

### 使用Node.js
```bash
npx http-server -p 8000
```
然后访问 http://localhost:8000

### 使用VS Code
安装 "Live Server" 扩展，右键点击 `index.html` 选择 "Open with Live Server"

## 📦 添加真实图片

1. 创建 `assets` 文件夹结构：
```
assets/
├── panoramas/
│   ├── living_default.jpg
│   ├── living_sofa1.jpg
│   └── ...
└── idmaps/
    ├── living_default.png
    ├── living_sofa1.png
    └── ...
```

2. 修改 `script.js` 中的 `createExampleImages()` 方法，改为加载真实图片：

```javascript
async loadRealImages() {
    for (let spaceKey in this.config) {
        const space = this.config[spaceKey];
        
        // 加载全景图
        const panorama = new Image();
        panorama.src = `assets/panoramas/${spaceKey}_default.jpg`;
        await panorama.decode();
        space.panorama = panorama;
        
        // 加载ID图
        const idMap = new Image();
        idMap.src = `assets/idmaps/${spaceKey}_default.png`;
        await idMap.decode();
        space.idMap = idMap;
    }
}
```

3. 在 `init()` 方法中调用：
```javascript
async init() {
    await this.loadRealImages(); // 替换 createExampleImages()
    // ...
}
```

## 🐛 故障排除

### 网站显示404
- 确认已启用GitHub Pages
- 确认分支选择正确（main或master）
- 等待几分钟让部署完成

### 图片不显示
- 检查图片路径是否正确
- 确认图片文件已上传到仓库
- 检查浏览器控制台的错误信息

### 点击检测不工作
- 确认ID图格式为PNG
- 确认RGB值完全精确
- 查看 `IMAGES_GUIDE.md` 了解详细说明

## 📞 获取帮助

遇到问题？
1. 查看 `README.md`
2. 查看 `IMAGES_GUIDE.md`
3. 在GitHub仓库提交Issue

---

祝部署顺利！🎉

