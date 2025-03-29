import { _decorator, Component, Node, director, Prefab, instantiate, Button, Label, Sprite, SpriteFrame, ScrollView, EditBox, Slider, UITransform, Layout, Color, Asset, resources, assetManager, Material, Canvas, Widget, Size, find, sys } from 'cc';
const { ccclass, property, executeInEditMode, menu } = _decorator;

// 为了在编辑器中使用，需要声明editor变量
declare const editor: any;

/**
 * 场景生成器
 * 用于自动创建着色器演示场景和相关预制体
 */
@ccclass('SceneGenerator')
@executeInEditMode
@menu('着色器演示/场景生成器')
export class SceneGenerator extends Component {
    @property({tooltip: '是否创建预制体'})
    public createPrefabs: boolean = false;
    
    @property({tooltip: '是否创建基础场景'})
    public createBaseScene: boolean = false;
    
    @property({tooltip: '是否创建波浪过渡场景'})
    public createWaveScene: boolean = false;
    
    @property({tooltip: '是否创建雨效果场景'})
    public createRainEffect: boolean = false;
    
    @property({tooltip: '是否创建马赛克效果场景'})
    public createMosaicEffect: boolean = false;
    
    @property({tooltip: '预览图片'})
    public previewImage: SpriteFrame = null;
    
    @property({tooltip: '参考材质'})
    public referenceMaterial: Material = null;
    
    // 存储已创建的预制体引用
    private sliderPrefab: Node = null;
    private presetButtonPrefab: Node = null;
    
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
     * 执行生成操作
     */
    public generate() {
        // 仅在编辑器环境执行
        if (!this.isEditor) return;
        
        if (this.createPrefabs) {
            this.createRequiredPrefabs();
        }
        
        if (this.createBaseScene) {
            this.createSceneTemplate();
        }
        
        if (this.createWaveScene) {
            this.createWaveTransitionScene();
        }
        
        if (this.createRainEffect) {
            this.createRainEffectScene();
        }
        
        if (this.createMosaicEffect) {
            this.createMosaicEffectScene();
        }
        
        // 重置选项
        this.createPrefabs = false;
        this.createBaseScene = false;
        this.createWaveScene = false;
        this.createRainEffect = false;
        this.createMosaicEffect = false;
        
        // 刷新编辑器
        if (typeof editor !== 'undefined') {
            editor.Selection.clear();
            editor.Selection.select('db://assets/prefabs', 'db://assets/scenes');
        }
    }
    
    /**
     * 创建所需的预制体
     */
    private createRequiredPrefabs() {
        // 仅在编辑器环境执行
        if (!this.isEditor) return;
        
        // 创建参数滑块预制体
        this.sliderPrefab = this.createParameterSliderPrefab();
        
        // 创建预设按钮预制体
        this.presetButtonPrefab = this.createPresetButtonPrefab();
    }
    
    /**
     * 创建参数滑块预制体
     */
    private createParameterSliderPrefab(): Node {
        // 仅在编辑器环境执行
        if (!this.isEditor) return null;
        
        // 创建根节点
        const sliderNode = new Node('ParameterSlider');
        const transform = sliderNode.addComponent(UITransform);
        transform.width = 400;
        transform.height = 60;
        
        // 添加布局组件
        const layout = sliderNode.addComponent(Layout);
        layout.type = Layout.Type.HORIZONTAL;
        layout.resizeMode = Layout.ResizeMode.CONTAINER;
        layout.paddingLeft = 10;
        layout.paddingRight = 10;
        layout.spacingX = 10;
        
        // 创建名称标签
        const nameLabel = new Node('NameLabel');
        const nameLabelTr = nameLabel.addComponent(UITransform);
        nameLabelTr.width = 120;
        nameLabelTr.height = 40;
        const nameComp = nameLabel.addComponent(Label);
        nameComp.string = '参数名称';
        nameComp.color = new Color(255, 255, 255, 255);
        nameComp.fontSize = 16;
        nameComp.horizontalAlign = Label.HorizontalAlign.LEFT;
        sliderNode.addChild(nameLabel);
        
        // 创建滑块
        const slider = new Node('Slider');
        const sliderTr = slider.addComponent(UITransform);
        sliderTr.width = 180;
        sliderTr.height = 40;
        const sliderComp = slider.addComponent(Slider);
        sliderComp.progress = 0.5;
        sliderNode.addChild(slider);
        
        // 创建滑块填充条
        const handle = new Node('Handle');
        const handleTr = handle.addComponent(UITransform);
        handleTr.width = 20;
        handleTr.height = 40;
        const handleSprite = handle.addComponent(Sprite);
        handleSprite.color = new Color(255, 255, 255, 255);
        slider.addChild(handle);
        
        // 创建数值输入框
        const valueInput = new Node('ValueInput');
        const valueInputTr = valueInput.addComponent(UITransform);
        valueInputTr.width = 60;
        valueInputTr.height = 40;
        const valueInputComp = valueInput.addComponent(EditBox);
        valueInputComp.string = '0.5';
        valueInputComp.maxLength = 5;
        valueInputComp.backgroundImage = null;
        valueInputComp.placeholderLabel = null;
        sliderNode.addChild(valueInput);
        
        // 添加组件脚本
        sliderNode.addComponent('ParameterSlider');
        
        // 保存为预制体
        if (typeof editor !== 'undefined') {
            editor.assetdb.createOrSave('db://assets/prefabs/templates/ParameterSlider.prefab', sliderNode);
        }
        
        return sliderNode;
    }
    
