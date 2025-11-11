// 环景导览系统主程序

class PanoramaViewer {
    constructor() {
        // Canvas元素
        this.panoramaCanvas = document.getElementById('panoramaCanvas');
        this.idCanvas = document.getElementById('idCanvas');
        this.panoramaCtx = this.panoramaCanvas.getContext('2d');
        this.idCtx = this.idCanvas.getContext('2d');
        
        // 当前状态
        this.currentSpace = 'living';
        this.currentVariant = {};
        
        // 拖动相关
        this.isDragging = false;
        this.startX = 0;
        this.offsetX = 0;
        this.currentX = 0;
        
        // 鼠标位置
        this.mouseX = 0;
        this.mouseY = 0;
        
        // 高光状态
        this.hoveredObject = null;
        
        // 配置数据
        this.config = {
            living: {
                name: '客餐厅',
                color: '#FFC0CB', // 粉红色
                panorama: null, // 将在loadImages中加载
                idMap: null,
                objects: [
                    { id: 'sofa', name: '沙发', color: '#00FF00', rgb: [0, 255, 0], variants: ['A', 'B', 'C'], currentVariant: 0 },
                    { id: 'table', name: '茶几', color: '#FF0000', rgb: [255, 0, 0], variants: ['A', 'B', 'C'], currentVariant: 0 }
                ]
            },
            master: {
                name: '主卧室',
                color: '#FFFF00', // 黄色
                panorama: null,
                idMap: null,
                objects: []
            },
            second: {
                name: '次卧室',
                color: '#0000FF', // 蓝色
                panorama: null,
                idMap: null,
                objects: []
            }
        };
        
        this.init();
    }
    
    async init() {
        // 加载真实图片
        await this.loadRealImages();
        
        // 初始化Canvas尺寸
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 绑定事件
        this.bindEvents();
        
        // 渲染对象列表
        this.renderObjectsList();
        
        // 加载初始场景
        this.loadScene(this.currentSpace);
    }
    
    async loadRealImages() {
        try {
            // 加载客餐厅的默认图片（A沙发_A茶几）
            await this.loadSpaceImages('living', '客餐廳_A沙發_A茶几');
            
            // 加载主卧室图片
            await this.loadSpaceImages('master', '主臥室');
            
            // 加载次卧室图片
            await this.loadSpaceImages('second', '次臥室');
            
        } catch (error) {
            console.error('加载图片失败，使用示例图片', error);
            await this.createExampleImages();
        }
    }
    
    async loadSpaceImages(spaceKey, filename) {
        return new Promise((resolve, reject) => {
            const panorama = new Image();
            const idMap = new Image();
            
            let loadedCount = 0;
            const checkComplete = () => {
                loadedCount++;
                if (loadedCount === 2) {
                    this.config[spaceKey].panorama = panorama;
                    this.config[spaceKey].idMap = idMap;
                    resolve();
                }
            };
            
            panorama.onload = checkComplete;
            panorama.onerror = () => {
                console.error(`无法加载全景图: ${filename}.jpg`);
                reject(new Error(`Failed to load ${filename}.jpg`));
            };
            
            idMap.onload = checkComplete;
            idMap.onerror = () => {
                console.error(`无法加载ID图: ${filename}_ID.jpg`);
                reject(new Error(`Failed to load ${filename}_ID.jpg`));
            };
            
            panorama.src = `panorama/${filename}.jpg`;
            idMap.src = `panorama/${filename}_ID.jpg`;
        });
    }
    
