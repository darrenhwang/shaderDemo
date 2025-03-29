import { _decorator, Component, Node, director, Label, Button, sys, game } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 场景加载器，确保安全地加载场景
 */
@ccclass('SceneLoader')
export class SceneLoader extends Component {
    @property([String])
    public availableScenes: string[] = ['main'];
    
    @property(Label)
    public messageLabel: Label = null;
    
    // 存储错误监听器的引用
    private errorListener: () => void = null;
    
    /**
     * 加载场景
     * @param sceneName 场景名称
     */
    public loadScene(sceneName: string) {
        // 检查场景是否有效
        if (this.isSceneValid(sceneName)) {
            try {
                // 显示加载信息
                this.showMessage(`正在加载场景: ${sceneName}`);
                
                // 加载场景
                director.loadScene(sceneName, (err) => {
                    if (err) {
                        // 加载失败
                        this.showMessage(`加载失败: ${err.message || err}`);
                        console.error(`加载场景失败: ${err.message || err}`);
                    }
                });
            } catch (err) {
                // 捕获异常
                this.showMessage(`加载错误: ${err.message || err}`);
                console.error(`加载场景发生错误: ${err.message || err}`);
            }
        } else {
            // 场景无效
            this.showMessage(`无效的场景名称: ${sceneName}`);
            console.warn(`尝试加载无效场景: ${sceneName}`);
        }
    }
    
    /**
     * 检查场景是否有效
     * @param sceneName 场景名称
     */
    private isSceneValid(sceneName: string): boolean {
        return this.availableScenes.indexOf(sceneName) >= 0;
    }
    
    /**
     * 添加场景按钮
     * @param container 按钮容器
     * @param sceneName 场景名称
     * @param displayName 显示名称
     */
    public addSceneButton(container: Node, sceneName: string, displayName: string) {
        // 创建按钮节点
        const buttonNode = new Node(displayName);
        container.addChild(buttonNode);
        
        // 添加按钮组件
        const button = buttonNode.addComponent(Button);
        
        // 设置点击事件
        button.node.on('click', () => {
            this.loadScene(sceneName);
        });
        
        // 添加到有效场景列表
        if (this.availableScenes.indexOf(sceneName) < 0) {
            this.availableScenes.push(sceneName);
        }
        
        return buttonNode;
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
    
    /**
     * 用于处理断网或其他错误情况
     */
    onLoad() {
        // 创建错误监听器
        this.errorListener = () => {
            this.onSystemError('发生系统错误');
        };
        
        // 监听错误事件
        game.on('ERROR', this.errorListener);
    }
    
    onDestroy() {
        // 移除监听
        if (this.errorListener) {
            game.off('ERROR', this.errorListener);
            this.errorListener = null;
        }
    }
    
    /**
     * 系统错误处理
     * @param err 错误对象
     */
    private onSystemError(err: any) {
        this.showMessage(`系统错误: ${err.message || err}`);
        console.error('系统错误:', err);
    }
} 