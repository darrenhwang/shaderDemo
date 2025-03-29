import { _decorator, Component, Node, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 预设按钮组件
 * 为着色器预设提供UI交互控制
 */
@ccclass('PresetButton')
export class PresetButton extends Component {
    @property(Button)
    public button: Button = null;
    
    @property(Label)
    public label: Label = null;
    
    private callback: () => void = null;
    
    /**
     * 初始化预设按钮
     * @param name 预设名称
     * @param callback 点击回调
     */
    public init(name: string, callback: () => void) {
        // 设置按钮文本
        if (this.label) {
            this.label.string = name;
        }
        
        // 保存回调函数
        this.callback = callback;
        
        // 设置点击事件
        if (this.button) {
            this.button.node.on('click', this.onClick, this);
        }
    }
    
    /**
     * 按钮点击处理
     */
    private onClick() {
        if (this.callback) {
            this.callback();
        }
    }
} 