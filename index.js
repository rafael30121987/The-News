const NewsAPI = require('newsapi')
const $ = require('jquery')
const newsapi = new NewsAPI('0e38e59576064d918a5e1dcb51498fa2')
const electron = new require('electron')
const {ipcRenderer} = electron
let navItems = $('.nav-group-item')
let articles = null;
let textarea = document.querySelector('textarea')
let defaultFontSize=20;

getNews('business')

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


function showNews(allNews) {
    $('#news-list').html('')
    $('#news-list').append(`
    <li class="list-group-header">
        <input class="form-control" type="text" value="" placeholder="Search for news" onchange="search(this)">
    </li>
    `)

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

function openArticle(event){
    event.preventDefault()
    let link = event.target.href
    window.open(link)
}

navItems.on("click",(event)=>{
    let category = event.target.id
    navItems.removeClass('active')
    $(event.target).addClass('active')
    getNews(category)
})

function search(input){
    let query = $(input).val()
    let sortedArticles = articles.filter((item)=>item.title.toLowerCase().includes(query.toLowerCase()))
    showNews(sortedArticles)
}

function increaseFont(){
    textarea.style.fontSize = `${++defaultFontSize}px`
}

function decreaseFont(){
    textarea.style.fontSize = `${--defaultFontSize}px`
}

function saveText(){
    let text = textarea.value
    console.log(text)
    ipcRenderer.send('save', text)
}

ipcRenderer.on('saved', (event, results)=>{
    if(results=='success'){
        console.log('note saved successfully')
        textarea.style.backgroundColor = "#b2ff99"
    }else{
        console.log('error saving text')
        textarea.style.backgroundColor = "#ff8989"
    }

    setTimeout(function(){textarea.style.backgroundColor = ""}, 1500)
})