type ImpersonationSnapshot = {
    authToken: string | null;
    refreshToken: string | null;
    userId: string | null;
    userRole: string | null;
    userEmail: string | null;
    userFirstName: string | null;
    userLastName: string | null;
    userProfilePicturePath: string | null;
};

const SNAPSHOT_KEY = 'impersonationAdminSnapshot';
const ACTIVE_KEY = 'impersonationActive';

export const isImpersonationActive = (): boolean =>
    typeof window !== 'undefined' &&
    localStorage.getItem(ACTIVE_KEY) === 'true';

export const startImpersonationSession = (params: {
    token: string;
    targetUser?: {
        id?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
        profilePicturePath?: string;
    } | null;
}) => {
    if (typeof window === 'undefined') return;

    const snapshot: ImpersonationSnapshot = {
        authToken: localStorage.getItem('authToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        userId: localStorage.getItem('userId'),
        userRole: localStorage.getItem('userRole'),
        userEmail: localStorage.getItem('userEmail'),
        userFirstName: localStorage.getItem('userFirstName'),
        userLastName: localStorage.getItem('userLastName'),
        userProfilePicturePath: localStorage.getItem('userProfilePicturePath'),
    };

    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
    localStorage.setItem(ACTIVE_KEY, 'true');

    localStorage.setItem('authToken', params.token);
    localStorage.removeItem('refreshToken');

    const target = params.targetUser;
    if (target) {
        if (target.id) localStorage.setItem('userId', target.id);
        if (target.role) {
            localStorage.setItem('userRole', target.role.toUpperCase());
        } else {
            localStorage.setItem('userRole', 'USER');
        }
        if (target.email) localStorage.setItem('userEmail', target.email);
        if (target.firstName)
            localStorage.setItem('userFirstName', target.firstName);
        if (target.lastName)
            localStorage.setItem('userLastName', target.lastName);
        if (target.profilePicturePath) {
            localStorage.setItem(
                'userProfilePicturePath',
                target.profilePicturePath,
            );
        }
    }
};

export const endImpersonationSession = () => {
    if (typeof window === 'undefined') return;

    const rawSnapshot = localStorage.getItem(SNAPSHOT_KEY);
    if (rawSnapshot) {
        try {
            const snapshot = JSON.parse(rawSnapshot) as ImpersonationSnapshot;
            if (snapshot.authToken) {
                localStorage.setItem('authToken', snapshot.authToken);
            } else {
                localStorage.removeItem('authToken');
            }
            if (snapshot.refreshToken) {
                localStorage.setItem('refreshToken', snapshot.refreshToken);
            } else {
                localStorage.removeItem('refreshToken');
            }
            if (snapshot.userId) {
                localStorage.setItem('userId', snapshot.userId);
            } else {
                localStorage.removeItem('userId');
            }
            if (snapshot.userRole) {
                localStorage.setItem('userRole', snapshot.userRole);
            } else {
                localStorage.removeItem('userRole');
            }
            if (snapshot.userEmail) {
                localStorage.setItem('userEmail', snapshot.userEmail);
            } else {
                localStorage.removeItem('userEmail');
            }
            if (snapshot.userFirstName) {
                localStorage.setItem('userFirstName', snapshot.userFirstName);
            } else {
                localStorage.removeItem('userFirstName');
            }
            if (snapshot.userLastName) {
                localStorage.setItem('userLastName', snapshot.userLastName);
            } else {
                localStorage.removeItem('userLastName');
            }
            if (snapshot.userProfilePicturePath) {
                localStorage.setItem(
                    'userProfilePicturePath',
                    snapshot.userProfilePicturePath,
                );
            } else {
                localStorage.removeItem('userProfilePicturePath');
            }
        } catch {
            // Ignore malformed snapshot
        }
    }

    localStorage.removeItem(SNAPSHOT_KEY);
    localStorage.removeItem(ACTIVE_KEY);
};

export const clearImpersonationSession = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SNAPSHOT_KEY);
    localStorage.removeItem(ACTIVE_KEY);
};
