// 环景导览系统 - Three.js实现

class PanoramaViewer {
    constructor() {
        this.container = document.getElementById('viewer-container');
        this.idCanvas = document.getElementById('idCanvas');
        this.idCtx = this.idCanvas.getContext('2d');
        
        // 当前状态
        this.currentSpace = 'living';
        
        // Three.js相关
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.sphere = null;
        this.idSphere = null;
        
        // 交互相关
        this.isUserInteracting = false;
        this.onPointerDownMouseX = 0;
        this.onPointerDownMouseY = 0;
        this.lon = 0;
        this.onPointerDownLon = 0;
        this.lat = 0;
        this.onPointerDownLat = 0;
        this.phi = 0;
        this.theta = 0;
        
        // 鼠标位置和高光
        this.mouseX = 0;
        this.mouseY = 0;
        this.hoveredObject = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // 空间切换色块定义
        this.spaceHotspots = {
            living: { name: '客餐厅', rgb: [255, 0, 255], space: 'living' },   // 粉色（品红）
            master: { name: '主卧室', rgb: [255, 255, 0], space: 'master' },   // 黄色
            second: { name: '次卧室', rgb: [0, 0, 255], space: 'second' }      // 蓝色
        };
        
        // 配置数据
        this.config = {
            living: {
                name: '客餐厅',
                panorama: null,
                idMap: null,
                objects: [
                    { id: 'sofa', name: '沙发', color: '#00FF00', rgb: [0, 255, 0], variants: ['A', 'B', 'C'], currentVariant: 0 },
                    { id: 'table', name: '茶几', color: '#FF0000', rgb: [255, 0, 0], variants: ['A', 'B', 'C'], currentVariant: 0 }
                ]
            },
            master: {
                name: '主卧室',
                panorama: null,
                idMap: null,
                objects: []
            },
            second: {
                name: '次卧室',
                panorama: null,
                idMap: null,
                objects: []
            }
        };
        
        this.init();
    }
    
    async init() {
        // 初始化Three.js场景
        this.initThreeJS();
        
        // 加载图片
        await this.loadRealImages();
        
        // 设置场景
        await this.loadScene(this.currentSpace);
        
        // 绑定事件
        this.bindEvents();
        
        // 开始动画循环
        this.animate();
    }
    
