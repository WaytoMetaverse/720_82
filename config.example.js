/**
 * 环景导览系统 - 配置示例
 * 
 * 这是一个配置示例文件，展示如何自定义你的环景导览系统
 * 复制相关代码到 script.js 的 config 对象中进行自定义
 */

const exampleConfig = {
    // ============================================
    // 空间配置示例
    // ============================================
    
    // 示例1：客餐厅配置
    living: {
        name: '客餐厅',                    // 空间显示名称
        color: '#FFC0CB',                  // 空间主题色（用于背景）
        panorama: null,                    // 全景图对象（由程序加载）
        idMap: null,                       // ID图对象（由程序加载）
        
        // 可互动物件列表
        objects: [
            {
                id: 'sofa',                // 物件唯一标识符
                name: '沙发',              // 显示名称
                color: '#00FF00',          // ID图中的标识颜色（HEX）
                rgb: [0, 255, 0],          // ID图中的标识颜色（RGB）
                variants: [                // 可切换的变体列表
                    'sofa1',               // 变体1：现代沙发
                    'sofa2',               // 变体2：古典沙发
                    'sofa3'                // 变体3：布艺沙发
                ]
            },
            {
                id: 'table',
                name: '茶几',
                color: '#FF0000',
                rgb: [255, 0, 0],
                variants: [
                    'table1',              // 玻璃茶几
                    'table2'               // 木质茶几
                ]
            },
            {
                id: 'tv',
                name: '电视柜',
                color: '#0000FF',
                rgb: [0, 0, 255],
                variants: [
                    'tv1',
                    'tv2',
                    'tv3'
                ]
            }
        ]
    },
    
    // 示例2：主卧室配置
    master: {
        name: '主卧室',
        color: '#FFFF00',
        panorama: null,
        idMap: null,
        objects: [
            {
                id: 'bed',
                name: '床',
                color: '#00FF00',
                rgb: [0, 255, 0],
                variants: ['bed1', 'bed2', 'bed3']
            },
            {
                id: 'wardrobe',
                name: '衣柜',
                color: '#FF0000',
                rgb: [255, 0, 0],
                variants: ['wardrobe1', 'wardrobe2']
            },
            {
                id: 'nightstand',
                name: '床头柜',
                color: '#FF00FF',
                rgb: [255, 0, 255],
                variants: ['nightstand1', 'nightstand2']
            }
        ]
    },
    
    // 示例3：次卧室配置
    second: {
        name: '次卧室',
        color: '#0000FF',
        panorama: null,
        idMap: null,
        objects: [
            {
                id: 'desk',
                name: '书桌',
                color: '#00FF00',
                rgb: [0, 255, 0],
                variants: ['desk1', 'desk2']
            },
            {
                id: 'chair',
                name: '椅子',
                color: '#FF0000',
                rgb: [255, 0, 0],
                variants: ['chair1', 'chair2']
            },
            {
                id: 'bookshelf',
                name: '书架',
                color: '#00FFFF',
                rgb: [0, 255, 255],
                variants: ['bookshelf1', 'bookshelf2', 'bookshelf3']
            }
        ]
    },
    
    // ============================================
    // 更多空间示例
    // ============================================
    
    // 示例4：厨房
    kitchen: {
        name: '厨房',
        color: '#FFA500',                  // 橙色主题
        panorama: null,
        idMap: null,
        objects: [
            {
                id: 'cabinet',
                name: '橱柜',
                color: '#00FF00',
                rgb: [0, 255, 0],
                variants: ['cabinet_white', 'cabinet_wood', 'cabinet_grey']
            },
            {
                id: 'countertop',
                name: '台面',
                color: '#FF0000',
                rgb: [255, 0, 0],
                variants: ['granite', 'marble', 'quartz']
            }
        ]
    },
    
    // 示例5：浴室
    bathroom: {
        name: '浴室',
        color: '#87CEEB',                  // 天蓝色主题
        panorama: null,
        idMap: null,
        objects: [
            {
                id: 'vanity',
                name: '洗手台',
                color: '#00FF00',
                rgb: [0, 255, 0],
                variants: ['vanity1', 'vanity2']
            },
            {
                id: 'mirror',
                name: '镜子',
                color: '#FF0000',
                rgb: [255, 0, 0],
                variants: ['mirror_round', 'mirror_square']
            }
        ]
    }
};

