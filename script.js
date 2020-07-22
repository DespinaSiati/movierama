const APIKEY = 'bc50218d91157b1ba4f142ef7baaa6a0';
let baseURL = 'https://api.themoviedb.org/3';
let posterBaseURL = 'http://image.tmdb.org/t/p/w185/'
let nowPlayingPage = 1;
let searchResultsPage = 1;

async function getGenreJson(){
    let genreUrl = ''.concat(baseURL, '/genre/movie/list?api_key=', APIKEY);
    const response = await fetch(genreUrl);
    return await response.json();
}
 
function nowPlaying() {
    getGenreJson().then(genresResponse => {
        let genres = genresResponse.genres;
        let nowPlayingUrl = ''.concat(baseURL, '/movie/now_playing?api_key=', APIKEY, '&page=', nowPlayingPage);
        getMovies(nowPlayingUrl, genres);
    })
}

function runSearch(index) {
	getGenreJson().then(genresResponse => {
        let genres = genresResponse.genres;
        if (index === 1) {
            searchResultsPage = 1;
            document.getElementById('output').innerHTML = "";
        }
		document.getElementById("page_title").style.display = "none";
		input = document.getElementById("myInput");
		inputValue = input.value;
	    let searchUrl = ''.concat(baseURL, '/search/movie?api_key=', APIKEY, '&query=', inputValue, '&page=', searchResultsPage);
	    getMovies(searchUrl, genres)
    })
}

function openHamburger() {
	var element = document.getElementById("hamburger");
	var mobileMenu = document.getElementById('mobile_header_menu');
	if (element.classList.contains("open")) {
  		element.classList.remove("open");
  		mobileMenu.classList.remove("open");
	} else {
		element.classList.add("open");
		mobileMenu.classList.add("open");
	}
	
}

function getMovies(url, genres) {
	fetch(url)
    .then(result=>result.json())
    .then((data)=>{
        var text = JSON.stringify(data, null, 4);
        var list = JSON.parse(text);
        results = list.results;
        for (let i = 0; i < results.length; i++) {
        	let movieId = results[i].id;
            let genresNames = [];
            let index = 0;
            for (let j = 0; j < results[i].genre_ids.length; j++) {
                for (let k = 0; k < genres.length; k++) {
                    if (results[i].genre_ids[j] === genres[k].id) {
                        genresNames[index] = ' ' + genres[k].name;
                        index++;
                    }
                }
            }

            document.getElementById('output').innerHTML +=
                "<div class='search-result'>" +
                    "<div class='movie-info' id='movie-info-"+ movieId +"'>" +
                        "<h3 class='movie-title' id='movie-title-"+ movieId +"'>" + results[i].title + "</h3>" +
                        "<p class='movie-release-year' id='movie-year-"+ movieId +"'>(" + results[i].release_date.substring(0, 4) + ")</p>" +
                        "<p class='movie-vote-average' id='movie-vote-"+ movieId +"'>" + results[i].vote_average + "<span class='star'> &#9733; </span></p>" +
                    "</div>" +
                    "<div class='movie-poster' id='movie-poster-"+ movieId +"'>" +
                        "<img src='" + posterBaseURL + results[i].poster_path + "'>" +
                    "</div>" +
                    "<div class='movie-details' id='movie-details-"+ movieId +"'>" +
                        "<p class='movie-genres' id='movie-genres-"+ movieId +"'>" + genresNames + "</p>" +
                        "<p class='movie-overview' id='movie-overview-"+ movieId +"'>" + results[i].overview + "</p>" +
                    "</div>" +
                    "<div class='hidden' id='hidden_"+ movieId +"'>" +
                    	"<h3 class='details-title'>Movie Trailer</h3><div class='trailer' id='trailer_"+ movieId +"'>" +
                        "</div>" +
                        "<h3 class='details-title'>Reviews</h3><div class='reviews' id='reviews_"+ movieId +"'>" +
                        "</div>" +
                        "<h3 class='details-title'>Similar Movies</h3><div class='similar' id='similar_"+ movieId +"'>" +
                        "</div>" +
                    "</div>" +
                    "<div id='read_more_"+ movieId +"' class='movie-read-more' onclick='show("+ movieId + ", "+ i +")'>Read More</div>" +
                    "<div id='read_less_"+ movieId +"' class='movie-read-less' onclick='hide("+ movieId +")'>Read Less</div>" +
                "</div>";   
        }
    })
}