    /**
     * 创建预设按钮预制体
     */
    private createPresetButtonPrefab(): Node {
        // 仅在编辑器环境执行
        if (!this.isEditor) return null;
        
        // 创建根节点
        const buttonNode = new Node('PresetButton');
        const transform = buttonNode.addComponent(UITransform);
        transform.width = 120;
        transform.height = 40;
        
        // 添加按钮组件
        const button = buttonNode.addComponent(Button);
        
        // 创建背景
        const background = new Node('Background');
        const bgTransform = background.addComponent(UITransform);
        bgTransform.width = 120;
        bgTransform.height = 40;
        const bgSprite = background.addComponent(Sprite);
        bgSprite.color = new Color(64, 64, 64, 255);
        button.target = background;
        button.transition = Button.Transition.COLOR;
        button.normalColor = new Color(64, 64, 64, 255);
        button.hoverColor = new Color(80, 80, 80, 255);
        button.pressedColor = new Color(40, 40, 40, 255);
        button.disabledColor = new Color(40, 40, 40, 128);
        buttonNode.addChild(background);
        
        // 创建标签
        const label = new Node('Label');
        const labelTr = label.addComponent(UITransform);
        labelTr.width = 100;
        labelTr.height = 40;
        const labelComp = label.addComponent(Label);
        labelComp.string = '预设';
        labelComp.color = new Color(255, 255, 255, 255);
        labelComp.fontSize = 16;
        labelComp.horizontalAlign = Label.HorizontalAlign.CENTER;
        labelComp.verticalAlign = Label.VerticalAlign.CENTER;
        background.addChild(label);
        
        // 添加组件脚本
        buttonNode.addComponent('PresetButton');
        
        // 保存为预制体
        if (typeof editor !== 'undefined') {
            editor.assetdb.createOrSave('db://assets/prefabs/templates/PresetButton.prefab', buttonNode);
        }
        
        return buttonNode;
    }
    
