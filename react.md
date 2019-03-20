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
      <button className={
        'Button-' + this.props.color +
        ' Button-text-' + textColor // ✅ Always fresh
      }>
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
    <button className={'Button-' + color + ' Button-text-' + textColor}>
      {children}
    </button>
  );
}
```
