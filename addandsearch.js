"use strict";

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:5000" });

async function run() {
  // Let's start by indexing some data
  await client.index({
    index: "shop",
    // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
    body: {
      name: "Ned Stark",
      description: "Winter is coming.",
      quantity: 1
    }
  });

  await client.index({
    index: "shop",
    // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
    body: {
      name: "Daenerys Targaryen",
      description: "I am the blood of the dragon.",
      quantity: 1
    }
  });

  await client.index({
    index: "shop",
    // refresh:true,
    // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
    body: {
      name: "Tyrion Lannister",
      description: "A mind needs books like a sword needs a whetstone.",
      quantity: 1
    }
  });

  // here we are forcing an index refresh, otherwise we will not
  // get any result in the consequent search
  await client.indices.refresh({ index: "shop" });

  // Let's search!
  const { body } = await client.search({
    index: "shop",
    // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
    body: {
      query: {
        match: { description: "winter" }
      }
    }
  });

  console.log(body);
}

run().catch(console.log);
