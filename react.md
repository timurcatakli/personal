# React

## 1. Do not copy props to state

In the rare case that this behavior is intentional, make sure to call that prop `initialColor` or `defaultColor` to clarify that changes to it are ignored.

But usually you’ll want to read the props directly in your component and avoid copying props (or anything computed from the props) into state:

## 2. Use PureComponent

```js
class Button extends React.PureComponent {
  render() {
    const textColor = slowlyCalculateTextColor(this.props.color);
    return (
      <button
        className={
          "Button-" + this.props.color + " Button-text-" + textColor // ✅ Always fresh
        }
      >
        {this.props.children}
      </button>
    );
  }
}
```

Effectively, we want memoization. We have some inputs, and we don’t want to recalculate the output unless the inputs change.
With a class, you could use a helper for memoization. However, Hooks take this a step further, giving you a built-in way to memoize expensive computations:

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

Memoize Helper Library => [https://www.npmjs.com/package/memoizee](https://www.npmjs.com/package/memoizee)

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

## Performance Links

- https://github.com/timurcatakli/personal.git
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
- https://blog.bitsrc.io/improve-react-performance-using-lazy-loading-and-suspense-933903171954
