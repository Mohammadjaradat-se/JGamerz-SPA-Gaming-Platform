import { Navbar, initNavbar } from "./components/navbar.js";
import { Home, initHome } from "./pages/home.js";
import { AuthPage, initAuth } from "./pages/auth.js";
import { GameStore, initGameStore } from "./pages/store.js";
import { Feed, initFeed } from "./pages/feed.js";
import { MarketPlace, initMarketPlace } from "./pages/marketplace.js";
import { News, initNews } from "./pages/news.js";
import { CommunityPage, initCommunity } from "./pages/community.js";
import { ProfilePage, initProfile } from "./pages/profile.js";
import { Settings, initSettings } from "./pages/settings.js";
import { AIAssistant, initAIAssistant } from "./components/ai-assistant.js";
import { Footer } from "./components/footer.js";
import { getUser } from "./utils/auth.js";
import { initRealtime } from "./utils/realtime.js";

const nav = document.getElementById("navbar");
const app = document.getElementById("app");
const footer = document.getElementById("footer");
const CURRENT_PAGE_KEY = "jgamerz_current_page";

nav.innerHTML = Navbar();
initNavbar();

footer.innerHTML = Footer();

document.body.insertAdjacentHTML("beforeend", AIAssistant());
initAIAssistant();
const user = getUser();

if (user) {

    initRealtime(user);

}

window.navigate = async function (page) {
    window.currentPage = page;
    sessionStorage.setItem(CURRENT_PAGE_KEY, page);

    switch (page) {
        case "home":
            app.innerHTML = Home();
            initHome();
            break;

        case "auth":
            app.innerHTML = AuthPage();
            initAuth();
            break;

        case "store":
            app.innerHTML = GameStore();
            initGameStore();
            break;

        case "feed":
            app.innerHTML = await Feed();
            initFeed();
            break;

        case "marketplace":
            app.innerHTML = MarketPlace();
            initMarketPlace();
            break;

        case "news":
            app.innerHTML = News();
            initNews();
            break;

        case "community":
            app.innerHTML = CommunityPage();
            initCommunity();
            break;
        case "profile":
            app.innerHTML = await ProfilePage();
            initProfile();
            break;
        case "settings":
            app.innerHTML = Settings();
            initSettings();
            break;

        default:
            app.innerHTML = Home();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};
// أول صفحة
navigate(sessionStorage.getItem(CURRENT_PAGE_KEY) || "home");


