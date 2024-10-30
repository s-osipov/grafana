import { css } from '@emotion/css';

import { Button, Modal } from '@grafana/ui';

import { DashboardModel } from '../../state';

import { SaveDashboardButton } from './SaveDashboardButton';

interface UnsavedChangesModalProps {
  dashboard: DashboardModel;
  onDiscard: () => void;
  onDismiss: () => void;
  onSaveSuccess?: () => void;
}

export const UnsavedChangesModal = ({ dashboard, onSaveSuccess, onDiscard, onDismiss }: UnsavedChangesModalProps) => {
  return (
    <Modal
      isOpen={true}
      title="Несохраненные изменения"
      onDismiss={onDismiss}
      icon="exclamation-triangle"
      className={css({
        width: '500px',
      })}
    >
      <h5>Желаете сохранить ваши изменения?</h5>
      <Modal.ButtonRow>
        <Button variant="secondary" onClick={onDismiss} fill="outline">
          Закрыть
        </Button>
        <Button variant="destructive" onClick={onDiscard}>
          Отказаться
        </Button>
        <SaveDashboardButton dashboard={dashboard} onSaveSuccess={onSaveSuccess} />
      </Modal.ButtonRow>
    </Modal>
  );
};
