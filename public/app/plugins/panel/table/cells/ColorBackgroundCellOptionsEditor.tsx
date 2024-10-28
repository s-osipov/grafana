import { SelectableValue } from '@grafana/data';
import { TableCellBackgroundDisplayMode, TableColoredBackgroundCellOptions } from '@grafana/schema';
import { Field, RadioButtonGroup, Switch, Label, Badge } from '@grafana/ui';

import { TableCellEditorProps } from '../TableCellOptionEditor';

const colorBackgroundOpts: Array<SelectableValue<TableCellBackgroundDisplayMode>> = [
  { value: TableCellBackgroundDisplayMode.Basic, label: 'Базовый' },
  { value: TableCellBackgroundDisplayMode.Gradient, label: 'Градиент' },
];

export const ColorBackgroundCellOptionsEditor = ({
  cellOptions,
  onChange,
}: TableCellEditorProps<TableColoredBackgroundCellOptions>) => {
  // Set the display mode on change
  const onCellOptionsChange = (v: TableCellBackgroundDisplayMode) => {
    cellOptions.mode = v;
    onChange(cellOptions);
  };

  // Handle row coloring changes
  const onColorRowChange = () => {
    cellOptions.applyToRow = !cellOptions.applyToRow;
    onChange(cellOptions);
  };

  // Handle row coloring changes
  const onWrapTextChange = () => {
    cellOptions.wrapText = !cellOptions.wrapText;
    onChange(cellOptions);
  };

  const label = (
    <Label description="Если выделенный текст будет перенесен по ширине текста в настроенном столбце">
      {'Перенос текста '}
      <Badge text="Alpha" color="blue" style={{ fontSize: '11px', marginLeft: '5px', lineHeight: '1.2' }} />
    </Label>
  );

  return (
    <>
      <Field label="Фоновый режим отображения">
        <RadioButtonGroup
          value={cellOptions?.mode ?? TableCellBackgroundDisplayMode.Gradient}
          onChange={onCellOptionsChange}
          options={colorBackgroundOpts}
        />
      </Field>
      <Field
        label="Применить ко всей строке"
        description="Если этот флажок установлен, вся строка будет окрашена так же, как эта ячейка."
      >
        <Switch value={cellOptions.applyToRow} onChange={onColorRowChange} />
      </Field>
      <Field label={label}>
        <Switch value={cellOptions.wrapText} onChange={onWrapTextChange} />
      </Field>
    </>
  );
};
