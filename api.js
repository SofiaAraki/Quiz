const axios = require('axios')


apiKey='8ejhebUUUT8Wy2peVVWK3KKdiUfMUxofo9KqeTLp'
category='code'
difficulty='Easy'
tags='JavaScript'
limit=10

url=`https://quizapi.io/api/v1/questions?apiKey=${apiKey}&category=${category}&difficulty=${difficulty}&limit=${limit}&tags=${tags}`

const getQuestions = async () => {
    return axios.get(url);
}

console.log(getQuestions());