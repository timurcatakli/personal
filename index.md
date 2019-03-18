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

## An easy way to optimize a React component

An easy way to optimize a React component for performance is to make it a class, and make it extend `React.PureComponent` instead of `React.Component`.

This way, the component will only re-render if it’s state is changed or if it’s props have changed. It will no longer mindlessly re-render every single time its parent re-renders; it will ONLY re-render if one of its props has changed since the last render.

## Optional Chaining

Have you ever had the problem of accessing a nested object property, without knowing if the object or one of the sub-properties even exists? You will probably end up with something like this:

```js
let data;
if (
  myObj &&
  myObj.firstProp &&
  myObj.firstProp.secondProp &&
  myObj.firstProp.secondProp.actualData
)
  data = myObj.firstProp.secondProp.actualData;
```

This is tedious and there’s a better way, at least a proposed way (keep reading how to enable it). It is called optional chaining and works as followed:

```js
const data = myObj?.firstProp?.secondProp?.actualData;
```

I think it is an eloquent way of checking nested properties and makes the code way cleaner.
Currently, optional chaining is not part of the official spec, but is at stage-1 as an experimental feature.

You have to add [@babel/plugin-proposal-optional-chaining](https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining) in your babelrc to use it.

## Simple Trick

Want boolean equivalent value for any type of value, use `!!`

like `!!a` to convert value of variable ‘a’ to boolean

## Links

https://levelup.gitconnected.com/9-tricks-for-kickass-javascript-developers-in-2019-eb01dd3def2a

[A beginners guide to route level authentication in ReactJS with React Router, HOC's, context & more.](https://www.reddit.com/r/reactjs/comments/atvy6t/a_beginners_guide_to_route_level_authentication/?st=JSIKF8DA&sh=9685e551)
