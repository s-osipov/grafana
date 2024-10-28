import { selectors } from '@grafana/e2e-selectors';
import { config } from '@grafana/runtime';
import { DataLinksInlineEditor, Input, RadioButtonGroup, Select, Switch, TextArea } from '@grafana/ui';
import { getPanelLinksVariableSuggestions } from 'app/features/panel/panellinks/link_srv';

import { GenAIPanelDescriptionButton } from '../GenAI/GenAIPanelDescriptionButton';
import { GenAIPanelTitleButton } from '../GenAI/GenAIPanelTitleButton';
import { RepeatRowSelect } from '../RepeatRowSelect/RepeatRowSelect';

import { OptionsPaneCategoryDescriptor } from './OptionsPaneCategoryDescriptor';
import { OptionsPaneItemDescriptor } from './OptionsPaneItemDescriptor';
import { OptionPaneRenderProps } from './types';

export function getPanelFrameCategory(props: OptionPaneRenderProps): OptionsPaneCategoryDescriptor {
  const { dashboard, panel, onPanelConfigChange } = props;
  const descriptor = new OptionsPaneCategoryDescriptor({
    title: 'Опции панели',
    id: 'Panel options',
    isOpenDefault: true,
  });

  const setPanelTitle = (title: string) => {
    const input = document.getElementById('PanelFrameTitle');
    if (input instanceof HTMLInputElement) {
      input.value = title;
      onPanelConfigChange('title', title);
    }
  };

  const setPanelDescription = (description: string) => {
    const input = document.getElementById('description-text-area');
    if (input instanceof HTMLTextAreaElement) {
      input.value = description;
      onPanelConfigChange('description', description);
    }
  };

  return descriptor
    .addItem(
      new OptionsPaneItemDescriptor({
        title: 'Заголовок',
        value: panel.title,
        popularRank: 1,
        render: function renderTitle() {
          return (
            <Input
              data-testid={selectors.components.PanelEditor.OptionsPane.fieldInput('Title')}
              id="PanelFrameTitle"
              defaultValue={panel.title}
              onBlur={(e) => onPanelConfigChange('title', e.currentTarget.value)}
            />
          );
        },
        addon: config.featureToggles.dashgpt && (
          <GenAIPanelTitleButton
            onGenerate={setPanelTitle}
            panel={panel.getSaveModel()}
            dashboard={dashboard.getSaveModelClone()}
          />
        ),
      })
    )
    .addItem(
      new OptionsPaneItemDescriptor({
        title: 'Описание',
        description: panel.description,
        value: panel.description,
        render: function renderDescription() {
          return (
            <TextArea
              data-testid={selectors.components.PanelEditor.OptionsPane.fieldInput('Description')}
              id="description-text-area"
              defaultValue={panel.description}
              onBlur={(e) => onPanelConfigChange('description', e.currentTarget.value)}
            />
          );
        },
        addon: config.featureToggles.dashgpt && (
          <GenAIPanelDescriptionButton onGenerate={setPanelDescription} panel={panel.getSaveModel()} />
        ),
      })
    )
    .addItem(
      new OptionsPaneItemDescriptor({
        title: 'Прозрачный фон',
        render: function renderTransparent() {
          return (
            <Switch
              data-testid={selectors.components.PanelEditor.OptionsPane.fieldInput('Transparent background')}
              value={panel.transparent}
              id="transparent-background"
              onChange={(e) => onPanelConfigChange('transparent', e.currentTarget.checked)}
            />
          );
        },
      })
    )
    .addCategory(
      new OptionsPaneCategoryDescriptor({
        title: 'Ссылки на панели',
        id: 'Panel links',
        isOpenDefault: false,
        itemsCount: panel.links?.length,
      }).addItem(
        new OptionsPaneItemDescriptor({
          title: 'Ссылки на панели',
          render: function renderLinks() {
            return (
              <DataLinksInlineEditor
                links={panel.links}
                onChange={(links) => onPanelConfigChange('links', links)}
                getSuggestions={getPanelLinksVariableSuggestions}
                data={[]}
              />
            );
          },
        })
      )
    )
    .addCategory(
      new OptionsPaneCategoryDescriptor({
        title: 'Повторить настройки',
        id: 'Repeat options',
        isOpenDefault: false,
      })
        .addItem(
          new OptionsPaneItemDescriptor({
            title: 'Повторить по переменной',
            description:
              'Повторите эту панель для каждого значения выбранной переменной. Это не видно в режиме редактирования. Вам нужно вернуться на панель мониторинга, а затем обновить переменную или перезагрузить панель мониторинга.',
            render: function renderRepeatOptions() {
              return (
                <RepeatRowSelect
                  id="repeat-by-variable-select"
                  repeat={panel.repeat}
                  onChange={(value?: string) => {
                    onPanelConfigChange('repeat', value);
                  }}
                />
              );
            },
          })
        )
        .addItem(
          new OptionsPaneItemDescriptor({
            title: 'Повторить направление',
            showIf: () => !!panel.repeat,
            render: function renderRepeatOptions() {
              const directionOptions = [
                { label: 'По горизонтали', value: 'h' },
                { label: 'По вертикали', value: 'v' },
              ];

              return (
                <RadioButtonGroup
                  options={directionOptions}
                  value={panel.repeatDirection || 'h'}
                  onChange={(value) => onPanelConfigChange('repeatDirection', value)}
                />
              );
            },
          })
        )
        .addItem(
          new OptionsPaneItemDescriptor({
            title: 'Макс. в строке',
            showIf: () => Boolean(panel.repeat && panel.repeatDirection === 'h'),
            render: function renderOption() {
              const maxPerRowOptions = [2, 3, 4, 6, 8, 12].map((value) => ({ label: value.toString(), value }));
              return (
                <Select
                  options={maxPerRowOptions}
                  value={panel.maxPerRow}
                  onChange={(value) => onPanelConfigChange('maxPerRow', value.value)}
                />
              );
            },
          })
        )
    );
}
