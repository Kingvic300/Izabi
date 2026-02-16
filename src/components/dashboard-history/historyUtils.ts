const extractItems = (res: any) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.data && Array.isArray(res.data)) return res.data;
    if (res.items && Array.isArray(res.items)) return res.items;
    return [];
};

export const normalizeHistory = (
    generationsRes: any,
    quizResultsRes: any,
    notesRes: any,
    chatsRes: any,
) => {
    const generations = extractItems(generationsRes);
    const quizResults = extractItems(quizResultsRes);
    const notes = extractItems(notesRes);
    const chats = extractItems(chatsRes);

    return [
        ...generations.map((g: any) => ({
            ...g,
            hType: 'generation',
            hDate: g.createdAt || g.timestamp || new Date(),
            title: g.fileName || g.topic || 'Study Material',
        })),
        ...quizResults.map((q: any) => ({
            ...q,
            hType: 'quiz',
            hDate: q.date || q.createdAt || new Date(),
            title: q.quizTitle || q.subject || 'Practice Quiz',
            // Calculate correct answers if missing
            correctAnswers:
                q.correctAnswers ??
                Math.round(
                    ((q.score || 0) / 100) * (q.totalQuestions || 0),
                ),
        })),
        ...notes.map((n: any) => ({
            ...n,
            hType: 'note',
            hDate: n.updatedAt || n.createdAt || new Date(),
            title: n.title || 'Quick Note',
        })),
        ...chats.map((c: any) => ({
            ...c,
            hType: 'chat',
            hDate: c.updatedAt || c.createdAt || new Date(),
            message: c.lastMessage?.content || '',
            title: c.title
                ? c.title.length > 30
                    ? c.title.substring(0, 30) + '...'
                    : c.title
                : 'AI Conversation',
        })),
    ].sort(
        (a, b) =>
            new Date(b.hDate).getTime() - new Date(a.hDate).getTime(),
    );
};
