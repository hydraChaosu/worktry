"use strict";

const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://localhost:5000" });

async function run() {
  // Let's search!
  const { body } = await client.search({
    index: "shop",
    // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
    body: {
      query: {
        match: { description: "Winter" }
      }
    }
  });

  console.log(body);
  const { body: boty } = await client.get({
    index: "shop",
    id: "5d74c7d951e0b705602183b0"
  });
  console.log(boty);
}

run().catch(console.log);
