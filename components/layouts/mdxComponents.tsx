import React, { memo, useContext } from 'react';
import NextLink from 'next/link';
import { Checkbox, Paper, Typography, TableBody, TableCell, TableHead, TableRow, Divider, Link, Stack } from '@mui/material';
import MdxPageLayout from './MdxPageLayout';
import LinkIcon from '@mui/icons-material/Link';
import { ChildrenProps } from '../../src/sharedTypes';
import { useLocaleHelpers } from '../../src/hooks/useLocale';
import IconButtonCopyToClipboard from '../shared/form/IconButtonCopyToClipboard';
import useIsClient from '../../src/hooks/useIsClient';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark as dark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { a11yLight as light } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { AppContext } from '../../pages/_app';

const headingTopSpacing = 4;
const headingBottomSpacing = 4;

function LinkedHeader(props: ChildrenProps & { id: string | undefined }) {
    const { t } = useLocaleHelpers();
    const isClient = useIsClient();

    return (
        <Stack spacing={1} direction="row" alignItems="center" sx={{ '&>.mdxHeaderLinkButton': { visibility: 'hidden' }, '&:hover': { '&>.mdxHeaderLinkButton': { visibility: 'visible' } } }}>
            {props.children}
            {(props.id && isClient) &&
                <IconButtonCopyToClipboard id={props.id} title={t('CopyLinkToClipboard')} value={`${window.location.origin}${window.location.pathname}#${props.id}`} className="mdxHeaderLinkButton">
                    <LinkIcon />
                </IconButtonCopyToClipboard>
            }
        </Stack>
    );
}

const components: any = {
    a: (() => {
        const A = (props: any) => (
            <NextLink href={props.href} passHref>
                <Link >{props.children}</Link>
            </NextLink>);
        return memo(A);
    })(),
    p: (() => {
        const P = (props: any) => <Typography sx={{ py: 1 }} gutterBottom color="textSecondary" {...props} />;
        return memo(P);
    })(),
    h1: (() => {
        const H1 = (props: any) => {
            const id = typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined;
            return (
                <LinkedHeader id={id}>
                    <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} {...props} variant="h1" id={id} />
                </LinkedHeader>
            );
        };
        return memo(H1);
    })(),
    h2: (() => {
        const H2 = (props: any) => {
            const id = typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined;
            return (
                <LinkedHeader id={id}>
                    <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} {...props} variant="h2" id={id} />
                </LinkedHeader>
            );
        };
        return memo(H2);
    })(),
    h3: (() => {
        const H3 = (props: any) => {
            const id = typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined;
            return (
                <LinkedHeader id={id}>
                    <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} {...props} variant="h3" id={id} />
                </LinkedHeader>
            );
        };
        return memo(H3);
    })(),
    h4: (() => {
        const H4 = (props: any) => {
            const id = typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined;
            return (
                <LinkedHeader id={id}>
                    <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} {...props} variant="h4" id={id} />
                </LinkedHeader>
            );
        };
        return memo(H4);
    })(),
    h5: (() => {
        const H5 = (props: any) => {
            const id = typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined;
            return (
                <LinkedHeader id={id}>
                    <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} {...props} variant="h5" id={id} />
                </LinkedHeader>
            );
        };
        return memo(H5);
    })(),
    h6: (() => {
        const H6 = (props: any) => {
            const id = typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined;
            return (
                <LinkedHeader id={id}>
                    <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} {...props} variant="h6" id={id} />
                </LinkedHeader>
            );
        };
        return memo(H6);
    })(),
    blockquote: (() => {
        const Blockquote = (props: any) => (
            <Paper style={{ borderLeft: '4px solid grey', padding: 8 }} {...props} />
        );
        return memo(Blockquote);
    })(),
    ul: (() => {
        const Ul = (props: any) => <Typography {...props} component="ul" color="textSecondary" />;
        return memo(Ul);
    })(),
    ol: (() => {
        const Ol = (props: any) => <Typography {...props} component="ol" color="textSecondary" />;
        return memo(Ol);
    })(),
    li: (() => {
        const Li = (props: any) => <Typography {...props} component="li" color="textSecondary" />;
        return memo(Li);
    })(),
    table: (() => {
        const Table = (props: any) => <Table {...props} />;
        return memo(Table);
    })(),
    tr: (() => {
        const Tr = (props: any) => <TableRow {...props} />;
        return memo(Tr);
    })(),
    td: (() => {
        const Td = ({ align, ...props }: { align?: 'inherit' | 'left' | 'center' | 'right' | 'justify' }) => (
            <TableCell align={align || undefined} {...props} />
        );
        return memo(Td);
    })(),
    tbody: (() => {
        const TBody = (props: any) => <TableBody {...props} />;
        return memo(TBody);
    })(),
    th: (() => {
        const Th = ({ align, ...props }: { align?: 'inherit' | 'left' | 'center' | 'right' | 'justify' }) => (
            <TableCell align={align || undefined} {...props} />
        );
        return memo(Th);
    })(),
    thead: (() => {
        const THead = (props: any) => <TableHead {...props} />;
        return memo(THead);
    })(),
    code: (() => {
        const Code = ({ className, ...props }) => {
            const appContext = useContext(AppContext);
            const match = /language-(\w+)/.exec(className || '')
            return match
                ? <SyntaxHighlighter style={appContext.isDark ? dark : light} language={match[1]} PreTag="div" {...props} />
                : <code className={className} {...props} />
        };
        return memo(Code);
    })(),
    hr: Divider,
    input: (() => {
        const Input = (props: any) => {
            const { type } = props;
            if (type === 'checkbox') {
                return <Checkbox {...props} disabled={false} readOnly />;
            }
            return <input {...props} />;
        };
        return memo(Input);
    })(),
    wrapper: (() => {
        const Wrapper = (props: any) => <MdxPageLayout maxWidth="md" {...props} />;
        return memo(Wrapper);
    })(),
};

export default components;
