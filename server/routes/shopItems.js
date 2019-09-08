const express = require("express");
const router = express.Router();
const ShopItem = require("./../schemas/itemSchema");

//GET ITEMS
router.get("/", function(req, res) {
  return ShopItem.find().then(items => res.json(items));
});

router.get("/_doc/:id", function(req, res) {
  // console.log(req.params);
  return ShopItem.findById(req.params.id).then(items => res.json(items));
});

//GETkjk ITEMS
router.get("/_refresh", function(req, res) {
  return ShopItem.find().then(items => res.json(items));
});

//GET ITEM
router.post("/_search", function(req, res) {
  const { match } = req.body.query;
  // { title: new RegExp(search.trim(), "i") }
  const lookfor = {};
  for (let search in match) {
    lookfor[search] = new RegExp(match[search], "i");
    // search = new RegExp(match[search], "i");
    // console.log(search);
    // console.log(match[search]);
    // console.log(JSON.stringify(lookfor));
  }
  // console.log(match);
  // return ShopItem.findOne({ description: new RegExp("winter", "i") }).then(
  //   item => res.json(item)
  // );
  return ShopItem.find(lookfor).then(item => res.json(item));
});

//ADD ITEM
router.post("/_doc", function(req, res, next) {
  const { name, description, quantity } = req.body;
  if (!name || !description || !quantity) {
    return res.status(400).json({
      msg: `You don't inserted information about ${!name ? "name" : ""} ${
        !description ? "description" : ""
      } ${!quantity ? "quantity" : ""}`
    });
  }
  ShopItem.findOne({ name }).then(shopItem => {
    if (shopItem) {
      return res.status(400).json({ msg: "This shop item already exists" });
    }
    const newShopItem = new ShopItem({ name, description, quantity });
    console.log(newShopItem);
    newShopItem.save().then(item => res.json(item));
  });
});

//CHANGE ITEM QUANTITY, DESC, NAME
router.patch("/", function(req, res) {
  let { id, name, description, quantity } = req.body;
  ShopItem.findById(id)
    .then(item => {
      console.log(item);
      !name ? (name = item.name) : name;
      !description ? (description = item.description) : description;
      !quantity ? (quantity = item.quantity) : quantity;
      return item.updateOne({ name, description, quantity });
    })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json({ msg: err }));
});

//REMOVE ITEM
router.delete("/:id", function(req, res) {
  const { id } = req.params;
  ShopItem.findById(id)
    .then(item => item.remove())
    .then(() => res.json({ success: true }))
    .catch(err => res.status(400).json({ msg: err }));
});

module.exports = router;
