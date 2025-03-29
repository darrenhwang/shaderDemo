import { _decorator, Component, Node, Slider, Button, Label, Material, Sprite, director } from 'cc';
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
                if (this.parameterNames.indexOf(paramName) >= 0) {
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
}