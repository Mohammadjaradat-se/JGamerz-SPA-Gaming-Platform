import { isLoggedIn } from "../utils/auth.js";

export function Home() {
  return `
        ${HeroSection()}
        ${GameSlider()}
        ${UpcomingGames()}
        ${GamingNews()}
        ${MarketPlace()}
`;
}
// Hero section :
export function HeroSection() {
  return `
        <!--Hero section-->
    <section class="hero">
        <div class="hero-content">
            <img class="hero-logo" src="./assets/Logo.png" alt="Website-logo" />
            <br />
            <div class="platform-badge">Jordan's #1 Gaming Platform</div>
            <p class="hero-subtitle">Level Up Your</p>
            <p class="hero-title">Gaming Experience</p>
            <p class="hero-description">
                Create your account, buy the latest games, list your products for
                sale,<br />
                create your profile, add friends, connect with them and share
                posts,<br />
                browse the latest gaming news,use the AI ​​assistant for help,<br />
                all in one platform!
            </p>
            <div class="hero-buttons">
                <button class="hero-button browse-btn">Browse Games</button>
                <button class="hero-button join-community-btn">Join Community</button>
            </div>
        </div>
    </section>
`;
}
// Featured Games / Slider Section :
export function GameSlider() {
  return ` 
    <!--games slider-->
    <section class="spaces-between-section">
        <div class="section-header">
            <h2 class="section-title">Featured Games</h2>
            <button class="section-button featured-games-btn">View All</button>
        </div>

        <div id="gameCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="2500">
            <!-- Indicators -->
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="0" class="active"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="2"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="3"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="4"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="5"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="6"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="7"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="8"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="9"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="10"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="11"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="12"></button>
                <button type="button" data-bs-target="#gameCarousel" data-bs-slide-to="13"></button>
            </div>

            <!-- Slides -->
            <div class="carousel-inner">
                <!-- Slide 1 -->
                <div class="carousel-item active">
                    <img src="./assets/games-images/FC26.png" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>EA Sports FC 26</h3>
                        <p>
                            Fast-paced football action with realistic gameplay and updated
                            teams.
                        </p>
                        <button class="slider-btn" id="FC26">More details</button>
                    </div>
                </div>

                <!-- Slide 2 -->
                <div class="carousel-item">
                    <img src="./assets/games-images/gtav.png" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>Grand Theft Auto V</h3>
                        <p>
                            Chaotic open-world crime adventure full of missions and freedom.
                        </p>
                        <button class="slider-btn" id="GTAV">More details</button>
                    </div>
                </div>

                <!-- Slide 3 -->
                <div class="carousel-item">
                    <img src="./assets/games-images/CallofDutybops6.png" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>Call of Duty: Black Ops 6</h3>
                        <p>Intense military combat with cinematic multiplayer action.</p>
                        <button class="slider-btn" id="CALLOFDUTYBLOPS6">
                            More details
                        </button>
                    </div>
                </div>

                <!-- Slide 4 -->
                <div class="carousel-item">
                    <img src="assets/games-images/Red-Dead.jpg" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>Red Dead Redemption 2</h3>
                        <p>
                            An emotional open-world western packed with action and
                            storytelling.
                        </p>
                        <button class="slider-btn" id="RED-DEAD">More details</button>
                    </div>
                </div>

                <!-- Slide 5 -->
                <div class="carousel-item">
                    <img src="assets/games-images/Godofwar.png" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>God of War</h3>
                        <p>A brutal mythological journey of a warrior and his son.</p>
                        <button class="slider-btn" id="GODOFWAR">More details</button>
                    </div>
                </div>

                <!-- Slide 6 -->
                <div class="carousel-item">
                    <img src="assets/games-images/forzaHorizon.jpg" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>Forza Horizon 6</h3>
                        <p>
                            Next-level racing excitement with massive open-world
                            exploration.
                        </p>
                        <button class="slider-btn" id="FORZA-HORIZON">More details</button>
                    </div>
                </div>

                <!-- Slide 7 -->
                <div class="carousel-item">
                    <img src="assets/games-images/Assassins Creed Valhalla.jpg" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>Assassin's Creed Valhalla</h3>
                        <p>
                            A Viking adventure filled with brutal combat and open-world
                            exploration.
                        </p>
                        <button class="slider-btn" id="ASSASSIN-VALHALLA">
                            More details
                        </button>
                    </div>
                </div>

                <!-- Slide 8 -->
                <div class="carousel-item">
                    <img src="assets/games-images/cs-2.jpg" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>Counter-Strike 2</h3>
                        <p>
                            A competitive first-person shooter focused on teamwork, strategy, and fast action.
                        </p>
                        <button class="slider-btn" id="Counter-Strike">
                            More details
                        </button>
                    </div>
                </div>

                <!-- Slide 9 -->
                <div class="carousel-item">
                    <img src="assets/games-images/residentEvil.jpg" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>Resident Evil 4</h3>
                        <p>
                            A survival horror game filled with zombies, mystery, and terrifying challenges.
                        </p>
                        <button class="slider-btn" id="Resident-Evil">
                            More details
                        </button>
                    </div>
                </div>

                <!-- Slide 9 -->
                <div class="carousel-item">
                    <img src="assets/games-images/TEKKEN_8.png" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>Tekken 8</h3>
                        <p>
                            A fast-paced fighting game with powerful characters and dynamic combat styles.
                        </p>
                        <button class="slider-btn" id="Tekken-8">
                            More details
                        </button>
                    </div>
                </div>

                <!-- Slide 10 -->
                <div class="carousel-item">
                    <img src="assets/games-images/pubg-battlegrounds.jpg" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>PUBG: Battlegrounds</h3>
                        <p>
                            A battle royale game where players fight to be the last survivor.
                        </p>
                        <button class="slider-btn" id="PUBG">
                            More details
                        </button>
                    </div>
                </div>

                <!-- Slide 11 -->
                <div class="carousel-item">
                    <img src="assets/games-images/spider-man.jpg" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>Marvel's Spider-Man</h3>
                        <p>
                            An action-adventure game where players swing through New York as Spider-Man.
                        </p>
                        <button class="slider-btn" id="Spider-Man">
                            More details
                        </button>
                    </div>
                </div>

                <!-- Slide 12 -->
                <div class="carousel-item">
                    <img src="assets/games-images/wwe-2k26.jpg" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>WWE 2K26</h3>
                        <p>
                            A wrestling game that lets players experience exciting WWE matches and superstars..
                        </p>
                        <button class="slider-btn" id="WWE-2k26">
                            More details
                        </button>
                    </div>
                </div>

                <!-- Slide 13-->
                <div class="carousel-item">
                    <img src="assets/games-images/mortal-kombat.jpg" class="d-block w-100" />
                    <div class="carousel-caption custom-caption">
                        <h3>Mortal Kombat</h3>
                        <p>
                            A legendary fighting game known for its intense battles and iconic Fatalities.
                        </p>
                        <button class="slider-btn" id="Mortal-Kombat">
                            More details
                        </button>
                    </div>
                </div>

            </div>

            <!-- Controls -->
            <button class="carousel-control-prev" type="button" data-bs-target="#gameCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </button>

            <button class="carousel-control-next" type="button" data-bs-target="#gameCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
            </button>
        </div>
    </section> 
`;
}
//Upcoming Games :
export function UpcomingGames() {
  return `
    <!--upcoming games-->
    <section class="spaces-between-section">
        <div class="section-header">
            <h2 class="section-title">Upcoming Games</h2>
            <button class="section-button upcoming-games-btn">View All</button>
        </div>

        <div class="trailers-grid">
            <!-- CARD 1 -->
            <div class="trailer-card">
                <h3 class="trailer-title">GTA VI</h3>

                <div class="video-container">
                    <iframe class="iframe-vid" src="https://www.youtube.com/embed/QdBZY2fkU-0?si=r5WGAmMybFkEC1LD"
                        title="YouTube video player" allowfullscreen>
                    </iframe>
                </div>

                <p class="trailer-description">
                    Most ambitious open-world experience yet, featuring stunning
                    realism, dynamic storytelling, and next-generation gameplay.
                </p>
            </div>

            <!-- CARD 2 -->
            <div class="trailer-card">
                <h3 class="trailer-title">ARC Raiders</h3>

                <div class="video-container">
                    <iframe class="iframe-vid" src="https://www.youtube.com/embed/IpeJjQDXNAE?si=PJuYy01spvpv5kOU"
                        title="YouTube video player" allowfullscreen>
                    </iframe>
                </div>

                <p class="trailer-description">
                    A futuristic extraction shooter where players battle deadly machines
                    in a ruined world.
                </p>
            </div>

            <!-- CARD 3 -->
            <div class="trailer-card">
                <h3 class="trailer-title">Marvel 1943: Rise of Hydra</h3>

                <div class="video-container">
                    <iframe class="iframe-vid" src="https://www.youtube.com/embed/Lb2wwEx6DVw?si=P7_wjZrQ0GXcb5eK"
                        title="YouTube video player" allowfullscreen>
                    </iframe>
                </div>

                <p class="trailer-description">
                    An action-adventure game featuring Captain America and Black Panther
                    during World War II.
                </p>
            </div>
        </div>
    </section>
`;
}
//Gaming news :
export function GamingNews() {
  return `
    
    <!--Gaming news-->
    <section class="spaces-between-section">

        <div class="section-header">
            <h2 class="section-title">Gaming News</h2>
            <button class="section-button all-news-btn">All news</button>
        </div>

        <div class="news-grid">
            <!--card 1-->
            <div class="news-card">
                <img class="news-img" src="./assets/images/razankeyboard.png" alt="razer-huntsman" />
                <h3 class="news-title">Razer Unveils Its Fastest Gaming Keyboard Yet</h3>
                <p class="news-description">Razer officially introduced its newest gaming keyboard built for competitive
                    players, featuring next-generation optical switches, customizable RGB lighting, faster response
                    times, and an upgraded ergonomic design for long gaming sessions.</p>
                <button class="left-card read-btn">Read more</button>
            </div>
            <!--card 2-->
            <div class="news-card">
                <img class="news-img" src="./assets/images/proxMouse.png" alt="pro x Logitech" />
                <h3 class="news-title">Logitech Launches a New Lightweight Gaming Mouse</h3>
                <p class="news-description">Logitech revealed a new wireless gaming mouse focused on speed, precision,
                    and comfort, designed specifically for esports and competitive gaming players.</p>
                <button class="right-card read-btn">Read more</button>
            </div>
        </div>
    </section>
`;
}
//Marketplace :
export function MarketPlace() {
  return `
    <!--Marketplace-->

    <section class="spaces-between-section">
        <div class="section-header">
            <h2 class="section-title">Marketplace</h2>
            <button class="section-button marketplace-btn">sell your items</button>
        </div>

        <div class="marketplace-grid">
            <div class="left-side">
                <h2 class="marketplace-title">Join the Ultimate Gaming Marketplace</h2>
                <p class="marketplace-description">List your gaming products, discover exclusive deals, and connect with
                    a growing gaming marketplace built for players.</p>
                <button class="get-started-btn">Get Started</button>
            </div>
            <div class="right-side">
                <img class="marketplace-img" src="./assets/images/marketPlace.png" alt="marketplace photo">
            </div>
        </div>
    </section>
`;
}
export function initHome() {
  // Browse Games
  document.querySelector(".browse-btn")?.addEventListener("click", () => {
    navigate("store");
  });
  // Join community
  document
    .querySelector(".join-community-btn")
    ?.addEventListener("click", () => {
      if (isLoggedIn()) {
        navigate("community");
      } else {
        navigate("auth");
      }
    });

  // Featured Games
  document
    .querySelector(".featured-games-btn")
    ?.addEventListener("click", () => {
      navigate("store");
    });

  // Upcoming Games
  document
    .querySelector(".upcoming-games-btn")
    ?.addEventListener("click", () => {
      navigate("store");
    });

  // News
  document.querySelector(".all-news-btn")?.addEventListener("click", () => {
    navigate("news");
  });
  // Marketplace
  document.querySelector(".get-started-btn")?.addEventListener("click", () => {
    navigate("marketplace");
  });

  document.querySelector(".marketplace-btn")?.addEventListener("click", () => {
    navigate("marketplace");
  });

   document.querySelector(".left-card")?.addEventListener("click", () => {
     navigate("news");
   });

   document.querySelector(".right-card")?.addEventListener("click", () => {
     navigate("news");
   });
}
