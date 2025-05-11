export function getUserIdFromCookie() {
    const match = document.cookie.match(/(^|;)\s*user_id=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
}