    initThreeJS() {
        // 创建场景
        this.scene = new THREE.Scene();
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            1100
        );
        this.camera.target = new THREE.Vector3(0, 0, 0);
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // 创建球体几何体（用于全景）
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1); // 反转法线，让纹理显示在内侧
        
        this.sphereGeometry = geometry;
    }
    
    async loadRealImages() {
        try {
            await this.loadSpaceImages('living', '客餐廳_A沙發_A茶几');
            await this.loadSpaceImages('master', '主臥室');
            await this.loadSpaceImages('second', '次臥室');
        } catch (error) {
            console.error('加载图片失败', error);
        }
    }
    
    loadSpaceImages(spaceKey, filename) {
        return new Promise((resolve, reject) => {
            const panorama = new Image();
            const idMap = new Image();
            
            let loadedCount = 0;
            const checkComplete = () => {
                loadedCount++;
                if (loadedCount === 2) {
                    this.config[spaceKey].panorama = panorama;
                    this.config[spaceKey].idMap = idMap;
                    console.log(`已加载 ${spaceKey}: ${filename}`);
                    resolve();
                }
            };
            
            panorama.onload = checkComplete;
            panorama.onerror = () => reject(new Error(`Failed to load ${filename}.jpg`));
            
            idMap.onload = checkComplete;
            idMap.onerror = () => reject(new Error(`Failed to load ${filename}_ID.jpg`));
            
            panorama.crossOrigin = 'anonymous';
            idMap.crossOrigin = 'anonymous';
            
            panorama.src = `panorama/${filename}.jpg`;
            idMap.src = `panorama/${filename}_ID.jpg`;
        });
    }
    
    async loadScene(spaceKey) {
        const space = this.config[spaceKey];
        if (!space || !space.panorama) {
            console.error('场景数据不存在');
            return;
        }
        
        // 移除旧的球体
        if (this.sphere) {
            this.scene.remove(this.sphere);
            if (this.sphere.material.map) {
                this.sphere.material.map.dispose();
            }
            this.sphere.material.dispose();
        }
        
        // 创建全景纹理
        const texture = new THREE.Texture(space.panorama);
        texture.needsUpdate = true;
        
        // 创建材质和球体
        const material = new THREE.MeshBasicMaterial({ map: texture });
        this.sphere = new THREE.Mesh(this.sphereGeometry, material);
        this.scene.add(this.sphere);
        
        // 更新ID图到canvas
        this.updateIdCanvas(space.idMap);
        
        console.log(`场景切换到: ${space.name}`);
    }
    
    updateIdCanvas(idMapImage) {
        // 设置ID canvas尺寸与图片相同
        this.idCanvas.width = idMapImage.width;
        this.idCanvas.height = idMapImage.height;
        
        // 绘制ID图
        this.idCtx.drawImage(idMapImage, 0, 0);
    }
    
    bindEvents() {
        // 鼠标事件
        this.container.addEventListener('mousedown', (e) => this.onPointerStart(e), false);
        this.container.addEventListener('mousemove', (e) => this.onPointerMove(e), false);
        this.container.addEventListener('mouseup', (e) => this.onPointerEnd(e), false);
        this.container.addEventListener('wheel', (e) => this.onMouseWheel(e), false);
        
        // 触摸事件
        this.container.addEventListener('touchstart', (e) => this.onPointerStart(e), false);
        this.container.addEventListener('touchmove', (e) => this.onPointerMove(e), false);
        this.container.addEventListener('touchend', (e) => this.onPointerEnd(e), false);
        
        // 点击事件
        this.container.addEventListener('click', (e) => this.onClick(e), false);
        
        // 窗口大小改变
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // 空间切换按钮
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const space = e.target.dataset.space;
                console.log('切换空间按钮被点击:', space);
                this.switchSpace(space);
            });
        });
    }
    
    onPointerStart(event) {
        if (event.type === 'mousedown' && event.button !== 0) return;
        
        this.isUserInteracting = true;
        
        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;
        
        this.onPointerDownMouseX = clientX;
        this.onPointerDownMouseY = clientY;
        this.onPointerDownLon = this.lon;
        this.onPointerDownLat = this.lat;
        
        this.container.style.cursor = 'grabbing';
    }
    
    onPointerMove(event) {
        const clientX = event.clientX || (event.touches ? event.touches[0].clientX : 0);
        const clientY = event.clientY || (event.touches ? event.touches[0].clientY : 0);
        
        this.mouseX = clientX;
        this.mouseY = clientY;
        
        if (this.isUserInteracting) {
            this.lon = (this.onPointerDownMouseX - clientX) * 0.1 + this.onPointerDownLon;
            this.lat = (clientY - this.onPointerDownMouseY) * 0.1 + this.onPointerDownLat;
        } else {
            // 检测悬停
            this.checkHover(clientX, clientY);
        }
    }
    
    onPointerEnd(event) {
        this.isUserInteracting = false;
        this.container.style.cursor = 'grab';
    }
    
    onMouseWheel(event) {
        event.preventDefault();
        const fov = this.camera.fov + event.deltaY * 0.05;
        this.camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
        this.camera.updateProjectionMatrix();
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onClick(event) {
        if (!this.isUserInteracting) {
            const result = this.getObjectAtScreenPosition(event.clientX, event.clientY);
            if (result) {
                if (result.type === 'space') {
                    // 点击了空间切换热点
                    console.log(`点击切换空间: ${result.data.name}`);
                    this.switchSpace(result.data.space);
                } else if (result.type === 'object') {
                    // 点击了家具物件
                    console.log(`点击了家具: ${result.data.name}`);
                    this.cycleObjectVariant(result.data);
                }
            }
        }
    }
    
    checkHover(clientX, clientY) {
        const result = this.getObjectAtScreenPosition(clientX, clientY);
        
        // 比较是否是同一个物件（比较整个result对象）
        const isDifferent = !this.hoveredObject || 
                           !result || 
                           this.hoveredObject.type !== result.type ||
                           this.hoveredObject.data !== result.data;
        
        if (isDifferent) {
            this.hoveredObject = result;
            
            if (result) {
                this.container.classList.add('highlight');
                
                if (result.type === 'space') {
                    this.showTooltip(clientX, clientY, `前往${result.data.name}`);
                } else if (result.type === 'object') {
                    this.showTooltip(clientX, clientY, `点击切换${result.data.name}`);
                }
            } else {
                this.container.classList.remove('highlight');
                this.hideTooltip();
            }
        } else if (result) {
            // 更新提示框位置
            if (result.type === 'space') {
                this.showTooltip(clientX, clientY, `前往${result.data.name}`);
            } else if (result.type === 'object') {
                this.showTooltip(clientX, clientY, `点击切换${result.data.name}`);
            }
        }
    }
    
    getObjectAtScreenPosition(clientX, clientY) {
        // 将屏幕坐标转换为球面UV坐标
        const uv = this.screenToUV(clientX, clientY);
        if (!uv) return null;
        
        // 将UV坐标转换为ID图像素坐标
        const x = Math.floor(uv.x * this.idCanvas.width);
        const y = Math.floor(uv.y * this.idCanvas.height);
        
        if (x < 0 || x >= this.idCanvas.width || y < 0 || y >= this.idCanvas.height) {
            return null;
        }
        
        // 读取ID图上的颜色
        const imageData = this.idCtx.getImageData(x, y, 1, 1);
        const r = imageData.data[0];
        const g = imageData.data[1];
        const b = imageData.data[2];
        
        // 1. 首先检查是否是空间切换热点
        for (let key in this.spaceHotspots) {
            const hotspot = this.spaceHotspots[key];
            const rDiff = Math.abs(hotspot.rgb[0] - r);
            const gDiff = Math.abs(hotspot.rgb[1] - g);
            const bDiff = Math.abs(hotspot.rgb[2] - b);
            
            if (rDiff <= 15 && gDiff <= 15 && bDiff <= 15) {
                return { type: 'space', data: hotspot };
            }
        }
        
        // 2. 然后检查是否是家具物件
        const space = this.config[this.currentSpace];
        if (space && space.objects && space.objects.length > 0) {
            for (let obj of space.objects) {
                const rDiff = Math.abs(obj.rgb[0] - r);
                const gDiff = Math.abs(obj.rgb[1] - g);
                const bDiff = Math.abs(obj.rgb[2] - b);
                
                if (rDiff <= 15 && gDiff <= 15 && bDiff <= 15) {
                    return { type: 'object', data: obj };
                }
            }
        }
        
        return null;
    }
    
    screenToUV(clientX, clientY) {
        // 使用raycaster检测射线与球体的交点
        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const intersects = this.raycaster.intersectObject(this.sphere);
        
        if (intersects.length > 0) {
            const uv = intersects[0].uv;
            return uv;
        }
        
        return null;
    }
    
    showTooltip(x, y, text) {
        const tooltip = document.getElementById('tooltip');
        tooltip.textContent = text;
        tooltip.style.left = `${x + 15}px`;
        tooltip.style.top = `${y + 15}px`;
        tooltip.classList.add('show');
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        tooltip.classList.remove('show');
    }
    
    cycleObjectVariant(object) {
        object.currentVariant = (object.currentVariant + 1) % object.variants.length;
        console.log(`切换${object.name}到变体: ${object.variants[object.currentVariant]}`);
        this.reloadCurrentSpace();
    }
    
    async reloadCurrentSpace() {
        if (this.currentSpace === 'living') {
            const sofaObj = this.config.living.objects.find(obj => obj.id === 'sofa');
            const tableObj = this.config.living.objects.find(obj => obj.id === 'table');
            
            const sofaVariant = sofaObj.variants[sofaObj.currentVariant];
            const tableVariant = tableObj.variants[tableObj.currentVariant];
            
            const filename = `客餐廳_${sofaVariant}沙發_${tableVariant}茶几`;
            
            try {
                await this.loadSpaceImages('living', filename);
                await this.loadScene('living');
            } catch (error) {
                console.error('加载新图片失败', error);
            }
        }
    }
    
    switchSpace(spaceKey) {
        console.log('执行切换空间:', spaceKey);
        this.currentSpace = spaceKey;
        
        // 重置视角
        this.lon = 0;
        this.lat = 0;
        
        // 重置物件变体
        const space = this.config[spaceKey];
        if (space && space.objects) {
            space.objects.forEach(obj => {
                obj.currentVariant = 0;
            });
        }
        
        // 更新按钮状态
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.space === spaceKey) {
                btn.classList.add('active');
            }
        });
        
        // 加载新场景
        this.loadScene(spaceKey);
    }
    
    update() {
        // 限制纬度范围
        this.lat = Math.max(-85, Math.min(85, this.lat));
        
        // 转换为弧度
        this.phi = THREE.MathUtils.degToRad(90 - this.lat);
        this.theta = THREE.MathUtils.degToRad(this.lon);
        
        // 更新相机位置
        const x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
        const y = 500 * Math.cos(this.phi);
        const z = 500 * Math.sin(this.phi) * Math.sin(this.theta);
        
        this.camera.lookAt(x, y, z);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const viewer = new PanoramaViewer();
    window.viewer = viewer; // 用于调试
});
