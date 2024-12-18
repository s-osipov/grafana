import { memo, useCallback } from 'react';
import * as React from 'react';

import { FieldMatcherID, fieldMatchers } from '@grafana/data';

import { Input } from '../Input/Input';

import { MatcherUIProps, FieldMatcherUIRegistryItem } from './types';

export const FieldNameByRegexMatcherEditor = memo<MatcherUIProps<string>>((props) => {
  const { options, onChange } = props;

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      return onChange(e.target.value);
    },
    [onChange]
  );

  return <Input placeholder="Введите регулярное выражение" defaultValue={options} onBlur={onBlur} />;
});
FieldNameByRegexMatcherEditor.displayName = 'FieldNameByRegexMatcherEditor';

export const fieldNameByRegexMatcherItem: FieldMatcherUIRegistryItem<string> = {
  id: FieldMatcherID.byRegexp,
  component: FieldNameByRegexMatcherEditor,
  matcher: fieldMatchers.get(FieldMatcherID.byRegexp),
  name: 'Поле с именем, соотвествующим регулярному выражению',
  description: 'Установите свойства для полей с именами, соответствующими регулярному выражению',
  optionsToLabel: (options) => options,
};
