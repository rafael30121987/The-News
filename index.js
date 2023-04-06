const NewsAPI = require('newsapi')
const $ = require('jquery')
const newsapi = new NewsAPI('0e38e59576064d918a5e1dcb51498fa2')

newsapi.v2.topHeadlines({
    category: 'business',
    language: 'en',
    country: 'us'
}).then((results) => {
    console.log(results)
    showNews(results.articles)
}).catch((err) => {
    console.log(err)
})


function showNews(allNews) {
    allNews.forEach(news => {
        
        let singleNews =`
        <li class="list-group-item">
            <img class="img-circle media-object pull-left" src="${news.urlToImage}" width="50"
                height="50">
                <div class="media-body">
                    <strong><a href="" >${news.title}</a></strong>
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