// ============================================
// 颜色配置参考
// ============================================

/**
 * 可用的ID图检测颜色（确保RGB值精确）
 * 
 * 基础色：
 * - 红色:   #FF0000 -> [255, 0, 0]
 * - 绿色:   #00FF00 -> [0, 255, 0]
 * - 蓝色:   #0000FF -> [0, 0, 255]
 * - 黄色:   #FFFF00 -> [255, 255, 0]
 * - 青色:   #00FFFF -> [0, 255, 255]
 * - 品红:   #FF00FF -> [255, 0, 255]
 * - 白色:   #FFFFFF -> [255, 255, 255]
 * 
 * 扩展色（可以使用任何RGB值，只要唯一）：
 * - 橙色:   #FF8000 -> [255, 128, 0]
 * - 紫色:   #8000FF -> [128, 0, 255]
 * - 棕色:   #804000 -> [128, 64, 0]
 * 
 * ⚠️ 注意：
 * 1. 黑色 #000000 保留给背景（不可点击区域）
 * 2. 每个空间内的每个物件必须使用不同的颜色
 * 3. RGB值必须完全精确，不能有压缩或抗锯齿
 */

// ============================================
// 使用方法
// ============================================

/**
 * 步骤1：在 script.js 中找到 this.config 对象
 * 步骤2：复制你需要的空间配置
 * 步骤3：修改名称、颜色和物件列表
 * 步骤4：准备对应的全景图和ID图
 * 步骤5：测试功能是否正常
 * 
 * 示例：添加一个新空间
 * 
 * 在 script.js 的 this.config 中添加：
 * 
 * study: {
 *     name: '书房',
 *     color: '#8B4513',
 *     panorama: null,
 *     idMap: null,
 *     objects: [
 *         {
 *             id: 'bookcase',
 *             name: '书柜',
 *             color: '#00FF00',
 *             rgb: [0, 255, 0],
 *             variants: ['bookcase1', 'bookcase2']
 *         }
 *     ]
 * }
 * 
 * 同时在HTML中添加对应的按钮：
 * <button class="space-btn" data-space="study">书房</button>
 */

// ============================================
// 高级配置示例
// ============================================

/**
 * 如果需要更复杂的配置，可以扩展对象结构：
 */

const advancedConfig = {
    living: {
        name: '客餐厅',
        color: '#FFC0CB',
        panorama: null,
        idMap: null,
        
        // 添加元数据
        metadata: {
            area: '35平方米',
            style: '现代简约',
            description: '开放式客餐厅设计'
        },
        
        // 添加热点位置（可选功能）
        hotspots: [
            {
                x: 512,
                y: 512,
                label: '查看阳台',
                action: 'switchSpace',
                target: 'balcony'
            }
        ],
        
        objects: [
            {
                id: 'sofa',
                name: '沙发',
                color: '#00FF00',
                rgb: [0, 255, 0],
                variants: [
                    {
                        id: 'sofa1',
                        name: '现代沙发',
                        price: '¥8,999',
                        panorama: 'living_sofa1.jpg',
                        idMap: 'living_sofa1_id.png'
                    },
                    {
                        id: 'sofa2',
                        name: '古典沙发',
                        price: '¥12,999',
                        panorama: 'living_sofa2.jpg',
                        idMap: 'living_sofa2_id.png'
                    }
                ],
                // 默认变体索引
                defaultVariant: 0
            }
        ]
    }
};

/**
 * 🎯 提示：
 * - 从简单配置开始，逐步添加功能
 * - 确保每次修改后都进行测试
 * - 保持RGB颜色值的唯一性
 * - 参考 IMAGES_GUIDE.md 准备图片资源
 */

// ============================================
// 导出配置（如果需要单独的配置文件）
// ============================================

// export default exampleConfig;

