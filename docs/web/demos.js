const setItemCode = `db.get("test").set("value");`;
const setItemPair = `db.set("test1.test2", "value");`;
const deleteItemCode = `db.get("test").delete();`;
const mapItemCode = `db.set("newList", [1, 2, 3]);\ndb.get("newList").map(x => x ** 2);`

const demos = {
  setItem: {
    code: setItemCode,
    name: "Set Item"
  },
  setItemPair: {
    code: setItemPair,
    name: "Set Item Pair"
  },
  deleteItem: {
    code: deleteItemCode,
    name: "Delete Item"
  },
  mapItem: {
    code: mapItemCode,
    name: "Map List"
  }
};
