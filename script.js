// 環景導覽系統 - Three.js實現

class PanoramaViewer {
    constructor() {
        this.container = document.getElementById('viewer-container');
        this.idCanvas = document.getElementById('idCanvas');
        this.idCtx = this.idCanvas.getContext('2d', { willReadFrequently: true });
        
        // 當前狀態
        this.currentSpace = 'living';
        
        // Three.js相關
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.sphere = null;
        this.idSphere = null; // ID檢測球體
        this.highlightMesh = null; // 高光網格
        
        // 交互相關
        this.isUserInteracting = false;
        this.onPointerDownMouseX = 0;
        this.onPointerDownMouseY = 0;
        this.lon = 180;  // 初始視角旋轉180度
        this.onPointerDownLon = 180;
        this.lat = 0;
        this.onPointerDownLat = 0;
        this.phi = 0;
        this.theta = 0;
        
        // 滑鼠位置和高光
        this.mouseX = 0;
        this.mouseY = 0;
        this.hoveredObject = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // 空間切換色塊定義
        this.spaceHotspots = {
            living: { name: '客餐廳', rgb: [255, 0, 255], space: 'living' },   // 粉色（品紅）
            master: { name: '主臥室', rgb: [255, 255, 0], space: 'master' },   // 黃色
            second: { name: '次臥室', rgb: [0, 0, 255], space: 'second' }      // 藍色
        };
        
        // 配置數據
        this.config = {
            living: {
                name: '客餐廳',
                panorama: null,
                idMap: null,
                objects: [
                    { id: 'sofa', name: '沙發', color: '#00FF00', rgb: [0, 255, 0], variants: ['A', 'B', 'C'], currentVariant: 0 },
                    { id: 'table', name: '茶几', color: '#FF0000', rgb: [255, 0, 0], variants: ['A', 'B', 'C'], currentVariant: 0 }
                ]
            },
            master: {
                name: '主臥室',
                panorama: null,
                idMap: null,
                objects: []
            },
            second: {
                name: '次臥室',
                panorama: null,
                idMap: null,
                objects: []
            }
        };
        
        this.init();
    }
    
    async init() {
        // 初始化Three.js場景
        this.initThreeJS();
        
        // 載入圖片
        await this.loadRealImages();
        
        // 設置場景
        await this.loadScene(this.currentSpace);
        
        // 綁定事件
        this.bindEvents();
        
        // 開始動畫循環
        this.animate();
    }
    
    initThreeJS() {
        // 創建場景
        this.scene = new THREE.Scene();
        
        // 創建相機
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            1100
        );
        this.camera.target = new THREE.Vector3(0, 0, 0);
        
