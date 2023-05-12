export function Card(props: any) {
    return <div className="bg-card rounded-lg border text-card-foreground shadow-sm">{props.children}</div>;
} 

export function CardOverflow(props: any) {
    return <div>{props.children}</div>;
} 

export function CardContent(props: any) {
    return <div className="p-6 pt-0">{props.children}</div>;
} 

export function CardCover(props: any) {
    return <div>{props.children}</div>;
} 
