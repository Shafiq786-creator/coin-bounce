import axios from "axios";

// const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEYS;
const NEWS_API_ENDPOINTS = `http://newsapi.org/v2/everything?q=business AND blockchain&sortBy=publishedAt&language=en&apiKey=223c28f98a8448aea2f7a8df4f55e79e`
const CRYPTO_API_ENDPOINT = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'

export const getNews = async () =>{
    let response;

    try {
        const result = await axios.get(NEWS_API_ENDPOINTS);
        if(result.data && Array.isArray(result.data.articles)){
            response = result.data.articles.slice(0, 25);
        }
        else {
            throw new Error('invalid API response structure');
        }
        
    } catch (error) {
        // Log the error for debugging
        console.error("Error fetching news:", error);

        // You could either throw the error here or return a specific message
        return { error: "Failed to fetch news. Please try again later." };
    }
    return response;
}

export const getCrypto = async ()=> {
    let response;

    try {
        response = await axios.get(CRYPTO_API_ENDPOINT)

        response = response.data;
    } catch (error) {
        console.log(error);
    }
    return response; 
}