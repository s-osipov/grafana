import { cx, css } from '@emotion/css';
import { FormEventHandler, KeyboardEventHandler, ReactNode, useCallback } from 'react';

import {
  DataFrame,
  DataTransformerID,
  TransformerRegistryItem,
  TransformationApplicabilityLevels,
  GrafanaTheme2,
  standardTransformersRegistry,
  SelectableValue,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Card, Drawer, FilterPill, IconButton, Input, Switch, useStyles2 } from '@grafana/ui';
import config from 'app/core/config';
import { PluginStateInfo } from 'app/features/plugins/components/PluginStateInfo';
import { categoriesLabels } from 'app/features/transformers/utils';

import { FilterCategory } from './TransformationsEditor';

const viewAllLabel = 'View all';
const VIEW_ALL_VALUE = 'viewAll';
const filterCategoriesLabels: Array<[FilterCategory, string]> = [
  [VIEW_ALL_VALUE, viewAllLabel],
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ...(Object.entries(categoriesLabels) as Array<[FilterCategory, string]>),
];

interface TransformationPickerNgProps {
  onTransformationAdd: (selectedItem: SelectableValue<string>) => void;
  onSearchChange: FormEventHandler<HTMLInputElement>;
  onSearchKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onClose?: () => void;
  noTransforms: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xforms: Array<TransformerRegistryItem<any>>;
  search: string;
  suffix: ReactNode;
  data: DataFrame[];
  showIllustrations?: boolean;
  onShowIllustrationsChange?: (showIllustrations: boolean) => void;
  onSelectedFilterChange?: (category: FilterCategory) => void;
  selectedFilter?: FilterCategory;
}

export function TransformationPickerNg(props: TransformationPickerNgProps) {
  const styles = useStyles2(getTransformationPickerStyles);
  const {
    suffix,
    xforms,
    search,
    onSearchChange,
    onSearchKeyDown,
    showIllustrations,
    onTransformationAdd,
    selectedFilter,
    data,
    onClose,
    onShowIllustrationsChange,
    onSelectedFilterChange,
  } = props;

  // Use a callback ref to call "click" on the search input
  // This will focus it when it's opened
  const searchInputRef = useCallback((input: HTMLInputElement) => {
    input?.click();
  }, []);

  return (
    <Drawer
      size="md"
      onClose={() => {
        onClose && onClose();
      }}
      title="Добавить другое преобразование"
    >
      <div className={styles.searchWrapper}>
        <Input
          data-testid={selectors.components.Transforms.searchInput}
          className={styles.searchInput}
          value={search ?? ''}
          placeholder="Искать"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
          suffix={suffix}
          ref={searchInputRef}
        />
        <div className={styles.showImages}>
          <span className={styles.illustationSwitchLabel}>Show images</span>{' '}
          <Switch
            value={showIllustrations}
            onChange={() => onShowIllustrationsChange && onShowIllustrationsChange(!showIllustrations)}
          />
        </div>
      </div>

      <div className={styles.filterWrapper}>
        {filterCategoriesLabels.map(([slug, label]) => {
          return (
            <FilterPill
              key={slug}
              onClick={() => onSelectedFilterChange && onSelectedFilterChange(slug)}
              label={label}
              selected={selectedFilter === slug}
            />
          );
        })}
      </div>

      <TransformationsGrid
        showIllustrations={showIllustrations}
        transformations={xforms}
        data={data}
        onClick={(id) => {
          onTransformationAdd({ value: id });
        }}
      />
    </Drawer>
  );
}

function getTransformationPickerStyles(theme: GrafanaTheme2) {
  return {
    showImages: css({
      flexBasis: '0',
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    }),
    pickerInformationLine: css({
      fontSize: '16px',
      marginBottom: `${theme.spacing(2)}`,
    }),
    pickerInformationLineHighlight: css({
      verticalAlign: 'middle',
    }),
    searchWrapper: css({
      display: 'flex',
      flexWrap: 'wrap',
      columnGap: '27px',
      rowGap: '16px',
      width: '100%',
    }),
    searchInput: css({
      flexGrow: '1',
      width: 'initial',
    }),
    illustationSwitchLabel: css({
      whiteSpace: 'nowrap',
    }),
    filterWrapper: css({
      padding: `${theme.spacing(1)} 0`,
      display: 'flex',
      flexWrap: 'wrap',
      rowGap: `${theme.spacing(1)}`,
      columnGap: `${theme.spacing(0.5)}`,
    }),
  };
}

interface TransformationsGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformations: Array<TransformerRegistryItem<any>>;
  showIllustrations?: boolean;
  onClick: (id: string) => void;
  data: DataFrame[];
}