    /**
     * 创建场景模板
     */
    private createSceneTemplate() {
        // 仅在编辑器环境执行
        if (!this.isEditor) return;
        
        // 创建根节点
        const rootNode = new Node('Canvas');
        rootNode.addComponent(Canvas);
        const canvasWidget = rootNode.addComponent(Widget);
        canvasWidget.isAlignLeft = canvasWidget.isAlignRight = canvasWidget.isAlignTop = canvasWidget.isAlignBottom = true;
        canvasWidget.left = canvasWidget.right = canvasWidget.top = canvasWidget.bottom = 0;
        
        // 创建摄像机
        const cameraNode = new Node('Camera');
        rootNode.addChild(cameraNode);
        
        // 创建标题
        const titleNode = new Node('Title');
        const titleTr = titleNode.addComponent(UITransform);
        titleTr.width = 600;
        titleTr.height = 60;
        const titleWidget = titleNode.addComponent(Widget);
        titleWidget.isAlignTop = true;
        titleWidget.top = 20;
        titleWidget.horizontalCenter = 0;
        const titleLabel = titleNode.addComponent(Label);
        titleLabel.string = '着色器效果演示';
        titleLabel.fontSize = 32;
        titleLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        rootNode.addChild(titleNode);
        
        // 创建返回按钮
        const backBtn = new Node('BackButton');
        const backBtnTr = backBtn.addComponent(UITransform);
        backBtnTr.width = 100;
        backBtnTr.height = 40;
        const backBtnWidget = backBtn.addComponent(Widget);
        backBtnWidget.isAlignLeft = true;
        backBtnWidget.isAlignTop = true;
        backBtnWidget.left = 20;
        backBtnWidget.top = 20;
        const backBtnComp = backBtn.addComponent(Button);
        
        // 返回按钮背景
        const backBtnBg = new Node('Background');
        const backBtnBgTr = backBtnBg.addComponent(UITransform);
        backBtnBgTr.width = 100;
        backBtnBgTr.height = 40;
        const backBtnBgSprite = backBtnBg.addComponent(Sprite);
        backBtnBgSprite.color = new Color(64, 64, 64, 255);
        backBtnComp.target = backBtnBg;
        backBtnComp.transition = Button.Transition.COLOR;
        backBtnComp.normalColor = new Color(64, 64, 64, 255);
        backBtnComp.hoverColor = new Color(80, 80, 80, 255);
        backBtnComp.pressedColor = new Color(40, 40, 40, 255);
        backBtn.addChild(backBtnBg);
        
        // 返回按钮标签
        const backBtnLabel = new Node('Label');
        const backBtnLabelTr = backBtnLabel.addComponent(UITransform);
        backBtnLabelTr.width = 100;
        backBtnLabelTr.height = 40;
        const backBtnLabelComp = backBtnLabel.addComponent(Label);
        backBtnLabelComp.string = '返回';
        backBtnLabelComp.color = new Color(255, 255, 255, 255);
        backBtnLabelComp.fontSize = 16;
        backBtnBg.addChild(backBtnLabel);
        rootNode.addChild(backBtn);
        
        // 创建预览区域
        const previewArea = new Node('PreviewArea');
        const previewAreaTr = previewArea.addComponent(UITransform);
        previewAreaTr.width = 500;
        previewAreaTr.height = 300;
        const previewAreaWidget = previewArea.addComponent(Widget);
        previewAreaWidget.horizontalCenter = 0;
        previewAreaWidget.isAlignTop = true;
        previewAreaWidget.top = 100;
        rootNode.addChild(previewArea);
        
        // 创建预览精灵
        const previewSprite = new Node('PreviewSprite');
        const previewSpriteTr = previewSprite.addComponent(UITransform);
        previewSpriteTr.width = 500;
        previewSpriteTr.height = 300;
        const previewSpriteComp = previewSprite.addComponent(Sprite);
        previewSpriteComp.spriteFrame = this.previewImage;
        previewArea.addChild(previewSprite);
        
        // 创建参数面板
        const paramsPanel = new Node('ParametersPanel');
        const paramsPanelTr = paramsPanel.addComponent(UITransform);
        paramsPanelTr.width = 500;
        paramsPanelTr.height = 200;
        const paramsPanelWidget = paramsPanel.addComponent(Widget);
        paramsPanelWidget.horizontalCenter = 0;
        paramsPanelWidget.isAlignTop = true;
        paramsPanelWidget.top = 420;
        rootNode.addChild(paramsPanel);
        
        // 创建参数面板标题
        const paramsPanelTitle = new Node('Title');
        const paramsPanelTitleTr = paramsPanelTitle.addComponent(UITransform);
        paramsPanelTitleTr.width = 500;
        paramsPanelTitleTr.height = 30;
        const paramsPanelTitleLabel = paramsPanelTitle.addComponent(Label);
        paramsPanelTitleLabel.string = '参数控制';
        paramsPanelTitleLabel.fontSize = 20;
        paramsPanelTitleLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        paramsPanel.addChild(paramsPanelTitle);
        
        // 创建参数滚动视图
        const paramsScrollView = new Node('ScrollView');
        const paramsScrollViewTr = paramsScrollView.addComponent(UITransform);
        paramsScrollViewTr.width = 500;
        paramsScrollViewTr.height = 170;
        const paramsScrollViewComp = paramsScrollView.addComponent(ScrollView);
        paramsPanel.addChild(paramsScrollView);
        
        // 创建参数内容容器
        const paramsContent = new Node('Content');
        const paramsContentTr = paramsContent.addComponent(UITransform);
        paramsContentTr.width = 500;
        paramsContentTr.height = 400; // 可滚动高度
        const paramsContentLayout = paramsContent.addComponent(Layout);
        paramsContentLayout.type = Layout.Type.VERTICAL;
        paramsContentLayout.resizeMode = Layout.ResizeMode.CONTAINER;
        paramsContentLayout.paddingTop = 10;
        paramsContentLayout.paddingBottom = 10;
        paramsContentLayout.spacingY = 10;
        paramsScrollViewComp.content = paramsContent;
        paramsScrollView.addChild(paramsContent);
        
        // 创建预设面板
        const presetsPanel = new Node('PresetsPanel');
        const presetsPanelTr = presetsPanel.addComponent(UITransform);
        presetsPanelTr.width = 500;
        presetsPanelTr.height = 100;
        const presetsPanelWidget = presetsPanel.addComponent(Widget);
        presetsPanelWidget.horizontalCenter = 0;
        presetsPanelWidget.isAlignTop = true;
        presetsPanelWidget.top = 640;
        rootNode.addChild(presetsPanel);
        
        // 创建预设面板标题
        const presetsPanelTitle = new Node('Title');
        const presetsPanelTitleTr = presetsPanelTitle.addComponent(UITransform);
        presetsPanelTitleTr.width = 500;
        presetsPanelTitleTr.height = 30;
        const presetsPanelTitleLabel = presetsPanelTitle.addComponent(Label);
        presetsPanelTitleLabel.string = '预设效果';
        presetsPanelTitleLabel.fontSize = 20;
        presetsPanelTitleLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        presetsPanel.addChild(presetsPanelTitle);
        
        // 创建预设按钮容器
        const presetsContainer = new Node('PresetsContainer');
        const presetsContainerTr = presetsContainer.addComponent(UITransform);
        presetsContainerTr.width = 500;
        presetsContainerTr.height = 60;
        const presetsContainerLayout = presetsContainer.addComponent(Layout);
        presetsContainerLayout.type = Layout.Type.HORIZONTAL;
        presetsContainerLayout.resizeMode = Layout.ResizeMode.CONTAINER;
        presetsContainerLayout.paddingLeft = 10;
        presetsContainerLayout.paddingRight = 10;
        presetsContainerLayout.spacingX = 10;
        presetsPanel.addChild(presetsContainer);
        
        // 创建动画控制按钮
        const animateBtn = new Node('AnimateButton');
        const animateBtnTr = animateBtn.addComponent(UITransform);
        animateBtnTr.width = 100;
        animateBtnTr.height = 40;
        const animateBtnWidget = animateBtn.addComponent(Widget);
        animateBtnWidget.horizontalCenter = 0;
        animateBtnWidget.isAlignTop = true;
        animateBtnWidget.top = 760;
        const animateBtnComp = animateBtn.addComponent(Button);
        
        // 动画按钮背景
        const animateBtnBg = new Node('Background');
        const animateBtnBgTr = animateBtnBg.addComponent(UITransform);
        animateBtnBgTr.width = 100;
        animateBtnBgTr.height = 40;
        const animateBtnBgSprite = animateBtnBg.addComponent(Sprite);
        animateBtnBgSprite.color = new Color(64, 64, 64, 255);
        animateBtnComp.target = animateBtnBg;
        animateBtnComp.transition = Button.Transition.COLOR;
        animateBtnComp.normalColor = new Color(64, 64, 64, 255);
        animateBtnComp.hoverColor = new Color(80, 80, 80, 255);
        animateBtnComp.pressedColor = new Color(40, 40, 40, 255);
        animateBtn.addChild(animateBtnBg);
        
        // 动画按钮标签
        const animateBtnLabel = new Node('Label');
        const animateBtnLabelTr = animateBtnLabel.addComponent(UITransform);
        animateBtnLabelTr.width = 100;
        animateBtnLabelTr.height = 40;
        const animateBtnLabelComp = animateBtnLabel.addComponent(Label);
        animateBtnLabelComp.string = '播放';
        animateBtnLabelComp.color = new Color(255, 255, 255, 255);
        animateBtnLabelComp.fontSize = 16;
        animateBtnBg.addChild(animateBtnLabel);
        rootNode.addChild(animateBtn);
        
        // 添加BaseSceneTemplate脚本组件
        const baseSceneTemplate = rootNode.addComponent('BaseSceneTemplate') as any;
        
        // 如果有参考材质，设置它
        if (this.referenceMaterial) {
            baseSceneTemplate.material = this.referenceMaterial;
        }
        
        // 设置组件引用
        baseSceneTemplate.titleLabel = titleLabel;
        baseSceneTemplate.previewSprite = previewSpriteComp;
        baseSceneTemplate.backButton = backBtnComp;
        baseSceneTemplate.parametersScrollView = paramsScrollViewComp;
        baseSceneTemplate.presetsContainer = presetsContainer;
        baseSceneTemplate.animateButton = animateBtnComp;
        
        // 保存场景
        if (typeof editor !== 'undefined') {
            editor.assetdb.createOrSave('db://assets/scenes/templates/BaseSceneTemplate.scene', rootNode);
        }
    }
    
