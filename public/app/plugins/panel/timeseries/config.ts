import {
  FieldColorModeId,
  FieldConfigProperty,
  FieldType,
  identityOverrideProcessor,
  SetFieldConfigOptionsArgs,
  Field,
} from '@grafana/data';
import {
  BarAlignment,
  GraphDrawStyle,
  GraphFieldConfig,
  GraphGradientMode,
  LineInterpolation,
  LineStyle,
  VisibilityMode,
  StackingMode,
  GraphThresholdsStyleMode,
  GraphTransform,
} from '@grafana/schema';
import { graphFieldOptions, commonOptionsBuilder } from '@grafana/ui';

import { InsertNullsEditor } from './InsertNullsEditor';
import { LineStyleEditor } from './LineStyleEditor';
import { SpanNullsEditor } from './SpanNullsEditor';
import { ThresholdsStyleEditor } from './ThresholdsStyleEditor';

export const defaultGraphConfig: GraphFieldConfig = {
  drawStyle: GraphDrawStyle.Line,
  lineInterpolation: LineInterpolation.Linear,
  lineWidth: 1,
  fillOpacity: 0,
  gradientMode: GraphGradientMode.None,
  barAlignment: BarAlignment.Center,
  barWidthFactor: 0.6,
  stacking: {
    mode: StackingMode.None,
    group: 'A',
  },
  axisGridShow: true,
  axisCenteredZero: false,
  axisBorderShow: false,
};

const categoryStyles = ['Стили графиков'];

export type NullEditorSettings = { isTime: boolean };

