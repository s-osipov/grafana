import { SelectableValue } from '@grafana/data';
import { BarGaugeDisplayMode, BarGaugeValueMode, TableBarGaugeCellOptions } from '@grafana/schema';
import { Field, RadioButtonGroup, Stack } from '@grafana/ui';

import { TableCellEditorProps } from '../TableCellOptionEditor';

type Props = TableCellEditorProps<TableBarGaugeCellOptions>;

export function BarGaugeCellOptionsEditor({ cellOptions, onChange }: Props) {
  // Set the display mode on change
  const onCellOptionsChange = (v: BarGaugeDisplayMode) => {
    cellOptions.mode = v;
    onChange(cellOptions);
  };

  const onValueModeChange = (v: BarGaugeValueMode) => {
    cellOptions.valueDisplayMode = v;
    onChange(cellOptions);
  };

  return (
    <Stack direction="column" gap={0}>
      <Field label="Тип отображения загрузки">
        <RadioButtonGroup
          value={cellOptions?.mode ?? BarGaugeDisplayMode.Gradient}
          onChange={onCellOptionsChange}
          options={barGaugeOpts}
        />
      </Field>
      <Field label="Отображение значений">
        <RadioButtonGroup
          value={cellOptions?.valueDisplayMode ?? BarGaugeValueMode.Text}
          onChange={onValueModeChange}
          options={valueModes}
        />
      </Field>
    </Stack>
  );
}

const barGaugeOpts: SelectableValue[] = [
  { value: BarGaugeDisplayMode.Basic, label: 'Базовый' },
  { value: BarGaugeDisplayMode.Gradient, label: 'Градиент' },
  { value: BarGaugeDisplayMode.Lcd, label: 'Ретро LCD' },
];

const valueModes: SelectableValue[] = [
  { value: BarGaugeValueMode.Color, label: 'Цвета значения' },
  { value: BarGaugeValueMode.Text, label: 'Цвет текста' },
  { value: BarGaugeValueMode.Hidden, label: 'Скрытое' },
];
