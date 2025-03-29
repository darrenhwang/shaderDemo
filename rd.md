创建效果场景
1. 主菜单场景 (main.scene)
创建新场景，保存为main.scene
场景结构搭建:
Apply to 着色器效果合集展示实现方...
挂载ShaderMenu脚本到Canvas节点
2. 创建效果演示场景模板
创建一个基础场景模板，结构如下:
Apply to 着色器效果合集展示实现方...
添加参数滑块模板
Apply to 着色器效果合集展示实现方...
创建预设按钮模板
Apply to 着色器效果合集展示实现方...
3. 创建具体效果场景
根据模板为每种效果创建特定场景，例如创建波浪过渡效果场景:
复制基础场景模板
保存为scenes/transitions/wave_transition_demo.scene
修改标题为"波浪过渡效果"
添加所需参数滑块（progress、waveCount、waveAmplitude等）
添加预设按钮（标准波浪、水平波浪、多重波浪等）
创建并配置材质:
创建新材质
指定使用wave_transition着色器
设置默认属性值
将材质应用到预览精灵上
创建WaveTransitionDemo.ts脚本并挂载到Canvas
四、创建天气效果场景示例
以雨效果场景为例:
复制基础场景模板
保存为scenes/weather/rain_demo.scene
修改标题为"雨效果"
添加所需参数滑块:
雨量强度
下落速度
雨滴角度
雨滴大小
雨滴长度
雨滴颜色
添加预设按钮:
轻微雨
大雨
暴雨
创建并配置雨效果材质
创建RainDemo.ts脚本并挂载到Canvas
五、创建滤镜效果场景示例
以马赛克效果为例:
复制基础场景模板
保存为scenes/filters/mosaic_demo.scene
修改标题为"马赛克效果"
添加所需参数滑块:
马赛克强度
马赛克块大小
宽高比调整
圆形模式
添加预设按钮:
轻微马赛克
中等马赛克
强烈马赛克
圆形马赛克
创建并配置马赛克效果材质
创建MosaicDemo.ts脚本并挂载到Canvas