import { BooleanFieldSettings } from '@react-awesome-query-builder/ui';

import {
  FieldConfigPropertyItem,
  FieldType,
  standardEditorsRegistry,
  StandardEditorsRegistryItem,
  ThresholdsConfig,
  ThresholdsFieldConfigSettings,
  ThresholdsMode,
  thresholdsOverrideProcessor,
  ValueMapping,
  ValueMappingFieldConfigSettings,
  valueMappingsOverrideProcessor,
  DataLink,
  dataLinksOverrideProcessor,
  NumberFieldConfigSettings,
  numberOverrideProcessor,
  StringFieldConfigSettings,
  stringOverrideProcessor,
  identityOverrideProcessor,
  TimeZone,
  FieldColor,
  FieldColorConfigSettings,
  StatsPickerConfigSettings,
  displayNameOverrideProcessor,
  FieldNamePickerConfigSettings,
  booleanOverrideProcessor,
  Action,
} from '@grafana/data';
import { actionsOverrideProcessor } from '@grafana/data/src/field/overrides/processors';
import { config } from '@grafana/runtime';
import { FieldConfig } from '@grafana/schema';
import { RadioButtonGroup, TimeZonePicker, Switch } from '@grafana/ui';
import { FieldNamePicker } from '@grafana/ui/src/components/MatchersUI/FieldNamePicker';
import { ThresholdsValueEditor } from 'app/features/dimensions/editors/ThresholdsEditor/thresholds';
import { ValueMappingsEditor } from 'app/features/dimensions/editors/ValueMappingsEditor/ValueMappingsEditor';

import { DashboardPicker, DashboardPickerOptions } from './DashboardPicker';
import { ActionsValueEditor } from './actions';
import { ColorValueEditor, ColorValueEditorSettings } from './color';
import { FieldColorEditor } from './fieldColor';
import { DataLinksValueEditor } from './links';
import { MultiSelectValueEditor } from './multiSelect';
import { NumberValueEditor } from './number';
import { SelectValueEditor } from './select';
import { SliderValueEditor } from './slider';
import { StatsPickerEditor } from './stats';
import { StringValueEditor } from './string';
import { StringArrayEditor } from './strings';
import { UnitValueEditor } from './units';

/**
 * Returns collection of standard option editors definitions
 */
export const getAllOptionEditors = () => {
  const number: StandardEditorsRegistryItem<number> = {
    id: 'number',
    name: 'Число',
    description: 'Позволяет вводить числовые значения',
    editor: NumberValueEditor,
  };

  const slider: StandardEditorsRegistryItem<number> = {
    id: 'slider',
    name: 'Слайдер',
    description: 'Позволяет вводить числовые значения',
    editor: SliderValueEditor,
  };

  const text: StandardEditorsRegistryItem<string> = {
    id: 'text',
    name: 'Текст',
    description: 'Позволяет вводить строковые значения',
    editor: StringValueEditor,
  };

  const strings: StandardEditorsRegistryItem<string[]> = {
    id: 'strings',
    name: 'Массив строк',
    description: 'Массив строк',
    editor: StringArrayEditor,
  };

  const boolean: StandardEditorsRegistryItem<boolean> = {
    id: 'boolean',
    name: 'Булево',
    description: 'Позволяет вводить логические значения',
    editor(props) {
      const { id, ...rest } = props; // Remove id from properties passed into switch
      return <Switch {...rest} onChange={(e) => props.onChange(e.currentTarget.checked)} />;
    },
  };

  const select: StandardEditorsRegistryItem = {
    id: 'select',
    name: 'Селект',
    description: 'Позволяет выбрать вариант',
    editor: SelectValueEditor,
  };

  const multiSelect: StandardEditorsRegistryItem = {
    id: 'multi-select',
    name: 'Мультиселект',
    description: 'Позволяет выбрать несколько вариантов',
    editor: MultiSelectValueEditor,
  };

  const radio: StandardEditorsRegistryItem = {
    id: 'radio',
    name: 'Радио',
    description: 'Позволяет выбрать вариант',
    editor(props) {
      return <RadioButtonGroup {...props} options={props.item.settings?.options} />;
    },
  };

  const unit: StandardEditorsRegistryItem<string> = {
    id: 'unit',
    name: 'Единица измерения',
    description: 'Позволяет вводить единицы измерения',
    editor: UnitValueEditor,
  };

  const color: StandardEditorsRegistryItem<string, ColorValueEditorSettings> = {
    id: 'color',
    name: 'Цвет',
    description: 'Позволяет выбрать цвет',
    editor(props) {
      return (
        <ColorValueEditor value={props.value} onChange={props.onChange} settings={props.item.settings} details={true} />
      );
    },
  };

  const fieldColor: StandardEditorsRegistryItem<FieldColor | undefined> = {
    id: 'fieldColor',
    name: 'Цвет поля',
    description: 'Выбор цвета поля',
    editor: FieldColorEditor,
  };

  const links: StandardEditorsRegistryItem<DataLink[]> = {
    id: 'links',
    name: 'Ссылки',
    description: 'Позволяет определять ссылки на данные',
    editor: DataLinksValueEditor,
  };

  const actions: StandardEditorsRegistryItem<Action[]> = {
    id: 'actions',
    name: 'Действия',
    description: 'Позволяет определять действия',
    editor: ActionsValueEditor,
  };

  const statsPicker: StandardEditorsRegistryItem<string[], StatsPickerConfigSettings> = {
    id: 'stats-picker',
    name: 'Stats Picker',
    editor: StatsPickerEditor,
    description: '',
  };

  const timeZone: StandardEditorsRegistryItem<TimeZone> = {
    id: 'timezone',
    name: 'Временная зона',
    description: 'Выбор временной зоны',
    editor: TimeZonePicker,
  };

  const fieldName: StandardEditorsRegistryItem<string, FieldNamePickerConfigSettings> = {
    id: 'field-name',
    name: 'Имя поля',
    description: 'Позволяет выбрать имя поля из фрейма данных',
    editor: FieldNamePicker,
  };

  const dashboardPicker: StandardEditorsRegistryItem<string, DashboardPickerOptions> = {
    id: 'dashboard-uid',
    name: 'Дашборд',
    description: 'Выбор дашборда',
    editor: DashboardPicker,
  };

  const mappings: StandardEditorsRegistryItem<ValueMapping[]> = {
    id: 'mappings',
    name: 'Сопоставления',
    description: 'Позволяет определять сопоставления значений',
    editor: ValueMappingsEditor,
  };

  const thresholds: StandardEditorsRegistryItem<ThresholdsConfig> = {
    id: 'thresholds',
    name: 'Пороги',
    description: 'Позволяет определять пороговые значения',
    editor: ThresholdsValueEditor,
  };

  return [
    text,
    number,
    slider,
    boolean,
    radio,
    select,
    unit,
    links,
    actions,
    statsPicker,
    strings,
    timeZone,
    fieldColor,
    color,
    multiSelect,
    fieldName,
    dashboardPicker,
    mappings,
    thresholds,
  ];
};

