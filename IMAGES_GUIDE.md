# 图片准备指南

本指南将帮助你准备环景导览系统所需的全景图和ID图。

## 📸 图片类型说明

### 1. 全景图（Panorama Image）

全景图是用户实际看到的360度环景照片。

**规格要求：**
- 📐 **尺寸**：2048 x 1024 像素（推荐）或 4096 x 2048（高清）
- 📏 **比例**：必须是 2:1
- 🎨 **格式**：JPG（压缩）或 PNG（高质量）
- 📷 **投影方式**：等矩形投影（Equirectangular Projection）

**命名示例：**
```
living_panorama.jpg        # 客餐厅全景
living_sofa1_panorama.jpg  # 客餐厅-沙发款式1
living_sofa2_panorama.jpg  # 客餐厅-沙发款式2
master_panorama.jpg        # 主卧室全景
```

### 2. ID图（ID Map）

ID图是隐藏的检测层，用于识别可点击区域。它与全景图对应，但使用纯色块标记可互动物件。

**规格要求：**
- 📐 **尺寸**：必须与对应的全景图完全相同
- 🎨 **格式**：**必须使用PNG**（无损压缩）
- 🚫 **禁止压缩**：保存时选择"无压缩"或"最高质量"
- 🚫 **禁止抗锯齿**：不要使用任何羽化或模糊效果

**命名示例：**
```
living_idmap.png           # 客餐厅ID图
living_sofa1_idmap.png     # 客餐厅-沙发款式1的ID图
master_idmap.png           # 主卧室ID图
```

## 🎨 ID图色彩规范

### 标准颜色配置

| 用途 | 颜色名 | HEX | RGB |
|------|--------|-----|-----|
| 背景（不可点击） | 黑色 | `#000000` | (0, 0, 0) |
| 家具类型1 | 绿色 | `#00FF00` | (0, 255, 0) |
| 家具类型2 | 红色 | `#FF0000` | (255, 0, 0) |
| 空间切换-客餐厅 | 粉红色 | `#FFC0CB` | (255, 192, 203) |
| 空间切换-主卧室 | 黄色 | `#FFFF00` | (255, 255, 0) |
| 空间切换-次卧室 | 蓝色 | `#0000FF` | (0, 0, 255) |

⚠️ **重要提醒**：
- RGB值必须**完全精确**，差1都不行！
- 使用 RGB(0, 255, 0) 而不是 RGB(0, 254, 0)
- 不要使用渐变或透明度

## 🛠️ 制作ID图的方法

### 方法1：使用Photoshop

1. **打开全景图**
   - File → Open → 选择你的全景图

2. **创建新图层**
   - Layer → New → Layer

3. **选择区域**
   - 使用魔棒工具(W)或套索工具(L)选择要标记的物件区域
   - 如沙发、桌子等

4. **填充纯色**
   - 选择油漆桶工具(G)
   - ⚠️ **关闭抗锯齿**：工具选项中取消勾选"Anti-alias"
   - 设置颜色为精确的RGB值（如 RGB: 0, 255, 0）
   - 点击填充

5. **隐藏原图层**
   - 只保留色块图层可见
   - 背景应该是黑色 (RGB: 0, 0, 0)

6. **导出为PNG**
   - File → Export → Export As
   - 格式选择PNG
   - ⚠️ **关闭压缩**：Quality设置为100%
   - 取消勾选"Convert to sRGB"
   - 保存

### 方法2：使用GIMP（免费）

1. **打开全景图**
   - File → Open

2. **创建透明图层**
   - Layer → New Layer
   - Layer Fill Type: Transparency

3. **选择铅笔工具**
   - 工具箱 → 铅笔 (N)
   - ⚠️ **重要**：必须用铅笔而不是画笔（铅笔没有抗锯齿）

4. **设置前景色**
   - 点击前景色方块
   - 输入精确的RGB值（如 R:0, G:255, B:0）

5. **绘制区域**
   - 使用铅笔工具或填充工具标记物件
   - 确保边缘锐利，没有半透明像素

6. **填充黑色背景**
   - 创建背景图层，填充黑色 (RGB: 0, 0, 0)
   - 移到最下层

