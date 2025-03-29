import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property, executeInEditMode, menu } = _decorator;

// 为了在编辑器中使用，需要声明editor变量
declare const editor: any;

/**
 * 项目设置脚本
 * 用于初始化项目目录结构
 */
@ccclass('ProjectSetup')
@executeInEditMode
@menu('着色器演示/项目设置')
export class ProjectSetup extends Component {
    @property({tooltip: '是否创建目录结构'})
    public createDirectories: boolean = false;
    
    @property({tooltip: '是否创建脚本文件'})
    public createScriptFiles: boolean = false;
    
    // 检查是否在编辑器中运行
    private get isEditor(): boolean {
        return sys.platform === sys.Platform.EDITOR_PAGE;
    }
    
    start() {
        // 仅在编辑器中执行，游戏运行时不执行任何操作
        if (!this.isEditor) {
            // 游戏运行时隐藏此节点
            this.node.active = false;
        }
    }
    
    /**
     * 目录结构配置
     */
    private readonly directories = [
        'assets/scenes/templates',
        'assets/scenes/transitions',
        'assets/scenes/weather',
        'assets/scenes/filters',
        'assets/prefabs/templates',
        'assets/scripts/templates',
        'assets/scripts/transitions',
        'assets/scripts/weather',
        'assets/scripts/filters',
        'assets/scripts/editor',
        'assets/effects/transitions',
        'assets/effects/weather',
        'assets/effects/filters',
        'assets/textures/demo'
    ];
    
    /**
     * 执行初始化
     */
    public initialize() {
        // 仅在编辑器环境执行
        if (!this.isEditor) return;
        
        if (this.createDirectories) {
            this.createDirectoryStructure();
        }
        
        if (this.createScriptFiles) {
            this.createScripts();
        }
        
        // 重置选项
        this.createDirectories = false;
        this.createScriptFiles = false;
        
        // 刷新编辑器
        if (typeof editor !== 'undefined') {
            editor.assetdb.refresh('db://assets', function() {
                console.log('项目资源刷新完成');
            });
        }
    }
    
    /**
     * 创建目录结构
     */
    private createDirectoryStructure() {
        if (!this.isEditor || typeof editor === 'undefined') {
            console.warn('只能在编辑器环境运行此操作');
            return;
        }
        
        // 创建目录
        this.directories.forEach(dir => {
            // 将路径转换为db://格式
            const dbPath = 'db://' + dir;
            
            // 创建目录
            editor.assetdb.create(dbPath, null, function(err, results) {
                if (err) {
                    console.error('创建目录失败:', dbPath, err);
                } else {
                    console.log('创建目录成功:', dbPath);
                }
            });
        });
    }
    
    /**
     * 创建脚本文件
     */
    private createScripts() {
        if (!this.isEditor || typeof editor === 'undefined') {
            console.warn('只能在编辑器环境运行此操作');
            return;
        }
        
        // 创建ShaderMenu.ts
        this.createScriptFile('assets/scripts/ShaderMenu.ts', this.getShaderMenuCode());
        
        // 创建ShaderDemo.ts
        this.createScriptFile('assets/scripts/ShaderDemo.ts', this.getShaderDemoCode());
    }
    
    /**
     * 创建脚本文件
     * @param path 文件路径
     * @param content 文件内容
     */
    private createScriptFile(path: string, content: string) {
        if (!this.isEditor || typeof editor === 'undefined') return;
        
        // 将路径转换为db://格式
        const dbPath = 'db://' + path;
        
        // 创建文件
        editor.assetdb.create(dbPath, content, function(err, results) {
            if (err) {
                console.error('创建脚本失败:', dbPath, err);
            } else {
                console.log('创建脚本成功:', dbPath);
            }
        });
    }
    
    /**
     * 获取ShaderMenu脚本代码
     */
    private getShaderMenuCode(): string {
        return `import { _decorator, Component, Node, Prefab, instantiate, Button, ScrollView, Toggle, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShaderMenu')
export class ShaderMenu extends Component {
    @property(Prefab)
    private buttonPrefab: Prefab = null;

    @property([Node])
    private categoryContainers: Node[] = [];
    
    @property([Toggle])
    private categoryToggles: Toggle[] = [];
    
    @property([ScrollView])
    private categoryLists: ScrollView[] = [];
    
    // 配置各种类型的效果
    private transitions = [
        {name: '波浪过渡', scene: 'transitions/wave_transition_demo'},
        {name: '圆形过渡', scene: 'transitions/circle_transition_demo'},
        {name: '百叶窗过渡', scene: 'transitions/blinds_transition_demo'},
        {name: '涡旋过渡', scene: 'transitions/vortex_transition_demo'}
    ];
    
    private weather = [
        {name: '雨效果', scene: 'weather/rain_demo'},
        {name: '雪效果', scene: 'weather/snow_demo'}
    ];
    
    private filters = [
        {name: '马赛克', scene: 'filters/mosaic_demo'},
        {name: '像素化', scene: 'filters/pixelate_demo'},
        {name: '溶解', scene: 'filters/dissolve_demo'},
        {name: '外发光', scene: 'filters/outline_demo'},
        {name: '灰度', scene: 'filters/grayscale_demo'}
    ];

    start() {
        this.initializeMenu();
        this.setupCategoryToggles();
    }

    private setupCategoryToggles() {
        // 设置分类切换
        if (this.categoryToggles.length > 0 && this.categoryLists.length > 0) {
            this.categoryToggles.forEach((toggle, index) => {
                toggle.node.on('toggle', (toggle) => {
                    const isChecked = toggle.isChecked;
                    if (isChecked && index < this.categoryLists.length) {
                        this.showCategory(index);
                    }
                });
            });
            
            // 默认显示第一个分类
            this.showCategory(0);
        }
    }
    
    private showCategory(index: number) {
        this.categoryLists.forEach((list, i) => {
            list.node.active = (i === index);
        });
    }

    private initializeMenu() {
        // 初始化主菜单按钮
        this.createCategoryButtons(this.transitions, 0);
        this.createCategoryButtons(this.weather, 1);
        this.createCategoryButtons(this.filters, 2);
    }
    
    private createCategoryButtons(items, categoryIndex) {
        if (!this.buttonPrefab || categoryIndex >= this.categoryContainers.length) return;
        
        const container = this.categoryContainers[categoryIndex];
        if (!container) return;
        
        items.forEach((item, index) => {
            const buttonNode = instantiate(this.buttonPrefab);
            const button = buttonNode.getComponent(Button);
            
            // 设置按钮文本
            const label = buttonNode.getChildByName('Label');
            if (label) {
                const labelComp = label.getComponent(Label);
                if (labelComp) {
                    labelComp.string = \`\${index < 10 ? '0' + index : index} \${item.name}\`;
                }
            }
            
            // 设置点击事件
            button.node.on('click', () => {
                this.loadShaderScene(item.scene);
            });
            
            container.addChild(buttonNode);
        });
    }

    private loadShaderScene(sceneName: string) {
        director.loadScene(sceneName);
    }
}`;
    }
    
