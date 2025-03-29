import { _decorator, Component, Node, Button, Label, ScrollView, Prefab, instantiate, Sprite, Material, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 基础场景模板
 * 为所有着色器效果演示场景提供基础结构和功能
 */
@ccclass('BaseSceneTemplate')
export class BaseSceneTemplate extends Component {
    // 场景标题
    @property(Label)
    public titleLabel: Label = null;

    // 预览区域
    @property(Sprite)
    public previewSprite: Sprite = null;

    // 材质
    @property(Material)
    public material: Material = null;

    // 返回按钮
    @property(Button)
    public backButton: Button = null;

    // 参数面板
    @property(ScrollView)
    public parametersScrollView: ScrollView = null;

    // 参数滑块预制体
    @property(Prefab)
    public sliderPrefab: Prefab = null;

    // 预设按钮容器
    @property(Node)
    public presetsContainer: Node = null;

    // 预设按钮预制体
    @property(Prefab)
    public presetButtonPrefab: Prefab = null;

    // 动画控制按钮
    @property(Button)
    public animateButton: Button = null;

    protected onLoad() {
        // 设置返回按钮事件
        if (this.backButton) {
            this.backButton.node.on('click', this.onBackButtonClicked, this);
        }

        // 设置动画按钮事件
        if (this.animateButton) {
            this.animateButton.node.on('click', this.onAnimateButtonClicked, this);
        }

        // 应用材质到预览精灵
        if (this.previewSprite && this.material) {
            this.previewSprite.customMaterial = this.material;
        }
    }

    /**
     * 返回主菜单
     */
    protected onBackButtonClicked() {
        director.loadScene('main');
    }

    /**
     * 动画按钮点击事件
     */
    protected onAnimateButtonClicked() {
        // 子类实现动画逻辑
    }

    /**
     * 添加参数滑块
     * @param name 参数名称
     * @param min 最小值
     * @param max 最大值 
     * @param defaultValue 默认值
     * @param callback 值变化回调
     */
    protected addParameterSlider(name: string, min: number, max: number, defaultValue: number, callback: (value: number) => void) {
        if (!this.parametersScrollView || !this.sliderPrefab) {
            return null;
        }

        const sliderNode = instantiate(this.sliderPrefab);
        this.parametersScrollView.content.addChild(sliderNode);

        // 设置滑块参数 (具体实现取决于滑块预制体结构)
        const sliderComp = sliderNode.getComponent('ParameterSlider') as any;
        if (sliderComp && typeof sliderComp.init === 'function') {
            sliderComp.init(name, min, max, defaultValue, callback);
        }

        return sliderNode;
    }

    /**
     * 添加预设按钮
     * @param name 预设名称
     * @param callback 点击回调
     */
    protected addPresetButton(name: string, callback: () => void) {
        if (!this.presetsContainer || !this.presetButtonPrefab) {
            return null;
        }

        const buttonNode = instantiate(this.presetButtonPrefab);
        this.presetsContainer.addChild(buttonNode);

        // 设置按钮文本
        const label = buttonNode.getChildByName('Label');
        if (label) {
            label.getComponent(Label).string = name;
        }

        // 设置点击事件
        const button = buttonNode.getComponent(Button);
        if (button) {
            button.node.on('click', callback, this);
        }

        return buttonNode;
    }

    /**
     * 设置场景标题
     * @param title 标题文本
     */
    protected setTitle(title: string) {
        if (this.titleLabel) {
            this.titleLabel.string = title;
        }
    }
} 