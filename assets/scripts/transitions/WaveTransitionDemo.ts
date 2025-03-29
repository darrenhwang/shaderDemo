import { _decorator, Component, Material, Node, Label } from 'cc';
import { BaseSceneTemplate } from '../templates/BaseSceneTemplate';
const { ccclass, property } = _decorator;

/**
 * 波浪过渡效果演示
 */
@ccclass('WaveTransitionDemo')
export class WaveTransitionDemo extends BaseSceneTemplate {
    // 波浪过渡效果参数
    private progress: number = 0;
    private waveCount: number = 5;
    private waveAmplitude: number = 0.1;
    private direction: number = 0; // 0: 水平, 1: 垂直
    
    // 动画相关
    private isAnimating: boolean = false;
    private animationSpeed: number = 1.0;
    private animationDirection: number = 1; // 1: 正向, -1: 反向
    
    start() {
        // 设置场景标题
        this.setTitle('波浪过渡效果');
        
        // 添加参数滑块
        this.addProgressSlider();
        this.addWaveCountSlider();
        this.addWaveAmplitudeSlider();
        this.addDirectionSlider();
        this.addAnimationSpeedSlider();
        
        // 添加预设按钮
        this.addPresetButtons();
        
        // 应用初始参数到着色器
        this.updateShaderParameters();
    }
    
    update(deltaTime: number) {
        // 处理动画
        if (this.isAnimating) {
            this.progress += this.animationSpeed * this.animationDirection * deltaTime;
            
            // 循环动画
            if (this.progress > 1) {
                if (this.animationDirection > 0) {
                    this.progress = 1;
                    this.animationDirection = -1;
                }
            } else if (this.progress < 0) {
                if (this.animationDirection < 0) {
                    this.progress = 0;
                    this.animationDirection = 1;
                }
            }
            
            // 更新着色器参数
            this.updateShaderParameters();
        }
    }
    
    /**
     * 添加进度滑块
     */
    private addProgressSlider() {
        this.addParameterSlider('过渡进度', 0, 1, this.progress, (value) => {
            this.progress = value;
            this.updateShaderParameters();
        });
    }
    
    /**
     * 添加波浪数量滑块
     */
    private addWaveCountSlider() {
        this.addParameterSlider('波浪数量', 1, 20, this.waveCount, (value) => {
            this.waveCount = value;
            this.updateShaderParameters();
        });
    }
    
    /**
     * 添加波浪振幅滑块
     */
    private addWaveAmplitudeSlider() {
        this.addParameterSlider('波浪振幅', 0, 0.5, this.waveAmplitude, (value) => {
            this.waveAmplitude = value;
            this.updateShaderParameters();
        });
    }
    
    /**
     * 添加方向滑块
     */
    private addDirectionSlider() {
        this.addParameterSlider('方向', 0, 1, this.direction, (value) => {
            this.direction = Math.round(value);
            this.updateShaderParameters();
        });
    }
    
    /**
     * 添加动画速度滑块
     */
    private addAnimationSpeedSlider() {
        this.addParameterSlider('动画速度', 0.1, 3, this.animationSpeed, (value) => {
            this.animationSpeed = value;
        });
    }
    
    /**
     * 添加预设按钮
     */
    private addPresetButtons() {
        // 标准波浪
        this.addPresetButton('标准波浪', () => {
            this.applyPreset({
                waveCount: 5,
                waveAmplitude: 0.1,
                direction: 0
            });
        });
        
        // 水平波浪
        this.addPresetButton('水平波浪', () => {
            this.applyPreset({
                waveCount: 10,
                waveAmplitude: 0.05,
                direction: 0
            });
        });
        
        // 垂直波浪
        this.addPresetButton('垂直波浪', () => {
            this.applyPreset({
                waveCount: 10,
                waveAmplitude: 0.05,
                direction: 1
            });
        });
        
        // 多重波浪
        this.addPresetButton('多重波浪', () => {
            this.applyPreset({
                waveCount: 20,
                waveAmplitude: 0.05,
                direction: 0
            });
        });
        
        // 大波浪
        this.addPresetButton('大波浪', () => {
            this.applyPreset({
                waveCount: 3,
                waveAmplitude: 0.2,
                direction: 0
            });
        });
    }
    
    /**
     * 应用预设
     * @param preset 预设参数
     */
    private applyPreset(preset: any) {
        if (preset.waveCount !== undefined) {
            this.waveCount = preset.waveCount;
        }
        
        if (preset.waveAmplitude !== undefined) {
            this.waveAmplitude = preset.waveAmplitude;
        }
        
        if (preset.direction !== undefined) {
            this.direction = preset.direction;
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
            this.material.setProperty('progress', this.progress);
            this.material.setProperty('waveCount', this.waveCount);
            this.material.setProperty('waveAmplitude', this.waveAmplitude);
            this.material.setProperty('direction', this.direction);
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