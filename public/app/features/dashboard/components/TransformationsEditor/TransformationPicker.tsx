import { css } from '@emotion/css';
import { FormEventHandler, KeyboardEventHandler, ReactNode } from 'react';

import { DocsId, GrafanaTheme2, TransformerRegistryItem } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Card, Container, VerticalGroup, Alert, Input, useStyles2 } from '@grafana/ui';
import { LocalStorageValueProvider } from 'app/core/components/LocalStorageValueProvider';
import { getDocsLink } from 'app/core/utils/docsLinks';
import { PluginStateInfo } from 'app/features/plugins/components/PluginStateInfo';

const LOCAL_STORAGE_KEY = 'dashboard.components.TransformationEditor.featureInfoBox.isDismissed';

interface TransformationPickerProps {
  noTransforms: boolean;
  search: string;
  onSearchChange: FormEventHandler<HTMLInputElement>;
  onSearchKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onTransformationAdd: Function;
  suffix: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xforms: Array<TransformerRegistryItem<any>>;
}

export function TransformationPicker(props: TransformationPickerProps) {
  const { noTransforms, search, xforms, onSearchChange, onSearchKeyDown, onTransformationAdd, suffix } = props;

  return (
    <VerticalGroup>
      {noTransforms && (
        <Container grow={1}>
          <LocalStorageValueProvider<boolean> storageKey={LOCAL_STORAGE_KEY} defaultValue={false}>
            {(isDismissed, onDismiss) => {
              if (isDismissed) {
                return null;
              }

              return (
                <Alert
                  title="Преобразования"
                  severity="info"
                  onRemove={() => {
                    onDismiss(true);
                  }}
                >
                  <p>
                    Преобразования позволяют объединять, вычислять, изменять порядок, скрывать и переименовывать результаты запроса перед их визуализацией. <br />
                    Многие преобразования не подходят, если вы используете визуализацию «График», поскольку в настоящее время она поддерживает только данные временных рядов. <br />
                    Переключение на визуализацию таблицы может помочь понять, что происходит при преобразовании.{' '}
                  </p>
                  <a
                    href={getDocsLink(DocsId.Transformations)}
                    className="external-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read more
                  </a>
                </Alert>
              );
            }}
          </LocalStorageValueProvider>
        </Container>
      )}
      <Input
        data-testid={selectors.components.Transforms.searchInput}
        value={search ?? ''}
        autoFocus={!noTransforms}
        placeholder="Поиск"
        onChange={onSearchChange}
        onKeyDown={onSearchKeyDown}
        suffix={suffix}
      />
      {xforms.map((t) => {
        return (
          <TransformationCard
            key={t.name}
            transform={t}
            onClick={() => {
              onTransformationAdd({ value: t.id });
            }}
          />
        );
      })}
    </VerticalGroup>
  );
}

interface TransformationCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: TransformerRegistryItem<any>;
  onClick: () => void;
}

function TransformationCard({ transform, onClick }: TransformationCardProps) {
  const styles = useStyles2(getStyles);
  return (
    <Card
      className={styles.card}
      data-testid={selectors.components.TransformTab.newTransform(transform.name)}
      onClick={onClick}
    >
      <Card.Heading>{transform.name}</Card.Heading>
      <Card.Description>{transform.description}</Card.Description>
      {transform.state && (
        <Card.Tags>
          <PluginStateInfo state={transform.state} />
        </Card.Tags>
      )}
    </Card>
  );
}

function getStyles(theme: GrafanaTheme2) {
  return {
    card: css({
      margin: '0',
      padding: `${theme.spacing(1)}`,
    }),
  };
}
