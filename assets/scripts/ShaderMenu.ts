import { _decorator, Component, Node, Prefab, instantiate, Button, ScrollView, Toggle, director, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShaderMenu')
export class ShaderMenu extends Component {
    @property(Prefab)
    private buttonPrefab: Prefab = null;

    @property([Node])
    private categoryContainers: Node[] = [];
    
    @property([Toggle])
    private categoryToggles: Toggle[] = [];
    
    @property([ScrollView])
    private categoryLists: ScrollView[] = [];
    
    // 配置各种类型的效果
    private transitions = [
        {name: '波浪过渡', scene: 'transitions/wave_transition_demo'},
        {name: '圆形过渡', scene: 'transitions/circle_transition_demo'},
        {name: '百叶窗过渡', scene: 'transitions/blinds_transition_demo'},
        {name: '涡旋过渡', scene: 'transitions/vortex_transition_demo'}
    ];
    
    private weather = [
        {name: '雨效果', scene: 'weather/rain_demo'},
        {name: '雪效果', scene: 'weather/snow_demo'}
    ];
    
    private filters = [
        {name: '马赛克', scene: 'filters/mosaic_demo'},
        {name: '像素化', scene: 'filters/pixelate_demo'},
        {name: '溶解', scene: 'filters/dissolve_demo'},
        {name: '外发光', scene: 'filters/outline_demo'},
        {name: '灰度', scene: 'filters/grayscale_demo'}
    ];

    start() {
        this.initializeMenu();
        this.setupCategoryToggles();
    }

    private setupCategoryToggles() {
        // 设置分类切换
        if (this.categoryToggles.length > 0 && this.categoryLists.length > 0) {
            this.categoryToggles.forEach((toggle, index) => {
                toggle.node.on('toggle', (toggle) => {
                    const isChecked = toggle.isChecked;
                    if (isChecked && index < this.categoryLists.length) {
                        this.showCategory(index);
                    }
                });
            });
            
            // 默认显示第一个分类
            this.showCategory(0);
        }
    }
    
    private showCategory(index: number) {
        this.categoryLists.forEach((list, i) => {
            list.node.active = (i === index);
        });
    }

    private initializeMenu() {
        // 初始化主菜单按钮
        this.createCategoryButtons(this.transitions, 0);
        this.createCategoryButtons(this.weather, 1);
        this.createCategoryButtons(this.filters, 2);
    }
    
    private createCategoryButtons(items, categoryIndex) {
        if (!this.buttonPrefab || categoryIndex >= this.categoryContainers.length) return;
        
        const container = this.categoryContainers[categoryIndex];
        if (!container) return;
        
        items.forEach((item, index) => {
            const buttonNode = instantiate(this.buttonPrefab);
            const button = buttonNode.getComponent(Button);
            
            // 设置按钮文本
            const label = buttonNode.getChildByName('Label');
            if (label) {
                const labelComp = label.getComponent(Label);
                if (labelComp) {
                    labelComp.string = `${index < 10 ? '0' + index : index} ${item.name}`;
                }
            }
            
            // 设置点击事件
            button.node.on('click', () => {
                this.loadShaderScene(item.scene);
            });
            
            container.addChild(buttonNode);
        });
    }

    private loadShaderScene(sceneName: string) {
        director.loadScene(sceneName);
    }
}