        // 創建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // 創建球體幾何體（用於全景）
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1); // 反轉法線，讓紋理顯示在內側
        
        this.sphereGeometry = geometry;
    }
    
    async loadRealImages() {
        try {
            await this.loadSpaceImages('living', '客餐廳_A沙發_A茶几');
            await this.loadSpaceImages('master', '主臥室');
            await this.loadSpaceImages('second', '次臥室');
        } catch (error) {
            console.error('載入圖片失敗', error);
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
                     console.log(`已載入 ${spaceKey}: ${filename}`);
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
            console.error('場景數據不存在');
            return;
        }
        
        // 移除舊的球體
        if (this.sphere) {
            this.scene.remove(this.sphere);
            if (this.sphere.material.map) {
                this.sphere.material.map.dispose();
            }
            this.sphere.material.dispose();
        }
        
        // 移除舊的ID球體
        if (this.idSphere) {
            this.scene.remove(this.idSphere);
            if (this.idSphere.material.map) {
                this.idSphere.material.map.dispose();
            }
            this.idSphere.material.dispose();
        }
        
        // 移除舊的高光層
        if (this.highlightMesh) {
            this.scene.remove(this.highlightMesh);
            if (this.highlightMesh.material.map) {
                this.highlightMesh.material.map.dispose();
            }
            this.highlightMesh.material.dispose();
        }
        
        // 創建全景紋理
        const texture = new THREE.Texture(space.panorama);
        texture.needsUpdate = true;
        
        // 創建材質和球體
        const material = new THREE.MeshBasicMaterial({ map: texture });
        this.sphere = new THREE.Mesh(this.sphereGeometry, material);
        this.scene.add(this.sphere);
        
        // 創建ID球體（用於點擊檢測，不可見）
        const idTexture = new THREE.Texture(space.idMap);
        idTexture.needsUpdate = true;
        
        const idMaterial = new THREE.MeshBasicMaterial({ 
            map: idTexture,
            visible: false  // 預設不可見
        });
        
        const idGeometry = new THREE.SphereGeometry(498, 60, 40);
        idGeometry.scale(-1, 1, 1);
        
        this.idSphere = new THREE.Mesh(idGeometry, idMaterial);
        this.scene.add(this.idSphere);
        
        // 保存ID圖用於顏色讀取
        this.idMapImage = space.idMap;
        this.idTexture = idTexture;
        
        // 創建高光層（稍微小一點的球體，避免Z-fighting）
        const highlightGeometry = new THREE.SphereGeometry(497, 60, 40);
        highlightGeometry.scale(-1, 1, 1);
        
        // 創建高光紋理canvas
        this.highlightCanvas = document.createElement('canvas');
        this.highlightCanvas.width = space.idMap.width;
        this.highlightCanvas.height = space.idMap.height;
        this.highlightCtx = this.highlightCanvas.getContext('2d');
        
        const highlightTexture = new THREE.Texture(this.highlightCanvas);
        const highlightMaterial = new THREE.MeshBasicMaterial({
            map: highlightTexture,
            transparent: true,
            opacity: 1,
            depthWrite: false
        });
        
        this.highlightMesh = new THREE.Mesh(highlightGeometry, highlightMaterial);
        this.scene.add(this.highlightMesh);
        
         // 更新ID圖到canvas（用於調試顯示）
         this.updateIdCanvas(space.idMap);
         
         console.log(`場景切換到: ${space.name}`);
    }
    
    updateIdCanvas(idMapImage) {
        // 设置ID canvas尺寸与窗口相同（用于显示调试）
        this.idCanvas.width = window.innerWidth;
        this.idCanvas.height = window.innerHeight;
        
        // 清空canvas
        this.idCtx.clearRect(0, 0, this.idCanvas.width, this.idCanvas.height);
        
        // 计算缩放以填充高度
        const scale = this.idCanvas.height / idMapImage.height;
        const scaledWidth = idMapImage.width * scale;
        
        // 居中绘制
        const offsetX = (this.idCanvas.width - scaledWidth) / 2;
        
        // 绘制ID图
        this.idCtx.drawImage(
            idMapImage,
            0, 0, idMapImage.width, idMapImage.height,
            offsetX, 0, scaledWidth, this.idCanvas.height
        );
        
        // 保存原始ID图用于颜色检测
        this.idMapImage = idMapImage;
    }
    
    bindEvents() {
        // 滑鼠事件
        this.container.addEventListener('mousedown', (e) => this.onPointerStart(e), false);
        this.container.addEventListener('mousemove', (e) => this.onPointerMove(e), false);
        this.container.addEventListener('mouseup', (e) => this.onPointerEnd(e), false);
        this.container.addEventListener('wheel', (e) => this.onMouseWheel(e), false);
        
        // 觸摸事件
        this.container.addEventListener('touchstart', (e) => this.onPointerStart(e), false);
        this.container.addEventListener('touchmove', (e) => this.onPointerMove(e), false);
        this.container.addEventListener('touchend', (e) => this.onPointerEnd(e), false);
        
        // 點擊事件
        this.container.addEventListener('click', (e) => this.onClick(e), false);
        
        // 窗口大小改變
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
         // 空間切換按鈕
         document.querySelectorAll('.nav-btn').forEach(btn => {
             btn.addEventListener('click', (e) => {
                 e.stopPropagation();
                 const space = e.target.dataset.space;
                 console.log('切換空間按鈕被點擊:', space);
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
         // 檢查是否真的是點擊（而不是拖動）
         const deltaX = Math.abs(event.clientX - this.onPointerDownMouseX);
         const deltaY = Math.abs(event.clientY - this.onPointerDownMouseY);
         const isDrag = deltaX > 5 || deltaY > 5;
         
         if (isDrag) {
             console.log('這是拖動操作，不是點擊');
             return;
         }
         
         const result = this.getObjectAtScreenPosition(event.clientX, event.clientY);
         console.log('點擊檢測結果:', result);
         
         if (result) {
             if (result.type === 'space') {
                 // 點擊了空間切換熱點
                 console.log(`點擊切換空間: ${result.data.name} -> ${result.data.space}`);
                 this.switchSpace(result.data.space);
             } else if (result.type === 'object') {
                 // 點擊了家具物件
                 console.log(`點擊了家具: ${result.data.name}`);
                 this.cycleObjectVariant(result.data);
             }
         } else {
             console.log('點擊位置無可交互對象');
         }
     }
    
     checkHover(clientX, clientY) {
         const result = this.getObjectAtScreenPosition(clientX, clientY);
         
         // 比較是否是同一個物件（比較整個result對象）
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
                     this.showTooltip(clientX, clientY, `點擊切換${result.data.name}`);
                 }
                 
                 // 更新高光顯示
                 this.updateHighlight(result);
             } else {
                 this.container.classList.remove('highlight');
                 this.hideTooltip();
                 this.clearHighlight();
             }
         } else if (result) {
             // 更新提示框位置
             if (result.type === 'space') {
                 this.showTooltip(clientX, clientY, `前往${result.data.name}`);
             } else if (result.type === 'object') {
                 this.showTooltip(clientX, clientY, `點擊切換${result.data.name}`);
             }
         }
     }
    
    updateHighlight(result) {
        if (!this.highlightCanvas || !this.highlightCtx || !this.highlightMesh || !this.idMapImage) return;
        
        // 清空高光canvas
        this.highlightCtx.clearRect(0, 0, this.highlightCanvas.width, this.highlightCanvas.height);
        
        // 創建臨時canvas讀取ID圖數據
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.idMapImage.width;
        tempCanvas.height = this.idMapImage.height;
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
        tempCtx.drawImage(this.idMapImage, 0, 0);
        
        // 獲取ID圖數據
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const highlightData = this.highlightCtx.createImageData(this.highlightCanvas.width, this.highlightCanvas.height);
        
        const targetRgb = result.data.rgb;
        
        // 遍歷所有像素，找到匹配的區域並高亮
        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            
            const rDiff = Math.abs(targetRgb[0] - r);
            const gDiff = Math.abs(targetRgb[1] - g);
            const bDiff = Math.abs(targetRgb[2] - b);
            
            if (rDiff <= 15 && gDiff <= 15 && bDiff <= 15) {
                // 設置高亮顏色（黃色半透明）
                highlightData.data[i] = 255;     // R
                highlightData.data[i + 1] = 255; // G
                highlightData.data[i + 2] = 0;   // B
                highlightData.data[i + 3] = 120; // A (透明度)
            }
        }
        
        this.highlightCtx.putImageData(highlightData, 0, 0);
        this.highlightMesh.material.map.needsUpdate = true;
    }
    
    clearHighlight() {
        if (!this.highlightCanvas || !this.highlightCtx || !this.highlightMesh) return;
        
        this.highlightCtx.clearRect(0, 0, this.highlightCanvas.width, this.highlightCanvas.height);
        this.highlightMesh.material.map.needsUpdate = true;
    }
    
    getObjectAtScreenPosition(clientX, clientY) {
        // 使用raycaster檢測ID球體
        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // 與ID球體相交檢測
        if (!this.idSphere) {
            return null;
        }
        
        const intersects = this.raycaster.intersectObject(this.idSphere);
        
        if (intersects.length === 0) {
            return null;
        }
        
        // 獲取UV坐標
        const uv = intersects[0].uv;
        if (!uv) {
            return null;
        }
        
         // 使用原始ID圖進行檢測
         if (!this.idMapImage) {
             console.log('ID圖未載入');
             return null;
         }
         
         // 將UV坐標轉換為ID圖像素坐標
         // 注意：Three.js的UV.y和圖片坐標的Y軸方向相反，需要翻轉
         const x = Math.floor(uv.x * this.idMapImage.width);
         const y = Math.floor((1 - uv.y) * this.idMapImage.height);
        
        if (x < 0 || x >= this.idMapImage.width || y < 0 || y >= this.idMapImage.height) {
            return null;
        }
        
         // 創建臨時canvas讀取像素（只在需要時創建）
         if (!this._tempCanvas) {
             this._tempCanvas = document.createElement('canvas');
             this._tempCtx = this._tempCanvas.getContext('2d', { willReadFrequently: true });
         }
         
         if (this._tempCanvas.width !== this.idMapImage.width || 
             this._tempCanvas.height !== this.idMapImage.height) {
             this._tempCanvas.width = this.idMapImage.width;
             this._tempCanvas.height = this.idMapImage.height;
             this._tempCtx.drawImage(this.idMapImage, 0, 0);
         }
         
         // 讀取ID圖上的顏色
         const imageData = this._tempCtx.getImageData(x, y, 1, 1);
         const r = imageData.data[0];
         const g = imageData.data[1];
         const b = imageData.data[2];
         
         console.log(`UV(${uv.x.toFixed(3)}, ${uv.y.toFixed(3)}) -> 像素(${x}, ${y}) -> RGB(${r}, ${g}, ${b})`);
         
         // 1. 首先檢查是否是空間切換熱點
         for (let key in this.spaceHotspots) {
             const hotspot = this.spaceHotspots[key];
             const rDiff = Math.abs(hotspot.rgb[0] - r);
             const gDiff = Math.abs(hotspot.rgb[1] - g);
             const bDiff = Math.abs(hotspot.rgb[2] - b);
             
             if (rDiff <= 15 && gDiff <= 15 && bDiff <= 15) {
                 console.log(`✓ 匹配到空間熱點: ${hotspot.name} (色差: R${rDiff} G${gDiff} B${bDiff})`);
                 return { type: 'space', data: hotspot };
             }
         }
         
         // 2. 然後檢查是否是家具物件
         const space = this.config[this.currentSpace];
         if (space && space.objects && space.objects.length > 0) {
             for (let obj of space.objects) {
                 const rDiff = Math.abs(obj.rgb[0] - r);
                 const gDiff = Math.abs(obj.rgb[1] - g);
                 const bDiff = Math.abs(obj.rgb[2] - b);
                 
                 if (rDiff <= 15 && gDiff <= 15 && bDiff <= 15) {
                     console.log(`✓ 匹配到家具物件: ${obj.name} (色差: R${rDiff} G${gDiff} B${bDiff})`);
                     return { type: 'object', data: obj };
                 }
             }
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
         console.log(`切換${object.name}到變體: ${object.variants[object.currentVariant]}`);
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
                 
                 // 清除臨時canvas緩存
                 if (this._tempCanvas) {
                     this._tempCanvas.width = 0;
                     this._tempCanvas.height = 0;
                 }
                 
                 await this.loadScene('living');
             } catch (error) {
                 console.error('載入新圖片失敗', error);
             }
         }
     }
     
     switchSpace(spaceKey) {
         console.log('執行切換空間:', spaceKey);
         this.currentSpace = spaceKey;
         
         // 重置視角（旋轉180度）
         this.lon = 180;
         this.lat = 0;
         
         // 重置物件變體
         const space = this.config[spaceKey];
         if (space && space.objects) {
             space.objects.forEach(obj => {
                 obj.currentVariant = 0;
             });
         }
         
         // 清除臨時canvas緩存
         if (this._tempCanvas) {
             this._tempCanvas.width = 0;
             this._tempCanvas.height = 0;
         }
         
         // 更新按鈕狀態
         document.querySelectorAll('.nav-btn').forEach(btn => {
             btn.classList.remove('active');
             if (btn.dataset.space === spaceKey) {
                 btn.classList.add('active');
             }
         });
         
         // 載入新場景
         this.loadScene(spaceKey);
     }
    
     update() {
         // 限制緯度範圍
         this.lat = Math.max(-85, Math.min(85, this.lat));
         
         // 轉換為弧度
         this.phi = THREE.MathUtils.degToRad(90 - this.lat);
         this.theta = THREE.MathUtils.degToRad(this.lon);
         
         // 更新相機位置
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

// 初始化應用
document.addEventListener('DOMContentLoaded', () => {
    const viewer = new PanoramaViewer();
    window.viewer = viewer; // 用於調試
});
