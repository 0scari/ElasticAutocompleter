let faker = require("faker");
faker.locale = "en_GB";

exports.seed = function(client, index, quantity) {
    return new Promise((resolve, reject) => {
        let bulkData = [];
        for (let i = 0; i < quantity; i++) {
            let create = {create: {_index: index.name, _type: index.type, _id: i}};
            bulkData.push(create);
            bulkData.push(newAddressDocument())
        }
        client.bulk({body: bulkData}, (error) => {
            if (!error)
                resolve();
            else
                reject(new Error(error));
        })
    });
};

function newAddressDocument() {
    let address = {
        houseNr: getRandom(1, 200).toString(),
        street: faker.address.streetName().toLowerCase(),
        city: faker.address.city().toLowerCase(),
        county: faker.address.county().toLowerCase(),
        postCode: faker.address.zipCode().toLowerCase()
    };
    address['fullAddress'] = `${address.houseNr} ${address.street} ${address.city} ${address.county} ${address.postCode}`;
    return address;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}