    /**
     * 创建波浪过渡效果场景
     */
    private createWaveTransitionScene() {
        // 仅在编辑器环境执行
        if (!this.isEditor) return;
        
        // 创建根节点
        const rootNode = this.cloneBaseSceneTemplate();
        if (!rootNode) return;
        
        // 修改标题
        const titleNode = rootNode.getChildByName('Title');
        if (titleNode) {
            const titleLabel = titleNode.getComponent(Label);
            if (titleLabel) {
                titleLabel.string = '波浪过渡效果';
            }
        }
        
        // 创建波浪过渡材质
        const material = new Material();
        // 设置材质属性
        material.name = 'WaveTransitionMaterial';
        
        // 应用材质到预览精灵
        const previewArea = rootNode.getChildByName('PreviewArea');
        if (previewArea) {
            const previewSprite = previewArea.getChildByName('PreviewSprite');
            if (previewSprite) {
                const spriteComp = previewSprite.getComponent(Sprite);
                if (spriteComp) {
                    spriteComp.customMaterial = material;
                }
            }
        }
        
        // 添加WaveTransitionDemo脚本
        rootNode.addComponent('WaveTransitionDemo');
        
        // 保存场景
        if (typeof editor !== 'undefined') {
            editor.assetdb.createOrSave('db://assets/scenes/transitions/wave_transition_demo.scene', rootNode);
        }
    }
    
