export const defaultAvatar = (email: string) =>
    `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(email || 'scholar@izabi.ai')}`;

export const syncAvatarInStorage = (
    profilePicturePath: string,
    email: string,
) => {
    localStorage.setItem(
        'userProfilePicturePath',
        profilePicturePath || defaultAvatar(email),
    );
    window.dispatchEvent(new Event('storage'));
};