    /**
     * 获取ShaderDemo脚本代码
     */
    private getShaderDemoCode(): string {
        return `import { _decorator, Component, Node, Slider, Button, Label, Material, Sprite, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShaderDemo')
export class ShaderDemo extends Component {
    @property(Material)
    protected material: Material = null;

    @property(Sprite)
    protected previewSprite: Sprite = null;

    @property([Node])
    protected parameterControls: Node[] = [];

    @property(Button)
    protected backButton: Button = null;

    @property([String])
    protected parameterNames: string[] = [];
    
    @property([Button])
    protected presetButtons: Button[] = [];
    
    protected isAnimating: boolean = false;
    protected animationProgress: number = 0;
    
    @property(Button)
    protected animateButton: Button = null;

    start() {
        // 初始化返回按钮
        if (this.backButton) {
            this.backButton.node.on('click', this.onBackButtonClicked, this);
        }
        
        // 初始化参数控制器
        this.initParameterControls();
        
        // 初始化动画按钮
        if (this.animateButton) {
            this.animateButton.node.on('click', this.onAnimateButtonClicked, this);
        }
        
        // 应用初始参数到着色器
        this.updateShaderParameters();
    }

    protected initParameterControls() {
        // 实现滑块控制逻辑
        if (this.parameterControls.length > 0 && this.parameterNames.length > 0) {
            for (let i = 0; i < this.parameterControls.length && i < this.parameterNames.length; i++) {
                const control = this.parameterControls[i];
                const paramName = this.parameterNames[i];
                
                const slider = control.getComponent(Slider);
                if (slider) {
                    slider.node.on('slide', () => {
                        this.updateShaderParameter(paramName, this.denormalizeValue(slider.progress, paramName));
                    });
                }
            }
        }
    }

    protected normalizeValue(value: number, paramName: string): number {
        // 将实际值转换为滑块范围 (0-1)
        // 这里需要根据不同参数设置不同的转换规则
        return value;
    }

    protected denormalizeValue(progress: number, paramName: string): number {
        // 将滑块值 (0-1) 转换为实际参数值
        // 这里需要根据不同参数设置不同的转换规则
        return progress;
    }

    protected updateShaderParameters() {
        // 更新所有着色器参数
        if (this.material && this.parameterNames.length > 0) {
            for (let i = 0; i < this.parameterControls.length && i < this.parameterNames.length; i++) {
                const control = this.parameterControls[i];
                const paramName = this.parameterNames[i];
                
                const slider = control.getComponent(Slider);
                if (slider) {
                    this.updateShaderParameter(paramName, this.denormalizeValue(slider.progress, paramName));
                }
            }
        }
    }
    
    protected updateShaderParameter(name: string, value: number) {
        if (this.material) {
            this.material.setProperty(name, value);
        }
    }

    protected onBackButtonClicked() {
        // 返回主菜单
        director.loadScene('main');
    }

    protected applyPreset(presetData: Record<string, number>) {
        // 应用预设
        if (this.material && presetData) {
            for (const paramName in presetData) {
                if (this.parameterNames.includes(paramName)) {
                    const value = presetData[paramName];
                    this.updateShaderParameter(paramName, value);
                    
                    // 更新UI控件
                    const index = this.parameterNames.indexOf(paramName);
                    if (index >= 0 && index < this.parameterControls.length) {
                        const slider = this.parameterControls[index].getComponent(Slider);
                        if (slider) {
                            slider.progress = this.normalizeValue(value, paramName);
                        }
                    }
                }
            }
        }
    }
    
    protected updateControlsFromMaterial() {
        // 根据材质更新UI控件
        if (this.material && this.parameterNames.length > 0) {
            // 具体实现取决于如何从材质中获取属性值
            // 以及如何将这些值映射到UI控件
        }
    }
    
    protected onAnimateButtonClicked() {
        // 切换动画状态
        this.isAnimating = !this.isAnimating;
        
        // 更新按钮文本
        if (this.animateButton) {
            const label = this.animateButton.node.getChildByName('Label');
            if (label) {
                const labelComp = label.getComponent(Label);
                if (labelComp) {
                    labelComp.string = this.isAnimating ? '停止' : '播放';
                }
            }
        }
    }
}`;
    }
    
    update() {
        // 仅在编辑器环境执行
        if (!this.isEditor) return;
        
        // 方便在编辑器中点击执行
        if (this.createDirectories || this.createScriptFiles) {
            this.initialize();
        }
    }
} 