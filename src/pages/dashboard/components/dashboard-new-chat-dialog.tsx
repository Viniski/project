import { FormattedMessage } from 'react-intl';
import { AppButton, AppDialog } from '@/components';

const DashboardNewChatDialog = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <AppDialog.Container open={open}>
    <AppDialog.Title onClose={onClose}>
      <FormattedMessage id="Dashboard.ChatNew.Dialog.Title" />
    </AppDialog.Title>
    <AppDialog.Description className="mb-8 flex flex-col gap-2">
      <FormattedMessage id="Dashboard.ChatNew.Dialog.Description" />
    </AppDialog.Description>
    <AppDialog.Actions>
      <AppButton color="003" variant="outlined" onClick={onConfirm}>
        <FormattedMessage id="Dashboard.ChatNew.Dialog.Confirm" />
      </AppButton>
    </AppDialog.Actions>
  </AppDialog.Container>
);

export default DashboardNewChatDialog;
