import { _decorator, Component, Node, Canvas, Widget, UITransform, Sprite, Label, Layout, Button, ScrollView, Color, director } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 基础场景模板创建器
 * 用于在运行时动态创建场景模板
 */
@ccclass('BaseSceneTemplateCreator')
export class BaseSceneTemplateCreator extends Component {
    /**
     * 创建基础场景模板
     */
    public createSceneTemplate(): Node {
        // 创建根节点
        const rootNode = new Node('Canvas');
        rootNode.addComponent(Canvas);
        const canvasWidget = rootNode.addComponent(Widget);
        canvasWidget.isAlignLeft = canvasWidget.isAlignRight = canvasWidget.isAlignTop = canvasWidget.isAlignBottom = true;
        canvasWidget.left = canvasWidget.right = canvasWidget.top = canvasWidget.bottom = 0;
        
        // 创建摄像机
        const cameraNode = new Node('Camera');
        rootNode.addChild(cameraNode);
        
        // 创建标题
        const titleNode = new Node('Title');
        const titleTr = titleNode.addComponent(UITransform);
        titleTr.width = 600;
        titleTr.height = 60;
        const titleWidget = titleNode.addComponent(Widget);
        titleWidget.isAlignTop = true;
        titleWidget.top = 20;
        titleWidget.horizontalCenter = 0;
        const titleLabel = titleNode.addComponent(Label);
        titleLabel.string = '着色器效果演示';
        titleLabel.fontSize = 32;
        titleLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        rootNode.addChild(titleNode);
        
        // 创建返回按钮
        const backBtn = new Node('BackButton');
        const backBtnTr = backBtn.addComponent(UITransform);
        backBtnTr.width = 100;
        backBtnTr.height = 40;
        const backBtnWidget = backBtn.addComponent(Widget);
        backBtnWidget.isAlignLeft = true;
        backBtnWidget.isAlignTop = true;
        backBtnWidget.left = 20;
        backBtnWidget.top = 20;
        const backBtnComp = backBtn.addComponent(Button);
        
        // 返回按钮背景
        const backBtnBg = new Node('Background');
        const backBtnBgTr = backBtnBg.addComponent(UITransform);
        backBtnBgTr.width = 100;
        backBtnBgTr.height = 40;
        const backBtnBgSprite = backBtnBg.addComponent(Sprite);
        backBtnBgSprite.color = new Color(64, 64, 64, 255);
        backBtnComp.target = backBtnBg;
        backBtnComp.transition = Button.Transition.COLOR;
        backBtnComp.normalColor = new Color(64, 64, 64, 255);
        backBtnComp.hoverColor = new Color(80, 80, 80, 255);
        backBtnComp.pressedColor = new Color(40, 40, 40, 255);
        backBtn.addChild(backBtnBg);
        
        // 返回按钮标签
        const backBtnLabel = new Node('Label');
        const backBtnLabelTr = backBtnLabel.addComponent(UITransform);
        backBtnLabelTr.width = 100;
        backBtnLabelTr.height = 40;
        const backBtnLabelComp = backBtnLabel.addComponent(Label);
        backBtnLabelComp.string = '返回';
        backBtnLabelComp.color = new Color(255, 255, 255, 255);
        backBtnLabelComp.fontSize = 16;
        backBtnBg.addChild(backBtnLabel);
        
        // 设置返回按钮事件
        backBtnComp.node.on('click', () => {
            director.loadScene('main');
        });
        
        // 创建预览区域
        const previewArea = new Node('PreviewArea');
        const previewAreaTr = previewArea.addComponent(UITransform);
        previewAreaTr.width = 500;
        previewAreaTr.height = 300;
        const previewAreaWidget = previewArea.addComponent(Widget);
        previewAreaWidget.horizontalCenter = 0;
        previewAreaWidget.isAlignTop = true;
        previewAreaWidget.top = 100;
        rootNode.addChild(previewArea);
        
        // 创建预览精灵
        const previewSprite = new Node('PreviewSprite');
        const previewSpriteTr = previewSprite.addComponent(UITransform);
        previewSpriteTr.width = 500;
        previewSpriteTr.height = 300;
        const previewSpriteComp = previewSprite.addComponent(Sprite);
        previewArea.addChild(previewSprite);
        
        // 创建参数面板
        const paramsPanel = new Node('ParametersPanel');
        const paramsPanelTr = paramsPanel.addComponent(UITransform);
        paramsPanelTr.width = 500;
        paramsPanelTr.height = 200;
        const paramsPanelWidget = paramsPanel.addComponent(Widget);
        paramsPanelWidget.horizontalCenter = 0;
        paramsPanelWidget.isAlignTop = true;
        paramsPanelWidget.top = 420;
        rootNode.addChild(paramsPanel);
        
        // 创建参数面板标题
        const paramsPanelTitle = new Node('Title');
        const paramsPanelTitleTr = paramsPanelTitle.addComponent(UITransform);
        paramsPanelTitleTr.width = 500;
        paramsPanelTitleTr.height = 30;
        const paramsPanelTitleLabel = paramsPanelTitle.addComponent(Label);
        paramsPanelTitleLabel.string = '参数控制';
        paramsPanelTitleLabel.fontSize = 20;
        paramsPanelTitleLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        paramsPanel.addChild(paramsPanelTitle);
        
        // 创建参数滚动视图
        const paramsScrollView = new Node('ScrollView');
        const paramsScrollViewTr = paramsScrollView.addComponent(UITransform);
        paramsScrollViewTr.width = 500;
        paramsScrollViewTr.height = 170;
        const paramsScrollViewComp = paramsScrollView.addComponent(ScrollView);
        paramsPanel.addChild(paramsScrollView);
        
        // 创建参数内容容器
        const paramsContent = new Node('Content');
        const paramsContentTr = paramsContent.addComponent(UITransform);
        paramsContentTr.width = 500;
        paramsContentTr.height = 400; // 可滚动高度
        const paramsContentLayout = paramsContent.addComponent(Layout);
        paramsContentLayout.type = Layout.Type.VERTICAL;
        paramsContentLayout.resizeMode = Layout.ResizeMode.CONTAINER;
        paramsContentLayout.paddingTop = 10;
        paramsContentLayout.paddingBottom = 10;
        paramsContentLayout.spacingY = 10;
        paramsScrollViewComp.content = paramsContent;
        paramsScrollView.addChild(paramsContent);
        
        // 创建预设面板
        const presetsPanel = new Node('PresetsPanel');
        const presetsPanelTr = presetsPanel.addComponent(UITransform);
        presetsPanelTr.width = 500;
        presetsPanelTr.height = 100;
        const presetsPanelWidget = presetsPanel.addComponent(Widget);
        presetsPanelWidget.horizontalCenter = 0;
        presetsPanelWidget.isAlignTop = true;
        presetsPanelWidget.top = 640;
        rootNode.addChild(presetsPanel);
        
        // 创建预设面板标题
        const presetsPanelTitle = new Node('Title');
        const presetsPanelTitleTr = presetsPanelTitle.addComponent(UITransform);
        presetsPanelTitleTr.width = 500;
        presetsPanelTitleTr.height = 30;
        const presetsPanelTitleLabel = presetsPanelTitle.addComponent(Label);
        presetsPanelTitleLabel.string = '预设效果';
        presetsPanelTitleLabel.fontSize = 20;
        presetsPanelTitleLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        presetsPanel.addChild(presetsPanelTitle);
        
        // 创建预设按钮容器
        const presetsContainer = new Node('PresetsContainer');
        const presetsContainerTr = presetsContainer.addComponent(UITransform);
        presetsContainerTr.width = 500;
        presetsContainerTr.height = 60;
        const presetsContainerLayout = presetsContainer.addComponent(Layout);
        presetsContainerLayout.type = Layout.Type.HORIZONTAL;
        presetsContainerLayout.resizeMode = Layout.ResizeMode.CONTAINER;
        presetsContainerLayout.paddingLeft = 10;
        presetsContainerLayout.paddingRight = 10;
        presetsContainerLayout.spacingX = 10;
        presetsPanel.addChild(presetsContainer);
        
        // 创建动画控制按钮
        const animateBtn = new Node('AnimateButton');
        const animateBtnTr = animateBtn.addComponent(UITransform);
        animateBtnTr.width = 100;
        animateBtnTr.height = 40;
        const animateBtnWidget = animateBtn.addComponent(Widget);
        animateBtnWidget.horizontalCenter = 0;
        animateBtnWidget.isAlignTop = true;
        animateBtnWidget.top = 760;
        const animateBtnComp = animateBtn.addComponent(Button);
        
        // 动画按钮背景
        const animateBtnBg = new Node('Background');
        const animateBtnBgTr = animateBtnBg.addComponent(UITransform);
        animateBtnBgTr.width = 100;
        animateBtnBgTr.height = 40;
        const animateBtnBgSprite = animateBtnBg.addComponent(Sprite);
        animateBtnBgSprite.color = new Color(64, 64, 64, 255);
        animateBtnComp.target = animateBtnBg;
        animateBtnComp.transition = Button.Transition.COLOR;
        animateBtnComp.normalColor = new Color(64, 64, 64, 255);
        animateBtnComp.hoverColor = new Color(80, 80, 80, 255);
        animateBtnComp.pressedColor = new Color(40, 40, 40, 255);
        animateBtn.addChild(animateBtnBg);
        
        // 动画按钮标签
        const animateBtnLabel = new Node('Label');
        const animateBtnLabelTr = animateBtnLabel.addComponent(UITransform);
        animateBtnLabelTr.width = 100;
        animateBtnLabelTr.height = 40;
        const animateBtnLabelComp = animateBtnLabel.addComponent(Label);
        animateBtnLabelComp.string = '播放';
        animateBtnLabelComp.color = new Color(255, 255, 255, 255);
        animateBtnLabelComp.fontSize = 16;
        animateBtnBg.addChild(animateBtnLabel);
        rootNode.addChild(animateBtn);
        
        return rootNode;
    }
} 