import type { JSX } from 'react';
// types/mdx.d.ts
declare module '*.mdx' {
    let MDXComponent: (props) => JSX.Element
    export const meta: {
        title: string
        date: string
        description: string
        category: string
    }
    export default MDXComponent
}
