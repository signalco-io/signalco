import React, { memo } from 'react';
import Link from 'next/link';
import { Checkbox, Paper, Typography, TableBody, TableCell, TableHead, TableRow, Divider } from '@mui/material';
import MdxPageLayout from './MdxPageLayout';

const headingTopSpacing = 4;
const headingBottomSpacing = 2;

const components: any = {
    a: Link,
    p: (() => {
        const P = (props: any) => <Typography sx={{ py: 1 }} gutterBottom {...props} />;
        return memo(P);
    })(),
    h1: (() => {
        const H1 = (props: any) => <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} gutterBottom {...props} color="textSecondary" variant="h1" id={typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined} />;
        return memo(H1);
    })(),
    h2: (() => {
        const H2 = (props: any) => <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} gutterBottom {...props} color="textSecondary" variant="h2" id={typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined} />;
        return memo(H2);
    })(),
    h3: (() => {
        const H3 = (props: any) => <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} gutterBottom {...props} color="textSecondary" variant="h3" id={typeof props.children === 'string' ? (props.children as string).toLowerCase().replace(' ', '-') : undefined} />;
        return memo(H3);
    })(),
    h4: (() => {
        const H4 = (props: any) => <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} gutterBottom {...props} color="textSecondary" variant="h4" />;
        return memo(H4);
    })(),
    h5: (() => {
        const H5 = (props: any) => <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} gutterBottom {...props} color="textSecondary" variant="h5" />;
        return memo(H5);
    })(),
    h6: (() => {
        const H6 = (props: any) => <Typography sx={{ pt: headingTopSpacing, pb: headingBottomSpacing }} gutterBottom {...props} color="textSecondary" variant="h6" />;
        return memo(H6);
    })(),
    blockquote: (() => {
        const Blockquote = (props: any) => (
            <Paper style={{ borderLeft: '4px solid grey', padding: 8 }} {...props} />
        );
        return memo(Blockquote);
    })(),
    ul: (() => {
        const Ul = (props: any) => <Typography {...props} component="ul" />;
        return memo(Ul);
    })(),
    ol: (() => {
        const Ol = (props: any) => <Typography {...props} component="ol" />;
        return memo(Ol);
    })(),
    li: (() => {
        const Li = (props: any) => <Typography {...props} component="li" />;
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