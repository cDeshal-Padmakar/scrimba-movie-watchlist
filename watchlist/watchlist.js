
// initialising page

let allTitleEl = []
let localData = []

if(localStorage.getItem("watchlist")){
    localData = JSON.parse(localStorage.getItem("watchlist"))
}

if (localData.length > 0) {
    render()
}
else {
    renderEmptyMessage()
}

function render() {
    let mainHtmlString = ""
    localData.forEach( (title,index) => {
        const imgSrc = (title.Poster === "N/A") ? "../image/img-not-found.jpg" : title.Poster
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
                <button class="title-watchlist-btn" data-remove-btn="${index}"><i class="fa-solid fa-xmark"></i> Watchlist</button>
            </div>
        </div>`
    })
    document.getElementById("main").innerHTML = mainHtmlString
    allTitleEl = document.getElementsByClassName("title-container")
}

function renderEmptyMessage() {
    document.getElementById("message").innerHTML = `
    <h4>Your watchlist is looking a little empty...</h4>
    <i class="fa-solid fa-circle-plus"></i> 
    <a href="../index.html">Let's add some movies!</a>
    `
}

window.addEventListener("beforeunload", function(e) {
    localStorage.setItem("watchlist", JSON.stringify(localData))
});



// listening for click event

document.addEventListener("click", handleClick)

function handleClick(e) {
    if(e.target.dataset.removeBtn) {
        handleRemoveBtnClick(e.target.dataset.removeBtn)
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

function handleRemoveBtnClick(index) {
    document.getElementById(index).style.opacity = 0
    localData.splice(index, 1)
    setTimeout(() => {
        render()
    }, 300)
}


function handleTitleClick(clickedEl) {
    const clickedElData = localData[clickedEl.id]
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
                    <button class="title-watchlist-btn text-wrap" data-remove-btn="${clickedEl.id}"><i class="fa-solid fa-xmark"></i></i> Watchlist</button>
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
                <button class="title-watchlist-btn" data-remove-btn="${clickedEl.id}"><i class="fa-solid fa-xmark"></i> Watchlist</button>
            </div>
            `
        }
        clickedEl.style.opacity = 1;
    }, 300)
}

