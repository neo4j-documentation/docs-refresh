const algoliasearch = require('algoliasearch')
const glob = require('glob')
const fs = require('fs')
const cheerio = require('cheerio')

const indexFiles = async () => {
    const applicationId = process.env.ALGOLIA_APPLICATION_ID || 'S38C6B80D2'
    const apiKey = process.env.ALGOLIA_API_KEY || '8dc90bc3f864d03a564d958d3d0abddd'
    const indexName = process.env.ALGOLIA_INDEX_NAME || 'dev_GUIDES'

    const client = algoliasearch(applicationId, apiKey);
    const index = client.initIndex(indexName);


    const baseUrl = 'https://neo4j.com'
    const baseDir = `${__dirname}/../build/site/`
    const titleSuffix = '- Neo4j Graph Database Platform'

    console.log('Starting indexing...');

    glob(`${baseDir}**/*.html`, async (err, matches) => {
        const objects = matches
            .filter(path => !path.includes('404') && fs.lstatSync(path).isFile())
            .map(path => {
                const html = fs.readFileSync(path)
                const $ = cheerio.load(html)

                const url = $('link[rel="canonical"]').attr('href')

                if (!url) return

                const objectID = url
                    .replace(baseUrl, '')
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/gi, ' ')
                    .trim()
                    .replace(/\s+/g, '-')

                const title = $('title').text().replace(titleSuffix, '').replace(/\s+/g, ' ').trim()
                const description = $('meta[name="description"]').attr('content')
                const keywords = $('meta[name="keywords"]').attr('content')

                const type = $('meta[name="post-type"]').attr('content')
                const neo4jSite = $('meta[name="neo4j-site"]').attr('content')
                const environment = $('meta[name="environment"]').attr('content')
                const programmingLanguage = $('meta[name="programming-language"]').attr('content')
                const neo4jVersion = $('meta[name="neo4j-version"]').attr('content')
                const product = $('meta[name="product"]').attr('content')

                return {
                    objectID,
                    url,
                    title,
                    description,
                    keywords,
                    type,
                    neo4jSite,
                    environment,
                    programmingLanguage,
                    neo4jVersion,
                    programmingLanguage
                }
            })
            .filter(r => !!r)

        const { taskIDs, objectIDs } = await index.saveObjects(objects)

        console.log(`${objectIDs.length} objects indexed in algolia (tasks: ${taskIDs.join(',')})`);

    })
}

indexFiles()