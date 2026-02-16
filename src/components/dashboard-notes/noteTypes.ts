export interface Note {
    id: string;
    _id?: string;
    title: string;
    content: string;
    subject?: string;
    category?: string;
    groupId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface NoteGroup {
    id: string;
    _id?: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}
