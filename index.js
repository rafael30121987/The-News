const NewsAPI = require('newsapi') // News API
const $ = require('jquery')
const newsapi = new NewsAPI('0e38e59576064d918a5e1dcb51498fa2') // Key to access news API
const electron = new require('electron')
const {ipcRenderer} = electron
const LautFm = require('lautfm')  // Radio API
const laut = new LautFm()
let navItems = $('.nav-group-item')
let articles = null;
let textarea = document.querySelector('textarea')
let defaultFontSize=20;
let player = $('audio').get(0)

getNews('business') // make business default selection

// function to get with the category that is passed
function getNews(category){
    newsapi.v2.topHeadlines({
        category: category,
        language: 'en',
        country: 'us'
    }).then((results) => {
        console.log(results)
        articles = results.articles
        showNews(results.articles)
    }).catch((err) => {
        console.log(err)
    })
}

// function to show the All News and input for search by title
function showNews(allNews) {
    $('#news-list').html('')
    $('#news-list').append(`
    <li class="list-group-header">
        <input class="form-control" type="text" value="" placeholder="Search for news" onchange="search(this)">
    </li>
    `)
    //looping to insert into list each new how is avaliable on the category or in search
    allNews.forEach(news => {
        
        let singleNews =`
        <li class="list-group-item">
            <img class="img-circle media-object pull-left" src="${news.urlToImage}" width="50"
                height="50">
                <div class="media-body">
                    <strong><a href="${news.url}" onclick="openArticle(event)" >${news.title}</a></strong>
                    <div>
                        <span class="">${news.publishedAt}</span>
                        <span class="pull-right">${news.author}</span>
                    </div>
                    <p>${news.description}</p>
                </div>
        </li>`

        $('#news-list').append(singleNews)
    });
}

// function to get the article link clicked to open a new window
function openArticle(event){
    event.preventDefault()
    let link = event.target.href
    window.open(link)
}

// sets the active class on the clicked item and removes the active class from other items
navItems.on("click",(event)=>{
    let category = event.target.id
    navItems.removeClass('active')
    $(event.target).addClass('active')
    getNews(category)
})

//func that takes the text typed in the search and 
//searches among all the news items based on the typed text and the news title
function search(input){
    let query = $(input).val()
    let sortedArticles = articles.filter((item)=>item.title.toLowerCase().includes(query.toLowerCase()))
    showNews(sortedArticles)
}

// function that increases the font size inside the textarea
function increaseFont(){
    textarea.style.fontSize = `${++defaultFontSize}px`
}

//function that decreases the font size inside the textarea
function decreaseFont(){
    textarea.style.fontSize = `${--defaultFontSize}px`
}

// function to send aop ipcRenderer the text sent in the textarea and save it
function saveText(){
    let text = textarea.value
    console.log(text)
    ipcRenderer.send('save', text)
}

// function to show a different color background onte textarea in case the text is saved or not
ipcRenderer.on('saved', (event, results)=>{
    if(results=='success'){
        console.log('note saved successfully')
        textarea.style.backgroundColor = "#b2ff99"
    }else{
        console.log('error saving text')
        textarea.style.backgroundColor = "#ff8989"
    }
    setTimeout(function(){textarea.style.backgroundColor = ""}, 500)
})


// get all radio stations with "live" category to append in the list
laut.getStations({by: 'live'}).then((stations)=>{
    if(stations){
        stations.forEach(station =>{
            let oneStation = `
            <li class="list-group-item" ondblclick="playStream('${station.stream_url}', this)">
                <img class="img-circle media-object pull-left" src="${station.images.station_120x120}" width="32" height="32">
                <div class="media-body">
                    <strong>${station.display_name}</strong>
                    <p>${station.description}</p>
                </div>
            </li>
            `
            $('#station-list').append(oneStation)
        })
    }
}).catch((e)=>{
    console.log(e)
})

// sets the active class on the clicked item and removes the active class from other items
function playStream(url, li){
    let allStations =$('.list-group-item')
    allStations.removeClass('active')
    $(li).addClass('active')
    player.src = url
    player.load()
    player.play()
}