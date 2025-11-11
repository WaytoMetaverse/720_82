# 项目结构说明

## 📁 目录结构

```
720_82/                          # 项目根目录
│
├── 📄 index.html                # 主HTML文件 - 页面结构
├── 🎨 style.css                 # 样式文件 - 所有视觉样式
├── ⚙️ script.js                 # JavaScript主程序 - 核心逻辑
│
├── 📖 README.md                 # 项目说明文档
├── 🚀 QUICKSTART.md             # 快速开始指南（从这里开始！）
├── 🎨 IMAGES_GUIDE.md           # 图片制作详细指南
├── 🚀 DEPLOY.md                 # 部署说明
├── ⚙️ config.example.js         # 配置示例文件
├── 📋 PROJECT_STRUCTURE.md      # 本文件 - 项目结构说明
│
├── 🙈 .gitignore                # Git忽略文件配置
│
└── 📁 panorama/                 # 全景图片资源文件夹
    ├── 客餐廳_A沙發_A茶几.jpg
    ├── 客餐廳_A沙發_A茶几_ID.jpg
    ├── 客餐廳_A沙發_B茶几.jpg
    ├── 客餐廳_A沙發_B茶几_ID.jpg
    ├── 客餐廳_A沙發_C茶几.jpg
    ├── 客餐廳_A沙發_C茶几_ID.jpg
    ├── 客餐廳_B沙發_A茶几.jpg
    ├── 客餐廳_B沙發_A茶几_ID.jpg
    ├── 客餐廳_B沙發_B茶几.jpg
    ├── 客餐廳_B沙發_B茶几_ID.jpg
    ├── 客餐廳_B沙發_C茶几.jpg
    ├── 客餐廳_B沙發_C茶几_ID.jpg
    ├── 客餐廳_C沙發_A茶几.jpg
    ├── 客餐廳_C沙發_A茶几_ID.jpg
    ├── 客餐廳_C沙發_B茶几.jpg
    ├── 客餐廳_C沙發_B茶几_ID.jpg
    ├── 客餐廳_C沙發_C茶几.jpg
    ├── 客餐廳_C沙發_C茶几_ID.jpg
    ├── 主臥室.jpg
    ├── 主臥室_ID.jpg
    ├── 次臥室.jpg
    └── 次臥室_ID.jpg
```

## 📄 核心文件说明

### 1. index.html
**作用**：页面结构和布局

**主要内容**：
- 导航栏（空间切换按钮）
- Canvas画布（全景图显示）
- 工具提示（tooltip）
- 控制面板（物件列表）
- 信息面板（使用说明）

**修改场景**：
- 添加新的UI元素
- 修改页面布局
- 添加新的空间按钮

### 2. style.css
**作用**：所有视觉样式和动画效果

**主要样式**：
- 渐变背景和卡片样式
- 按钮样式和悬停效果
- Canvas容器和控制面板
- 高光动画效果
- 响应式设计（移动端适配）

**修改场景**：
- 改变颜色主题
- 调整布局间距
- 修改动画效果
- 适配不同屏幕尺寸

### 3. script.js
**作用**：核心交互逻辑

**主要功能模块**：

#### 📦 PanoramaViewer 类
主控制器类，管理整个系统

**属性**：
- `panoramaCanvas` - 显示画布
- `idCanvas` - ID检测画布（隐藏）
- `currentSpace` - 当前空间
- `config` - 空间配置数据

**核心方法**：

```javascript
// 初始化
init()                          // 系统初始化
loadRealImages()                // 加载真实图片
loadSpaceImages()               // 加载单个空间的图片

// Canvas相关
resizeCanvas()                  // 调整Canvas尺寸
render()                        // 渲染全景图

// 事件处理
onMouseDown()                   // 鼠标按下（开始拖动）
onMouseMove()                   // 鼠标移动（拖动/悬停）
onMouseUp()                     // 鼠标释放（结束拖动）
onClick()                       // 鼠标点击（切换物件）

// 交互逻辑
getObjectAtPosition()           // 检测鼠标位置的物件
checkHover()                    // 检查悬停状态
cycleObjectVariant()            // 切换物件变体
reloadCurrentSpace()            // 重新加载场景

// UI更新
updateTooltip()                 // 更新提示框
drawHighlight()                 // 绘制高光效果
renderObjectsList()             // 渲染物件列表
switchSpace()                   // 切换空间
```

**修改场景**：
- 添加新空间
- 添加新物件
- 修改交互逻辑
- 调整检测算法

## 🎨 资源文件说明

### panorama/ 文件夹

包含所有全景图和ID图资源。

**命名规范**：
- 全景图：`空间名_变体信息.jpg`
- ID图：`空间名_变体信息_ID.jpg`

**示例**：
- `客餐廳_A沙發_A茶几.jpg` - 客餐厅，A款沙发，A款茶几的全景图
- `客餐廳_A沙發_A茶几_ID.jpg` - 对应的ID检测图

