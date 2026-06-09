import { initRealtime } from "../utils/realtime.js" ;


export function saveUser(data) {
    // خزّن التوكن
    localStorage.setItem("token", data.token);

    // خزّن بيانات المستخدم
    localStorage.setItem("user", JSON.stringify(data.user));
    initRealtime(data.user);

    // خزّن حالة تسجيل الدخول
    localStorage.setItem("loggedIn", "true");
}

export function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

export function getToken() {
    return localStorage.getItem("token");
}

export function isLoggedIn() {
    return localStorage.getItem("loggedIn") === "true";
}

export function logout() {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    localStorage.removeItem("loggedIn");
    
    localStorage.removeItem("jgamerz_cart");

    localStorage.removeItem("jgamerz_wishlist");
}
// Route Protection / Access Control
export function requireAuth(page) {

    if (!isLoggedIn()) {

        localStorage.setItem("redirectPage", page);

        navigate("auth");

        return false;
    }

    return true;
}
window.requireAuth = requireAuth;