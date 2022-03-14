import HCaptcha from "@hcaptcha/react-hcaptcha";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography, Collapse, FilledInput, Slide, Alert, Fade } from "@mui/material";
import { useState, useRef, createRef, SyntheticEvent, ChangeEvent } from "react";
import HttpService from "../../../src/services/HttpService";

function Newsletter() {
    const [email, setEmail] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const errorContainerRef = useRef<Element>(null);
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
                await HttpService.requestAsync(
                    "/website/newsletter-subscribe",
                    "post",
                    { email: email },
                    {
                        "HCAPTCHA-RESPONSE": token
                    },
                    true
                );

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
                <Typography variant="h2">{"What's new?"}</Typography>
                <Stack spacing={1} ref={errorContainerRef}>
                    <Typography sx={{ opacity: 0.9 }}>{"We'll get back to you with awesome news and updates."}</Typography>
                    <Collapse unmountOnExit in={!showSuccess}>
                        <Stack direction="row" alignItems="stretch">
                            <FilledInput
                                disabled={isLoading}
                                type="email"
                                placeholder="you@email.com"
                                hiddenLabel
                                fullWidth
                                required
                                sx={{ borderRadius: '8px 0 0 8px', maxWidth: '400px' }}
                                value={email}
                                onChange={handleOnEmail} />
                            <LoadingButton loading={isLoading} type="submit" variant="outlined" size="large" sx={{ borderRadius: '0 8px 8px 0' }} disableElevation>Subscribe</LoadingButton>
                        </Stack>
                    </Collapse>
                    <Slide unmountOnExit in={error != null} direction="down" container={errorContainerRef.current}>
                        <Alert severity="error" variant="outlined">{error}</Alert>
                    </Slide>
                    <Fade unmountOnExit in={showSuccess}>
                        <Alert severity="success" variant="outlined">You are our new favorite subscriber</Alert>
                    </Fade>
                </Stack>
            </Stack>
        </form>
    );
}

export default Newsletter;