import { a11yDark as dark, a11yLight as light } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import React, { memo } from 'react';
import NextLink from 'next/link';
import { Checkbox, Divider, Link, Paper, Stack, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Typography } from '@mui/joy';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useUserTheme from 'src/hooks/useUserTheme';
import IconButtonCopyToClipboard from 'components/shared/buttons/IconButtonCopyToClipboard';
import MdxPageLayout from './MdxPageLayout';
import { ChildrenProps } from '../../src/sharedTypes';
import { useLocaleHelpers, useLocalePlaceholders } from '../../src/hooks/useLocale';
import useIsClient from '../../src/hooks/useIsClient';

const headingTopSpacing = 2;
const headingBottomSpacing = 2;

function LinkedHeader(props: ChildrenProps & { id: string | undefined }) {
    const { t } = useLocaleHelpers();
    const isClient = useIsClient();

    return (
        <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            sx={{
                '&>.mdxHeaderLinkButton': { visibility: 'hidden' },
                '&:hover': { '&>.mdxHeaderLinkButton': { visibility: 'visible' } }
            }}>
            {props.children}
            {(props.id && isClient) &&
                <IconButtonCopyToClipboard title={t('CopyLinkToClipboard')} value={`${window.location.origin}${window.location.pathname}#${props.id}`} className="mdxHeaderLinkButton">
                    <LinkIcon />
                </IconButtonCopyToClipboard>
            }
        </Stack>
    );
}

const components: any = {
    a: (() => {
        function A(props: any) {
            return <NextLink href={props.href} passHref>
                <Link >{props.children}</Link>
            </NextLink>
        }
        return memo(A);
    })(),
    p: (() => {
        function P(props: any) {
            return <Typography sx={{ py: 1 }} gutterBottom textColor="text.secondary" {...props} />
        }
        return memo(P);
    })(),
    h1: (() => {
        function H1(props: any) {
            const id = typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined;
            return (
                <LinkedHeader id={id}>
                    <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} {...props} level="h3" id={id} />
                </LinkedHeader>
            );
        }
        return memo(H1);
    })(),
    h2: (() => {
        function H2(props: any) {
            const id = typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined;
            return (
                <LinkedHeader id={id}>
                    <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} {...props} level="h4" id={id} />
                </LinkedHeader>
            );
        }
        return memo(H2);
    })(),
    h3: (() => {
        function H3(props: any) {
            const id = typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined;
            return (
                <LinkedHeader id={id}>
                    <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} {...props} level="h5" id={id} />
                </LinkedHeader>
            );
        }
        return memo(H3);
    })(),
    h4: (() => {
        function H4(props: any) {
            const id = typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined;
            return (
                <LinkedHeader id={id}>
                    <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} {...props} level="h6" id={id} />
                </LinkedHeader>
            );
        }
        return memo(H4);
    })(),
    h5: (() => {
        function H5(props: any) {
            const id = typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined;
            return (
                <LinkedHeader id={id}>
                    <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} {...props} level="h6" id={id} />
                </LinkedHeader>
            );
        }
        return memo(H5);
    })(),
    h6: (() => {
        function H6(props: any) {
            const id = typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined;
            return (
                <LinkedHeader id={id}>
                    <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} {...props} level="h6" id={id} />
                </LinkedHeader>
            );
        }
        return memo(H6);
    })(),
    blockquote: (() => {
        function Blockquote(props: any) {
            return <Paper style={{ borderLeft: '4px solid grey', padding: 8 }} {...props} />
        }
        return memo(Blockquote);
    })(),
    ul: (() => {
        function Ul(props: any) {
            return <ul {...props} />
        }
        return memo(Ul);
    })(),
    ol: (() => {
        function Ol(props: any) {
            return <ol {...props} />
        }
        return memo(Ol);
    })(),
    li: (() => {
        function Li(props: any) {
            return <Typography {...props} component="li" textColor="text.secondary" />
        }
        return memo(Li);
    })(),
    table: (() => {
        function Table(props: any) {
            return <Table {...props} />
        }
        return memo(Table);
    })(),
    tr: (() => {
        function Tr(props: any) {
            return <TableRow {...props} />
        }
        return memo(Tr);
    })(),
    td: (() => {
        function Td({ align, ...props }: { align?: 'inherit' | 'left' | 'center' | 'right' | 'justify' }) {
            return <TableCell align={align || undefined} {...props} />
        }
        return memo(Td);
    })(),
    tbody: (() => {
        function TBody(props: any) {
            return <TableBody {...props} />
        }
        return memo(TBody);
    })(),
    th: (() => {
        function Th({ align, ...props }: { align?: 'inherit' | 'left' | 'center' | 'right' | 'justify' }) {
            return <TableCell align={align || undefined} {...props} />
        }
        return memo(Th);
    })(),
    thead: (() => {
        function THead(props: any) {
            return <TableHead {...props} />
        }
        return memo(THead);
    })(),
    code: (() => {
        function Code({ className, ...props }: { children: string | string[], className?: string | undefined }) {
            const themeContext = useUserTheme();
            const { t } = useLocalePlaceholders();
            const match = /language-(\w+)/.exec(className || '')
            return match
                ? (
                    <Stack spacing={1}>
                        <Paper sx={{ py: 1, px: 2, position: 'relative' }}>
                            <Typography sx={{ position: 'absolute', right: 12, top: 12, userSelect: 'none' }} level="body2">{match[1]?.toUpperCase()}</Typography>
                            <SyntaxHighlighter customStyle={{ background: 'transparent', fontSize: '0.9em' }} showLineNumbers style={themeContext.isDark ? dark : light} language={match[1]} PreTag="div" {...props} />
                        </Paper>
                        <Stack direction="row" justifyContent="end">
                            <IconButtonCopyToClipboard title={t('CopyCodeToClipboard')} value={props.children}>
                                <ContentCopyIcon fontSize="small" />
                            </IconButtonCopyToClipboard>
                        </Stack>
                    </Stack>)
                : <code className={className} {...props} />
        }
        return memo(Code);
    })(),
    hr: Divider,
    input: (() => {
        function Input(props: any) {
            const { type } = props;
            if (type === 'checkbox') {
                return <Checkbox {...props} disabled={false} readOnly />;
            }
            return <input {...props} />;
        }
        return memo(Input);
    })(),
    wrapper: (() => {
        function Wrapper(props: any) {
            return <MdxPageLayout maxWidth="md" {...props} />
        }
        return memo(Wrapper);
    })(),
};

export default components;
