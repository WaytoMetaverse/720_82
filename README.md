# 环景导览系统

一个基于Web的全景图导览系统，支持在GitHub Pages上直接预览。可以通过点击ID图上的色块区域来实现空间切换和家具互动。

## 🌟 功能特点

- ✨ **全景图浏览**：支持拖拽查看360度环景
- 🎯 **智能点击检测**：通过ID图色块精确识别可互动物件
- 🏠 **多空间切换**：在不同房间之间自由切换
- 🛋️ **家具变体**：点击家具可切换不同款式
- 💫 **高光效果**：鼠标悬停时自动高亮可点击区域
- 📱 **响应式设计**：支持桌面和移动设备

## 🚀 在线演示

访问以下链接查看在线演示：
```
https://你的用户名.github.io/你的仓库名/
```

## 📦 项目结构

```
720_82/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # JavaScript逻辑
├── README.md           # 说明文档
└── IMAGES_GUIDE.md     # 图片准备指南
```

## 🎨 色块ID系统

系统使用ID图（ID Map）来识别可点击区域。每个可互动物件在ID图上用特定颜色标记：

### 客餐厅（空间色：粉红色 #FFC0CB）
- 🟢 沙发：绿色 `#00FF00` (RGB: 0, 255, 0)
- 🔴 茶几：红色 `#FF0000` (RGB: 255, 0, 0)

### 主卧室（空间色：黄色 #FFFF00）
- 🟢 床：绿色 `#00FF00` (RGB: 0, 255, 0)
- 🔴 衣柜：红色 `#FF0000` (RGB: 255, 0, 0)

### 次卧室（空间色：蓝色 #0000FF）
- 🟢 书桌：绿色 `#00FF00` (RGB: 0, 255, 0)
- 🔴 椅子：红色 `#FF0000` (RGB: 255, 0, 0)

## 🛠️ 使用方法

### 1. 克隆项目

```bash
git clone https://github.com/你的用户名/你的仓库名.git
cd 你的仓库名
```

### 2. 准备图片资源

目前系统使用程序生成的示例图片。要使用真实的全景图片：

1. 准备全景图（建议尺寸：2048x1024 或更高）
2. 准备对应的ID图（与全景图相同尺寸）
3. 修改 `script.js` 中的 `createExampleImages()` 方法，改为加载真实图片

参考 `IMAGES_GUIDE.md` 了解如何准备图片。

### 3. 本地测试

使用任何HTTP服务器打开 `index.html`：

```bash
# Python 3
python -m http.server 8000

# Node.js (需要安装 http-server)
npx http-server
```

然后访问 `http://localhost:8000`

### 4. 部署到GitHub Pages

1. 进入GitHub仓库的Settings
2. 找到Pages选项
3. 在Source中选择主分支
4. 保存后等待几分钟
5. 访问 `https://你的用户名.github.io/你的仓库名/`

## 💻 技术实现

### ID图检测原理

1. **双Canvas系统**：
   - 显示Canvas：展示全景图和高光效果
   - ID Canvas：隐藏的检测层，存储ID图

2. **颜色映射**：
   - 鼠标位置 → Canvas坐标 → ID图坐标
   - 读取像素RGB值 → 匹配物件配置
   - 找到对应物件 → 触发互动

3. **高光渲染**：
   - 遍历ID图像素
   - 匹配当前悬停物件的RGB值
   - 在对应位置绘制半透明黄色覆盖层

### 核心功能

```javascript
// 检测鼠标位置的物件
getObjectAtPosition(x, y) {
    // 坐标转换
    const panoramaX = Math.floor(x * scaleX);
    const panoramaY = Math.floor(y * scaleY);
    
    // 获取像素颜色
    const imageData = this.idCtx.getImageData(...);
    const [r, g, b] = [imageData.data[index], ...];
    
    // 匹配物件
    return objects.find(obj => 
        obj.rgb[0] === r && obj.rgb[1] === g && obj.rgb[2] === b
    );
}
```

## 🎯 自定义配置

在 `script.js` 中修改 `config` 对象来自定义：

```javascript
this.config = {
    living: {
        name: '客餐厅',
        color: '#FFC0CB',
        objects: [
            { 
                id: 'sofa', 
                name: '沙发', 
                color: '#00FF00', 
                rgb: [0, 255, 0], 
                variants: ['sofa1', 'sofa2', 'sofa3'] 
            }
            // 添加更多物件...
        ]
    }
    // 添加更多空间...
}
```

## 📝 图片要求

### 全景图（Panorama）
- 格式：JPG/PNG
- 尺寸：2048x1024（2:1比例）
- 类型：等矩形投影（Equirectangular）

### ID图（ID Map）
- 格式：PNG（无压缩）
- 尺寸：与全景图完全相同
- 要求：使用纯色填充可点击区域（RGB值必须精确）

### 色彩规范
⚠️ **重要**：ID图必须使用精确的RGB值，不能有任何压缩或抗锯齿！

推荐工具：
- Photoshop（关闭抗锯齿）
- GIMP（铅笔工具）
- 程序生成

## 🐛 常见问题

### 1. 点击检测不准确
- 确认ID图与全景图尺寸完全一致
- 检查RGB值是否精确匹配配置
- 确认PNG没有被压缩

### 2. 高光位置偏移
- 检查Canvas缩放计算
- 确认坐标转换公式正确

### 3. 移动端拖动不流畅
- 已添加 `touch` 事件支持
- 可以调整拖动灵敏度

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📮 联系方式

如有问题请在GitHub上提Issue。

---

**享受你的环景导览之旅！** 🎉

