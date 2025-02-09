import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { twJoin } from 'tailwind-merge';
import { z } from 'zod';
import supabase from '@/api/supabase-client';
import { AppButton, AppTextFieldForm } from '@/components';
import PublicContainer from '@/components/public-container';
import { createEmailValidator } from '@/utils/validation';

const Forgotten = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const remindPasswordMutation = useMutation({
    mutationFn: async (email: string) =>
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/reset/super_secret_token',
      }),
  });

  const formSchema = z.object({ email: createEmailValidator(intl) });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: searchParams.get('email') || '' },
  });

  return (
    <PublicContainer
      className={twJoin(remindPasswordMutation.isSuccess && 'items-center')}
      onSubmit={form.handleSubmit(({ email }) => remindPasswordMutation.mutate(email))}
    >
      {remindPasswordMutation.isSuccess ? (
        <>
          <img alt="" className="mb-6 max-w-full" height={148} src="/images/email-sent.svg" width={262} />
          <PublicContainer.Title className="mb-2.5">
            <FormattedMessage id="Forgotten.EmailSent.Title" />
          </PublicContainer.Title>
          <p className="mb-6 flex flex-col items-center text-center text-gray-600">
            <FormattedMessage id="Forgotten.EmailSent.Description" />
            <span className="font-bold text-primary-900">{form.getValues('email')}</span>
          </p>
          <Link className="self-center font-semibold text-primary-500 no-underline" to="/">
            <FormattedMessage id="Common.BackToLogin" />
          </Link>
        </>
      ) : (
        <>
          <PublicContainer.Title className="mb-3">
            <FormattedMessage id="Forgotten.Title" />
          </PublicContainer.Title>
          <p className="mb-8 text-gray-600">
            <FormattedMessage id="Forgotten.Description" />
          </p>
          <AppTextFieldForm
            className="mb-5"
            control={form.control}
            field="email"
            label={intl.$t({ id: 'Form.Email' })}
            slotProps={{
              htmlInput: { autoComplete: 'email' },
            }}
          />
          <AppButton
            className="rounded-xl !py-4 !text-base !font-normal"
            loading={remindPasswordMutation.isLoading}
            type="submit"
          >
            <FormattedMessage id="Forgotten.ResetPassword" />
          </AppButton>
          <div className="mt-8 self-center text-gray-600">
            <FormattedMessage id="Forgotten.RememberPassword" />
            &nbsp;
            <Link className="self-center font-semibold text-primary-500 no-underline" to="/">
              <FormattedMessage id="Common.LogIn" />
            </Link>
          </div>
        </>
      )}
    </PublicContainer>
  );
};

export default Forgotten;