export function getGraphFieldConfig(cfg: GraphFieldConfig, isTime = true): SetFieldConfigOptionsArgs<GraphFieldConfig> {
  return {
    standardOptions: {
      [FieldConfigProperty.Color]: {
        settings: {
          byValueSupport: true,
          bySeriesSupport: true,
          preferThresholdsMode: false,
        },
        defaultValue: {
          mode: FieldColorModeId.PaletteClassic,
        },
      },
    },
    useCustomConfig: (builder) => {
      builder
        .addRadio({
          path: 'drawStyle',
          name: 'Стиль',
          category: categoryStyles,
          defaultValue: cfg.drawStyle,
          settings: {
            options: graphFieldOptions.drawStyle,
          },
        })
        .addRadio({
          path: 'lineInterpolation',
          name: 'Линейная интерполяция',
          category: categoryStyles,
          defaultValue: cfg.lineInterpolation,
          settings: {
            options: graphFieldOptions.lineInterpolation,
          },
          showIf: (config) => config.drawStyle === GraphDrawStyle.Line,
        })
        .addRadio({
          path: 'barAlignment',
          name: 'Выравнивание столбцов',
          category: categoryStyles,
          defaultValue: cfg.barAlignment,
          settings: {
            options: graphFieldOptions.barAlignment,
          },
          showIf: (config) => config.drawStyle === GraphDrawStyle.Bars,
        })
        .addSliderInput({
          path: 'barWidthFactor',
          name: 'Bar width factor',
          category: categoryStyles,
          defaultValue: cfg.barWidthFactor,
          settings: {
            min: 0.1,
            max: 1.0,
            step: 0.1,
            ariaLabelForHandle: 'Коэффициент ширины столбца',
          },
          showIf: (config) => config.drawStyle === GraphDrawStyle.Bars,
        })
        .addSliderInput({
          path: 'lineWidth',
          name: 'Ширина линии',
          category: categoryStyles,
          defaultValue: cfg.lineWidth,
          settings: {
            min: 0,
            max: 10,
            step: 1,
            ariaLabelForHandle: 'Ширина линии',
          },
          showIf: (config) => config.drawStyle !== GraphDrawStyle.Points,
        })
        .addSliderInput({
          path: 'fillOpacity',
          name: 'Заполнить непрозрачность',
          category: categoryStyles,
          defaultValue: cfg.fillOpacity,
          settings: {
            min: 0,
            max: 100,
            step: 1,
            ariaLabelForHandle: 'Заполнить непрозрачность',
          },
          showIf: (config) => config.drawStyle !== GraphDrawStyle.Points,
        })
        .addRadio({
          path: 'gradientMode',
          name: 'Режим градиента',
          category: categoryStyles,
          defaultValue: graphFieldOptions.fillGradient[0].value,
          settings: {
            options: graphFieldOptions.fillGradient,
          },
          showIf: (config) => config.drawStyle !== GraphDrawStyle.Points,
        })
        .addFieldNamePicker({
          path: 'fillBelowTo',
          name: 'Заполнить ниже',
          category: categoryStyles,
          hideFromDefaults: true,
          settings: {
            filter: (field: Field) => field.type === FieldType.number,
          },
        })
        .addCustomEditor<void, LineStyle>({
          id: 'lineStyle',
          path: 'lineStyle',
          name: 'Стиль линии',
          category: categoryStyles,
          showIf: (config) => config.drawStyle === GraphDrawStyle.Line,
          editor: LineStyleEditor,
          override: LineStyleEditor,
          process: identityOverrideProcessor,
          shouldApply: (field) => field.type === FieldType.number,
        })
        .addCustomEditor<NullEditorSettings, boolean>({
          id: 'spanNulls',
          path: 'spanNulls',
          name: 'Подключить нулевые значения',
          category: categoryStyles,
          defaultValue: false,
          editor: SpanNullsEditor,
          override: SpanNullsEditor,
          showIf: (config) => config.drawStyle === GraphDrawStyle.Line,
          shouldApply: (field) => field.type !== FieldType.time,
          process: identityOverrideProcessor,
          settings: { isTime },
        })
        .addCustomEditor<NullEditorSettings, boolean>({
          id: 'insertNulls',
          path: 'insertNulls',
          name: 'Отключить значения',
          category: categoryStyles,
          defaultValue: false,
          editor: InsertNullsEditor,
          override: InsertNullsEditor,
          showIf: (config) => config.drawStyle === GraphDrawStyle.Line,
          shouldApply: (field) => field.type !== FieldType.time,
          process: identityOverrideProcessor,
          settings: { isTime },
        })
        .addRadio({
          path: 'showPoints',
          name: 'Показать точки',
          category: categoryStyles,
          defaultValue: graphFieldOptions.showPoints[0].value,
          settings: {
            options: graphFieldOptions.showPoints,
          },
          showIf: (config) => config.drawStyle !== GraphDrawStyle.Points,
        })
        .addSliderInput({
          path: 'pointSize',
          name: 'Размер точки',
          category: categoryStyles,
          defaultValue: 5,
          settings: {
            min: 1,
            max: 40,
            step: 1,
            ariaLabelForHandle: 'Размер точки',
          },
          showIf: (config) => config.showPoints !== VisibilityMode.Never || config.drawStyle === GraphDrawStyle.Points,
        });

      commonOptionsBuilder.addStackingConfig(builder, cfg.stacking, categoryStyles);

      builder.addSelect({
        category: categoryStyles,
        name: 'Трансформация',
        path: 'transform',
        settings: {
          options: [
            {
              label: 'Постоянная',
              value: GraphTransform.Constant,
              description: 'Первое значение будет отображаться в виде постоянной линии',
            },
            {
              label: 'Отрицательная Y',
              value: GraphTransform.NegativeY,
              description: 'Отразите результаты на отрицательные значения по оси Y.',
            },
          ],
          isClearable: true,
        },
        hideFromDefaults: true,
      });

      commonOptionsBuilder.addAxisConfig(builder, cfg);
      commonOptionsBuilder.addHideFrom(builder);

      builder.addCustomEditor({
        id: 'thresholdsStyle',
        path: 'thresholdsStyle',
        name: 'Показать пороги',
        category: ['Пороги'],
        defaultValue: { mode: GraphThresholdsStyleMode.Off },
        settings: {
          options: graphFieldOptions.thresholdsDisplayModes,
        },
        editor: ThresholdsStyleEditor,
        override: ThresholdsStyleEditor,
        process: identityOverrideProcessor,
        shouldApply: () => true,
      });
    },
  };
}
