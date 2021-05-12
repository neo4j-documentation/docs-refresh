module.exports = {
  data: [
    {
      match: "developer/**/*.html",
    },

    // general labs folers
    {
      match: "labs/*/discussions/**/*.html",
    },
    {
      match: "labs/*/how-to-guide/**/*.html",
    },
    {
      match: "labs/*/installation/**/*.html",
    },
    {
      match: "labs/*/reference/**/*.html",
    },
    {
      match: "labs/*/tutorial/**/*.html",
    },
    {
      match: "labs/*/acknowledgements/**/*.html",
    },
    {
      match: "labs/*/graph-app/**/*.html",
    },
    {
      match: "labs/*/troubleshooting/**/*.html",
    },
    {
      match: "labs/*/index.html",
    },

    // ===== for versioned lab folders =====
    // apoc
    {
      match: "labs/apoc/4.0/**/*.html",
      version: "4.0",
    },
    {
      match: "labs/apoc/4.1/**/*.html",
      version: "4.1",
    },

    // etl
    {
      match: "labs/etl-tool/1.5.0/**/*.html",
      version: "1.5.0",
    },

    // kafka
    {
      match: "labs/kafka/4.0/**/*.html",
      version: "4.0",
    },

    // neo4j-helm
    {
      match: "labs/neo4j-helm/1.0.0/**/*.html",
      version: "1.0.0",
    },

    // neo-semantics
    {
      match: "labs/neosemantics/4.0/**/*.html",
      version: "4.0",
    },
    {
      match: "labs/neosemantics/4.1/**/*.html",
      version: "4.1",
    },
  ],
};
