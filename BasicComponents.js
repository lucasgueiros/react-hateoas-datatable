export const StandaloneField = (props) => {
  return (
    <div>
      <label htmlFor={props.path.join('.') + '.' + props.property}>{props.label}: </label>
      <props.Field {...props}/>
    </div>
  );
}

export const TextField = (props) => {
  return (
      <input
        name={props.path.join('.') + '.' + props.property}
        type="text"
        value={props.entity[props.property] || ''}
        readOnly={props.readOnly}
        onChange={(e) => props.dispatch({
          method: 'write',
          path: props.path,
          property: props.property,
          value: e.target.value,
        })}
        >
      </input>
  );
}

export const YearField = (props) => {
  return (
    <input
      name={props.path.join('.') + '.' + props.property}
      type="number" step="1"
      readOnly={props.readOnly}
      onChange={(e) => props.dispatch({
        method: 'write',
        path: props.path,
        property: props.property,
        value: e.target.value,
      })}
      value={props.entity[props.property] || new Date().getFullYear()}>
    </input>
  );
}
