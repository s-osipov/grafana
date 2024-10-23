import { TimeOption } from '@grafana/data';

import { ComboboxOption } from '../Combobox/Combobox';

//import { t } from '../../../../grafana-ui/src/utils/i18n';
//import { t } from '../../../../../public/app/core/internationalization';

export const quickOptions: TimeOption[] = [
  { from: 'now-5m', to: 'now', display: '5 минут'},
  { from: 'now-15m', to: 'now', display: '15 минут'},
  { from: 'now-30m', to: 'now', display: '30 минут' },
  { from: 'now-1h', to: 'now', display: '1 час' },
  { from: 'now-3h', to: 'now', display: '3 часа' },
  { from: 'now-6h', to: 'now', display: '6 часов' },
  { from: 'now-12h', to: 'now', display: '2 часов' },
  { from: 'now-24h', to: 'now', display: '24 часа' },
  { from: 'now-2d', to: 'now', display: '2 дня' },
  { from: 'now-7d', to: 'now', display: '7 дней' },
  { from: 'now-30d', to: 'now', display: '30 дней},
  { from: 'now-90d', to: 'now', display: '90 дней' },
  { from: 'now-6M', to: 'now', display: '6 месяцев' },
  { from: 'now-1y', to: 'now', display: 'Год' },
  { from: 'now-2y', to: 'now', display: '2 года' },
  { from: 'now-5y', to: 'now', display: '5 лет' },
  { from: 'now-1d/d', to: 'now-1d/d', display: 'Вчера' },
  { from: 'now-2d/d', to: 'now-2d/d', display: 'Позавчера' },
  { from: 'now-7d/d', to: 'now-7d/d', display: 'Этот день прошлой недели' },
  { from: 'now-1w/w', to: 'now-1w/w', display: 'Предыдущая неделя' },
  { from: 'now-1M/M', to: 'now-1M/M', display: 'Предыдущий месяц' },
  { from: 'now-1Q/fQ', to: 'now-1Q/fQ', display: 'Предыдущий финансовый квартал' },
  { from: 'now-1y/y', to: 'now-1y/y', display: 'Предыдущий год' },
  { from: 'now-1y/fy', to: 'now-1y/fy', display: 'Предыдущий финансовый год' },
 /*  { from: 'now/d', to: 'now/d', display: 'Today' }, */
   { from: 'now/d', to: 'now/d', display: 'Сегодня' },
  { from: 'now/d', to: 'now', display: 'Сегодня до сих пор' },
  { from: 'now/w', to: 'now/w', display: 'Текущая неделя' },
  { from: 'now/w', to: 'now', display: 'Текущая неделя до сих пор' },
  { from: 'now/M', to: 'now/M', display: 'Текущий месяц' },
  { from: 'now/M', to: 'now', display: 'Текущий месяц до сих пор' },
  { from: 'now/y', to: 'now/y', display: 'Текущий год' },
  { from: 'now/y', to: 'now', display: 'Текущий год до сих пор' },
  { from: 'now/fQ', to: 'now', display: 'Текущий финансовый квартал до сих пор' },
  { from: 'now/fQ', to: 'now/fQ', display: 'Текущий финансовый квартал' },
  { from: 'now/fy', to: 'now', display: 'Текущий финансовый год до сих пор' },
  { from: 'now/fy', to: 'now/fy', display: 'Текущий финансовый год' },
];

export const monthOptions: Array<ComboboxOption<number>> = [
  { label: 'Январь', value: 0 },
  { label: 'Февраль', value: 1 },
  { label: 'Март', value: 2 },
  { label: 'Апрель', value: 3 },
  { label: 'Май', value: 4 },
  { label: 'Июнь', value: 5 },
  { label: 'Июль', value: 6 },
  { label: 'Август', value: 7 },
  { label: 'Сентябрь', value: 8 },
  { label: 'Октябрь', value: 9 },
  { label: 'Ноябрь', value: 10 },
  { label: 'Декабрь', value: 11 },
];