function show(id, i) {
    document.getElementById("hidden_"+ id +"").classList.add("open");
    document.getElementById("read_less_"+ id +"").style.display = "block";
    document.getElementById("read_more_"+ id +"").style.display = "none";
    document.querySelector("#movie-overview-"+ id +"").scrollIntoView({ 
	  behavior: 'smooth' 
	});
	getTrailer(id, i);
	getReviews(id, i);
	getSimilar(id, i);
};

function hide(id) {
    document.getElementById("hidden_"+ id +"").classList.remove("open");
    document.getElementById("read_less_"+ id +"").style.display = "none";
    document.getElementById("read_more_"+ id +"").style.display = "block";
    document.querySelector("#movie-title-"+ id +"").scrollIntoView({ 
	  behavior: 'smooth' 
	});
};

function getTrailer(movieId, i) {
	let movieVideosUrl = ''.concat(baseURL, '/movie/', movieId, '/videos?api_key=', APIKEY);
    fetch(movieVideosUrl)
    .then(result=>result.json())
    .then((data)=>{
        var videoText = JSON.stringify(data, null, 4);
        var videoList = JSON.parse(videoText);
        var videoResults = videoList.results;
        var trailer = [];
        if (videoResults.length > 0) {
            for (let v = 0; v < videoResults.length; v++) {
            	if ( videoResults[v].site == "YouTube" ) {
            		trailer[i] = 'https://www.youtube.com/embed/' + videoResults[v].key;
            		break;
            	} 
            }
        } else {
        	document.getElementById('trailer_'+ movieId).innerHTML += "<p class='no-content'>There is no trailer for this movie.</p>"
        }
        document.getElementById('trailer_'+ movieId).innerHTML += "<iframe width='420' height='315' src='"+ trailer[i] +"' frameborder='0' SameSite='none' allowfullscreen></iframe>"
    })
}
 
function getReviews(movieId, i) {
	let movieReviewsUrl = ''.concat(baseURL, '/movie/', movieId, '/reviews?api_key=', APIKEY);
    fetch(movieReviewsUrl)
    .then(result=>result.json())
    .then((data)=>{
        var reviewsText = JSON.stringify(data, null, 4);
        var reviewsList = JSON.parse(reviewsText);
        var reviewsResults = reviewsList.results;
        var review = [];
        var author = [];
        if (reviewsResults.length > 0) {
            for (let r = 0; r < 2; r++) {
            	review[i] = reviewsResults[r].content;
            	author[i] = reviewsResults[r].author;
            	document.getElementById('reviews_'+ movieId).innerHTML += "<div class='review'><p>"+ review[i] +"<span class='author-name'> - by "+ author[i] +"</span></p></div>"
            }
        } else {
        	document.getElementById('reviews_'+ movieId).innerHTML += "<p class='no-content'>There are no reviews for this movie.</p>"
        }

    })
}

function getSimilar(movieId, i) {
	let similarMoviesUrl = ''.concat(baseURL, '/movie/', movieId, '/similar?api_key=', APIKEY);
    fetch(similarMoviesUrl)
    .then(result=>result.json())
    .then((data)=>{
        var similarText = JSON.stringify(data, null, 4);
        var similarList = JSON.parse(similarText);
        var similarResults = similarList.results;
        var title = [];
        var poster = [];
        if (similarResults.length > 0) {
            for (let s = 0; s < 6; s++) {
            	title[i] = similarResults[s].title;
            	poster[i] = similarResults[s].poster_path;
            	document.getElementById('similar_'+ movieId).innerHTML += "<div class='single-similar'><img src='" + posterBaseURL + poster[i] + "'><p>" + title[i] +"</p></div>"
            }
        } else {
        	document.getElementById('similar_'+ movieId).innerHTML += "<p></p><p class='no-content'>There are no movies similar to this.</p>"
        }

    })
}

window.onscroll = function(ev) {
	currentPageTitle = document.title;
	if (currentPageTitle == 'MovieRama') {
	    if ((window.innerHeight + window.scrollY + 1000) > document.body.offsetHeight) {
	    	nowPlayingPage++;
	        nowPlaying();
	    }
	} else if (currentPageTitle == 'Search') {
		if ((window.innerHeight + window.scrollY + 1000) > document.body.offsetHeight) {
	    	searchResultsPage++;
	        runSearch(2);
	    }
	}
};