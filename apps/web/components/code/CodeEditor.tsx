import { editor } from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';
import useUserTheme from '../../src/hooks/useUserTheme';

loader.config({ paths: { vs: '/vs' } });
if (typeof window !== 'undefined') {
    loader.init().then(monaco => {
        monaco.editor.defineTheme('signalco-dark', {
            base: 'vs-dark',
            colors: {
                'editor.background': '#09090D'
            },
            inherit: true,
            rules: []
        });
        monaco.editor.defineTheme('signalco-light', {
            base: 'vs',
            colors: {
                'editor.background': '#eeeeee'
            },
            inherit: true,
            rules: []
        })
    });
}

export interface CodeEditorProps {
    language: 'bash' | 'json'
    code: string | string[] | undefined,
    setCode?: (code: string) => void,
    height?: string | number,
    readonly?: boolean,
    lineNumbers?: boolean,
    options?: editor.IStandaloneEditorConstructionOptions
}

export default function CodeEditor(props: CodeEditorProps) {
    const { language, code, setCode, height, readonly, lineNumbers, options } = props;
    const themeContext = useUserTheme();

    return (
        <Editor
            height={height}
            language={language}
            theme={themeContext.isDark ? 'signalco-dark' : 'signalco-light'}
            options={{
                lineNumbers: lineNumbers ? 'on' : 'off',
                minimap: { enabled: false },
                readOnly: readonly,
                ...(options || {})
            }}
            value={Array.isArray(code) ? code.join() : code}
            onChange={(value) => setCode && setCode(value || '')} />
    );
}
