const autocompleteConfig = {
    renderOption(movie) {
        const imageSrc = (movie.Poster === "N/A") ? "" : movie.Poster;
        return `
            <img src="${imageSrc}">
            ${movie.Title}  (${movie.Year})
        `;
    },
    inputValue(movie) {
        return `${movie.Title} (${movie.Year})`;
    },
    async fetchData(searchTerm) {
        const response = await axios.get("http://www.omdbapi.com/", {
            params: {
                apikey: "99e262a4",
                s: searchTerm
            }
        });

        if (response.data.Error) {
            return [];
        }
        return response.data.Search;
    }

}

createAutocomplete({
    ...autocompleteConfig,
    root: document.querySelector("#left-autocomplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"),"left");
    }
});

createAutocomplete({
    ...autocompleteConfig,
    root: document.querySelector("#right-autocomplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#right-summary"),"right");
    }
});

let movieLeft;
let movieRight;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get("https://omdbapi.com/", {
        params: {
            apikey: "99e262a4",
            i: movie.imdbID
        }

    })
    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === "left"){
        movieLeft = response.data;
    }else{
        movieRight = response.data;
    }
    
    if (movieRight && movieLeft) {
        runComparison();
    }
}

const runComparison = () => {
    const leftSideStats = document.querySelectorAll("#left-summary .notification");
    const rightSideStats = document.querySelectorAll("#right-summary .notification");

    leftSideStats.forEach((leftStat , index) => {
        const rightStat = rightSideStats[index];
       
        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);

        if (rightSideValue > leftSideValue){
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
        }else {
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
        }
    })
}

const movieTemplate = (movieDetails) => {
    const rottenTomatoes = parseInt(movieDetails.Ratings[1].Value);
    const metascore =  parseInt(movieDetails.Metascore);                  //parseInt used for first time
    const imdbRating = parseFloat(movieDetails.imdbRating);               //parseFloat too
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/\,/g,""))  //new method used (replce();)
    const awards = movieDetails.Awards.split(" ").reduce((prev , word) => {
        const value = parseInt(word);

        if (isNaN(value)){                                           //new buil un method in the browser (isNaN)
            return prev;
        }else {
            prev += value
            return prev;
        }
    },0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div> 
        </article>
        <article data-value="${awards}" class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="sub-title">Awards</p>
        </article>
        <article data-value="${rottenTomatoes}" class="notification is-primary">
            <p class="title">${movieDetails.Ratings[1].Value}</p>
            <p class="sub-title">Rotten Tomatoes Rating</p>
        </article>
        <article data-value="${metascore}" class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="sub-title">Metascore</p>
        </article>
        <article data-value="${imdbRating}" class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="sub-title">IMDB Rating</p>
        </article>
        <article data-value="${imdbVotes}" class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="sub-title">IMDB Votes</p>
        </article>
        `;
}