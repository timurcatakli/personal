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

## Tagged String Templates

```js
var amount = 12.3;

function formatCurrency(strings, ...values) {
  // console.log(values)
  // console.log(strings)
  // [ 12.3 ]
  // [ 'The total for your order is ', '' ]
  var str = "";
  for (let i = 0; i < strings.length; i++) {
    if (i > 0) {
      if (typeof values[i - 1] == "number") {
        str += `$${values[i - 1].toFixed(2)}`;
      }
    }
    str += strings[i];
  }
  console.log(str);
}

var msg = formatCurrency`The total for your order is ${amount} and this is good`;
```

## Destructuring

```js
const obj = {
  firstName: "John",
  last_name: "Doe"
};

const { firstName: name, lastName: last = "Hunter" } = obj;

console.log(name);
// Joe
console.log(last);
// Hunter
```

## Naming Convention

- cb: callback
- arr: array
- v: single primitive value

## Array.find - Array.findIndex

```js
var arr = [{ a: 1 }, { a: 2 }];

arr.find(function match(v) {
  return v && v.a > 1;
});
// {a: 2}

arr.find(v => v && v.a > 1);
// {a: 2}

arr.find(v => v && v.a > 2);
// undefined

arr.findIndex(v => v && v.a > 2);
// -1

arr.findIndex(v => v && v.a > 1);
// 1
```

## Array.includes

```js
const arr = [10, 20, NaN, 30, 40, 50];
// arr.includes(valueToFind[, fromIndex])

arr.includes(20); // true
arr.includes(60); // false
arr.includes(20, 3); // false
arr.includes(10, -2); // false
arr.includes(20, 30); // false
arr.includes(40, -2); // true
arr.includes(NaN); // true

// If fromIndex is greater than or equal to the length of the array, false is returned. The array will not be searched.

var arr0 = ["a", "b", "c"];

arr0.includes("c", 3); // false
arr0.includes("c", 100); // false

//Computed index is less than 0
// If fromIndex is negative, the computed index is calculated to be used as a position in the array at which to begin searching for valueToFind. If the computed index is less or equal than -1 * array.length, the entire array will be searched.

// array length is 3
// fromIndex is -100
// computed index is 3 + (-100) = -97

var arr1 = ["a", "b", "c"];

arr1.includes("a", -100); // true
arr1.includes("b", -100); // true
arr1.includes("c", -100); // true
arr1.includes("a", -2); // false
```

## Array.flat & Array.flatMap

```js
const nestedValues = [1, [2, 3], [[]], [4, [5]], 6];

nestedValues.flat(0); // does nothing because of level 0
nestedValues.flat(1); // default is 1 level
nestedValues.flat(Infinity); // all levels

[1, 2, 3].flatMap(v => {
  return [v * 2, String(v * 2)];
});
```

## Get Array Unique Values

ES6 provides a couple of very neat ways of extracting the unique values from an array. Unfortunately, they do not do well with arrays filled with non-primitive types. You can read more about it later at this link Handling Array Duplicates Can Be Tricky. In this article, we will focus on the primitive data types.

```js
const cars = ["Mazda", "Ford", "Renault", "Opel", "Mazda"];
const uniqueWithArrayFrom = Array.from(new Set(cars));
console.log(uniqueWithArrayFrom); // outputs ["Mazda", "Ford", "Renault", "Opel"]

const uniqueWithSpreadOperator = [...new Set(cars)];
console.log(uniqueWithSpreadOperator); // outputs ["Mazda", "Ford", "Renault", "Opel"]
```

## Merge Objects and Array of Objects Using Spread Operator

Object merging is not a rare task and there is a great chance you've done this in the past and that you will do it in the future. The difference is that in the past you did most of the work manually, but now and in the future, you will use new ES6 features.

```js
// merging objects
const product = { name: "Milk", packaging: "Plastic", price: "5$" };
const manufacturer = { name: "Company Name", address: "The Company Address" };

const productManufacturer = { ...product, ...manufacturer };
console.log(productManufacturer);
// outputs { name: "Company Name", packaging: "Plastic", price: "5$", address: "The Company Address" }

// merging an array of objects into one
const cities = [
  { name: "Paris", visited: "no" },
  { name: "Lyon", visited: "no" },
  { name: "Marseille", visited: "yes" },
  { name: "Rome", visited: "yes" },
  { name: "Milan", visited: "no" },
  { name: "Palermo", visited: "yes" },
  { name: "Genoa", visited: "yes" },
  { name: "Berlin", visited: "no" },
  { name: "Hamburg", visited: "yes" },
  { name: "New York", visited: "yes" }
];

const result = cities.reduce((accumulator, item) => {
  return {
    ...accumulator,
    [item.name]: item.visited
  };
}, {});

console.log(result);
/* outputs
Berlin: "no"
Genoa: "yes"
Hamburg: "yes"
Lyon: "no"
Marseille: "yes"
Milan: "no"
New York: "yes"
Palermo: "yes"
Paris: "no"
Rome: "yes"
*/
```

## Conditional Object Properties

It's no longer needed to create two different objects based on a condition in order for it to have a certain property. For this purpose, the spread operator is the perfect fit.

```js
const getUser = emailIncluded => {
  return {
    name: "John",
    surname: "Doe",
    ...(emailIncluded && { email: "john@doe.com" })
  };
};

const user = getUser(true);
console.log(user); // outputs { name: "John", surname: "Doe", email: "john@doe.com" }

const userWithoutEmail = getUser(false);
console.log(userWithoutEmail); // outputs { name: "John", surname: "Doe" }
```

## Destructuring the Raw Data

Have you ever worked with an object with too much data in it? I'm pretty sure you have. Probably the most common situation is when we have a user object containing the overall data together with details. Here we can call the new ES destructuring feature to the rescue. Let's back up this with an example.

```js
const rawUser = {
   name: 'John',
   surname: 'Doe',
   email: 'john@doe.com',
   displayName: 'SuperCoolJohn',
   joined: '2016-05-05',
   image: 'path-to-the-image',
   followers: 45
   ...
}
The object above can be represented in a more contextual manner by splitting into two, like this:

let user = {}, userDetails = {};
({ name: user.name, surname: user.surname, ...userDetails } = rawUser);

console.log(user); // outputs { name: "John", surname: "Doe" }
console.log(userDetails); // outputs { email: "john@doe.com", displayName: "SuperCoolJohn", joined: "2016-05-05", image: "path-to-the-image", followers: 45 }
```

## Referential equality

If you're new to JavaScript/programming, it wont take long before you learn why this is the case:

```js
true === true // true
false === false // true
1 === 1 // true
'a' === 'a' // true
{} === {} // false
[] === [] // false
() => {} === () => {} // false
const z = {}
z === z // true
// NOTE: React actually uses Object.is, but it's very similar to ===
```
