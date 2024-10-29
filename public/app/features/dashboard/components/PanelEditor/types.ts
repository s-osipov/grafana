import { DataFrame, FieldConfigSource, PanelData, PanelPlugin } from '@grafana/data';

import { DashboardModel, PanelModel } from '../../state';

export interface PanelEditorTab {
  id: string;
  text: string;
  active: boolean;
  icon: string;
}

export enum PanelEditorTabId {
  Query = 'query',
  Transform = 'transform',
  Visualize = 'visualize',
  Alert = 'alert',
}

export enum DisplayMode {
  Fill = 0,
  Fit = 1,
  Exact = 2,
}

export enum PanelEditTableToggle {
  Off = 0,
  Table = 1,
}

export const displayModes = [
  { value: DisplayMode.Fill, label: 'Наполнение', description: 'Используйте все доступное пространство' },
  { value: DisplayMode.Exact, label: 'Действительный', description: 'Сделайте такого же размера, как на дашборде' },
];

export const panelEditTableModes = [
  {
    value: PanelEditTableToggle.Off,
    label: 'Визуализация',
    description: 'Показать с использованием выбранной визуализации',
  },
  { value: PanelEditTableToggle.Table, label: 'Таблица', description: 'Показать необработанные данные в виде таблицы' },
];

/** @internal */
export interface Props {
  plugin: PanelPlugin;
  config: FieldConfigSource;
  onChange: (config: FieldConfigSource) => void;
  /* Helpful for IntelliSense */
  data: DataFrame[];
}

export interface OptionPaneRenderProps {
  panel: PanelModel;
  plugin: PanelPlugin;
  data?: PanelData;
  dashboard: DashboardModel;
  instanceState: unknown;
  onPanelConfigChange: <T extends keyof PanelModel>(configKey: T, value: PanelModel[T]) => void;
  onPanelOptionsChanged: (options: PanelModel['options']) => void;
  onFieldConfigsChange: (config: FieldConfigSource) => void;
}

export interface OptionPaneItemOverrideInfo {
  type: 'data' | 'rule';
  onClick?: () => void;
  tooltip: string;
  description: string;
}

export enum VisualizationSelectPaneTab {
  Visualizations,
  LibraryPanels,
  Suggestions,
  Widgets,
}
