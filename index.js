const NewsAPI = require('newsapi')
const newsapi = new NewsAPI('0e38e59576064d918a5e1dcb51498fa2')

newsapi.v2.topHeadlines({
    category: 'business',
    language: 'en',
    country: 'us'
}).then((results)=>{
    console.log(results)
    showNews(results.articles)
}).catch((err)=>{
    console.log(err)
})


function showNews(allNews){

}