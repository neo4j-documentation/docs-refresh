const algoliasearch = require('algoliasearch')
const glob = require('glob')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const indexFiles = async () => {
    const root = process.env.ROOT_URL || 'https://neo4j.com/'
    const applicationId = process.env.ALGOLIA_APPLICATION_ID || 'S38C6B80D2'
    const apiKey = process.env.ALGOLIA_API_KEY || '8dc90bc3f864d03a564d958d3d0abddd'
    const indexName = process.env.ALGOLIA_INDEX_NAME || 'dev_GUIDES'

    const client = algoliasearch(applicationId, apiKey);
    const index = client.initIndex(indexName);

    const baseUrl = 'https://neo4j.com'
    const baseDir = path.join(__dirname, '..', 'build', 'site')
    const titleSuffix = '- Neo4j Graph Database Platform'

    console.log('Starting indexing...');

    glob(`${baseDir}/**/neosemantics/**/*.html`, (err, matches) => {
        const objects = matches
            .filter(path => !path.includes('404') && fs.lstatSync(path).isFile())
            .map(path => {
                const html = fs.readFileSync(path)
                const $ = cheerio.load(html)

                const url = new URL( path.replace(baseDir, '').replace('index.html', ''), baseUrl ) .toString()

                const objectID = url
                    .replace(baseUrl, '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/gi, ' ')
                    .trim()
                    .replace(/\s+/g, '-')

                const title = $('title').text().replace(titleSuffix, '').replace(/\s+/g, ' ').trim()
                const description = $('meta[name="description"]').attr('content')
                const keywords = $('meta[name="keywords"]').attr('content')

                const type = $('meta[property="neo:type"]').attr('content')

                const environment = $('meta[property="neo:environment"]').attr('content')
                const programmingLanguage = $('meta[name="neo:programming-language"]').attr('content')
                const manualType = $('meta[property="neo:manual-type"]').attr('content')
                const manualVersion = $('meta[property="neo:version"]').attr('content')
                const product = $('meta[name="product"]').attr('content')


                const toc = $('.doc h2')
                    .get()
                    .map(el => ({
                        url: url + $('a', el).attr('href'),
                        title: $(el).text(),
                    }))

                return {
                    post_type: 'Docs',
                    objectID,
                    url,
                    title,
                    // TODO? Use content instead>
                    content: description,
                    description,
                    keywords,
                    type,
                    product,
                    manualType,
                    manualVersion,
                    environment,
                    programmingLanguage,
                    toc,
                }
            })
            .filter(r => !!r)
            .filter(r => !r.title.includes('Redirect'))

        index.saveObjects(objects)
            .then(res => console.log(`${res.objectIDs.length} objects indexed in algolia (tasks: ${res.taskIDs.join(',')})`))
            .catch(e => console.error(e))

    })
}

indexFiles()