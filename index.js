
let dataBase = []
let allTitleEl = []


document.getElementById("title").addEventListener("keyup", (e) => {
    if(e.key === "Enter"){
        handleSearch()
    }
})

document.addEventListener("click", handleClick)

function handleClick(e) {
    if(e.target.id === "search-btn") {
        handleSearch()
    }
    else if(e.target.dataset.watchlistBtn) {
        handleWatchlistBtnClick(e.target.dataset.watchlistBtn)
    }
    else if(allTitleEl.length > 0){
        for(let item of allTitleEl) {
            if(item.contains(e.target)){
                handleTitleClick(item)
                break;
            }
        }
    }
}

async function handleSearch() {
    const titleEl = document.getElementById("title")
    
    // searching for given title
    const response = await fetch(`http://www.omdbapi.com/?apikey=d5178fef&s=${titleEl.value}`)
    const titles = await response.json()
    if(titles.Response === "True") {
        //getting detailed data of each title
        dataBase.splice(0, dataBase.length)
        dataBase = await Promise.all(titles.Search.map(async title => {
            const res = await fetch(`http://www.omdbapi.com/?apikey=d5178fef&i=${title.imdbID}`)
            const data = await res.json()
            return data
        }))
        //render
        render(dataBase)
    } 
    else {
        renderError()
    }
    

}

function handleWatchlistBtnClick(titleId) {
    if(!(localData.includes(dataBase[titleId]))) {
        localData.push(dataBase[titleId])
    }
}

function handleTitleClick(clickedEl) {
    const clickedElData = dataBase[clickedEl.id]
    clickedEl.style.opacity = 0;
    setTimeout(function() {
        if(clickedEl.dataset.clicked === "false") {
            clickedEl.dataset.clicked = "true"
            clickedEl.innerHTML = `
            <div class="title-summary clicked">
                <h3 class="title-name">${clickedElData.Title}</h3>
                <div class="title-imdb-rating">
                    <p><i class="fa-solid fa-star"></i> ${clickedElData.imdbRating}</p>
                </div>
                <div class="title-mics-details">
                    <p>${clickedElData.Runtime} ● ${clickedElData.Genre} ● ${clickedElData.Type} ● ${clickedElData.Year}</p>
                </div>
                <div class="plot">
                    <p>${clickedElData.Plot}</p>
                </div>
                <div class="last-child">
                    <button class="title-watchlist-btn text-wrap" data-watchlist-btn="${clickedEl.id}"><i class="fa-solid fa-plus"></i> Watchlist</button>
                </div>
            </div>
            `
        } 
        else {
            const imgSrc = (clickedElData.Poster === "N/A") ? "./image/img-not-found.jpg" : clickedElData.Poster
            clickedEl.dataset.clicked = "false"
            clickedEl.innerHTML = `
            <div>
                <img src=${imgSrc}>
            </div>
            <div class="title-summary">
                <h4 class="title-name text-wrap">${clickedElData.Title}</h4>
                <div class="title-details">
                    <div class="title-imdb-rating">
                        <p><i class="fa-solid fa-star"></i> ${clickedElData.imdbRating}</p>
                    </div>
                    <div class="title-mics-details text-wrap">
                        <p>&nbsp● ${clickedElData.Runtime} ● ${clickedElData.Type} ● ${clickedElData.Year}</p>
                    </div>
                </div>
                <button class="title-watchlist-btn" data-watchlist-btn="${clickedEl.id}"><i class="fa-solid fa-plus"></i> Watchlist</button>
            </div>
            `
        }
        clickedEl.style.opacity = 1;
    }, 300)
}

function render(dataBase) {
    let mainHtmlString = ""
    dataBase.forEach( (title,index) => {
        const imgSrc = (title.Poster === "N/A") ? "./image/img-not-found.jpg" : title.Poster
        mainHtmlString += `
        <div class="title-container" id=${index} data-clicked="false">
            <div>
                <img src=${imgSrc}>
            </div>
            <div class="title-summary">
                <h4 class="title-name text-wrap">${title.Title}</h4>
                <div class="title-details">
                    <div class="title-imdb-rating">
                        <p><i class="fa-solid fa-star"></i> ${title.imdbRating}</p>
                    </div>
                    <div class="title-mics-details text-wrap">
                        <p>&nbsp● ${title.Runtime} ● ${title.Type} ● ${title.Year}</p>
                    </div>
                </div>
                <button class="title-watchlist-btn" data-watchlist-btn="${index}"><i class="fa-solid fa-plus"></i> Watchlist</button>
            </div>
        </div>`
    })
    document.getElementById("main").innerHTML = mainHtmlString
    document.getElementById("message").textContent = ""
    allTitleEl = document.getElementsByClassName("title-container")
}

function renderError() {
    document.getElementById("main").innerHTML = ""
    document.getElementById("message").innerHTML = `
    <i class="fa-solid fa-triangle-exclamation"></i>
    <h2>No title found</h2>`
}


// local storage

let localData = []

if(localStorage.getItem("watchlist")) {
    localData = JSON.parse(localStorage.getItem("watchlist"))
}

window.addEventListener("beforeunload", function(e) {
    localStorage.setItem("watchlist", JSON.stringify(localData))
});

