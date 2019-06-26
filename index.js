const SitemapGenerator = require('sitemap-generator');
const fs = require('fs');
const parser = require('xml2json');

let count = 0;

// create generator
const generator = SitemapGenerator('https://www.test-site.fr', {
    stripQuerystring: true,
    filepath: './sitemap.xml',
    maxDepth: 10,
    priorityMap: [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0],
    ignore: url => {
        // Prevent URLs from being added that contain `<pattern>`.
        return /[^>]+sitemap.xml/g.test(url);
    },
    interval: 1000, // 1s (default: 250)
    maxConcurrency: 3, // Maximum number of requests the crawler will run simultaneously (default: 5)
    timeout: 60000 // (default: 30000)
});

// register event listeners
generator.on('done', () => {
    // sitemaps created
    console.log('SitemapGenerator done!');

    fs.readFile('./sitemap.xml', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        let json = JSON.parse(parser.toJson(data, { reversible: true }));
        console.log('urls:', json.urlset.url.length);
    });
});

generator.on('add', (url) => {
    count++;
    // log url
    console.log(count + ' - add url: ' + url);
});

generator.on('error', (error) => {
    console.log('error:', error);
});

// start the crawler
generator.start();