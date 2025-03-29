import { _decorator, Component, Node, Material, Sprite, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 简单的转场效果控制器
 */
@ccclass('SimpleTransition')
export class SimpleTransition extends Component {
    // 预览精灵
    @property(Sprite)
    public previewSprite: Sprite = null;
    
    // 材质
    @property(Material)
    public material: Material = null;
    
    // 过渡进度
    private progress: number = 0;
    
    // 是否播放动画
    private isPlaying: boolean = false;
    
    // 动画速度
    private speed: number = 0.5;
    
    start() {
        // 应用材质到精灵
        if (this.previewSprite && this.material) {
            this.previewSprite.customMaterial = this.material;
            
            // 设置初始进度
            this.updateProgress(0);
        }
    }
    
    update(dt: number) {
        // 如果正在播放动画，更新进度
        if (this.isPlaying) {
            this.progress += dt * this.speed;
            
            // 循环播放
            if (this.progress > 1) {
                this.progress = 0;
            }
            
            // 更新着色器参数
            this.updateProgress(this.progress);
        }
    }
    
    /**
     * 更新转场进度
     * @param value 进度值 (0-1)
     */
    public updateProgress(value: number) {
        if (this.material) {
            // 更新材质中的progress属性
            this.material.setProperty('progress', value);
        }
    }
    
    /**
     * 播放/停止转场动画
     */
    public togglePlay() {
        this.isPlaying = !this.isPlaying;
    }
    
    /**
     * 返回主场景
     */
    public backToMain() {
        director.loadScene('main');
    }
} 