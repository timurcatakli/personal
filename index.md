## Use MAP or SET

The Map object holds key-value pairs and remembers the original insertion order of the keys. Any value (both objects and primitive values) may be used as either a key or a value.

The Set object lets you store unique values of any type, whether primitive values or object references.

## Lodash Chaining

```js
import _ from "lodash";

const items2 = [
  {
    id: "unassigned",
    label: "Unassigned",
    color: "red",
    value: 245,
    active: false
  },
  {
    id: "new",
    label: "New",
    color: "blue",
    value: 54,
    active: false
  },
  {
    id: "inprogress",
    label: "In Progress",
    color: "purple",
    value: 78,
    active: false
  },
  {
    id: "pending",
    label: "Pending",
    color: "yellow",
    value: 12,
    active: false
  },
  {
    id: "resolved",
    label: "Resolved",
    color: "green",
    value: 245,
    active: false
  }
];

var youngest = _.chain(items2)
  .filter(o => o.active === false)
  .value();

console.log(youngest);
```

## JS Array Methods That Mutate

Certain array methods will mutate the array they’re used on:

- push (add an item to the end)
- pop (remove an item from the end)
- shift (remove an item from the beginning)
- unshift (add an item to the beginning)
- sort
- reverse
- splice

> Yep, JS Array’s sort is not immutable! It will sort the array in place. The easiest thing to do, if you need to use one of these operations, is to make a copy of the array and then operate on the copy. You can copy an array with any of these methods:

```js
let a = [1, 2, 3];
let copy1 = [...a];
let copy2 = a.slice();
let copy3 = a.concat();
```

> And one quick aside about sort (which has bitten me in the past) is that the compareFunction needs to return 0, 1, or -1. Not a boolean! Keep that in mind next time you’re writing a comparator.
