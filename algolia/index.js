const algoliasearch = require('algoliasearch')
const glob = require('glob')
const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const baseUrl = 'https://neo4j.com'
const titleSuffix = '- Neo4j Graph Database Platform'
const baseDir = path.join(__dirname, '..', 'build', 'site')


const indexFile = path => {
    const relative = path.replace(baseDir, '')

    let version
    const parts = relative.split('/').splice(1)
    const [section, product] = parts

    if (section === 'labs' && parts.length > 3) {
        version = parts[2]
    }

    const html = fs.readFileSync(path)
    const $ = cheerio.load(html)

    const url = new URL(path.replace(baseDir, '').replace('index.html', ''), baseUrl).toString()

    let urlParts = url.replace(baseUrl, "").toLowerCase().split("/");

    // Remove version no. (if exists) from the object ID.
    const objectID = urlParts
        .map((part) => (isNaN(parseInt(part)) ? part : null))
        .filter((part) => part)
        .join("-")
        .trim()
        .replace(/\s+/g, "-");


    const title = $('title').text().replace(titleSuffix, '').replace(/\s+/g, ' ').trim()
    const description = $('meta[name="description"]').attr('content')
    const keywords = $('meta[name="keywords"]').attr('content')

    const docsType = $('meta[property="neo:type"]').attr('content')
    const docsProduct = $('meta[name="product"]').attr('content')

    const toc = $('.doc h2')
        .get()
        .filter(el => $('a', el).attr('href') !== undefined)
        .map(el => ({
            url: url + $('a', el).attr('href'),
            title: $(el).text(),
        }))

    const priorityIndex = path.includes('apoc') ? 2 : 1;

    const output = {
        post_type: 'docs',
        objectID,
        url,
        title,
        // TODO? Use content instead>
        content: description,
        description,
        keywords,
        docsType,
        docsProduct,
        toc,

        priorityIndex,
        // Just a parameter to help filtering when we might want to delete all objects at once
        isDeveloperGuide: true,
    }

    if (version) {
        output['docsVersion'] = {
            _operation: 'AddUnique',
            value: version,
        }
    }

    return output
}

const indexFiles = () => {
    const applicationId = process.env.ALGOLIA_APPLICATION_ID
    const apiKey = process.env.ALGOLIA_API_KEY
    const indexes = process.env.ALGOLIA_INDEXES.split(',').map(index => index.trim())

    if ( !applicationId ) {
        throw new Error('Missing ALGOLIA_APPLICATION_ID')
    }
    if ( !apiKey ) {
        throw new Error('Missing ALGOLIA_API_KEY')
    }

    if ( !indexes.length ) {
        throw new error('Missing ALGOLIA_INDEXES')
    }

    const client = algoliasearch(applicationId, apiKey);
    const baseDir = path.join(__dirname, '..', 'build', 'site')

    console.log('Starting indexing...');

    glob(`${baseDir}/**/*.html`, (err, matches) => {
        const objects = matches
            .filter(path => !path.includes('404') && fs.lstatSync(path).isFile())
            .map(path => indexFile(path))
            .filter(r => !!r)
            .filter(r => !r.title.includes('Redirect'))

        indexes.map(indexName => {
            const index = client.initIndex(indexName);
            index.saveObjects(objects)
                .then(res => console.log(`${res.objectIDs.length} objects indexed in ${indexName} (tasks: ${res.taskIDs.join(',')})`))
                .catch(e => console.error(e))
        })
    })
}

indexFiles()