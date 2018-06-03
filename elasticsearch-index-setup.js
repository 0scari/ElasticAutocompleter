let seeder = require("./elasticSeeder");
let elasticsearch=require('elasticsearch');
let client = new elasticsearch.Client( {
    hosts: [
        'elastic:secret@localhost:9200/'
    ]
});
const index = {name: "elastic-autocompleter17", type: "addresses"};

client.ping({
    requestTimeout: 10000,
}, function(error) {
    if (error) {
        console.error('Elasticsearch cluster is down!');
        process.exit(1);
    } else {
        console.log('Connection with Elasticsearch ok!');
    }
});

let migration = {
    index: index.name,
    body: {
        "settings": {
            "analysis": {
                "tokenizer": {
                    "edgeNGramTokenizer": {
                        "type": "edge_ngram",
                        "min_gram": 2,
                        "max_gram": 15,
                        "token_chars": ["letter", "digit"]
                    }
                },
                "analyzer": {
                    "autocomplete-analyzer":{
                        "type": "custom",
                        "tokenizer": "edgeNGramTokenizer"
                    }
                }
            }
        },
        "mappings": {
            [index.type]: {
                "_source": {
                    "excludes": [
                        "fullAddress"
                    ]
                },
                "properties": {
                    "fullAddress": {
                        "analyzer": "autocomplete-analyzer",
                        "search_analyzer": "standard",
                        "type": "text",
                        "norms": false,
                        "fields": {
                            "raw": {
                                "type": "text",
                                "analyzer": "standard"
                            }
                        }
                    },
                    "houseNr": {
                        "type": "text",
                        "analyzer": "autocomplete-analyzer",
                        "search_analyzer": "standard",
                        "norms": false,
                        "doc_values": false
                    },
                    "street": {
                        "type": "text",
                        "analyzer": "autocomplete-analyzer",
                        "search_analyzer": "standard",
                        "norms": false,
                        "doc_values": false
                    },
                    "city": {
                        "type": "text",
                        "norms": false,
                        "analyzer": "autocomplete-analyzer",
                        "search_analyzer": "standard",
                        "doc_values": false
                    },
                    "county": {
                        "type": "text",
                        "norms": false,
                        "analyzer": "autocomplete-analyzer",
                        "search_analyzer": "standard",
                        "doc_values": false
                    },
                    "postCode": {
                        "type": "text",
                        "norms": false,
                        "analyzer": "autocomplete-analyzer",
                        "search_analyzer": "standard",
                        "doc_values": false
                    }
                }
            }
        }
    }
};

client.indices.create(migration)
    .then(() => console.log("Elasticsearch index was created successfully"),
          err => {
            console.error(err);
            console.error("Quitting");
            process.exit(1);
          }
    );

async function f() {
    await seeder.seed(client, index, 10000).catch(error => {
        console.error(error);
        process.exit(1)});
    console.log("Data was seeded successfully");
}

f();
