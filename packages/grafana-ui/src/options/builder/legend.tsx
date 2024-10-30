import { PanelOptionsEditorBuilder, standardEditorsRegistry, StatsPickerConfigSettings } from '@grafana/data';
import { LegendDisplayMode, OptionsWithLegend } from '@grafana/schema';

/**
 * @alpha
 */
export function addLegendOptions<T extends OptionsWithLegend>(
  builder: PanelOptionsEditorBuilder<T>,
  includeLegendCalcs = true,
  showLegend = true
) {
  builder
    .addBooleanSwitch({
      path: 'legend.showLegend',
      name: 'Visibility',
      category: ['Легенда'],
      description: '',
      defaultValue: showLegend,
    })
    .addRadio({
      path: 'legend.displayMode',
      name: 'Mode',
      category: ['Легенда'],
      description: '',
      defaultValue: LegendDisplayMode.List,
      settings: {
        options: [
          { value: LegendDisplayMode.List, label: 'Список' },
          { value: LegendDisplayMode.Table, label: 'Таблица' },
        ],
      },
      showIf: (c) => c.legend.showLegend,
    })
    .addRadio({
      path: 'legend.placement',
      name: 'Расположение',
      category: ['Легенда'],
      description: '',
      defaultValue: 'bottom',
      settings: {
        options: [
          { value: 'bottom', label: 'Снизу' },
          { value: 'right', label: 'Справа' },
        ],
      },
      showIf: (c) => c.legend.showLegend,
    })
    .addNumberInput({
      path: 'legend.width',
      name: 'Ширина',
      category: ['Легенда'],
      settings: {
        placeholder: 'Авто',
      },
      showIf: (c) => c.legend.showLegend && c.legend.placement === 'right',
    });

  if (includeLegendCalcs) {
    builder.addCustomEditor<StatsPickerConfigSettings, string[]>({
      id: 'legend.calcs',
      path: 'legend.calcs',
      name: 'Значения',
      category: ['Легенда'],
      description: 'Выберите значения или вычисления для отображения в легенде',
      editor: standardEditorsRegistry.get('stats-picker').editor,
      defaultValue: [],
      settings: {
        allowMultiple: true,
      },
      showIf: (currentConfig) => currentConfig.legend.showLegend !== false,
    });
  }
}
