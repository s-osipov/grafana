import { css } from '@emotion/css';
import { memo, ChangeEvent } from 'react';

import { VariableSuggestion, GrafanaTheme2, DataLink } from '@grafana/data';

import { useStyles2 } from '../../themes/index';
import { isCompactUrl } from '../../utils/dataLinks';
import { Field } from '../Forms/Field';
import { Input } from '../Input/Input';
import { Switch } from '../Switch/Switch';

import { DataLinkInput } from './DataLinkInput';

interface DataLinkEditorProps {
  index: number;
  isLast: boolean;
  value: DataLink;
  suggestions: VariableSuggestion[];
  onChange: (index: number, link: DataLink, callback?: () => void) => void;
}

const getStyles = (theme: GrafanaTheme2) => ({
  listItem: css({
    marginBottom: theme.spacing(),
  }),
  infoText: css({
    paddingBottom: theme.spacing(2),
    marginLeft: '66px',
    color: theme.colors.text.secondary,
  }),
});

export const DataLinkEditor = memo(({ index, value, onChange, suggestions, isLast }: DataLinkEditorProps) => {
  const styles = useStyles2(getStyles);

  const onUrlChange = (url: string, callback?: () => void) => {
    onChange(index, { ...value, url }, callback);
  };
  const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(index, { ...value, title: event.target.value });
  };

  const onOpenInNewTabChanged = () => {
    onChange(index, { ...value, targetBlank: !value.targetBlank });
  };

  return (
    <div className={styles.listItem}>
      <Field label="Заголовок">
        <Input value={value.title} onChange={onTitleChange} placeholder="Показать детали" />
      </Field>

      <Field
        label="URL"
        invalid={isCompactUrl(value.url)}
        error="Ссылка на данные — это URL-адрес просмотра в устаревшем формате. Посетите URL-адрес, который необходимо перенаправить, и отредактируйте эту ссылку на данные, чтобы использовать этот URL-адрес."
      >
        <DataLinkInput value={value.url} onChange={onUrlChange} suggestions={suggestions} />
      </Field>

      <Field label="Открыть в новой вкладке">
        <Switch value={value.targetBlank || false} onChange={onOpenInNewTabChanged} />
      </Field>

      {isLast && (
        <div className={styles.infoText}>
          With data links you can reference data variables like series name, labels and values. Type CMD+Space,
          CTRL+Space, or $ to open variable suggestions.
        </div>
      )}
    </div>
  );
});

DataLinkEditor.displayName = 'DataLinkEditor';
