
// tag::example.fetch[]
CALL n10s.rdf.preview.fetch(
  '<< YOUR URL >>',
  '<< FORMAT >>'
)
// end::example.fetch[]

// tag::example.inline[]
CALL n10s.rdf.preview.inline(
  '<< YOUR RDF QUERY HERE >>',
  '<< FORMAT >>'
)
// end::example.inline[]

// tag::preview.fetch[]
CALL n10s.rdf.preview.fetch(
  'https://raw.githubusercontent.com/neo4j-labs/neosemantics/3.5/docs/rdf/nsmntx.ttl',
  'Turtle'
)
// end::preview.fetch[]

// tag::preview.inline[]
CALL n10s.rdf.preview.fetch(
  '
@prefix neo4voc: <http://neo4j.org/vocab/sw#> .
@prefix neo4ind: <http://neo4j.org/ind#> .

neo4ind:nsmntx3502 neo4voc:name "NSMNTX" ;
			   a neo4voc:Neo4jPlugin ;
			   neo4voc:version "3.5.0.2" ;
			   neo4voc:releaseDate "03-06-2019" ;
			   neo4voc:runsOn neo4ind:neo4j355 .

neo4ind:apoc3502 neo4voc:name "APOC" ;
			   a neo4voc:Neo4jPlugin ;
			   neo4voc:version "3.5.0.4" ;
			   neo4voc:releaseDate "05-31-2019" ;
			   neo4voc:runsOn neo4ind:neo4j355 .

neo4ind:graphql3502 neo4voc:name "Neo4j-GraphQL" ;
			   a neo4voc:Neo4jPlugin ;
			   neo4voc:version "3.5.0.3" ;
			   neo4voc:releaseDate "05-05-2019" ;
			   neo4voc:runsOn neo4ind:neo4j355 .

neo4ind:neo4j355 neo4voc:name "neo4j" ;
			   a neo4voc:GraphPlatform , neo4voc:AwesomePlatform ;
			   neo4voc:version "3.5.5" .
  ',
  'Turtle'
)
// end::preview.inline[]

// tag::nsprefixes.add[]
CALL n10s.nsprefixes.add(
    'neo4voc', // <1>
    'http://neo4j.org/vocab/sw#' // <2>
)
// tag::nsprefixes.add[]


// tag::import.fetch[]
CALL n10s.rdf.import.fetch(
  'https://raw.githubusercontent.com/neo4j-labs/neosemantics/3.5/docs/rdf/nsmntx.ttl',
  'Turtle'
)
// end::import.fetch[]

// tag::import.inline[]
CALL n10s.rdf.import.inline(
  '
@prefix neo4voc: <http://neo4j.org/vocab/sw#> .
@prefix neo4ind: <http://neo4j.org/ind#> .

neo4ind:nsmntx3502 neo4voc:name "NSMNTX" ;
			   a neo4voc:Neo4jPlugin ;
			   neo4voc:version "3.5.0.2" ;
			   neo4voc:releaseDate "03-06-2019" ;
			   neo4voc:runsOn neo4ind:neo4j355 .

neo4ind:apoc3502 neo4voc:name "APOC" ;
			   a neo4voc:Neo4jPlugin ;
			   neo4voc:version "3.5.0.4" ;
			   neo4voc:releaseDate "05-31-2019" ;
			   neo4voc:runsOn neo4ind:neo4j355 .

neo4ind:graphql3502 neo4voc:name "Neo4j-GraphQL" ;
			   a neo4voc:Neo4jPlugin ;
			   neo4voc:version "3.5.0.3" ;
			   neo4voc:releaseDate "05-05-2019" ;
			   neo4voc:runsOn neo4ind:neo4j355 .

neo4ind:neo4j355 neo4voc:name "neo4j" ;
			   a neo4voc:GraphPlatform , neo4voc:AwesomePlatform ;
			   neo4voc:version "3.5.5" .
  ',
  'Turtle'
)
// end::import.inline[]


// tag::delete.fetch[]
CALL n10s.rdf.delete.fetch(
  'https://raw.githubusercontent.com/neo4j-labs/neosemantics/3.5/docs/rdf/nsmntx.ttl',
  'Turtle'
)
// end::delete.fetch[]


// tag::delete.inline[]
CALL n10s.rdf.delete.inline(
  '
@prefix neo4voc: <http://neo4j.org/vocab/sw#> .
@prefix neo4ind: <http://neo4j.org/ind#> .

neo4ind:nsmntx3502 neo4voc:name "NSMNTX" ;
			   a neo4voc:Neo4jPlugin ;
			   neo4voc:version "3.5.0.2" ;
			   neo4voc:releaseDate "03-06-2019" ;
			   neo4voc:runsOn neo4ind:neo4j355 .

neo4ind:apoc3502 neo4voc:name "APOC" ;
			   a neo4voc:Neo4jPlugin ;
			   neo4voc:version "3.5.0.4" ;
			   neo4voc:releaseDate "05-31-2019" ;
			   neo4voc:runsOn neo4ind:neo4j355 .

neo4ind:graphql3502 neo4voc:name "Neo4j-GraphQL" ;
			   a neo4voc:Neo4jPlugin ;
			   neo4voc:version "3.5.0.3" ;
			   neo4voc:releaseDate "05-05-2019" ;
			   neo4voc:runsOn neo4ind:neo4j355 .

neo4ind:neo4j355 neo4voc:name "neo4j" ;
			   a neo4voc:GraphPlatform , neo4voc:AwesomePlatform ;
			   neo4voc:version "3.5.5" .
  ',
  'Turtle'
)
// end::delete.inline[]
