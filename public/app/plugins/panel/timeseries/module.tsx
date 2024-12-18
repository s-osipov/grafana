import { PanelPlugin } from '@grafana/data';
import { commonOptionsBuilder } from '@grafana/ui';

import { TimeSeriesPanel } from './TimeSeriesPanel';
import { TimezonesEditor } from './TimezonesEditor';
import { defaultGraphConfig, getGraphFieldConfig } from './config';
import { graphPanelChangedHandler } from './migrations';
import { FieldConfig, Options } from './panelcfg.gen';
import { TimeSeriesSuggestionsSupplier } from './suggestions';

export const plugin = new PanelPlugin<Options, FieldConfig>(TimeSeriesPanel)
  .setPanelChangeHandler(graphPanelChangedHandler)
  .useFieldConfig(getGraphFieldConfig(defaultGraphConfig))
  .setPanelOptions((builder) => {
    commonOptionsBuilder.addTooltipOptions(builder, false, true);
    commonOptionsBuilder.addLegendOptions(builder);

    builder.addCustomEditor({
      id: 'timezone',
      name: 'Временная зона',
      path: 'timezone',
      category: ['Оси'],
      editor: TimezonesEditor,
      defaultValue: undefined,
    });
  })
  .setSuggestionsSupplier(new TimeSeriesSuggestionsSupplier())
  .setDataSupport({ annotations: true, alertStates: true });
