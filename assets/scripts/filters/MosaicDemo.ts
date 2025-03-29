import { _decorator, Component, Node, Label } from 'cc';
import { BaseSceneTemplate } from '../templates/BaseSceneTemplate';
const { ccclass, property } = _decorator;

/**
 * 马赛克效果演示
 */
@ccclass('MosaicDemo')
export class MosaicDemo extends BaseSceneTemplate {
    // 马赛克效果参数
    private intensity: number = 0.5;      // 马赛克强度
    private blockSize: number = 0.02;     // 马赛克块大小
    private aspectRatio: number = 1.0;    // 宽高比调整
    private circleMode: number = 0;       // 圆形模式 (0:关闭, 1:开启)
    
    // 动画相关
    private isAnimating: boolean = false;
    private animationSpeed: number = 0.5;
    private animDirection: number = 1;    // 1:增加, -1:减少
    
    start() {
        // 设置场景标题
        this.setTitle('马赛克效果');
        
        // 添加参数滑块
        this.addIntensitySlider();
        this.addBlockSizeSlider();
        this.addAspectRatioSlider();
        this.addCircleModeSlider();
        this.addAnimationSpeedSlider();
        
        // 添加预设按钮
        this.addPresetButtons();
        
        // 应用初始参数到着色器
        this.updateShaderParameters();
    }
    
    update(deltaTime: number) {
        // 处理动画
        if (this.isAnimating) {
            // 动态改变马赛克块大小
            this.blockSize += this.animationSpeed * this.animDirection * deltaTime * 0.02;
            
            // 循环动画
            if (this.blockSize > 0.1) {
                if (this.animDirection > 0) {
                    this.blockSize = 0.1;
                    this.animDirection = -1;
                }
            } else if (this.blockSize < 0.005) {
                if (this.animDirection < 0) {
                    this.blockSize = 0.005;
                    this.animDirection = 1;
                }
            }
            
            // 更新着色器参数
            this.updateShaderParameters();
        }
    }
    
    /**
     * 添加马赛克强度滑块
     */
    private addIntensitySlider() {
        this.addParameterSlider('马赛克强度', 0, 1, this.intensity, (value) => {
            this.intensity = value;
            this.updateShaderParameters();
        });
    }
    
    /**
     * 添加马赛克块大小滑块
     */
    private addBlockSizeSlider() {
        this.addParameterSlider('块大小', 0.005, 0.1, this.blockSize, (value) => {
            this.blockSize = value;
            this.updateShaderParameters();
        });
    }
    
    /**
     * 添加宽高比滑块
     */
    private addAspectRatioSlider() {
        this.addParameterSlider('宽高比', 0.5, 2, this.aspectRatio, (value) => {
            this.aspectRatio = value;
            this.updateShaderParameters();
        });
    }
    
    /**
     * 添加圆形模式滑块
     */
    private addCircleModeSlider() {
        this.addParameterSlider('圆形模式', 0, 1, this.circleMode, (value) => {
            this.circleMode = Math.round(value);
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
        // 轻微马赛克
        this.addPresetButton('轻微马赛克', () => {
            this.applyPreset({
                intensity: 0.3,
                blockSize: 0.01,
                aspectRatio: 1,
                circleMode: 0
            });
        });
        
        // 中等马赛克
        this.addPresetButton('中等马赛克', () => {
            this.applyPreset({
                intensity: 0.7,
                blockSize: 0.03,
                aspectRatio: 1,
                circleMode: 0
            });
        });
        
        // 强烈马赛克
        this.addPresetButton('强烈马赛克', () => {
            this.applyPreset({
                intensity: 1.0,
                blockSize: 0.05,
                aspectRatio: 1,
                circleMode: 0
            });
        });
        
        // 圆形马赛克
        this.addPresetButton('圆形马赛克', () => {
            this.applyPreset({
                intensity: 0.8,
                blockSize: 0.03,
                aspectRatio: 1,
                circleMode: 1
            });
        });
        
        // 扁平马赛克
        this.addPresetButton('扁平马赛克', () => {
            this.applyPreset({
                intensity: 0.8,
                blockSize: 0.03,
                aspectRatio: 2,
                circleMode: 0
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
        
        if (preset.blockSize !== undefined) {
            this.blockSize = preset.blockSize;
        }
        
        if (preset.aspectRatio !== undefined) {
            this.aspectRatio = preset.aspectRatio;
        }
        
        if (preset.circleMode !== undefined) {
            this.circleMode = preset.circleMode;
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
            this.material.setProperty('mosaicIntensity', this.intensity);
            this.material.setProperty('blockSize', this.blockSize);
            this.material.setProperty('aspectRatio', this.aspectRatio);
            this.material.setProperty('circleMode', this.circleMode);
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