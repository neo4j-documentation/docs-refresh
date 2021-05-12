const algoliasearch = require("algoliasearch");
const glob = require("glob");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const constants = require("./constants");

const applicationId = process.env.ALGOLIA_APPLICATION_ID || "S38C6B80D2";
const apiKey =
  process.env.ALGOLIA_API_KEY || "8dc90bc3f864d03a564d958d3d0abddd";
const indexName = process.env.ALGOLIA_INDEX_NAME || "dev_GUIDES";

const client = algoliasearch(applicationId, apiKey);
const index = client.initIndex(indexName);

const baseUrl = "https://neo4j.com";
const baseDir = path.join(__dirname, "..", "build", "site");
const titleSuffix = "- Neo4j Graph Database Platform";

function transformItem(html, version, path) {
  const $ = cheerio.load(html);

  const url = new URL(
    path.replace(baseDir, "").replace("index.html", ""),
    baseUrl
  ).toString();

  let urlParts = url.replace(baseUrl, "").toLowerCase().split("/");

  // Remove version no. (if exists) from the object ID.
  const objectID = urlParts
    .map((part) => (isNaN(parseInt(part)) ? part : null))
    .filter((part) => part)
    .join("-")
    .trim()
    .replace(/\s+/g, "-");

  const title = $("title")
    .text()
    .replace(titleSuffix, "")
    .replace(/\s+/g, " ")
    .trim();
  const description = $('meta[name="description"]').attr("content");
  const keywords = $('meta[name="keywords"]').attr("content");

  const docsType = $('meta[property="neo:manual-type"]').attr("content");
  const docsProduct = $('meta[name="product"]').attr("content");

  const toc = $(".doc h2")
    .get()
    .filter((el) => $("a", el).attr("href") !== undefined)
    .map((el) => ({
      url: url + $("a", el).attr("href"),
      title: $(el).text(),
    }));

  const item = {
    type: "docs",
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
    priorityIndex: 1,

    // Just a parameter to help filtering when we might want to delete all objects at once
    isDeveloperGuide: true,
  };

  if (version) {
    item["docsVersions"] = {
      _operation: "AddUnique",
      value: version,
    };
  }

  return item;
}

function indexGroupItems(paths, version) {
  const objects = paths
    .filter((path) => !path.includes("404") && fs.lstatSync(path).isFile())
    .map((path) => transformItem(fs.readFileSync(path), version, path))
    .filter((r) => !!r)
    .filter((r) => !r.title.includes("Redirect"));

  console.log(paths);
  index
    .partialUpdateObjects(objects, {
      createIfNotExists: true,
    })
    .then((res) =>
      console.log(
        `${
          res.objectIDs.length
        } objects indexed in algolia (tasks: ${res.taskIDs.join(",")})`
      )
    )
    .catch((e) => console.error(e));
}

const indexFiles = async () => {
  console.log("Starting indexing...");

  constants.data.map((indexGroup) => {
    glob(`${baseDir}/${indexGroup.match}`, (err, matches) => {
      console.log(
        `indexing group ${indexGroup.match}. Found ${matches.length} items. For version ${indexGroup.version}`
      );
      indexGroupItems(matches, indexGroup.version);
    });
  });
};

indexFiles();
