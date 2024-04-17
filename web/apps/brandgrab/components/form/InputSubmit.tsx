import { Input, InputProps } from '@signalco/ui-primitives/Input';

export type InputSubmitProps = Omit<InputProps, 'onSubmit'> & {
    onSubmit: (value: InputProps['value']) => void;
};

export default function InputSubmit({ value, onSubmit, ...rest }: InputSubmitProps) {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input value={value} {...rest} />
        </form>
    )
}
