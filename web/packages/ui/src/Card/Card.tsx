import type { HTMLAttributes, PropsWithChildren } from "react";
import { Link } from "../Link";
import { cx } from "classix";

export function Card({ href, ...restProps }: any) {
    const Comp = href
        ? ({ children }: PropsWithChildren) => <Link href={href}>{children}</Link>
        : ({ children }: PropsWithChildren) => (<>{children}</>);
    return (
        <Comp>
            <div className="bg-card rounded-lg p-2 border text-card-foreground shadow-sm" {...restProps} />
        </Comp>
    );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx("flex flex-col space-y-1.5 p-6", className)} {...props} />;
};

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return <div className={cx("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
};

export function CardOverflow(props: any) {
    return <div>{props.children}</div>;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cx("p-6 pt-0", className)}>{props.children}</div>;
}

export function CardCover(props: any) {
    return <div>{props.children}</div>;
} 
