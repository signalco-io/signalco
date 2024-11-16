'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Input } from '@signalco/ui-primitives/Input';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';
import { Mail } from '@signalco/ui-icons';
import { useValidation, isValidEmail, validateFields } from '@enterwell/react-form-validation';
import { KnownPages } from '../../../../src/knownPages';

function useEmailLogin() {
    return useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            const resp = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            if (resp.status < 200 || resp.status > 299) {
                throw new Error('Failed to request login email');
            }
            const data = await resp.json() as { verifyPhrase?: string, clientId?: string };
            const verifyPhrase = data?.verifyPhrase;
            if (!verifyPhrase)
                throw new Error('Failed to request login email');
            const clientId = data?.clientId;
            if (!clientId)
                throw new Error('Failed to request login email');

            return {
                verifyPhrase,
                clientId
            };
        }
    });
}

export default function LoginPage() {
    const router = useRouter();
    const emailLogin = useEmailLogin();

    const formData = {
        email: useValidation('', isValidEmail)
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const hasErrors = validateFields(formData);
        if (hasErrors) {
            return;
        }

        try {
            const email = formData.email.value;
            const { verifyPhrase, clientId } = await emailLogin.mutateAsync({ email });
            router.push(KnownPages.LoginEmailSent(verifyPhrase, email, clientId));
        } catch {
            showNotification('Failed to send login email. Please try again.', 'error');
        }
    }

    return (
        <>
            <Typography center level="h2" semiBold>Log in to WorkingParty</Typography>
            <form onSubmit={handleLogin}>
                <Stack spacing={2}>
                    <Stack spacing={1}>
                        <Input
                            placeholder="Email address"
                            autoComplete="email"
                            autoFocus
                            {...formData.email.props}
                        />
                        {formData.email.error && <Typography
                            level="body2"
                            className="pl-2 text-red-400">
                            Please enter valid email address
                        </Typography>}
                    </Stack>
                    <Button
                        startDecorator={<Mail className="w-5" />}
                        variant="solid"
                        size="lg"
                        className="text-lg"
                        type="submit"
                        loading={emailLogin.isPending}
                        disabled={formData.email.error}>
                        Continue with Email
                    </Button>
                </Stack>
            </form>
        </>
    )
}
