export function Card(props: any) {
    return <div className="bg-neutral-100 p-2 rounded-lg border-neutral-300 border">{props.children}</div>;
} 

export function CardOverflow(props: any) {
    return <div>{props.children}</div>;
} 

export function CardContent(props: any) {
    return <div className="flex">{props.children}</div>;
} 

export function CardCover(props: any) {
    return <div>{props.children}</div>;
} 
