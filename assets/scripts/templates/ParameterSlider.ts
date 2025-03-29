import { _decorator, Component, Node, Slider, Label, EditBox } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 参数滑块组件
 * 为着色器参数提供UI交互控制
 */
@ccclass('ParameterSlider')
export class ParameterSlider extends Component {
    @property(Label)
    public nameLabel: Label = null;
    
    @property(Slider)
    public slider: Slider = null;
    
    @property(EditBox)
    public valueInput: EditBox = null;
    
    private minValue: number = 0;
    private maxValue: number = 1;
    private currentValue: number = 0;
    private valueChangeCallback: (value: number) => void = null;
    
    /**
     * 初始化滑块参数
     * @param name 参数名称
     * @param min 最小值
     * @param max 最大值
     * @param defaultValue 默认值
     * @param callback 值变化回调
     */
    public init(name: string, min: number, max: number, defaultValue: number, callback: (value: number) => void) {
        this.minValue = min;
        this.maxValue = max;
        this.valueChangeCallback = callback;
        
        // 设置参数名称
        if (this.nameLabel) {
            this.nameLabel.string = name;
        }
        
        // 设置滑块初始值
        if (this.slider) {
            // 将值标准化为0-1之间用于滑块
            const normalizedValue = this.normalizeValue(defaultValue);
            this.slider.progress = normalizedValue;
            this.slider.node.on('slide', this.onSliderChange, this);
        }
        
        // 设置输入框初始值
        if (this.valueInput) {
            this.valueInput.string = defaultValue.toFixed(2);
            this.valueInput.node.on('editing-did-ended', this.onInputChange, this);
        }
        
        this.currentValue = defaultValue;
    }
    
    /**
     * 滑块值变化处理
     * @param slider 滑块组件
     */
    private onSliderChange(slider: Slider) {
        const denormalizedValue = this.denormalizeValue(slider.progress);
        this.updateValue(denormalizedValue);
    }
    
    /**
     * 输入框值变化处理
     */
    private onInputChange() {
        if (this.valueInput) {
            const value = parseFloat(this.valueInput.string);
            if (!isNaN(value)) {
                // 限制在有效范围内
                const clampedValue = Math.max(this.minValue, Math.min(this.maxValue, value));
                this.updateValue(clampedValue);
            }
        }
    }
    
    /**
     * 更新控件值
     * @param value 实际参数值
     */
    private updateValue(value: number) {
        this.currentValue = value;
        
        // 更新输入框
        if (this.valueInput) {
            this.valueInput.string = value.toFixed(2);
        }
        
        // 更新滑块（如果触发源不是滑块）
        if (this.slider && Math.abs(this.normalizeValue(value) - this.slider.progress) > 0.001) {
            this.slider.progress = this.normalizeValue(value);
        }
        
        // 调用回调函数
        if (this.valueChangeCallback) {
            this.valueChangeCallback(value);
        }
    }
    
    /**
     * 将实际值标准化为0-1之间（用于滑块）
     * @param value 实际参数值
     * @returns 标准化后的值 (0-1)
     */
    private normalizeValue(value: number): number {
        if (this.maxValue === this.minValue) return 0;
        return (value - this.minValue) / (this.maxValue - this.minValue);
    }
    
    /**
     * 将0-1之间的值转换为实际参数值
     * @param normalized 标准化的值 (0-1)
     * @returns 实际参数值
     */
    private denormalizeValue(normalized: number): number {
        return this.minValue + normalized * (this.maxValue - this.minValue);
    }
    
    /**
     * 获取当前值
     * @returns 当前参数值
     */
    public getValue(): number {
        return this.currentValue;
    }
    
    /**
     * 设置当前值
     * @param value 要设置的值
     */
    public setValue(value: number) {
        this.updateValue(value);
    }
} 