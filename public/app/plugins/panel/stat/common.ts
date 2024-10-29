// These are used in some other plugins for some reason

import {
  escapeStringForRegex,
  FieldOverrideContext,
  getFieldDisplayName,
  PanelOptionsEditorBuilder,
  ReducerID,
  standardEditorsRegistry,
} from '@grafana/data';
import { SingleStatBaseOptions, VizOrientation } from '@grafana/schema';

export function addStandardDataReduceOptions<T extends SingleStatBaseOptions>(
  builder: PanelOptionsEditorBuilder<T>,
  includeFieldMatcher = true
) {
  const valueOptionsCategory = ['Настройки значений'];

  builder.addRadio({
    path: 'reduceOptions.values',
    name: 'Показать',
    description: 'Вычислите одно значение для каждого столбца или серии или отобразите каждую строку',
    settings: {
      options: [
        { value: false, label: 'Вычислить' },
        { value: true, label: 'Все значения' },
      ],
    },
    category: valueOptionsCategory,
    defaultValue: false,
  });

  builder.addNumberInput({
    path: 'reduceOptions.limit',
    name: 'Лимит',
    description: 'Максимальное количество строк для отображения',
    category: valueOptionsCategory,
    settings: {
      placeholder: '25',
      integer: true,
      min: 1,
      max: 5000,
    },
    showIf: (options) => options.reduceOptions.values === true,
  });

  builder.addCustomEditor({
    id: 'reduceOptions.calcs',
    path: 'reduceOptions.calcs',
    name: 'Вычмсление',
    description: 'Выберите функцию редуктора/расчет',
    category: valueOptionsCategory,
    editor: standardEditorsRegistry.get('stats-picker').editor,
    // TODO: Get ReducerID from generated schema one day?
    defaultValue: [ReducerID.lastNotNull],
    // Hides it when all values mode is on
    showIf: (currentConfig) => currentConfig.reduceOptions.values === false,
  });

  if (includeFieldMatcher) {
    builder.addSelect({
      path: 'reduceOptions.fields',
      name: 'Поля',
      description: 'Выберите поля, которые должны быть включены в панель',
      category: valueOptionsCategory,
      settings: {
        allowCustomValue: true,
        options: [],
        getOptions: async (context: FieldOverrideContext) => {
          const options = [
            { value: '', label: 'Числовые поля' },
            { value: '/.*/', label: 'Все поля' },
          ];
          if (context && context.data) {
            for (const frame of context.data) {
              for (const field of frame.fields) {
                const name = getFieldDisplayName(field, frame, context.data);
                const value = `/^${escapeStringForRegex(name)}$/`;
                options.push({ value, label: name });
              }
            }
          }
          return Promise.resolve(options);
        },
      },
      defaultValue: '',
    });
  }
}

export function addOrientationOption<T extends SingleStatBaseOptions>(
  builder: PanelOptionsEditorBuilder<T>,
  category?: string[]
) {
  builder.addRadio({
    path: 'orientation',
    name: 'Ориентация',
    description: 'Ориентация макета',
    category,
    settings: {
      options: [
        { value: VizOrientation.Auto, label: 'Авто' },
        { value: VizOrientation.Horizontal, label: 'По горизонтали' },
        { value: VizOrientation.Vertical, label: 'По вертикали' },
      ],
    },
    defaultValue: VizOrientation.Auto,
  });
}
