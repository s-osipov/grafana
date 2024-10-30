import { FieldConfigProperty, FieldType, identityOverrideProcessor, PanelPlugin } from '@grafana/data';
import { config } from '@grafana/runtime';
import {
  AxisPlacement,
  GraphFieldConfig,
  ScaleDistribution,
  ScaleDistributionConfig,
  HeatmapCellLayout,
} from '@grafana/schema';
import { TooltipDisplayMode } from '@grafana/ui';
import { addHideFrom, ScaleDistributionEditor } from '@grafana/ui/src/options/builder';
import { ColorScale } from 'app/core/components/ColorScale/ColorScale';
import { addHeatmapCalculationOptions } from 'app/features/transformers/calculateHeatmap/editor/helper';
import { readHeatmapRowsCustomMeta } from 'app/features/transformers/calculateHeatmap/heatmap';

import { HeatmapPanel } from './HeatmapPanel';
import { prepareHeatmapData } from './fields';
import { heatmapChangedHandler, heatmapMigrationHandler } from './migrations';
import { colorSchemes, quantizeScheme } from './palettes';
import { HeatmapSuggestionsSupplier } from './suggestions';
import { Options, defaultOptions, HeatmapColorMode, HeatmapColorScale } from './types';

export const plugin = new PanelPlugin<Options, GraphFieldConfig>(HeatmapPanel)
  .useFieldConfig({
    disableStandardOptions: Object.values(FieldConfigProperty).filter((v) => v !== FieldConfigProperty.Links),
    useCustomConfig: (builder) => {
      builder.addCustomEditor<void, ScaleDistributionConfig>({
        id: 'scaleDistribution',
        path: 'scaleDistribution',
        name: 'Y axis scale',
        category: ['Heatmap'],
        editor: ScaleDistributionEditor,
        override: ScaleDistributionEditor,
        defaultValue: { type: ScaleDistribution.Linear },
        shouldApply: (f) => f.type === FieldType.number,
        process: identityOverrideProcessor,
        hideFromDefaults: true,
      });
      addHideFrom(builder); // for tooltip etc
    },
  })
  .setPanelChangeHandler(heatmapChangedHandler)
  .setMigrationHandler(heatmapMigrationHandler)
  .setPanelOptions((builder, context) => {
    const opts = context.options ?? defaultOptions;

    let isOrdinalY = false;

    if (context.data.length > 0) {
      try {
        // NOTE: this feels like overkill/expensive just to assert if we have an ordinal y
        // can probably simplify without doing full dataprep
        const palette = quantizeScheme(opts.color, config.theme2);
        const v = prepareHeatmapData({
          frames: context.data,
          options: opts,
          palette,
          theme: config.theme2,
        });
        isOrdinalY = readHeatmapRowsCustomMeta(v.heatmap).yOrdinalDisplay != null;
      } catch {}
    }

    let category = ['Heatmap'];

    builder.addRadio({
      path: 'calculate',
      name: 'Calculate from data',
      defaultValue: defaultOptions.calculate,
      category,
      settings: {
        options: [
          { label: 'Да', value: true },
          { label: 'Нет', value: false },
        ],
      },
    });

    if (opts.calculate) {
      addHeatmapCalculationOptions('calculation.', builder, opts.calculation, category);
    }

    category = ['Ось Y'];

    builder
      .addRadio({
        path: 'yAxis.axisPlacement',
        name: 'Размещение',
        defaultValue: defaultOptions.yAxis.axisPlacement ?? AxisPlacement.Left,
        category,
        settings: {
          options: [
            { label: 'Слева', value: AxisPlacement.Left },
            { label: 'Справа', value: AxisPlacement.Right },
            { label: 'Скрытый', value: AxisPlacement.Hidden },
          ],
        },
      })
      .addUnitPicker({
        category,
        path: 'yAxis.unit',
        name: 'Единица измерения',
        defaultValue: undefined,
        settings: {
          isClearable: true,
        },
      })
      .addNumberInput({
        category,
        path: 'yAxis.decimals',
        name: 'Десятичные',
        settings: {
          placeholder: 'Авто',
        },
      });

    if (!isOrdinalY) {
      // if undefined, then show the min+max
      builder
        .addNumberInput({
          path: 'yAxis.min',
          name: 'Мин значение',
          settings: {
            placeholder: 'Авто',
          },
          category,
        })
        .addTextInput({
          path: 'yAxis.max',
          name: 'Макс значение',
          settings: {
            placeholder: 'Авто',
          },
          category,
        });
    }

    builder
      .addNumberInput({
        path: 'yAxis.axisWidth',
        name: 'Ширина оси',
        defaultValue: defaultOptions.yAxis.axisWidth,
        settings: {
          placeholder: 'Авто',
          min: 5, // smaller should just be hidden
        },
        category,
      })
      .addTextInput({
        path: 'yAxis.axisLabel',
        name: 'Подпись оси',
        defaultValue: defaultOptions.yAxis.axisLabel,
        settings: {
          placeholder: 'Авто',
        },
        category,
      });

    if (!opts.calculate) {
      builder.addRadio({
        path: 'rowsFrame.layout',
        name: 'Выравнивание отметок',
        defaultValue: defaultOptions.rowsFrame?.layout ?? HeatmapCellLayout.auto,
        category,
        settings: {
          options: [
            { label: 'Авто', value: HeatmapCellLayout.auto },
            { label: 'Сверху (LE)', value: HeatmapCellLayout.le },
            { label: 'По центру', value: HeatmapCellLayout.unknown },
            { label: 'Снизу (GE)', value: HeatmapCellLayout.ge },
          ],
        },
      });
    }
    builder.addBooleanSwitch({
      path: 'yAxis.reverse',
      name: 'Реверс',
      defaultValue: defaultOptions.yAxis.reverse === true,
      category,
    });

    category = ['Цвета'];

    builder.addRadio({
      path: `color.mode`,
      name: 'Режим',
      defaultValue: defaultOptions.color.mode,
      category,
      settings: {
        options: [
          { label: 'Схема', value: HeatmapColorMode.Scheme },
          { label: 'Непрозрачность', value: HeatmapColorMode.Opacity },
        ],
      },
    });

    builder.addColorPicker({
      path: `color.fill`,
      name: 'Цвет',
      defaultValue: defaultOptions.color.fill,
      category,
      showIf: (opts) => opts.color.mode === HeatmapColorMode.Opacity,
    });

    builder.addRadio({
      path: `color.scale`,
      name: 'Масштаб',
      defaultValue: defaultOptions.color.scale,
      category,
      settings: {
        options: [
          { label: 'Экспоненциальный', value: HeatmapColorScale.Exponential },
          { label: 'Лмнейный', value: HeatmapColorScale.Linear },
        ],
      },
      showIf: (opts) => opts.color.mode === HeatmapColorMode.Opacity,
    });

    builder.addSliderInput({
      path: 'color.exponent',
      name: 'Порядок',
      defaultValue: defaultOptions.color.exponent,
      category,
      settings: {
        min: 0.1, // 1 for on/off?
        max: 2,
        step: 0.1,
      },
      showIf: (opts) =>
        opts.color.mode === HeatmapColorMode.Opacity && opts.color.scale === HeatmapColorScale.Exponential,
    });

    builder.addSelect({
      path: `color.scheme`,
      name: 'Схема',
      description: '',
      defaultValue: defaultOptions.color.scheme,
      category,
      settings: {
        options: colorSchemes.map((scheme) => ({
          value: scheme.name,
          label: scheme.name,
          //description: 'Set a geometry field based on the results of other fields',
        })),
      },
      showIf: (opts) => opts.color.mode !== HeatmapColorMode.Opacity,
    });

    builder
      .addSliderInput({
        path: 'color.steps',
        name: 'Шаги',
        defaultValue: defaultOptions.color.steps,
        category,
        settings: {
          min: 2,
          max: 128,
          step: 1,
        },
      })
      .addBooleanSwitch({
        path: 'color.reverse',
        name: 'Реверс',
        defaultValue: defaultOptions.color.reverse,
        category,
      })
      .addCustomEditor({
        id: '__scale__',
        path: `__scale__`,
        name: '',
        category,
        editor: () => {
          const palette = quantizeScheme(opts.color, config.theme2);
          return (
            <div>
              <ColorScale colorPalette={palette} min={1} max={100} />
            </div>
          );
        },
      });

    builder
      .addNumberInput({
        path: 'color.min',
        name: 'Начать цветовую шкалу со значения',
        defaultValue: defaultOptions.color.min,
        settings: {
          placeholder: 'Авто (мин)',
        },
        category,
      })
      .addNumberInput({
        path: 'color.max',
        name: 'Закончить цветовую шкалу со значения',
        defaultValue: defaultOptions.color.max,
        settings: {
          placeholder: 'Авто (макс)',
        },
        category,
      });

    category = ['Отображение ячейки'];

    if (!opts.calculate) {
      builder.addTextInput({
        path: 'rowsFrame.value',
        name: 'Имя значения',
        defaultValue: defaultOptions.rowsFrame?.value,
        settings: {
          placeholder: 'Значение',
        },
        category,
      });
    }

    builder
      .addUnitPicker({
        category,
        path: 'cellValues.unit',
        name: 'Единица измерения',
        defaultValue: undefined,
        settings: {
          isClearable: true,
        },
      })
      .addNumberInput({
        category,
        path: 'cellValues.decimals',
        name: 'Десятичные',
        settings: {
          placeholder: 'Авто',
        },
      });

    builder
      // .addRadio({
      //   path: 'showValue',
      //   name: 'Show values',
      //   defaultValue: defaultOptions.showValue,
      //   category,
      //   settings: {
      //     options: [
      //       { value: VisibilityMode.Auto, label: 'Auto' },
      //       { value: VisibilityMode.Always, label: 'Always' },
      //       { value: VisibilityMode.Never, label: 'Never' },
      //     ],
      //   },
      // })
      .addSliderInput({
        name: 'Cell gap',
        path: 'cellGap',
        defaultValue: defaultOptions.cellGap,
        category,
        settings: {
          min: 0,
          max: 25,
        },
      })
      .addNumberInput({
        path: 'filterValues.le',
        name: 'Скрыть ячейки со значением <=',
        defaultValue: defaultOptions.filterValues?.le,
        settings: {
          placeholder: 'Нет',
        },
        category,
      })
      .addNumberInput({
        path: 'filterValues.ge',
        name: 'Скрыть ячейки со значением >=',
        defaultValue: defaultOptions.filterValues?.ge,
        settings: {
          placeholder: 'Нет',
        },
        category,
      });
    // .addSliderInput({
    //   name: 'Cell radius',
    //   path: 'cellRadius',
    //   defaultValue: defaultOptions.cellRadius,
    //   category,
    //   settings: {
    //     min: 0,
    //     max: 100,
    //   },
    // })

    category = ['Подсказка'];

    builder.addRadio({
      path: 'tooltip.mode',
      name: 'Режим подсказки',
      category,
      defaultValue: TooltipDisplayMode.Single,
      settings: {
        options: [
          { value: TooltipDisplayMode.Single, label: 'Один' },
          { value: TooltipDisplayMode.Multi, label: 'Все' },
          { value: TooltipDisplayMode.None, label: 'Скрытый' },
        ],
      },
    });

    builder.addBooleanSwitch({
      path: 'tooltip.yHistogram',
      name: 'Показать гистогнрамму(ось Y)',
      defaultValue: defaultOptions.tooltip.yHistogram,
      category,
      showIf: (opts) => opts.tooltip.mode === TooltipDisplayMode.Single,
    });

    builder.addBooleanSwitch({
      path: 'tooltip.showColorScale',
      name: 'Показать цветовую шкалу',
      defaultValue: defaultOptions.tooltip.showColorScale,
      category,
      showIf: (opts) => opts.tooltip.mode === TooltipDisplayMode.Single,
    });

    builder.addNumberInput({
      path: 'tooltip.maxWidth',
      name: 'Максимальная ширина',
      category,
      settings: {
        integer: true,
      },
      showIf: (opts) => opts.tooltip.mode !== TooltipDisplayMode.None,
    });

    builder.addNumberInput({
      path: 'tooltip.maxHeight',
      name: 'Максимальная высота',
      category,
      defaultValue: undefined,
      settings: {
        integer: true,
      },
      showIf: (options) => options.tooltip?.mode === TooltipDisplayMode.Multi,
    });

    category = ['Legend'];
    builder.addBooleanSwitch({
      path: 'legend.show',
      name: 'Показать легенду',
      defaultValue: defaultOptions.legend.show,
      category,
    });

    category = ['Exemplars'];
    builder.addColorPicker({
      path: 'exemplars.color',
      name: 'Цвет',
      defaultValue: defaultOptions.exemplars.color,
      category,
    });
  })
  .setSuggestionsSupplier(new HeatmapSuggestionsSupplier())
  .setDataSupport({ annotations: true });
