import { _decorator, Component, Node, Color, Label } from 'cc';
import { BaseSceneTemplate } from '../templates/BaseSceneTemplate';
const { ccclass, property } = _decorator;

/**
 * 雨效果演示
 */
@ccclass('RainDemo')
export class RainDemo extends BaseSceneTemplate {
    // 雨效果参数
    private intensity: number = 0.5;     // 雨量强度
    private speed: number = 1.0;         // 下落速度
    private angle: number = 0.0;         // 雨滴角度
    private dropSize: number = 0.05;     // 雨滴大小
    private dropLength: number = 0.3;    // 雨滴长度
    private color: Color = new Color(255, 255, 255, 128); // 雨滴颜色
    
    // 动画相关
    private isAnimating: boolean = false;
    
    start() {
        // 设置场景标题
        this.setTitle('雨效果');
        
        // 添加参数滑块
        this.addIntensitySlider();
        this.addSpeedSlider();
        this.addAngleSlider();
        this.addDropSizeSlider();
        this.addDropLengthSlider();
        
        // 添加预设按钮
        this.addPresetButtons();
        
        // 应用初始参数到着色器
        this.updateShaderParameters();
    }
    
    update(deltaTime: number) {
        // 如果需要动态更新效果，可以在这里实现
        if (this.isAnimating) {
            // 可以添加一些随机变化，例如不时变化雨量等
            this.updateShaderParameters();
        }
    }
    
    /**
     * 添加雨量强度滑块
     */
    private addIntensitySlider() {
        this.addParameterSlider('雨量强度', 0, 1, this.intensity, (value) => {
            this.intensity = value;
            this.updateShaderParameters();
        });
    }
    
    /**
     * 添加下落速度滑块
     */
    private addSpeedSlider() {
        this.addParameterSlider('下落速度', 0.1, 3, this.speed, (value) => {
            this.speed = value;
            this.updateShaderParameters();
        });
    }
    
    /**
     * 添加雨滴角度滑块
     */
    private addAngleSlider() {
        this.addParameterSlider('雨滴角度', -1, 1, this.angle, (value) => {
            this.angle = value;
            this.updateShaderParameters();
        });
    }
    
    /**
     * 添加雨滴大小滑块
     */
    private addDropSizeSlider() {
        this.addParameterSlider('雨滴大小', 0.01, 0.2, this.dropSize, (value) => {
            this.dropSize = value;
            this.updateShaderParameters();
        });
    }
    
    /**
     * 添加雨滴长度滑块
     */
    private addDropLengthSlider() {
        this.addParameterSlider('雨滴长度', 0.1, 1, this.dropLength, (value) => {
            this.dropLength = value;
            this.updateShaderParameters();
        });
    }
    
    /**
     * 添加预设按钮
     */
    private addPresetButtons() {
        // 轻微雨
        this.addPresetButton('轻微雨', () => {
            this.applyPreset({
                intensity: 0.3,
                speed: 0.7,
                angle: 0.0,
                dropSize: 0.03,
                dropLength: 0.2
            });
        });
        
        // 大雨
        this.addPresetButton('大雨', () => {
            this.applyPreset({
                intensity: 0.7,
                speed: 1.2,
                angle: 0.1,
                dropSize: 0.06,
                dropLength: 0.4
            });
        });
        
        // 暴雨
        this.addPresetButton('暴雨', () => {
            this.applyPreset({
                intensity: 1.0,
                speed: 1.8,
                angle: 0.2,
                dropSize: 0.08,
                dropLength: 0.5
            });
        });
        
        // 有风的雨
        this.addPresetButton('有风的雨', () => {
            this.applyPreset({
                intensity: 0.6,
                speed: 1.3,
                angle: -0.6,
                dropSize: 0.05,
                dropLength: 0.5
            });
        });
    }
    
    /**
     * 应用预设
     * @param preset 预设参数
     */
    private applyPreset(preset: any) {
        if (preset.intensity !== undefined) {
            this.intensity = preset.intensity;
        }
        
        if (preset.speed !== undefined) {
            this.speed = preset.speed;
        }
        
        if (preset.angle !== undefined) {
            this.angle = preset.angle;
        }
        
        if (preset.dropSize !== undefined) {
            this.dropSize = preset.dropSize;
        }
        
        if (preset.dropLength !== undefined) {
            this.dropLength = preset.dropLength;
        }
        
        // 更新着色器参数
        this.updateShaderParameters();
        
        // 更新UI控件
        this.updateControlsFromMaterial();
    }
    
    /**
     * 更新着色器参数
     */
    private updateShaderParameters() {
        if (this.material) {
            this.material.setProperty('rainIntensity', this.intensity);
            this.material.setProperty('rainSpeed', this.speed);
            this.material.setProperty('rainAngle', this.angle);
            this.material.setProperty('dropSize', this.dropSize);
            this.material.setProperty('dropLength', this.dropLength);
            this.material.setProperty('rainColor', this.color);
        }
    }
    
    /**
     * 根据当前参数更新UI控件
     */
    private updateControlsFromMaterial() {
        // 实际实现取决于如何获取滑块引用
        // 这里需要根据项目具体实现完善
    }
    
    /**
     * 动画按钮点击事件处理
     */
    protected onAnimateButtonClicked() {
        this.isAnimating = !this.isAnimating;
        
        // 更新按钮文本
        if (this.animateButton) {
            const label = this.animateButton.node.getChildByName('Label');
            if (label) {
                label.getComponent(Label).string = this.isAnimating ? '停止' : '播放';
            }
        }
    }
} 