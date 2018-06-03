let faker = require("faker");
faker.locale = "en_GB";
let elasticsearch=require('elasticsearch');
let client = new elasticsearch.Client( {
    hosts: [
        'elastic:secret@localhost:9200/'
    ]
});

client.ping({
    requestTimeout: 30000,
}, function(error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
        exit_(1);
    } else {
        console.log('Connection ok!');
    }
});

function newAddressDocumentJSON() {
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    let address = {
        houseNr: getRandom(1, 200).toString(),
        street: faker.address.streetName().toLowerCase(),
        city: faker.address.city().toLowerCase(),
        county: faker.address.county().toLowerCase(),
        postCode: faker.address.zipCode().toLowerCase()
    };
    address['fullAddress'] = `${address.houseNr} ${address.street} ${address.city} ${address.county} ${address.postCode}`;
    return JSON.stringify(address);
}

let migration = {
    index: "elastic-autocompleter",
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
            "addresses": {
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
    }
};

// client.indices.create(migration)
//     .then(resp => console.log(resp),
//           err => console.error(err))