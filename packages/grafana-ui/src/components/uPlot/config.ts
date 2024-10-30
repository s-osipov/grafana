import { SelectableValue } from '@grafana/data';
import {
  AxisPlacement,
  BarAlignment,
  GraphDrawStyle,
  GraphGradientMode,
  GraphThresholdsStyleMode,
  LineInterpolation,
  VisibilityMode,
  StackingMode,
} from '@grafana/schema';

/**
 * @alpha
 */
export const graphFieldOptions: {
  drawStyle: Array<SelectableValue<GraphDrawStyle>>;
  lineInterpolation: Array<SelectableValue<LineInterpolation>>;
  barAlignment: Array<SelectableValue<BarAlignment>>;
  showPoints: Array<SelectableValue<VisibilityMode>>;
  axisPlacement: Array<SelectableValue<AxisPlacement>>;
  fillGradient: Array<SelectableValue<GraphGradientMode>>;
  stacking: Array<SelectableValue<StackingMode>>;
  thresholdsDisplayModes: Array<SelectableValue<GraphThresholdsStyleMode>>;
} = {
  drawStyle: [
    { label: 'Линия', value: GraphDrawStyle.Line },
    { label: 'Бар', value: GraphDrawStyle.Bars },
    { label: 'Точки', value: GraphDrawStyle.Points },
  ],

  lineInterpolation: [
    { description: 'Линейная', value: LineInterpolation.Linear, icon: 'gf-interpolation-linear' },
    { description: 'Гладкая', value: LineInterpolation.Smooth, icon: 'gf-interpolation-smooth' },
    { description: 'Шаг до', value: LineInterpolation.StepBefore, icon: 'gf-interpolation-step-before' },
    { description: 'Шаг после', value: LineInterpolation.StepAfter, icon: 'gf-interpolation-step-after' },
  ],

  barAlignment: [
    { description: 'Перед', value: BarAlignment.Before, icon: 'gf-bar-alignment-before' },
    { description: 'По центу', value: BarAlignment.Center, icon: 'gf-bar-alignment-center' },
    { description: 'После', value: BarAlignment.After, icon: 'gf-bar-alignment-after' },
  ],

  showPoints: [
    { label: 'Авто', value: VisibilityMode.Auto, description: 'Показывать точки при низкой плотности' },
    { label: 'Всегда', value: VisibilityMode.Always },
    { label: 'Никогда', value: VisibilityMode.Never },
  ],

  axisPlacement: [
    { label: 'Авто', value: AxisPlacement.Auto, description: 'Первое поле слева, все остальное справа' },
    { label: 'Слева', value: AxisPlacement.Left },
    { label: 'Справа', value: AxisPlacement.Right },
    { label: 'Скрытый', value: AxisPlacement.Hidden },
  ],

  fillGradient: [
    { label: 'Нет', value: GraphGradientMode.None },
    { label: 'Непрозрачность', value: GraphGradientMode.Opacity, description: 'Включить градиент непрозрачности заливки' },
    { label: 'Оттенок', value: GraphGradientMode.Hue, description: 'Небольшой градиент цветового оттенка' },
    {
      label: 'Схема',
      value: GraphGradientMode.Scheme,
      description: 'Используйте цветовую схему для определения градиента',
    },
  ],

  stacking: [
    { label: 'Выкл', value: StackingMode.None },
    { label: 'Нормальный', value: StackingMode.Normal },
    { label: '100%', value: StackingMode.Percent },
  ],

  thresholdsDisplayModes: [
    { label: 'Выкл', value: GraphThresholdsStyleMode.Off },
    { label: 'Как линия', value: GraphThresholdsStyleMode.Line },
    { label: 'Как линия (пунктирная)', value: GraphThresholdsStyleMode.Dashed },
    { label: 'Как заполненная область', value: GraphThresholdsStyleMode.Area },
    { label: 'Как заполненная область и линия', value: GraphThresholdsStyleMode.LineAndArea },
    { label: 'Как заполненная область и линия (пунктирная)', value: GraphThresholdsStyleMode.DashedAndArea },
  ],
};
