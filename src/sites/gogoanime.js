'use strict';

const cloudscraper = require('cloudscraper');
const cheerio = require('cheerio');

const searchURL = 'https://ajax.gogocdn.net/site/loadAjaxSearch';

function getHeaders() {
    return {
        'Referer': 'https://www16.gogoanime.io/',
        'User-Agent': 'Mozilla/5.0 CK={} (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko'
    }
}

async function search(query) {
    let searchResults = [];
    const params = { keyword: query, id: '-1', link_web: 'https://www16.gogoanime.io/' };
    let searchResponse = await cloudscraper.get(searchURL, { headers: getHeaders(), qs: params });
    searchResponse = JSON.parse(searchResponse).content;
    const $ = cheerio.load(searchResponse);

    $('.list_search_ajax').each(function (ind, element) {
        let title = $(this).find('.ss-title').text();
        let url = $(this).find('.ss-title').attr('href');
        let poster = $(this).find('.thumbnail-recent_search').attr('style');
        [, poster] = poster.match(/"([^"]+)/);
        searchResults.push({ title: title, url: url, poster: poster });
    });

    return searchResults;
}

search('Naruto').then(console.log, console.error);
