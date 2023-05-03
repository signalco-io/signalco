import { TextField } from '@signalco/ui/dist/TextField';
import { Button } from '@signalco/ui/dist/Button';
import { FormControl } from '@signalco/ui';

type InputSubmitProps = {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onSubmit: (value: string) => void;
    placeholder?: string;
    isLoading?: boolean;
};

export default function InputSubmit({ value, onChange, onSubmit, placeholder, isLoading }: InputSubmitProps) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormControl>
                <TextField
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    fullWidth
                    endDecorator={
                        <Button
                            variant="solid"
                            type="submit"
                            loading={isLoading}>
                            Grab
                        </Button>
                    } />
            </FormControl>
        </form>
    )
}
