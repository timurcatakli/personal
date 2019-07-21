# Render Prop Patterns

```js
// example 1
<Container render={prop => (
 <Presentation {...props} />
)} />

// example 2
<Container children={prop => (
 <Presentation {...props} />
)} />

// example 3
<Container>
 {props => (
    <Presentation {...props} />
  )}
</Container>
```

# Memoization

In below component, we want memoization. We have some inputs, and we don’t want to recalculate the output unless the inputs change.

With a class, you could use a helper for memoization. However, Hooks take this a step further, giving you a built-in way to memoize expensive computations:

Memoize Helper Library => [https://www.npmjs.com/package/memoizee](https://www.npmjs.com/package/memoizee)

```js
import React, { Component } from "react";
import "./App.css";
import DumbComponent from "./components/DumbComponent";

class App extends Component {
  state = {
    expanded: true
  };
  handleStateUpdate = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };
  render() {
    const color = this.state.expanded ? "red" : "green";
    return (
      <div className="App">
        <button onClick={this.handleStateUpdate}>Update State</button>
        <div
          style={{ backgroundColor: color, width: "50px", height: "50px" }}
        />
        <DumbComponent value={Math.random()} power={7} />
      </div>
    );
  }
}

export default App;
```

```js
import React, { Component } from "react";
import isEqual from "react-fast-compare";
import memoize from "memoizee";

class DumbComponent extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  componentDidMount() {
    console.log("componendDidMount");
  }

  componentDidUpdate(prevProps) {
    console.log("componendDidUpdate");
  }

  anExpensiveFunction = a => {
    console.log("anExpensiveFunction");
    return Math.pow(a, this.props.power);
  };

  memoizedExpensiveFunction = memoize(this.anExpensiveFunction);

  render() {
    return (
      <div>
        {this.props.value} - {this.memoizedExpensiveFunction(12)}
      </div>
    );
  }
}

export default DumbComponent;
```

## Or Use useMemo Hook

```js
function Button({ color, children }) {
  const textColor = useMemo(
    () => slowlyCalculateTextColor(color),
    [color] // ✅ Don’t recalculate until `color` changes
  );
  return (
    <button className={"Button-" + color + " Button-text-" + textColor}>
      {children}
    </button>
  );
}
```

# PureComponent

```js
// App.js
import React, { Component } from "react";
import "./App.css";
import DumbComponent from "./components/DumbComponent";

class App extends Component {
  state = {
    expanded: true
  };
  handleStateUpdate = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };
  render() {
    const color = this.state.expanded ? "red" : "green";
    return (
      <div className="App">
        {/*
        Clicking on the button updates App's state which cause DumbComponent to rerender.
      */}
        <button onClick={this.handleStateUpdate}>Update State</button>
        <div
          style={{ backgroundColor: color, width: "50px", height: "50px" }}
        />
        <DumbComponent value="12" />
      </div>
    );
  }
}

export default App;
```

```js
// DumbComponent
import React, { Component } from "react";

class DumbComponent extends Component {
  componentDidMount() {
    console.log("componendDidMount");
  }

  componentDidUpdate(prevProps) {
    console.log("componendDidUpdate");
  }
  render() {
    return <div>{this.props.value}</div>;
  }
}

export default DumbComponent;
```

If we change `DumbComponent` to use `PureComponent` then we can prevent the rerender.

Note that `PureComponent` does a shallow comparison of props (comparison by value not reference), so if you use complex data structures, it may miss some prop changes and not update your components.

If we change the `DumbComponent` reference in `App` like this:

`<DumbComponent value="12" propA={[1, 2, 3]} />`

`DumbComponent` will render regardless of `PureComponent`. Why? Because propA is an array.

So what is the solution?

## Implement shouldComponentUpdate

`shouldComponentUpdate` is a component method called before render when either props or state has changed. If `shouldComponentUpdate` returns `true`, render will be called, if it returns `false`, nothing happens.

By implementing this method, you can instruct React to avoid re-rendering a given component if its props don’t change.

We could implement `shouldComponentUpdate` in our dumb component and compare each prop one by one or as a whole.

> `Warning:` DumbComponent has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.

I recommend using [react-fast-compare](https://github.com/FormidableLabs/react-fast-compare) for prop comparison.

> As the name implies, react-fast-compare aims to be the fastest deep equality comparison available. It’s very lightweight: under 600 bytes gzipped and minified. It does deep equality comparison by value for any object, as long as it doesn’t contain circular references. It also allows deep comparison of React elements.

```js
import React, { Component } from "react";
import isEqual from "react-fast-compare";

class DumbComponent extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  componentDidMount() {
    console.log("componendDidMount");
  }

  componentDidUpdate(prevProps) {
    console.log("componendDidUpdate");
  }
  render() {
    return <div>{this.props.value}</div>;
  }
}

export default DumbComponent;
```

## Important!

You should only use `shouldComponentUpdate` if you have “deep” props, which are any props that cannot be compared with a simple equality. Examples of deep props are `objects`, `arrays`, and `dates`.

If you don’t have any deep props (they are all shallow: `strings`, `booleans`, and `numbers`), you can just use a `PureComponent`. You could also consider using immutable data to allow for fast comparison of deep props, but it won’t work for every project.

## What About Lodash?

Lodash is a powerful utility library, and its `isEqual` function is very thorough. react-fast-compare is faster by virtue of the fact that it’s doing less work. For example, react-fast-compare doesn’t track circular references or allow custom comparison functions like Lodash does.

# Fully Controlled vs Uncontrolled Component

## Fully Controlled Component

While there are a few different solutions for when you truly want to derive state from props, usually you should use either a fully controlled component:

```js
// Option 1: Fully controlled component.
function TextInput({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}
```

## Fully Uncontrolled Component

```js
// Option 2: Fully uncontrolled component.
function TextInput() {
  const [value, setValue] = useState("");
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// We can reset its internal state later by changing the key:
<TextInput key={formId} />;
```

# React.lazy() - React Suspense

`React.lazy` is a new feature added to React when Reactv16.6 was released, it offered an easy and straight-forward approach to lazy-loading and code-splitting our React components.

React.lazy makes it easy to create components and render them using dynamic imports. React.lazy takes a function as a parameter:

```js
const Lazycomponent = React.lazy(() => import("./lazy.component.js"));
function AppComponent() {
  return (
    <div>
      <Suspense fallback={<div>loading ...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}
```

Components can also be used in the fallback prop:

```js
// ...
function LoadingIndicator() {
  return <div>loading ...</div>;
}
function AppComponent() {
  return;
  <div>
    <Suspense fallback={<LoadingIndicator />}>
      <LazyComponent />
    </Suspense>
  </div>;
}
```

Multiple lazy components can be placed in the Suspense tag.

```js
const Lazycomponent1 = React.lazy(() => import("./lazy.component1.js"));
const Lazycomponent2 = React.lazy(() => import("./lazy.component2.js"));
const Lazycomponent3 = React.lazy(() => import("./lazy.component3.js"));
const Lazycomponent4 = React.lazy(() => import("./lazy.component4.js"));

function AppComponent() {
  return;
  <div>
    <Suspense fallback={<div>loading ...</div>}>
      <LazyComponent1 />
      <LazyComponent2 />
      <LazyComponent3 />
      <LazyComponent4 />
    </Suspense>
  </div>;
}
```

# Try to Avoid Inline Styles

Inline styles take way more size in the DOM, are converted more slowly from VDOM (have probably a bigger impact on memory), and take more time to be handled by the browser.

But they have no impact on performance once it’s rendered.

# Cache React Event Listeners

```js
class SomeComponent extends React.PureComponent {
  get instructions() {
    if (this.props.do) {
      return "Click the button: ";
    }
    return "Do NOT click the button: ";
  }

  render() {
    return (
      <div>
        {this.instructions}
        <Button onClick={() => alert("!")} />
      </div>
    );
  }
}
```

This is a pretty straightforward component. There’s a button, and when it is clicked, it alerts. Instructions tell you whether or not you should click it, which is controlled by the `do={true}` or `do={false}` prop of SomeComponent.

What happens here is that every time `SomeComponent` is re-rendered (such as do toggling from true to false), Button is re-rendered too!

The onClick handler, despite being **exactly the same**, is being created every render call. Each render, a new function is created (because it is created in the render function) in memory, a new reference to a new address in memory is passed to `<Button />`, and the Button component is re-rendered, despite absolutely nothing having changed in its output.

## The Fix

If your function does not depend on your component (no this contexts), you can define it outside of the component. All instances of your component will use the same function reference, since the function is identical in all cases.

```js
const createAlertBox = () => alert("!");

class SomeComponent extends React.PureComponent {
  get instructions() {
    if (this.props.do) {
      return "Click the button: ";
    }
    return "Do NOT click the button: ";
  }

  render() {
    return (
      <div>
        {this.instructions}
        <Button onClick={createAlertBox} />
      </div>
    );
  }
}
```

In contrast to the previous example, `createAlertBox` remains the same reference to the same location in memory during every render. Button therefore never has to re-render.

While Button is likely a small, quick-to-render component, you may see these inline definitions on large, complex, slow-to-render components, and it can really bog down your React application. It is good practice to simply never define these functions inside the render method.

## Mapping Arrays

There is a very common use case that you have a lot of unique, dynamic event listeners in a single component, such as when mapping an array.

```js
class SomeComponent extends React.PureComponent {
  render() {
    return (
      <ul>
        {this.props.list.map(listItem => (
          <li key={listItem.text}>
            <Button onClick={() => alert(listItem.text)} />
          </li>
        ))}
      </ul>
    );
  }
}
```

In this case, you have a variable number of buttons, making a variable number of event listeners, each with a unique function that you cannot possibly know what is when creating your SomeComponent. How can you possible solve this conundrum?

## Use Memoization

You may use a library or code it yourself as below:

```js
class SomeComponent extends React.PureComponent {
  // Each instance of SomeComponent has a cache of click handlers
  // that are unique to it.
  clickHandlers = {};

  // Generate and/or return a click handler,
  // given a unique identifier.
  getClickHandler(key) {
    // If no click handler exists for this unique identifier, create one.
    if (!Object.prototype.hasOwnProperty.call(this.clickHandlers, key)) {
      this.clickHandlers[key] = () => alert(key);
    }
    return this.clickHandlers[key];
  }

  render() {
    return (
      <ul>
        {this.props.list.map(listItem => (
          <li key={listItem.text}>
            <Button onClick={this.getClickHandler(listItem.text)} />
          </li>
        ))}
      </ul>
    );
  }
}
```

Each item in the array is passed through the getClickHandler method. Said method will, the first time it is called with a value, create a function unique to that value, then return it. All future calls to that method with that value will not create a new function; instead, it will return the reference to the previously created function in memory.

As a result, re-rendering `SomeComponent` will not cause `Button` to re-render. Similarly, adding items to the list prop will create event listeners for each button dynamically.

You may need to use your own cleverness for generating unique identifiers for each handler when they are determined by more than one variable, but it is not much harder than simply generating a unique `key` prop for each JSX object in the mapped result.

A word of warning for using the index as the identifier: You may get the wrong result if the list changes order or removes items. When your array changes from `[ 'soda', 'pizza' ]` to just `[ 'pizza' ]` and you have cached your event listener as `listeners[0] = () => alert('soda')`, you will find that when you users click the now-index-0 button for pizza that it alerts soda. This is the same reason React advises against using array indices for key props.

## A Better Way

A better implementation is to use **cache invalidation** and **React’s built-in memory management**.

```js
import React, { Component } from "react";
import Button from "./components/Button";
import "./App.css";

class App extends Component {
  onClickButton = text => {
    console.log(text);
  };
  render() {
    const list = [
      { text: "aaa" },
      { text: "bbb" },
      { text: "ccc" },
      { text: "ddd" },
      { text: "eee" }
    ];
    return (
      <div className="App">
        <ul>
          {list.map(({ text }) => {
            return (
              <li key={text}>
                <Button text={text} onClick={this.onClickButton} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default App;
```

```js
import React, { Component } from "react";

class Button extends Component {
  onClick = () => {
    const { text, onClick } = this.props;
    onClick(text);
  };
  render() {
    return <button onClick={this.onClick}>{this.props.text}</button>;
  }
}

export default Button;
```

# Split Big Components

React re-renders a Component whenever it receives new props or its state changes. This means that Components which are frequently updated should be encapsulated so that their updates don’t cause other Components to render unnecessarily.

This is also important when connecting Components to the application’s store. You don’t need to hook up all the Redux logic `(connect, mapState/DispatchToProps)` in one single place.

The following code is a modification of redux’s todos example. We have a Component that renders the list of todos and displays the possible filters `(active, completed, all)`.

This is a pretty basic example of why we should split component’s by their responsibility since each time we add a new todo or change the state of a todo to active/completed, we will re-render not only the list of todos but also the filters below.

Simply refactoring and moving the filter to their own Component (Footer in the original example) will prevent this Component to re-render each time we modify the todo list.

```js
const TodoScreen = ({ todos, toggleTodo }) => (
  <div>
    <ul>
      {todos.map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => toggleTodo(todo.id)} />
      ))}
    </ul>
    {/* The code below should be moved to its own Component */}
    <div>
      <span>Show: </span>
      <FilterLink filter={VisibilityFilters.SHOW_ALL}>All</FilterLink>
      <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>Active</FilterLink>
      <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
        Completed
      </FilterLink>
    </div>
  </div>
);
```

# React Profiler

![React Dev Tools](https://reactjs.org/static/devtools-profiler-tab-4da6b55fc3c98de04c261cd902c14dc3-53c76.png)

https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html

[![React Profiler](https://img.youtube.com/vi/yXJOkfYXCJQ/0.jpg)](https://www.youtube.com/watch?v=yXJOkfYXCJQ "Everything Is AWESOME")

# Delete EventListeners on unMount

Lets say you have a component where you listen to page activities.

```js
import React, { useState, useRef, useEffect } from "react";
import createActivityDetector from "activity-detector";

const useIdle = options => {
  const [isIdle, setIdle] = useState(false);
  useEffect(() => {
    const activityDetector = createActivityDetector(options);
    activityDetector.on("idle", () => setIdle(true));
    activityDetector.on("active", () => setIdle(false));
  }, []);
  return isIdle;
};

const App = () => {
  const isIdle = useIdle({ timeToIdle: 1000 });
  return <div>{isIdle ? "Are you still there" : "Hello there"}</div>;
};

export default App;
```

When this component unmounts you need to remove the event listeners `activity-detector` created.

So you update the `useEffect`

```js
useEffect(() => {
  const activityDetector = createActivityDetector(options);
  activityDetector.on("idle", () => setIdle(true));
  activityDetector.on("active", () => setIdle(false));
  return () => activityDetector.stop();
}, []);
```

A nice trick is to check if there are any eventlisteners left undeleted. In Chrome DevTools console you can write `getEventListeners(document);` and get a list of all the undeleted listeners.

# Avoid inline objects wherever you can

Each time you inline an object, React re-creates a new reference to this object on every render. This causes components that receive this object to treat it as a referentially different one. Thus, a shallow equality on the props of this component will return false on every render cycle.

This is an indirect reference to the inline styles that a lot of people use. Inlining styles prop on a component will force your component to always render (unless you write a custom shouldComponentUpdate method) which could potentially lead to performance issues, depending on whether the component holds a lot of other subcomponents below it or not.

There is a nice trick to use if this prop has to have a different reference — because, for example, it’s being created inside a .map — , which is to spread its contents as props using the ES6 spread operator. Whenever the contents of an object are primitives (i.e. not functions, objects or Arrays) or non-primitives with “fixed” references, you can pass them as props instead of passing the object that contains them as a single prop. Doing that will allow your components to benefit from rendering bail-out techniques by referentially comparing their next and previous props.

```js
// Don't do this!
function Component(props) {
  const aProp = { someProp: "someValue" };
  return <AnotherComponent style={{ margin: 0 }} aProp={aProp} />;
}

// Do this instead :)
const styles = { margin: 0 };
function Component(props) {
  const aProp = { someProp: "someValue" };
  return <AnotherComponent style={styles} {...aProp} />;
}
```

Try and bind function props to method or utilise useCallback as much as you can to benefit from rendering bail-out techniques. This applies to functions returned from render-props as well.

```js
// Don't do this!
function Component(props) {
  return <AnotherComponent onChange={() => props.callback(props.id)} />;
}

// Do this instead :)
function Component(props) {
  const handleChange = useCallback(() => props.callback(props.id), [props.id]);
  return <AnotherComponent onChange={handleChange} />;
}

// Or this for class-based components :)
class Component extends React.Component {
  handleChange = () => {
    this.props.callback(this.props.id);
  };

  render() {
    return <AnotherComponent onChange={this.handleChange} />;
  }
}
```

# Tweak CSS instead of forcing a component to mount & unmount

Rendering is costly, especially when the DOM needs to be altered. Whenever you have some sort of accordion or tab functionality — where you only see one item at a time — , you might be tempted to unmount the component that’s not visible and mount it back when it becomes visible.

If the component that gets mounted/unmounted is “heavy”, then this operation might be way more costly than needed and result into lagginess. In cases like these, you would be better off hiding it through CSS, while keeping the content to the DOM. I do realise that sometimes this is not possible since you might have a case where having those components simultaneously mounted might cause issues (i.e. components competing with endless pagination on the window), but you should opt to do it when that’s not the case.

As a bonus, tweaking the opacity to 0 has almost zero cost for the Browser (since it doesn’t cause a reflow) and should be preferred over visibility & display changes whenever possible.

TLDR; Instead of hiding through unmounting, sometimes it can be beneficial to hide through CSS while keeping your component mounted. This is a big gain for heavy components with significant mount/unmount timings.

```js
// Avoid this is the components are too "heavy" to mount/unmount
function Component(props) {
  const [view, setView] = useState('view1');
  return view === 'view1' ? <SomeComponent /> : <AnotherComponent />
}

// Do this instead if you' re opting for speed & performance gains
const visibleStyles = { opacity: 1 };
const hiddenStyles = { opacity: 0 };
function Component(props) {
  const [view, setView] = useState('view1');
  return (
    <React.Fragment>
      <SomeComponent style={view === 'view1' ? visibleStyles : hiddenStyles}>
      <AnotherComponent style={view !== 'view1' ? visibleStyles : hiddenStyles}>
    </React.Fragment>
  )
}
```

# Is it worth using hooks like useMemo for constant values?

`const one = useMemo( () => 1, [] )`

@dan_abramov
For primitives, no — just adds extra cost. For objects, maybe.

---

---

---

---

---

---

---

---

---

READ BELOW IN ORDER
1- https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1

2- https://hackernoon.com/react-performance-primer-64fe623c4821

# React Profiler

https://reactjs.org/docs/optimizing-performance.html#profiling-components-with-the-chrome-performance-tab

https://www.youtube.com/watch?v=nySib7ipZdk

## Performance Links

https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4

- https://ponyfoo.com/articles/javascript-performance-pitfalls-v8
- https://medium.com/@sdolidze/react-hooks-memoization-99a9a91c8853
- https://levelup.gitconnected.com/cache-your-react-event-listeners-to-improve-performance-cfbafbf9bb5f
- https://www.telerik.com/blogs/react-component-performance-comparison?utm_campaign=React%20Ninjas%20Newsletter&utm_medium=email&utm_source=Revue%20newsletter
- https://houssein.me/progressive-react?utm_campaign=React%2BNewsletter&utm_medium=email&utm_source=React_Newsletter_150
- https://medium.freecodecamp.org/yeah-hooks-are-good-but-have-you-tried-faster-react-components-e698a8db468c
- https://www.youtube.com/watch?v=iTrCNz1gRt0
- https://blog.usejournal.com/what-the-heck-is-repaint-and-reflow-in-the-browser-b2d0fb980c08
- https://medium.com/crowdbotics/how-to-use-usereducer-in-react-hooks-for-performance-optimization-ecafca9e7bf5
- https://itnext.io/improving-react-application-perfomance-by-avoiding-unnecessary-updates-bd96d03dec40
- https://hackernoon.com/react-performance-primer-64fe623c4821
- https://web.dev/fast/serve-modern-code-to-modern-browsers/codelab-serve-modern-code?utm_campaign=React%20Ninjas%20Newsletter&utm_medium=email&utm_source=Revue%20newsletter
- https://blog.bitsrc.io/improve-react-performance-using-lazy-loading-and-suspense-933903171954 ✅
- https://benchling.engineering/a-deep-dive-into-react-perf-debugging-fd2063f5a667
- https://blog.logrocket.com/make-react-fast-again-part-2-why-did-you-update-dd1faf79399f

https://reactjs.org/docs/optimizing-performance.html#profiling-components-with-the-chrome-performance-tab

https://www.youtube.com/watch?v=nySib7ipZdk
