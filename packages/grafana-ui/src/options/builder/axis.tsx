import {
  FieldConfigEditorBuilder,
  FieldType,
  identityOverrideProcessor,
  SelectableValue,
  StandardEditorProps,
} from '@grafana/data';
import { AxisColorMode, AxisConfig, AxisPlacement, ScaleDistribution, ScaleDistributionConfig } from '@grafana/schema';

import { Field } from '../../components/Forms/Field';
import { RadioButtonGroup } from '../../components/Forms/RadioButtonGroup/RadioButtonGroup';
import { Input } from '../../components/Input/Input';
import { Select } from '../../components/Select/Select';
import { graphFieldOptions } from '../../components/uPlot/config';

/**
 * @alpha
 */
export function addAxisConfig(
  builder: FieldConfigEditorBuilder<AxisConfig>,
  defaultConfig: AxisConfig,
  hideScale?: boolean
) {
  const category = ['Оси'];

  // options for axis appearance
  builder
    .addRadio({
      path: 'axisPlacement',
      name: 'Расположение',
      category,
      defaultValue: graphFieldOptions.axisPlacement[0].value,
      settings: {
        options: graphFieldOptions.axisPlacement,
      },
    })
    .addTextInput({
      path: 'axisLabel',
      name: 'Подпись',
      category,
      defaultValue: '',
      settings: {
        placeholder: 'Дополнительный текст',
        expandTemplateVars: true,
      },
      showIf: (c) => c.axisPlacement !== AxisPlacement.Hidden,
      // Do not apply default settings to time and string fields which are used as x-axis fields in Time series and Bar chart panels
      shouldApply: (f) => f.type !== FieldType.time && f.type !== FieldType.string,
    })
    .addNumberInput({
      path: 'axisWidth',
      name: 'Ширина',
      category,
      settings: {
        placeholder: 'Авто',
      },
      showIf: (c) => c.axisPlacement !== AxisPlacement.Hidden,
    })
    .addRadio({
      path: 'axisGridShow',
      name: 'Показать линии сетки',
      category,
      defaultValue: undefined,
      settings: {
        options: [
          { value: undefined, label: 'Авто' },
          { value: true, label: 'Вкл' },
          { value: false, label: 'Выкл' },
        ],
      },
      showIf: (c) => c.axisPlacement !== AxisPlacement.Hidden,
    })
    .addRadio({
      path: 'axisColorMode',
      name: 'Цвет',
      category,
      defaultValue: AxisColorMode.Text,
      settings: {
        options: [
          { value: AxisColorMode.Text, label: 'Тект' },
          { value: AxisColorMode.Series, label: 'Серия' },
        ],
      },
      showIf: (c) => c.axisPlacement !== AxisPlacement.Hidden,
    })
    .addBooleanSwitch({
      path: 'axisBorderShow',
      name: 'Показать границу',
      category,
      defaultValue: false,
      showIf: (c) => c.axisPlacement !== AxisPlacement.Hidden,
    });

  // options for scale range
  builder
    .addCustomEditor<void, ScaleDistributionConfig>({
      id: 'scaleDistribution',
      path: 'scaleDistribution',
      name: 'Масштаб',
      category,
      editor: ScaleDistributionEditor,
      override: ScaleDistributionEditor,
      defaultValue: { type: ScaleDistribution.Linear },
      shouldApply: (f) => f.type === FieldType.number,
      process: identityOverrideProcessor,
    })
    .addBooleanSwitch({
      path: 'axisCenteredZero',
      name: 'Центрироваль по нулю',
      category,
      defaultValue: false,
      showIf: (c) => c.scaleDistribution?.type !== ScaleDistribution.Log,
    })
    .addNumberInput({
      path: 'axisSoftMin',
      name: 'Soft min',
      defaultValue: defaultConfig.axisSoftMin,
      category,
      settings: {
        placeholder: 'См.: Стандартные опции > Min',
      },
    })
    .addNumberInput({
      path: 'axisSoftMax',
      name: 'Soft max',
      defaultValue: defaultConfig.axisSoftMax,
      category,
      settings: {
        placeholder: 'См.: Стандартные опции > Max',
      },
    });
}

const DISTRIBUTION_OPTIONS: Array<SelectableValue<ScaleDistribution>> = [
  {
    label: 'Линейный',
    value: ScaleDistribution.Linear,
  },
  {
    label: 'Логарифмический',
    value: ScaleDistribution.Log,
  },
  {
    label: 'Симлог',
    value: ScaleDistribution.Symlog,
  },
];

const LOG_DISTRIBUTION_OPTIONS: Array<SelectableValue<number>> = [
  {
    label: '2',
    value: 2,
  },
  {
    label: '10',
    value: 10,
  },
];

/**
 * @internal
 */
export const ScaleDistributionEditor = ({ value, onChange }: StandardEditorProps<ScaleDistributionConfig>) => {
  const type = value?.type ?? ScaleDistribution.Linear;
  const log = value?.log ?? 2;
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <RadioButtonGroup
          value={type}
          options={DISTRIBUTION_OPTIONS}
          onChange={(v) => {
            onChange({
              ...value,
              type: v!,
              log: v === ScaleDistribution.Linear ? undefined : log,
            });
          }}
        />
      </div>
      {(type === ScaleDistribution.Log || type === ScaleDistribution.Symlog) && (
        <Field label="Логарифмическая основа">
          <Select
            options={LOG_DISTRIBUTION_OPTIONS}
            value={log}
            onChange={(v) => {
              onChange({
                ...value,
                log: v.value!,
              });
            }}
          />
        </Field>
      )}
      {type === ScaleDistribution.Symlog && (
        <Field label="Линейный порог">
          <Input
            placeholder="1"
            value={value?.linearThreshold}
            onChange={(v) => {
              onChange({
                ...value,
                linearThreshold: Number(v.currentTarget.value),
              });
            }}
          />
        </Field>
      )}
    </>
  );
};
