const SitemapGenerator = require('sitemap-generator');
const fs = require('fs');
const parser = require('xml2json');

// create generator
const generator = SitemapGenerator('https://www.test-site.fr', {
    stripQuerystring: false,
    filepath: './sitemap.xml',
    maxDepth: 10,
    priorityMap: [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0]
});

// register event listeners
generator.on('done', () => {
    // sitemaps created
    console.log('SitemapGenerator done!');

    fs.readFile('./sitemap.xml', function(err, data) {
        if (err) {
            console.error(err);
        }

        let json = JSON.parse(parser.toJson(data, {reversible: true}));
        console.log('urls:', json["urlset"]["url"].length);
    });
});

generator.on('error', (error) => {
    console.log('error:', error);
});

// start the crawler
generator.start();