7. **合并并导出**
   - Image → Flatten Image
   - File → Export As
   - 选择PNG格式
   - ⚠️ Compression level设为0
   - Export

### 方法3：程序生成（推荐）

使用Python脚本自动生成（精确度最高）：

```python
from PIL import Image, ImageDraw

# 创建ID图
width, height = 2048, 1024
idmap = Image.new('RGB', (width, height), (0, 0, 0))  # 黑色背景
draw = ImageDraw.Draw(idmap)

# 绘制沙发区域（绿色）
sofa_area = [(400, 300), (800, 700)]  # (x1, y1), (x2, y2)
draw.rectangle(sofa_area, fill=(0, 255, 0))

# 绘制茶几区域（红色）
table_area = [(1000, 300), (1400, 700)]
draw.rectangle(table_area, fill=(255, 0, 0))

# 保存（无压缩）
idmap.save('living_idmap.png', 'PNG', compress_level=0)
```

## 📋 制作检查清单

在完成ID图后，请确认：

- [ ] ID图与全景图尺寸完全相同
- [ ] 使用PNG格式保存
- [ ] 压缩级别设为0或最低
- [ ] 没有使用抗锯齿或羽化
- [ ] RGB值完全精确（使用吸管工具检查）
- [ ] 背景为纯黑色 (0, 0, 0)
- [ ] 没有半透明像素
- [ ] 不同物件的色块没有重叠

## 🔍 验证ID图

### 方法1：使用吸管工具
1. 在Photoshop/GIMP中打开ID图
2. 使用吸管工具点击色块
3. 查看信息面板，确认RGB值精确

### 方法2：使用在线工具
1. 访问 https://www.imagecolorpicker.com/
2. 上传ID图
3. 点击色块查看RGB值

### 方法3：使用浏览器开发者工具
1. 在网页中加载系统
2. 打开浏览器控制台
3. 观察鼠标悬停时的检测日志

## 📁 推荐目录结构

```
assets/
├── panoramas/
│   ├── living/
│   │   ├── default.jpg
│   │   ├── sofa1.jpg
│   │   ├── sofa2.jpg
│   │   └── sofa3.jpg
│   ├── master/
│   │   ├── default.jpg
│   │   ├── bed1.jpg
│   │   └── bed2.jpg
│   └── second/
│       ├── default.jpg
│       └── ...
└── idmaps/
    ├── living/
    │   ├── default.png
    │   ├── sofa1.png
    │   ├── sofa2.png
    │   └── sofa3.png
    ├── master/
    │   └── ...
    └── second/
        └── ...
```

## 🎓 获取全景图的方法

### 1. 360度相机拍摄
- Ricoh Theta
- Insta360
- GoPro MAX

### 2. 3D渲染软件
- Blender（免费）
- 3ds Max
- SketchUp
- Unreal Engine

### 3. 全景图素材网站
- https://polyhaven.com/hdris （免费）
- https://hdrihaven.com/ （免费）
- https://www.textures.com/

## ❓ 常见问题

### Q: 为什么点击检测不准？
A: 最常见的原因是ID图使用了JPEG格式或启用了压缩，导致颜色值不精确。**必须使用无压缩的PNG格式**。

### Q: 可以使用更多颜色吗？
A: 可以！在 `script.js` 的 `config` 中添加新物件，只要每个物件的RGB值唯一即可。

### Q: ID图可以有渐变吗？
A: 不可以！必须使用纯色填充，因为系统通过精确的RGB值匹配来识别物件。

### Q: 全景图可以用手机拍吗？
A: 可以，但需要使用专门的全景拍摄App，确保输出的是等矩形投影格式。

## 💡 提示和技巧

1. **使用图层管理**：在Photoshop中为每个可点击物件创建单独的图层，方便修改
2. **保留PSD源文件**：保存带图层的源文件，方便后续调整
3. **批量处理**：如果有多个场景，可以使用脚本批量生成ID图
4. **测试优先**：先用简单的矩形色块测试，确认系统工作正常后再绘制精确轮廓

## 📞 需要帮助？

如果在制作图片时遇到问题，请在GitHub仓库提交Issue，附上：
- 全景图和ID图的截图
- 使用的制作方法和工具
- 遇到的具体问题描述

---

祝你制作顺利！🎉

