const API_KEY = "1f0ef25771d74023a3118716b153dfc3";
const BASE_URL = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        // Construct the full API URL with the query and API key
        const url = `${BASE_URL}${encodeURIComponent(query)}&apiKey=${API_KEY}`;
        let response = await fetch(url);

        // Check if response is ok (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        console.log(data); // Log data to check its structure

        // Assuming 'articles' is the key containing the news items
        bindData(data.articles);   // Pass the articles to the function
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clear previous cards
    cardsContainer.innerHTML = "";

    if (Array.isArray(articles)) {
        articles.forEach((article) => {
            if (!article.urlToImage) return; // Skip if no image

            const cardClone = newsCardTemplate.content.cloneNode(true);
            fillDataInCard(cardClone, article);
            cardsContainer.appendChild(cardClone);
        });
    } else {
        console.error('Unexpected data format:', articles);
    }
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    // Fill the card with article data
    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Add click event to open article in a new tab
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    if (curSelectedNav) {
        curSelectedNav.classList.remove("active");
    }
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (query) {
        fetchNews(query);
        if (curSelectedNav) {
            curSelectedNav.classList.remove("active");
        }
        curSelectedNav = null;
    }
});
