import { PanelOptionsEditorBuilder } from '@grafana/data';
import { OptionsWithTooltip, TooltipDisplayMode, SortOrder } from '@grafana/schema';

export function addTooltipOptions<T extends OptionsWithTooltip>(
  builder: PanelOptionsEditorBuilder<T>,
  singleOnly = false,
  setProximity = false,
  defaultOptions?: Partial<OptionsWithTooltip>
) {
  const category = ['Подсказка'];
  const modeOptions = singleOnly
    ? [
        { value: TooltipDisplayMode.Single, label: 'Один' },
        { value: TooltipDisplayMode.None, label: 'Скрытый' },
      ]
    : [
        { value: TooltipDisplayMode.Single, label: 'Один' },
        { value: TooltipDisplayMode.Multi, label: 'Все' },
        { value: TooltipDisplayMode.None, label: 'Скрытый' },
      ];

  const sortOptions = [
    { value: SortOrder.None, label: 'Нет' },
    { value: SortOrder.Ascending, label: 'По возрастанию' },
    { value: SortOrder.Descending, label: 'По убыванию' },
  ];

  builder
    .addRadio({
      path: 'tooltip.mode',
      name: 'Режим подсказки',
      category,
      defaultValue: defaultOptions?.tooltip?.mode ?? TooltipDisplayMode.Single,
      settings: {
        options: modeOptions,
      },
    })
    .addRadio({
      path: 'tooltip.sort',
      name: 'Порядок сортировки значений',
      category,
      defaultValue: defaultOptions?.tooltip?.sort ?? SortOrder.None,
      showIf: (options: T) => options.tooltip?.mode === TooltipDisplayMode.Multi,
      settings: {
        options: sortOptions,
      },
    });

  if (setProximity) {
    builder.addNumberInput({
      path: 'tooltip.hoverProximity',
      name: 'Близость наведения курсора',
      description: 'Насколько близко курсор должен находиться к точке, чтобы вызвать всплывающую подсказку, в пикселях',
      category,
      settings: {
        integer: true,
      },
      showIf: (options: T) => options.tooltip?.mode !== TooltipDisplayMode.None,
    });
  }

  builder
    .addNumberInput({
      path: 'tooltip.maxWidth',
      name: 'Макс ширина',
      category,
      settings: {
        integer: true,
      },
      showIf: (options: T) => options.tooltip?.mode !== TooltipDisplayMode.None,
    })
    .addNumberInput({
      path: 'tooltip.maxHeight',
      name: 'Макс высота',
      category,
      defaultValue: undefined,
      settings: {
        integer: true,
      },
      showIf: (options: T) => options.tooltip?.mode === TooltipDisplayMode.Multi,
    });
}
