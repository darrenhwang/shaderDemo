import { _decorator, Material, CCFloat, Slider } from 'cc';
import { ShaderDemo } from '../ShaderDemo';

const { ccclass, property } = _decorator;

@ccclass('RainSnowDemo')
export class RainSnowDemo extends ShaderDemo {
    @property({ type: [CCFloat], tooltip: '雨速度值的范围 [min, max]' })
    rainSpeedRange: number[] = [0, 5.0];

    @property({ type: [CCFloat], tooltip: '雪速度值的范围 [min, max]' })
    snowSpeedRange: number[] = [0, 3.0];

    @property({ type: [CCFloat], tooltip: '雨大小值的范围 [min, max]' })
    rainScaleRange: number[] = [0.1, 10.0];

    @property({ type: [CCFloat], tooltip: '雪大小值的范围 [min, max]' })
    snowScaleRange: number[] = [0.1, 10.0];

    @property({ type: [CCFloat], tooltip: '雨密度值的范围 [min, max]' })
    rainIntensityRange: number[] = [0, 1.0];

    @property({ type: [CCFloat], tooltip: '雪密度值的范围 [min, max]' })
    snowIntensityRange: number[] = [0, 1.0];

    @property({ type: [CCFloat], tooltip: '风力值的范围 [min, max]' })
    windStrengthRange: number[] = [-1.0, 1.0];

    @property({ type: [CCFloat], tooltip: '风向角度值的范围 [min, max]' })
    windDirectionRange: number[] = [0, 360];

    protected normalizeValue(value: number, paramName: string): number {
        // 将实际值转换为滑块范围 (0-1)
        switch (paramName) {
            case 'rainSpeed':
                return (value - this.rainSpeedRange[0]) / (this.rainSpeedRange[1] - this.rainSpeedRange[0]);
            case 'snowSpeed':
                return (value - this.snowSpeedRange[0]) / (this.snowSpeedRange[1] - this.snowSpeedRange[0]);
            case 'rainScale':
                return (value - this.rainScaleRange[0]) / (this.rainScaleRange[1] - this.rainScaleRange[0]);
            case 'snowScale':
                return (value - this.snowScaleRange[0]) / (this.snowScaleRange[1] - this.snowScaleRange[0]);
            case 'rainIntensity':
                return (value - this.rainIntensityRange[0]) / (this.rainIntensityRange[1] - this.rainIntensityRange[0]);
            case 'snowIntensity':
                return (value - this.snowIntensityRange[0]) / (this.snowIntensityRange[1] - this.snowIntensityRange[0]);
            case 'windStrength':
                return (value - this.windStrengthRange[0]) / (this.windStrengthRange[1] - this.windStrengthRange[0]);
            case 'windDirection':
                return (value - this.windDirectionRange[0]) / (this.windDirectionRange[1] - this.windDirectionRange[0]);
            default:
                return value;
        }
    }

    protected denormalizeValue(progress: number, paramName: string): number {
        // 将滑块值 (0-1) 转换为实际参数值
        switch (paramName) {
            case 'rainSpeed':
                return this.rainSpeedRange[0] + progress * (this.rainSpeedRange[1] - this.rainSpeedRange[0]);
            case 'snowSpeed':
                return this.snowSpeedRange[0] + progress * (this.snowSpeedRange[1] - this.snowSpeedRange[0]);
            case 'rainScale':
                return this.rainScaleRange[0] + progress * (this.rainScaleRange[1] - this.rainScaleRange[0]);
            case 'snowScale':
                return this.snowScaleRange[0] + progress * (this.snowScaleRange[1] - this.snowScaleRange[0]);
            case 'rainIntensity':
                return this.rainIntensityRange[0] + progress * (this.rainIntensityRange[1] - this.rainIntensityRange[0]);
            case 'snowIntensity':
                return this.snowIntensityRange[0] + progress * (this.snowIntensityRange[1] - this.snowIntensityRange[0]);
            case 'windStrength':
                return this.windStrengthRange[0] + progress * (this.windStrengthRange[1] - this.windStrengthRange[0]);
            case 'windDirection':
                return this.windDirectionRange[0] + progress * (this.windDirectionRange[1] - this.windDirectionRange[0]);
            default:
                return progress;
        }
    }

    // 轻微雨预设
    protected onLightRainButtonClicked() {
        this.applyPreset({
            rainSpeed: 0.8,
            snowSpeed: 0.0,
            rainScale: 0.8,
            snowScale: 0.0,
            rainIntensity: 0.3,
            snowIntensity: 0.0,
            windStrength: 0.1,
            windDirection: 90
        });
    }

    // 大雨预设
    protected onHeavyRainButtonClicked() {
        this.applyPreset({
            rainSpeed: 2.0,
            snowSpeed: 0.0,
            rainScale: 1.2,
            snowScale: 0.0,
            rainIntensity: 0.7,
            snowIntensity: 0.0,
            windStrength: 0.3,
            windDirection: 100
        });
    }

    // 暴雨预设
    protected onStormButtonClicked() {
        this.applyPreset({
            rainSpeed: 4.0,
            snowSpeed: 0.0,
            rainScale: 1.5,
            snowScale: 0.0,
            rainIntensity: 1.0,
            snowIntensity: 0.0,
            windStrength: 0.8,
            windDirection: 110
        });
    }

    // 小雪预设
    protected onLightSnowButtonClicked() {
        this.applyPreset({
            rainSpeed: 0.0,
            snowSpeed: 0.3,
            rainScale: 0.0,
            snowScale: 0.8,
            rainIntensity: 0.0,
            snowIntensity: 0.3,
            windStrength: 0.1,
            windDirection: 45
        });
    }

    // 大雪预设
    protected onHeavySnowButtonClicked() {
        this.applyPreset({
            rainSpeed: 0.0,
            snowSpeed: 0.8,
            rainScale: 0.0,
            snowScale: 1.5,
            rainIntensity: 0.0,
            snowIntensity: 0.8,
            windStrength: 0.4,
            windDirection: 60
        });
    }

    // 雨夹雪预设
    protected onRainSnowMixButtonClicked() {
        this.applyPreset({
            rainSpeed: 1.5,
            snowSpeed: 0.5,
            rainScale: 1.0,
            snowScale: 0.7,
            rainIntensity: 0.5,
            snowIntensity: 0.4,
            windStrength: 0.5,
            windDirection: 80
        });
    }

    start() {
        super.start();
        
        // 初始化预设按钮
        if (this.presetButtons.length >= 6) {
            this.presetButtons[0].node.on('click', this.onLightRainButtonClicked, this);
            this.presetButtons[1].node.on('click', this.onHeavyRainButtonClicked, this);
            this.presetButtons[2].node.on('click', this.onStormButtonClicked, this);
            this.presetButtons[3].node.on('click', this.onLightSnowButtonClicked, this);
            this.presetButtons[4].node.on('click', this.onHeavySnowButtonClicked, this);
            this.presetButtons[5].node.on('click', this.onRainSnowMixButtonClicked, this);
        }
    }
} 