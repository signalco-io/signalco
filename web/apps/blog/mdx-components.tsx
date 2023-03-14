import Typograhy from '@signalco/ui/dist/Typography';
import Row from '@signalco/ui/dist/Row';

function H1({ children }) {
    return <Typograhy level="h1">{children}</Typograhy>;
}

function H2({ children }) {
    return <Typograhy level="h2">{children}</Typograhy>;
}

function H3({ children }) {
    return <Typograhy level="h3">{children}</Typograhy>;
}

function H4({ children }) {
    return <Typograhy level="h4">{children}</Typograhy>;
}

function H5({ children }) {
    return <Typograhy level="h5">{children}</Typograhy>;
}

function H6({ children }) {
    return <Typograhy level="h6">{children}</Typograhy>;
}

function P({ children }) {
    return <Typograhy level="body1" gutterBottom lineHeight={1.5} fontSize={'1.1em'}>{children}</Typograhy>;
}

function Li({ children }) {
    return (
        <Row spacing={1} style={{ marginBottom: 8 }} alignItems="start">
            <Typograhy opacity={0.4} fontSize={'1.1em'} lineHeight={1.5}>&ndash;</Typograhy>
            <Typograhy level="body1" fontSize={'1.1em'} lineHeight={1.5}>{children}</Typograhy>
        </Row>
    );
}

function Ul({ children }) {
    return <ul style={{ paddingBottom: 4 }}>{children}</ul>;
}

export function useMDXComponents(components) {
    return { h1: H1, h2: H2, h3: H3, h4: H4, h5: H5, h6: H6, p: P, li: Li, ul: Ul, ...components };
}
