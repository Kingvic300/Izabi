import type { Note, NoteGroup } from './noteTypes';

export const getNoteId = (note: Partial<Note> | any): string =>
    String(note?.id || note?._id || '');

export const normalizeNote = (note: any): Note => ({
    ...note,
    id: getNoteId(note),
    _id: note?._id,
    subject: note?.subject || note?.category || '',
    groupId:
        typeof note?.groupId === 'object'
            ? note?.groupId?._id || note?.groupId?.id || null
            : note?.groupId || null,
});

export const getGroupId = (group: Partial<NoteGroup> | any): string =>
    String(group?.id || group?._id || '');

export const normalizeGroup = (group: any): NoteGroup => ({
    ...group,
    id: getGroupId(group),
    _id: group?._id,
});

export const ACCEPTED_IMPORT_TYPES = '.txt,.pdf,.docx,.jpg,.jpeg,.png';
export const ACCEPTED_SCAN_TYPES = '.jpg,.jpeg,.png';

export const stripExtension = (value: string): string =>
    value.replace(/\.[^/.]+$/, '');

export const isImageFile = (file: File): boolean =>
    file.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(file.name);

export const isAllowedImportFile = (file: File): boolean =>
    /\.(txt|pdf|docx|jpg|jpeg|png)$/i.test(file.name) ||
    file.type.startsWith('image/') ||
    file.type === 'application/pdf' ||
    file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const escapeHtml = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

export const plainTextToHtml = (text: string): string => {
    const paragraphs = text.split(/\n{2,}/);
    return paragraphs
        .map((paragraph) => {
            const escaped = escapeHtml(paragraph.trim());
            const withBreaks = escaped.replace(/\n/g, '<br />');
            return `<p>${withBreaks}</p>`;
        })
        .join('');
};