**ID图要求**：
- 格式：PNG（建议）或JPG（需确保无压缩）
- 尺寸：必须与全景图完全相同
- 颜色：使用精确的RGB值标记物件
  - 绿色 `(0, 255, 0)` - 沙发
  - 红色 `(255, 0, 0)` - 茶几
  - 黑色 `(0, 0, 0)` - 背景（不可点击）

## 📖 文档文件说明

### README.md
- 完整的项目文档
- 功能特点说明
- 技术实现细节
- 配置方法

### QUICKSTART.md ⭐
- **推荐新手从这里开始**
- 5分钟快速上手指南
- 基本使用说明
- 常见问题解答

### IMAGES_GUIDE.md
- 详细的图片制作指南
- Photoshop/GIMP教程
- 色彩规范说明
- Python脚本生成方法

### DEPLOY.md
- GitHub Pages部署步骤
- 本地测试方法
- 自定义域名配置

### config.example.js
- 完整的配置示例
- 各种场景的配置方法
- 颜色参考表
- 高级配置示例

## 🔧 技术架构

### 前端技术栈
- **HTML5** - 语义化标记
- **CSS3** - 现代样式和动画
- **Vanilla JavaScript (ES6+)** - 纯JS，无依赖框架
- **Canvas API** - 图像渲染和检测

### 核心技术

#### 1. 双Canvas系统
```
显示层 (panoramaCanvas)          检测层 (idCanvas)
    ↓                                ↓
[用户可见的全景图]              [隐藏的ID色块图]
    ↓                                ↓
渲染美观的场景                  检测点击位置
```

#### 2. 色块检测原理
```
用户点击 → 获取坐标 → 转换到ID图坐标 
    ↓
读取该位置的RGB值
    ↓
匹配配置中的物件颜色
    ↓
触发对应的交互动作
```

#### 3. 场景切换流程
```
点击物件 → 确定新的变体组合
    ↓
构建新的文件名
    ↓
异步加载新图片
    ↓
更新Canvas和UI
```

## 🎯 数据流

```
用户操作
    ↓
事件处理器 (onMouseMove, onClick等)
    ↓
业务逻辑 (getObjectAtPosition, cycleObjectVariant等)
    ↓
状态更新 (config, currentSpace, currentVariant等)
    ↓
视图渲染 (render, renderObjectsList等)
    ↓
显示更新
```

## 🔄 扩展指南

### 添加新空间

1. **准备图片**
   - 全景图：`新空间名.jpg`
   - ID图：`新空间名_ID.jpg`
   - 放入 `panorama/` 文件夹

2. **修改 script.js**
   ```javascript
   this.config = {
       // ... 现有配置
       newSpace: {
           name: '新空间名',
           color: '#颜色',
           panorama: null,
           idMap: null,
           objects: [
               // 物件配置
           ]
       }
   }
   ```

3. **修改 index.html**
   ```html
   <button class="space-btn" data-space="newSpace">新空间名</button>
   ```

4. **修改 loadRealImages()**
   ```javascript
   await this.loadSpaceImages('newSpace', '新空间名');
   ```

### 添加新物件

1. **在ID图上标记色块**
   - 使用唯一的RGB颜色

2. **在配置中添加**
   ```javascript
   objects: [
       {
           id: 'newObject',
           name: '新物件',
           color: '#00FFFF',
           rgb: [0, 255, 255],
           variants: ['A', 'B', 'C'],
           currentVariant: 0
       }
   ]
   ```

### 自定义样式

修改 `style.css` 中的变量或类：

```css
/* 主题色 */
.navbar h1 {
    color: #你的颜色;
}

/* 按钮样式 */
.space-btn {
    border-color: #你的颜色;
}

/* 高光颜色 */
.highlight-overlay {
    background: rgba(你的RGB, 0.3);
}
```

## 📊 文件大小参考

- `index.html` - ~2KB
- `style.css` - ~4KB
- `script.js` - ~15KB
- 全景图 - 根据质量，通常500KB - 2MB每张
- ID图 - 建议小于500KB每张

## 🚀 性能优化建议

1. **图片优化**
   - 全景图：使用JPG，质量80-90%
   - ID图：使用PNG-8（如果颜色少）
   - 考虑使用WebP格式（更小的文件大小）

2. **懒加载**
   - 只加载当前空间的图片
   - 切换空间时再加载其他图片

3. **Canvas优化**
   - 限制Canvas尺寸（当前最大600px高度）
   - 避免频繁重绘

## 🐛 调试技巧

### 查看ID图检测
在浏览器控制台运行：
```javascript
// 显示ID图（调试用）
document.getElementById('idCanvas').style.display = 'block';
document.getElementById('idCanvas').style.opacity = '0.5';
```

### 检查RGB值
点击后查看控制台：
```javascript
// 在 getObjectAtPosition() 中添加
console.log(`RGB at position: (${r}, ${g}, ${b})`);
```

### 测试图片加载
```javascript
// 检查是否成功加载
console.log('Config:', viewer.config);
console.log('Current space:', viewer.currentSpace);
```

## 📞 获取帮助

遇到问题时：
1. 检查浏览器控制台的错误信息
2. 查看相关文档
3. 在GitHub提交Issue

---

**项目结构清晰，易于扩展和维护！** 🎉

