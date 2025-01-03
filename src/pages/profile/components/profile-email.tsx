import { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { z } from 'zod';
import supabase from '@/api/supabase-client';
import { AppButton, AppTextFieldForm } from '@/components';
import { useNavigationTransitionConfirmation } from '@/components/navigation-transition-confirmation';
import { createEmailValidator } from '@/utils/validation';
import FormAccordion from './form-accordion';
import FormDivider from './form-divider';
import ProfileEmailVerifyDialog from './profile-email-verify-dialog';

const ProfileEmail = () => {
  const intl = useIntl();
  const [isVerifyEmailDialogOpen, toggleIsVerifyEmailDialogOpen] = useReducer((value) => !value, false);
  const formSchema = z.object({
    email: createEmailValidator(intl),
  });
  type FormData = z.infer<typeof formSchema>;
  const form = useForm({
    defaultValues: { email: '' },
    resolver: zodResolver(formSchema),
  });

  const useUpdateProfileEmail = useMutation({
    mutationFn: async (data: FormData) => {
      const { error } = await supabase.auth.updateUser({
        email: data.email,
      });

      if (error) {
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      enqueueSnackbar(intl.$t({ id: 'Profile.UpdateToastSuccessTitle' }), {
        variant: 'success',
      });
      form.reset(variables);
    },
    onError: () => {
      enqueueSnackbar(intl.$t({ id: 'Error.CommonError' }), {
        variant: 'error',
        persist: true,
      });
    },
  });

  const isEditing = form.formState.isDirty;
  useNavigationTransitionConfirmation(isEditing);

  return (
    <FormAccordion title={intl.$t({ id: 'Profile.EmailTitle' })} titleBarClassName="bg-007">
      <ProfileEmailVerifyDialog open={isVerifyEmailDialogOpen} onClose={toggleIsVerifyEmailDialogOpen} />
      <FormDivider />
      <div className="grid items-center gap-6 md:grid-cols-2">
        <AppTextFieldForm
          control={form.control}
          field="email"
          label={intl.$t({ id: 'Form.NewEmailLabel' })}
          type="email"
        />
        <div className="flex flex-wrap justify-end gap-4">
          <AppButton
            color="003"
            startIcon={<FontAwesomeIcon icon={faEnvelope} />}
            type="button"
            onClick={toggleIsVerifyEmailDialogOpen}
          >
            <FormattedMessage id="Profile.VerifyEmailAction" />
          </AppButton>
        </div>
      </div>
      <FormDivider />
      <div className="flex justify-end">
        <AppButton
          color="003"
          disabled={!isEditing}
          loading={useUpdateProfileEmail.isLoading}
          onClick={form.handleSubmit((values: FormData) => useUpdateProfileEmail.mutate(values))}
        >
          <FormattedMessage id="Common.SaveChanges" />
        </AppButton>
      </div>
    </FormAccordion>
  );
};

export default ProfileEmail;
