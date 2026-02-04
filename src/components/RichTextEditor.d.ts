interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}
declare const RichTextEditor: ({ content, onChange, placeholder }: RichTextEditorProps) => import("react/jsx-runtime").JSX.Element;
export default RichTextEditor;