    /**
     * 创建雨效果场景
     */
    private createRainEffectScene() {
        // 仅在编辑器环境执行
        if (!this.isEditor) return;
        
        // 创建根节点
        const rootNode = this.cloneBaseSceneTemplate();
        if (!rootNode) return;
        
        // 修改标题
        const titleNode = rootNode.getChildByName('Title');
        if (titleNode) {
            const titleLabel = titleNode.getComponent(Label);
            if (titleLabel) {
                titleLabel.string = '雨效果';
            }
        }
        
        // 创建雨效果材质
        const material = new Material();
        // 设置材质属性
        material.name = 'RainMaterial';
        
        // 应用材质到预览精灵
        const previewArea = rootNode.getChildByName('PreviewArea');
        if (previewArea) {
            const previewSprite = previewArea.getChildByName('PreviewSprite');
            if (previewSprite) {
                const spriteComp = previewSprite.getComponent(Sprite);
                if (spriteComp) {
                    spriteComp.customMaterial = material;
                }
            }
        }
        
        // 添加RainDemo脚本
        rootNode.addComponent('RainDemo');
        
        // 保存场景
        if (typeof editor !== 'undefined') {
            editor.assetdb.createOrSave('db://assets/scenes/weather/rain_demo.scene', rootNode);
        }
    }
    
    /**
     * 创建马赛克效果场景
     */
    private createMosaicEffectScene() {
        // 仅在编辑器环境执行
        if (!this.isEditor) return;
        
        // 创建根节点
        const rootNode = this.cloneBaseSceneTemplate();
        if (!rootNode) return;
        
        // 修改标题
        const titleNode = rootNode.getChildByName('Title');
        if (titleNode) {
            const titleLabel = titleNode.getComponent(Label);
            if (titleLabel) {
                titleLabel.string = '马赛克效果';
            }
        }
        
        // 创建马赛克材质
        const material = new Material();
        // 设置材质属性
        material.name = 'MosaicMaterial';
        
        // 应用材质到预览精灵
        const previewArea = rootNode.getChildByName('PreviewArea');
        if (previewArea) {
            const previewSprite = previewArea.getChildByName('PreviewSprite');
            if (previewSprite) {
                const spriteComp = previewSprite.getComponent(Sprite);
                if (spriteComp) {
                    spriteComp.customMaterial = material;
                }
            }
        }
        
        // 添加MosaicDemo脚本
        rootNode.addComponent('MosaicDemo');
        
        // 保存场景
        if (typeof editor !== 'undefined') {
            editor.assetdb.createOrSave('db://assets/scenes/filters/mosaic_demo.scene', rootNode);
        }
    }
    
    /**
     * 克隆基础场景模板
     */
    private cloneBaseSceneTemplate(): Node {
        // 仅在编辑器环境执行
        if (!this.isEditor) return null;
        
        // 创建一个空的Canvas节点
        const node = new Node('Canvas');
        node.addComponent(Canvas);
        
        // 在实际运行时，你可能需要使用其他方法来克隆场景
        // 例如，加载基础场景模板的预制体并实例化
        
        return node;
    }
    
    update() {
        // 仅在编辑器环境执行
        if (!this.isEditor) return;
        
        // 方便在编辑器中点击执行
        if (this.createPrefabs || this.createBaseScene || this.createWaveScene || this.createRainEffect || this.createMosaicEffect) {
            this.generate();
        }
    }
} 