function TransformationsGrid({ showIllustrations, transformations, onClick, data }: TransformationsGridProps) {
  const styles = useStyles2(getTransformationGridStyles);

  return (
    <div className={styles.grid}>
      {transformations.map((transform) => {
        // Check to see if the transform
        // is applicable to the given data
        let applicabilityScore = TransformationApplicabilityLevels.Applicable;
        if (transform.transformation.isApplicable !== undefined) {
          applicabilityScore = transform.transformation.isApplicable(data);
        }
        const isApplicable = applicabilityScore > 0;

        let applicabilityDescription = null;
        if (transform.transformation.isApplicableDescription !== undefined) {
          if (typeof transform.transformation.isApplicableDescription === 'function') {
            applicabilityDescription = transform.transformation.isApplicableDescription(data);
          } else {
            applicabilityDescription = transform.transformation.isApplicableDescription;
          }
        }

        // Add disabled styles to disabled
        let cardClasses = styles.newCard;
        if (!isApplicable) {
          cardClasses = cx(styles.newCard, styles.cardDisabled);
        }

        return (
          <Card
            className={cardClasses}
            data-testid={selectors.components.TransformTab.newTransform(transform.name)}
            onClick={() => onClick(transform.id)}
            key={transform.id}
          >
            <Card.Heading className={styles.heading}>
              <span>{transform.name}</span>
              <span className={styles.pluginStateInfoWrapper}>
                <PluginStateInfo state={transform.state} />
              </span>
            </Card.Heading>
            <Card.Description className={styles.description}>
              <span>{getTransformationsRedesignDescriptions(transform.id)}</span>
              {showIllustrations && (
                <span>
                  <img className={styles.image} src={getImagePath(transform.id, !isApplicable)} alt={transform.name} />
                </span>
              )}
              {!isApplicable && applicabilityDescription !== null && (
                <IconButton
                  className={styles.cardApplicableInfo}
                  name="info-circle"
                  tooltip={applicabilityDescription}
                />
              )}
            </Card.Description>
          </Card>
        );
      })}
    </div>
  );
}

function getTransformationGridStyles(theme: GrafanaTheme2) {
  return {
    heading: css({
      fontWeight: 400,
      '> button': {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'nowrap',
      },
    }),
    description: css({
      fontSize: '12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }),
    image: css({
      display: 'block',
      maxEidth: '100%`',
      marginTop: `${theme.spacing(2)}`,
    }),
    grid: css({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gridAutoRows: '1fr',
      gap: `${theme.spacing(2)} ${theme.spacing(1)}`,
      width: '100%',
    }),
    cardDisabled: css({
      backgroundColor: 'rgb(204, 204, 220, 0.045)',
      color: `${theme.colors.text.disabled} !important`,
      img: {
        filter: 'grayscale(100%)',
        opacity: 0.33,
      },
    }),
    cardApplicableInfo: css({
      position: 'absolute',
      bottom: `${theme.spacing(1)}`,
      right: `${theme.spacing(1)}`,
    }),
    newCard: css({
      gridTemplateRows: 'min-content 0 1fr 0',
    }),
    pluginStateInfoWrapper: css({
      marginLeft: '5px',
    }),
  };
}

const getImagePath = (id: string, disabled: boolean) => {
  const folder = config.theme2.isDark ? 'dark' : 'light';
  return `public/img/transformations/${folder}/${id}.svg`;
};

const TransformationDescriptionOverrides: { [key: string]: string } = {
  [DataTransformerID.concatenate]: 'Объедините все поля в один кадр.',
  [DataTransformerID.configFromData]: 'Установите единицу измерения, мин, максимум и многое другое.',
  [DataTransformerID.fieldLookup]: 'Используйте значение поля для поиска стран, штатов или аэропортов.',
  [DataTransformerID.filterFieldsByName]: 'Удалите части результатов запроса, используя шаблон регулярного выражения.',
  [DataTransformerID.filterByRefId]: 'Удалить строки из данных на основе исходного запроса',
  [DataTransformerID.filterByValue]: 'Удаляйте строки из результатов запроса с помощью пользовательских фильтров.',
  [DataTransformerID.groupBy]: 'Группируйте данные по значению поля и создавайте агрегированные данные.',
  [DataTransformerID.groupingToMatrix]: 'Суммируйте и реорганизуйте данные на основе трех полей.',
  [DataTransformerID.joinByField]: 'Объедините строки из двух+ таблиц на основе связанного поля.',
  [DataTransformerID.labelsToFields]: 'Группируйте серии по времени и возвращайте метки или теги в виде полей.',
  [DataTransformerID.merge]: 'Объединить несколько серий. Значения будут объединены в одну строку.',
  [DataTransformerID.organize]: 'Измените порядок, скройте или переименуйте поля.',
  [DataTransformerID.partitionByValues]: 'Разделите набор данных из одного кадра на несколько серий.',
  [DataTransformerID.prepareTimeSeries]: 'Растягивайте кадры данных из широкого формата в длинный формат.',
  [DataTransformerID.reduce]: 'Сократите все строки или точки данных до одного значения (например, максимальное, среднее).',
  [DataTransformerID.renameByRegex]:
    'Переименуйте части результатов запроса, используя регулярное выражение и шаблон замены.',
  [DataTransformerID.seriesToRows]: 'Объединить несколько серий. Возвращает время, метрику и значения в виде строки.',
};

const getTransformationsRedesignDescriptions = (id: string): string => {
  return TransformationDescriptionOverrides[id] || standardTransformersRegistry.getIfExists(id)?.description || '';
};
