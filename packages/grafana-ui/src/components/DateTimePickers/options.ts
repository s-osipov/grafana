import { TimeOption } from '@grafana/data';

import { ComboboxOption } from '../Combobox/Combobox';

import { t } from '../../../../grafana-ui/src/utils/i18n';
//import { t } from '../../../../../public/app/core/internationalization';

export const quickOptions: TimeOption[] = [
  { from: 'now-5m', to: 'now', display: t('time-picker.options.last-5-minutes', 'Last 5 minutes')},
  { from: 'now-15m', to: 'now', display: t('time-picker.options.last-15-minutes', 'Last 15 minutes')},
  { from: 'now-30m', to: 'now', display: 'Last 30 minutes' },
  { from: 'now-1h', to: 'now', display: 'Last 1 hour' },
  { from: 'now-3h', to: 'now', display: 'Last 3 hours' },
  { from: 'now-6h', to: 'now', display: 'Last 6 hours' },
  { from: 'now-12h', to: 'now', display: 'Last 12 hours' },
  { from: 'now-24h', to: 'now', display: 'Last 24 hours' },
  { from: 'now-2d', to: 'now', display: 'Last 2 days' },
  { from: 'now-7d', to: 'now', display: 'Last 7 days' },
  { from: 'now-30d', to: 'now', display: 'Last 30 days' },
  { from: 'now-90d', to: 'now', display: 'Last 90 days' },
  { from: 'now-6M', to: 'now', display: 'Last 6 months' },
  { from: 'now-1y', to: 'now', display: 'Last 1 year' },
  { from: 'now-2y', to: 'now', display: 'Last 2 years' },
  { from: 'now-5y', to: 'now', display: 'Last 5 years' },
  { from: 'now-1d/d', to: 'now-1d/d', display: 'Yesterday' },
  { from: 'now-2d/d', to: 'now-2d/d', display: 'Day before yesterday' },
  { from: 'now-7d/d', to: 'now-7d/d', display: 'This day last week' },
  { from: 'now-1w/w', to: 'now-1w/w', display: 'Previous week' },
  { from: 'now-1M/M', to: 'now-1M/M', display: 'Previous month' },
  { from: 'now-1Q/fQ', to: 'now-1Q/fQ', display: 'Previous fiscal quarter' },
  { from: 'now-1y/y', to: 'now-1y/y', display: 'Previous year' },
  { from: 'now-1y/fy', to: 'now-1y/fy', display: 'Previous fiscal year' },
  { from: 'now/d', to: 'now/d', display: 'Today' },
  /* { from: 'now/d', to: 'now/d', display: 'Сегодня' }, */
  { from: 'now/d', to: 'now', display: 'Today so far' },
  { from: 'now/w', to: 'now/w', display: 'This week' },
  { from: 'now/w', to: 'now', display: 'This week so far' },
  { from: 'now/M', to: 'now/M', display: 'This month' },
  { from: 'now/M', to: 'now', display: 'This month so far' },
  { from: 'now/y', to: 'now/y', display: 'This year' },
  { from: 'now/y', to: 'now', display: 'This year so far' },
  { from: 'now/fQ', to: 'now', display: 'This fiscal quarter so far' },
  { from: 'now/fQ', to: 'now/fQ', display: 'This fiscal quarter' },
  { from: 'now/fy', to: 'now', display: 'This fiscal year so far' },
  { from: 'now/fy', to: 'now/fy', display: 'This fiscal year' },
];

export const monthOptions: Array<ComboboxOption<number>> = [
  { label: 'January', value: 0 },
  { label: 'February', value: 1 },
  { label: 'March', value: 2 },
  { label: 'April', value: 3 },
  { label: 'May', value: 4 },
  { label: 'June', value: 5 },
  { label: 'July', value: 6 },
  { label: 'August', value: 7 },
  { label: 'September', value: 8 },
  { label: 'October', value: 9 },
  { label: 'November', value: 10 },
  { label: 'December', value: 11 },
];
