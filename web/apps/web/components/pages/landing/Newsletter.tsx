'use client';

import { ChangeEvent, SyntheticEvent, createRef, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Input } from '@signalco/ui-primitives/Input';
import { Button } from '@signalco/ui-primitives/Button';
import { GentleSlide} from '@signalco/ui/GentleSlide';
import { Fade } from '@signalco/ui/Fade';
import { Alert } from '@signalco/ui/Alert';
import HCaptcha from '@hcaptcha/react-hcaptcha';

function Newsletter() {
    const [email, setEmail] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const hcaptchaRef = createRef<HCaptcha>();

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault();

        setIsLoading(true);

        // Execute the reCAPTCHA when the form is submitted
        hcaptchaRef.current?.execute();
    };

    const onHCaptchaChange = async (token: string | undefined) => {
        try {
            // If the HCAPTCHA code is null or undefined indicating that
            // the HCAPTCHA was expired then return early
            if (!token) {
                return;
            }

            // TODO: Submit request
            try {
                await fetch('https://api.signalco.io/api/website/newsletter-subscribe', {
                    method: 'post',
                    body: JSON.stringify({ email }),
                    headers: {
                        'HCAPTCHA-RESPONSE': token
                    }
                });

                setShowSuccess(true);
            } catch (err) {
                console.error('Failed to subscribe to newsletter', err);
                setError('Failed to subscribe to newsletter');
            }

            // Reset the HCAPTCHA so that it can be executed again if user
            // submits another email.
            hcaptchaRef.current?.resetCaptcha();
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        setError(undefined);
    };

    // Retrieve key, if not available don't show the component
    const key = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
    if (typeof key === 'undefined')
        return <></>;

    return (
        <form onSubmit={handleSubmit}>
            <HCaptcha
                ref={hcaptchaRef}
                size="invisible"
                sitekey={key}
                onVerify={onHCaptchaChange}
                onClose={() => onHCaptchaChange(undefined)} />
            <Stack spacing={4}>
                <Typography level="h4">{'What\'s new?'}</Typography>
                <Stack spacing={1}>
                    <Typography>{'We\'ll get back to you with awesome news and updates.'}</Typography>
                    <GentleSlide collapsedWhenHidden appear={!showSuccess} duration={200}>
                        <Row spacing={1}>
                            <Input
                                disabled={isLoading}
                                type="email"
                                placeholder="you@email.com"
                                required
                                className="w-full max-w-md"
                                value={email}
                                onChange={handleOnEmail} />
                            <Button loading={isLoading} type="submit" variant="solid">Subscribe</Button>
                        </Row>
                    </GentleSlide>
                    <GentleSlide collapsedWhenHidden appear={error != null} direction="down" duration={200}>
                        <Alert color="danger">{error}</Alert>
                    </GentleSlide>
                    <Fade collapsedWhenHidden appear={showSuccess}>
                        <Alert color="success">You are our new favorite subscriber</Alert>
                    </Fade>
                </Stack>
            </Stack>
        </form>
    );
}

export default Newsletter;
