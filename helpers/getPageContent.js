import axios from 'axios';

export function getPageContent(url) {
   return axios.get(url,{
        headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4137.125 Safari/537.36' }
      })
}