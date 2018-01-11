ValuePickerList with non-empty list:

```jsx
<ValuePickerList
  list={[
    {
      key: "valuePicker1",
      title: "Value Picker 1",
      selected: [
        { key: "blue", value: "Blue" },
        { key: "green", value: "Green" }
      ],
      selectable: [
        { key: "red", value: "Red" },
        { key: "yellow", value: "Yellow" },
        { key: "orange", value: "Orange" }
      ],
      onAddValue: payload =>
        console.log(`onAddValue (Value Picker 1): ${payload}`),
      onRemoveValue: payload =>
        console.log(`onRemoveValue (Value Picker 1): ${payload}`)
    },
    {
      key: "valuePicker2",
      title: "Value Picker 2",
      selected: [
        { key: "bart", value: "Bart" },
        { key: "lisa", value: "Lisa" },
        { key: "maggie", value: "Maggie" }
      ],
      selectable: [
        { key: "homer", value: "Homer" },
        { key: "marge", value: "Marge" }
      ],
      onAddValue: payload =>
        console.log(`onAddValue (Value Picker 2): ${payload}`),
      onRemoveValue: payload =>
        console.log(`onRemoveValue (Value Picker 2): ${payload}`)
    },
    {
      key: "valuePicker3",
      title: "Value Picker 3",
      selected: [{ key: "one", value: "One" }, { key: "two", value: "Two" }],
      selectable: [{ key: "three", value: "Three" }],
      onAddValue: payload =>
        console.log(`onAddValue (Value Picker 3): ${payload}`),
      onRemoveValue: payload =>
        console.log(`onRemoveValue (Value Picker 3): ${payload}`)
    }
  ]}
  onRemoveValuePicker={payload =>
    console.log(`onRemoveValuePicker: ${payload}`)
  }
/>
```

ValuePickerList with empty list:

```jsx
<ValuePickerList
  list={[]}
  onRemove={payload => console.log(`onRemove: ${payload}`)}
/>
```