/**
 * Returns collection of common field config properties definitions
 */
export const getAllStandardFieldConfigs = () => {
  const category = ['Стандартные опции'];
  const displayName: FieldConfigPropertyItem<FieldConfig, string, StringFieldConfigSettings> = {
    id: 'displayName',
    path: 'displayName',
    name: 'Отображаемое имя',
    description: 'Измените имя поля или серии',
    editor: standardEditorsRegistry.get('text').editor,
    override: standardEditorsRegistry.get('text').editor,
    process: displayNameOverrideProcessor,
    settings: {
      placeholder: 'нет',
      expandTemplateVars: true,
    },
    shouldApply: () => true,
    category,
  };

  const unit: FieldConfigPropertyItem<FieldConfig, string, StringFieldConfigSettings> = {
    id: 'unit',
    path: 'unit',
    name: 'Единица измерения',
    description: '',

    editor: standardEditorsRegistry.get('unit').editor,
    override: standardEditorsRegistry.get('unit').editor,
    process: stringOverrideProcessor,

    settings: {
      placeholder: 'нет',
    },

    shouldApply: () => true,
    category,
  };

  const fieldMinMax: FieldConfigPropertyItem<FieldConfig, boolean, BooleanFieldSettings> = {
    id: 'fieldMinMax',
    path: 'fieldMinMax',
    name: 'Поле мин/макс',
    description: 'Рассчитать мин-макс для каждого поля',

    editor: standardEditorsRegistry.get('boolean').editor,
    override: standardEditorsRegistry.get('boolean').editor,
    process: booleanOverrideProcessor,

    shouldApply: (field) => field.type === FieldType.number,
    showIf: (options) => {
      return options.min === undefined || options.max === undefined;
    },
    category,
  };

  const min: FieldConfigPropertyItem<FieldConfig, number, NumberFieldConfigSettings> = {
    id: 'min',
    path: 'min',
    name: 'Мин',
    description: 'Оставьте пустым, чтобы рассчитать на основе всех значений.',

    editor: standardEditorsRegistry.get('number').editor,
    override: standardEditorsRegistry.get('number').editor,
    process: numberOverrideProcessor,

    settings: {
      placeholder: 'авто',
    },
    shouldApply: (field) => field.type === FieldType.number,
    category,
  };

  const max: FieldConfigPropertyItem<FieldConfig, number, NumberFieldConfigSettings> = {
    id: 'max',
    path: 'max',
    name: 'Макс',
    description: 'Оставьте пустым, чтобы рассчитать на основе всех значений.',

    editor: standardEditorsRegistry.get('number').editor,
    override: standardEditorsRegistry.get('number').editor,
    process: numberOverrideProcessor,

    settings: {
      placeholder: 'авто',
    },

    shouldApply: (field) => field.type === FieldType.number,
    category,
  };

  const decimals: FieldConfigPropertyItem<FieldConfig, number, NumberFieldConfigSettings> = {
    id: 'decimals',
    path: 'decimals',
    name: 'Десятичные',

    editor: standardEditorsRegistry.get('number').editor,
    override: standardEditorsRegistry.get('number').editor,
    process: numberOverrideProcessor,

    settings: {
      placeholder: 'авто',
      min: 0,
      max: 15,
      integer: true,
    },

    shouldApply: (field) => field.type === FieldType.number,
    category,
  };

  const noValue: FieldConfigPropertyItem<FieldConfig, string, StringFieldConfigSettings> = {
    id: 'noValue',
    path: 'noValue',
    name: 'Нет значения',
    description: 'Что показывать, когда нет значения',

    editor: standardEditorsRegistry.get('text').editor,
    override: standardEditorsRegistry.get('text').editor,
    process: stringOverrideProcessor,

    settings: {
      placeholder: '-',
    },
    // ??? FieldConfig optionsUi with no value
    shouldApply: () => true,
    category,
  };

  const dataLinksCategory = config.featureToggles.vizActions ? 'Ссылки на данные и действия' : 'Ссылки на данные';

  const links: FieldConfigPropertyItem<FieldConfig, DataLink[], StringFieldConfigSettings> = {
    id: 'links',
    path: 'links',
    name: 'Ссылки на данные',
    editor: standardEditorsRegistry.get('links').editor,
    override: standardEditorsRegistry.get('links').editor,
    process: dataLinksOverrideProcessor,
    settings: {
      placeholder: '-',
    },
    shouldApply: () => true,
    category: [dataLinksCategory],
    getItemsCount: (value) => (value ? value.length : 0),
  };

  const actions: FieldConfigPropertyItem<FieldConfig, Action[], StringFieldConfigSettings> = {
    id: 'actions',
    path: 'actions',
    name: 'Действия',
    editor: standardEditorsRegistry.get('actions').editor,
    override: standardEditorsRegistry.get('actions').editor,
    process: actionsOverrideProcessor,
    settings: {
      placeholder: '-',
    },
    shouldApply: () => true,
    category: [dataLinksCategory],
    getItemsCount: (value) => (value ? value.length : 0),
    showIf: () => config.featureToggles.vizActions,
  };

  const color: FieldConfigPropertyItem<FieldConfig, FieldColor | undefined, FieldColorConfigSettings> = {
    id: 'color',
    path: 'color',
    name: 'Цветовая схема',
    editor: standardEditorsRegistry.get('fieldColor').editor,
    override: standardEditorsRegistry.get('fieldColor').editor,
    process: identityOverrideProcessor,
    shouldApply: () => true,
    settings: {
      byValueSupport: true,
      preferThresholdsMode: true,
    },
    category,
  };

  const mappings: FieldConfigPropertyItem<FieldConfig, ValueMapping[], ValueMappingFieldConfigSettings> = {
    id: 'mappings',
    path: 'mappings',
    name: 'Сопоставления значений',
    description: 'Измените отображаемый текст на основе входного значения',

    editor: standardEditorsRegistry.get('mappings').editor,
    override: standardEditorsRegistry.get('mappings').editor,
    process: valueMappingsOverrideProcessor,
    settings: {},
    defaultValue: [],
    shouldApply: (x) => x.type !== FieldType.time,
    category: ['Сопоставления значений'],
    getItemsCount: (value?) => (value ? value.length : 0),
  };

  const thresholds: FieldConfigPropertyItem<FieldConfig, ThresholdsConfig, ThresholdsFieldConfigSettings> = {
    id: 'thresholds',
    path: 'thresholds',
    name: 'Thresholds',
    editor: standardEditorsRegistry.get('thresholds').editor,
    override: standardEditorsRegistry.get('thresholds').editor,
    process: thresholdsOverrideProcessor,
    settings: {},
    defaultValue: {
      mode: ThresholdsMode.Absolute,
      steps: [
        { value: -Infinity, color: 'green' },
        { value: 80, color: 'red' },
      ],
    },
    shouldApply: () => true,
    category: ['Пороги'],
    getItemsCount: (value) => (value ? value.steps.length : 0),
  };

  const filterable: FieldConfigPropertyItem<FieldConfig, boolean | undefined, {}> = {
    id: 'filterable',
    path: 'filterable',
    name: 'Ad-hoc фильтруемый',
    hideFromDefaults: true,
    editor: standardEditorsRegistry.get('boolean').editor,
    override: standardEditorsRegistry.get('boolean').editor,
    process: booleanOverrideProcessor,
    shouldApply: () => true,
    settings: {},
    category,
  };

  return [
    unit,
    min,
    max,
    fieldMinMax,
    decimals,
    displayName,
    color,
    noValue,
    links,
    actions,
    mappings,
    thresholds,
    filterable,
  ];
};
