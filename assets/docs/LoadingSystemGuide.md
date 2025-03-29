# 场景加载系统指南

本文档介绍如何在项目中设置和使用场景加载系统，包括`SceneLoader`和`SimpleLoadingScene`两个组件。

## 一、系统组件说明

### 1. SceneLoader

`SceneLoader` 是一个安全的场景加载管理器，可以安全地加载场景并处理可能出现的错误。

**主要功能**：
- 检查场景名称是否有效
- 安全地加载场景并捕获异常
- 显示加载状态和错误信息
- 动态创建场景按钮

### 2. SimpleLoadingScene

`SimpleLoadingScene` 是一个简单的加载场景组件，提供平滑的过渡动画和加载进度显示。

**主要功能**：
- 显示加载进度条
- 平滑的过渡动画效果
- 自动加载目标场景
- 错误处理和信息显示

## 二、创建加载场景

### 1. 创建基础加载场景

1. 在 Cocos Creator 中创建一个新场景，命名为 `loading`
2. 在场景根节点添加 Canvas 节点
3. 为 Canvas 添加 `SimpleLoadingScene` 组件
4. 设置以下节点结构：

```
Canvas (SimpleLoadingScene组件)
├── Background (Sprite组件)
├── ProgressBar (ProgressBar组件)
├── LoadingLabel (Label组件，显示"加载中...")
└── MessageLabel (Label组件，用于显示状态信息)
```

5. 在 `SimpleLoadingScene` 组件中设置：
   - messageLabel: 引用 MessageLabel 节点的 Label 组件
   - progressBar: 引用 ProgressBar 节点的 ProgressBar 组件
   - targetScene: 设置为 "main" 或其他目标场景名称
   - autoLoadDelay: 设置为 0.5 或其他适当的延迟时间

### 2. 添加过渡效果（可选）

如果需要过渡效果：

1. 在场景中添加一个全屏的 Sprite 节点，命名为 `TransitionSprite`
2. 创建一个过渡效果材质（例如淡入淡出、波纹等）
3. 将材质分配给 `TransitionSprite`
4. 在 `SimpleLoadingScene` 组件中设置：
   - transitionSprite: 引用 TransitionSprite 节点的 Sprite 组件
   - transitionMaterial: 引用创建的过渡效果材质

## 三、使用场景加载器

### 1. 在启动场景中使用

1. 在项目的启动场景中添加 Canvas 节点
2. 为 Canvas 添加 `SceneLoader` 组件
3. 设置 availableScenes 属性，列出所有可用的场景名称（例如 ["main", "level1", "level2"]）
4. 创建一个 UI 按钮，在点击事件中调用 `SceneLoader` 的 `loadScene` 方法

```typescript
// 获取SceneLoader组件引用
const sceneLoader = this.getComponent(SceneLoader);

// 加载指定场景
sceneLoader.loadScene("main");
```

### 2. 动态创建场景按钮

```typescript
// 获取SceneLoader组件引用
const sceneLoader = this.getComponent(SceneLoader);

// 创建场景按钮
const buttonContainer = this.node.getChildByName("ButtonContainer");
sceneLoader.addSceneButton(buttonContainer, "level1", "关卡 1");
sceneLoader.addSceneButton(buttonContainer, "level2", "关卡 2");
```

## 四、从其他脚本中使用

### 1. 在其他组件中使用 SceneLoader

```typescript
import { _decorator, Component, director } from 'cc';
import { SceneLoader } from './SceneLoader';
const { ccclass, property } = _decorator;

@ccclass('YourComponent')
export class YourComponent extends Component {
    @property(SceneLoader)
    public sceneLoader: SceneLoader = null;
    
    public onSomeButtonClicked() {
        // 使用场景加载器加载场景
        if (this.sceneLoader) {
            this.sceneLoader.loadScene("level1");
        } else {
            // 降级方案：直接使用director加载
            director.loadScene("level1");
        }
    }
}
```

### 2. 在没有 SceneLoader 的情况下使用

如果在某些情况下无法访问 SceneLoader 实例，可以直接使用 `director.loadScene`：

```typescript
try {
    director.loadScene("level1", (err) => {
        if (err) {
            console.error(`加载场景失败: ${err}`);
            // 处理错误情况
        }
    });
} catch (err) {
    console.error(`场景加载错误: ${err}`);
    // 处理异常情况
}
```

## 五、注意事项

1. **场景名称**：确保所有场景名称在 `SceneLoader` 的 `availableScenes` 列表中。

2. **过渡效果**：使用 `SimpleLoadingScene` 时，建议创建自定义的过渡效果材质，材质中应包含名为 "progress" 的属性（或根据 `_materialProperty` 设置调整）。

3. **性能考虑**：
   - 加载场景尽量保持简单，减少资源加载时间
   - 过渡动画应简洁，避免复杂的效果影响性能

4. **错误处理**：
   - 始终使用 try-catch 包装场景加载代码
   - 提供用户友好的错误信息
   - 实现回退机制，当场景加载失败时可以回到安全的场景

5. **兼容性**：
   - 考虑不同平台的加载性能差异
   - 移动设备上可能需要更长的加载时间 