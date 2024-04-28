// When the app first loads or the browser is manually refreshed, check localStorage
export const checkAuthFromLocalStorage = (): { token: string | null; userId: string | null } => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return { token, userId };
};

export const removeUserLoginInfo = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
};
