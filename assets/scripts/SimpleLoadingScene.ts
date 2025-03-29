import { _decorator, Component, Node, director, Label, ProgressBar, Sprite, Material, game } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 简单加载场景
 * 实现基础的场景加载过渡效果
 */
@ccclass('SimpleLoadingScene')
export class SimpleLoadingScene extends Component {
    @property(Label)
    public messageLabel: Label = null;
    
    @property(ProgressBar)
    public progressBar: ProgressBar = null;
    
    @property(Sprite)
    public transitionSprite: Sprite = null;
    
    @property(Material)
    public transitionMaterial: Material = null;
    
    @property
    public targetScene: string = 'main';
    
    @property
    public autoLoadDelay: number = 0.5;
    
    @property
    public transitionDuration: number = 0.5;
    
    private _isLoading: boolean = false;
    private _materialProperty: string = 'progress';
    private _currentProgress: number = 0;
    private _targetProgress: number = 0;
    private _transitionSpeed: number = 0;
    private _isTransitioning: boolean = false;
    private _sceneLoaded: boolean = false;
    
    start() {
        // 初始化过渡效果
        this.initTransition();
        
        // 如果设置了自动加载延迟，则自动开始加载
        if (this.autoLoadDelay > 0) {
            this.scheduleOnce(() => {
                this.loadTargetScene();
            }, this.autoLoadDelay);
        }
    }
    
    /**
     * 初始化过渡效果
     */
    private initTransition() {
        if (this.transitionSprite && this.transitionMaterial) {
            this.transitionSprite.customMaterial = this.transitionMaterial;
            
            // 设置初始进度为0
            this._currentProgress = 0;
            this._targetProgress = 0;
            this.updateProgress(0);
        }
    }
    
    /**
     * 加载目标场景
     * @param sceneName 可选，指定要加载的场景名称
     */
    public loadTargetScene(sceneName?: string) {
        // 如果已经在加载中，则忽略请求
        if (this._isLoading) return;
        
        // 更新目标场景
        if (sceneName) {
            this.targetScene = sceneName;
        }
        
        // 标记为加载中
        this._isLoading = true;
        
        // 显示加载信息
        this.showMessage(`正在加载 ${this.targetScene} 场景...`);
        
        try {
            // 预加载目标场景获取进度
            director.preloadScene(
                this.targetScene,
                (completedCount, totalCount, item) => {
                    // 更新加载进度
                    this._targetProgress = completedCount / totalCount;
                },
                (error) => {
                    if (error) {
                        // 加载失败
                        this.showMessage(`加载失败: ${error.message || error}`);
                        console.error(`场景加载失败: ${error}`);
                        this._isLoading = false;
                    } else {
                        // 加载完成，使用动画过渡到下一个场景
                        this.showMessage('加载完成，正在切换场景...');
                        this._sceneLoaded = true;
                        this.startTransitionAnimation();
                    }
                }
            );
        } catch (err) {
            // 捕获异常
            this.showMessage(`加载错误: ${err.message || err}`);
            console.error(`场景加载发生错误: ${err}`);
            this._isLoading = false;
        }
    }
    
    /**
     * 更新加载进度
     * @param progress 进度值 (0-1)
     */
    private updateProgress(progress: number) {
        // 更新进度条
        if (this.progressBar) {
            this.progressBar.progress = progress;
        }
        
        // 更新过渡材质属性
        if (this.transitionMaterial) {
            this.transitionMaterial.setProperty(this._materialProperty, progress);
        }
    }
    
    /**
     * 开始过渡动画
     */
    private startTransitionAnimation() {
        // 设置目标进度为1
        this._targetProgress = 1;
        this._isTransitioning = true;
        
        // 计算过渡速度
        const remainingProgress = 1 - this._currentProgress;
        this._transitionSpeed = remainingProgress / this.transitionDuration;
    }
    
    update(deltaTime: number) {
        // 平滑过渡到目标进度
        if (this._currentProgress < this._targetProgress) {
            // 计算新的进度
            this._currentProgress += this._transitionSpeed * deltaTime;
            if (this._currentProgress > this._targetProgress) {
                this._currentProgress = this._targetProgress;
            }
            
            // 更新实际显示的进度
            this.updateProgress(this._currentProgress);
        } 
        else if (this._isTransitioning && this._currentProgress >= 1 && this._sceneLoaded) {
            // 过渡完成后加载场景
            this._isTransitioning = false;
            director.loadScene(this.targetScene);
        }
    }
    
    /**
     * 显示消息
     * @param message 消息文本
     */
    private showMessage(message: string) {
        // 在控制台打印消息
        console.log(message);
        
        // 如果有消息标签，则显示消息
        if (this.messageLabel) {
            this.messageLabel.string = message;
        }
    }
} 