    async createExampleImages() {
        // 为每个空间创建示例全景图和ID图
        for (let spaceKey in this.config) {
            const space = this.config[spaceKey];
            
            // 创建全景图
            const panoramaCanvas = document.createElement('canvas');
            panoramaCanvas.width = 2048;
            panoramaCanvas.height = 1024;
            const ctx = panoramaCanvas.getContext('2d');
            
            // 渐变背景
            const gradient = ctx.createLinearGradient(0, 0, 2048, 1024);
            gradient.addColorStop(0, space.color);
            gradient.addColorStop(0.5, '#FFFFFF');
            gradient.addColorStop(1, space.color);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 2048, 1024);
            
            // 添加空间名称
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.font = 'bold 80px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(space.name, 1024, 512);
            
            // 添加装饰网格
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 2048; i += 100) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 1024);
                ctx.stroke();
            }
            for (let i = 0; i < 1024; i += 100) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(2048, i);
                ctx.stroke();
            }
            
            space.panorama = panoramaCanvas;
            
            // 创建ID图
            const idCanvas = document.createElement('canvas');
            idCanvas.width = 2048;
            idCanvas.height = 1024;
            const idCtx = idCanvas.getContext('2d');
            
            // 背景黑色（无互动区域）
            idCtx.fillStyle = '#000000';
            idCtx.fillRect(0, 0, 2048, 1024);
            
            // 为每个对象绘制色块区域
            space.objects.forEach((obj, index) => {
                idCtx.fillStyle = obj.color;
                const x = 400 + index * 600;
                const y = 300;
                const width = 400;
                const height = 400;
                idCtx.fillRect(x, y, width, height);
                
                // 在全景图上也标记这些区域（仅用于演示）
                ctx.strokeStyle = obj.color;
                ctx.lineWidth = 5;
                ctx.strokeRect(x, y, width, height);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.font = 'bold 40px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(obj.name, x + width / 2, y + height / 2);
            });
            
            space.idMap = idCanvas;
        }
    }
    
    resizeCanvas() {
        const container = this.panoramaCanvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        this.panoramaCanvas.width = rect.width - 40;
        this.panoramaCanvas.height = 600;
        
        this.idCanvas.width = this.panoramaCanvas.width;
        this.idCanvas.height = this.panoramaCanvas.height;
        
        this.render();
    }
    
    bindEvents() {
        // 鼠标事件
        this.panoramaCanvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.panoramaCanvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.panoramaCanvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.panoramaCanvas.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
        this.panoramaCanvas.addEventListener('click', (e) => this.onClick(e));
        
        // 触摸事件（移动端支持）
        this.panoramaCanvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.panoramaCanvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.panoramaCanvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
        
        // 空间切换按钮
        document.querySelectorAll('.space-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const space = e.target.dataset.space;
                this.switchSpace(space);
            });
        });
    }
    
    onMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.panoramaCanvas.style.cursor = 'grabbing';
    }
    
    onMouseMove(e) {
        const rect = this.panoramaCanvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
        
        if (this.isDragging) {
            const deltaX = e.clientX - this.startX;
            this.currentX = this.offsetX + deltaX;
            this.render();
        } else {
            this.checkHover();
        }
        
        this.updateTooltip(e.clientX, e.clientY);
    }
    
    onMouseUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.offsetX = this.currentX;
            this.panoramaCanvas.style.cursor = 'grab';
        }
    }
    
    onMouseLeave(e) {
        this.isDragging = false;
        this.hoveredObject = null;
        this.hideTooltip();
        this.panoramaCanvas.classList.remove('highlight');
    }
    
    onClick(e) {
        const clickedObject = this.getObjectAtPosition(this.mouseX, this.mouseY);
        if (clickedObject) {
            this.cycleObjectVariant(clickedObject);
        }
    }
    
    onTouchStart(e) {
        if (e.touches.length === 1) {
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
        }
    }
    
    onTouchMove(e) {
        if (this.isDragging && e.touches.length === 1) {
            const deltaX = e.touches[0].clientX - this.startX;
            this.currentX = this.offsetX + deltaX;
            this.render();
            e.preventDefault();
        }
    }
    
    onTouchEnd(e) {
        this.isDragging = false;
        this.offsetX = this.currentX;
    }
    
    checkHover() {
        const object = this.getObjectAtPosition(this.mouseX, this.mouseY);
        
        if (object !== this.hoveredObject) {
            this.hoveredObject = object;
            
            if (object) {
                this.panoramaCanvas.classList.add('highlight');
            } else {
                this.panoramaCanvas.classList.remove('highlight');
                this.hideTooltip();
            }
            
            this.render();
        }
    }
    
    getObjectAtPosition(x, y) {
        // 将canvas坐标转换为全景图坐标
        const space = this.config[this.currentSpace];
        if (!space || !space.idMap) return null;
        
        const scaleX = space.idMap.width / this.panoramaCanvas.width;
        const scaleY = space.idMap.height / this.panoramaCanvas.height;
        
        const panoramaX = Math.floor(x * scaleX);
        const panoramaY = Math.floor(y * scaleY);
        
        // 获取ID图上该位置的像素颜色
        const imageData = this.idCtx.getImageData(0, 0, this.idCanvas.width, this.idCanvas.height);
        const index = (panoramaY * this.idCanvas.width + panoramaX) * 4;
        
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        
        // 匹配对象
        for (let obj of space.objects) {
            if (obj.rgb[0] === r && obj.rgb[1] === g && obj.rgb[2] === b) {
                return obj;
            }
        }
        
        return null;
    }
    
    updateTooltip(clientX, clientY) {
        const tooltip = document.getElementById('tooltip');
        
        if (this.hoveredObject) {
            tooltip.textContent = `点击切换${this.hoveredObject.name}`;
            tooltip.style.left = `${clientX + 15}px`;
            tooltip.style.top = `${clientY + 15}px`;
            tooltip.classList.add('show');
        } else {
            this.hideTooltip();
        }
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        tooltip.classList.remove('show');
    }
    
    cycleObjectVariant(object) {
        // 切换到下一个变体
        object.currentVariant = (object.currentVariant + 1) % object.variants.length;
        
        console.log(`切换${object.name}到变体: ${object.variants[object.currentVariant]}`);
        
        // 重新加载当前空间的全景图
        this.reloadCurrentSpace();
    }
    
    async reloadCurrentSpace() {
        if (this.currentSpace === 'living') {
            // 获取当前沙发和茶几的变体
            const sofaObj = this.config.living.objects.find(obj => obj.id === 'sofa');
            const tableObj = this.config.living.objects.find(obj => obj.id === 'table');
            
            const sofaVariant = sofaObj.variants[sofaObj.currentVariant];
            const tableVariant = tableObj.variants[tableObj.currentVariant];
            
            const filename = `客餐廳_${sofaVariant}沙發_${tableVariant}茶几`;
            
            try {
                await this.loadSpaceImages('living', filename);
                this.renderObjectsList();
                this.render();
            } catch (error) {
                console.error('加载新图片失败', error);
            }
        } else {
            // 主卧室和次卧室暂时只有一个场景
            this.render();
        }
    }
    
    switchSpace(spaceKey) {
        this.currentSpace = spaceKey;
        this.offsetX = 0;
        this.currentX = 0;
        
        // 重置当前空间所有物件的变体为默认值
        const space = this.config[spaceKey];
        if (space && space.objects) {
            space.objects.forEach(obj => {
                obj.currentVariant = 0;
            });
        }
        
        // 更新按钮状态
        document.querySelectorAll('.space-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.space === spaceKey) {
                btn.classList.add('active');
            }
        });
        
        this.renderObjectsList();
        this.loadScene(spaceKey);
    }
    
    loadScene(spaceKey) {
        const space = this.config[spaceKey];
        if (space) {
            this.render();
        }
    }
    
    render() {
        const space = this.config[this.currentSpace];
        if (!space || !space.panorama) return;
        
        // 清空画布
        this.panoramaCtx.clearRect(0, 0, this.panoramaCanvas.width, this.panoramaCanvas.height);
        this.idCtx.clearRect(0, 0, this.idCanvas.width, this.idCanvas.height);
        
        // 计算偏移（循环全景）
        const offset = this.currentX % space.panorama.width;
        
        // 绘制全景图
        this.panoramaCtx.drawImage(
            space.panorama,
            0, 0, space.panorama.width, space.panorama.height,
            offset, 0, this.panoramaCanvas.width, this.panoramaCanvas.height
        );
        
        // 绘制ID图（隐藏的，用于检测）
        this.idCtx.drawImage(
            space.idMap,
            0, 0, space.idMap.width, space.idMap.height,
            offset, 0, this.idCanvas.width, this.idCanvas.height
        );
        
        // 绘制高光效果
        if (this.hoveredObject) {
            this.drawHighlight();
        }
    }
    
    drawHighlight() {
        const space = this.config[this.currentSpace];
        const imageData = this.idCtx.getImageData(0, 0, this.idCanvas.width, this.idCanvas.height);
        
        // 创建高光覆盖层
        this.panoramaCtx.fillStyle = 'rgba(255, 255, 0, 0.2)';
        
        const rgb = this.hoveredObject.rgb;
        
        for (let y = 0; y < this.idCanvas.height; y++) {
            for (let x = 0; x < this.idCanvas.width; x++) {
                const index = (y * this.idCanvas.width + x) * 4;
                const r = imageData.data[index];
                const g = imageData.data[index + 1];
                const b = imageData.data[index + 2];
                
                if (r === rgb[0] && g === rgb[1] && b === rgb[2]) {
                    this.panoramaCtx.fillRect(x, y, 1, 1);
                }
            }
        }
    }
    
    renderObjectsList() {
        const space = this.config[this.currentSpace];
        const container = document.getElementById('objectsList');
        container.innerHTML = '';
        
        if (!space.objects || space.objects.length === 0) {
            container.innerHTML = '<p style="color: #999; font-size: 14px;">此空间暂无可互动物件</p>';
            return;
        }
        
        space.objects.forEach(obj => {
            const item = document.createElement('div');
            item.className = 'object-item';
            
            const colorIndicator = document.createElement('div');
            colorIndicator.className = 'color-indicator';
            colorIndicator.style.backgroundColor = obj.color;
            
            const name = document.createElement('span');
            name.className = 'object-name';
            name.textContent = obj.name;
            
            const variantInfo = document.createElement('span');
            variantInfo.className = 'object-name';
            variantInfo.textContent = `(${obj.variants[obj.currentVariant]}款 - ${obj.currentVariant + 1}/${obj.variants.length})`;
            
            item.appendChild(colorIndicator);
            item.appendChild(name);
            item.appendChild(variantInfo);
            container.appendChild(item);
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new PanoramaViewer();
});

