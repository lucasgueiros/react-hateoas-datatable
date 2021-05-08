import React, { useEffect, useState, useReducer } from 'react';
import {firstAvaliable} from './ColumnsHelpers.js';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";

import {StandaloneField, TextField, YearField} from './BasicComponents.js';

const entityReducer = (state,action) => {
  switch(action.method) {
    case 'substitute': return action.entity;
    case 'write':
      let e = state;
      let entityHierarchy = [];
      for(let i=0;i<action.path.length;i++) {
        entityHierarchy[i] = e;
        e = e[action.path[i]];
      }
      if(Array.isArray(e)) {
        e = [...e];
        e[action.property] = action.value;
      } else {
        e = {...e};
        e[action.property] = action.value;
      }

      for(let i=action.path.length-1;i>=0;i--) {
        if(Array.isArray(entityHierarchy[i])) {
          let v = e;
          e = [...entityHierarchy[i]];
          e[action.path[i]] = v;
        } else {
          let v = e;
          e = {...entityHierarchy[i]};
          e[action.path[i]] = v;
        }
      }

      return e;
    break;
    default:
      return state;
  }
}

export const Details = (props) => {

  let { index } = useParams();
  const description = props.description;
  const headerText = firstAvaliable (description, ['singularLabel','label','header']);
  const [method,setMethod] = useState(props.method);
  useEffect(() => setMethod(props.method), [props.method]);

  let Header = () => <></>;
  let path = [];
  if(props.path) {
    path = props.path;
  }
  switch (path.length) {
    case 0:
      Header = () => <h2>{headerText}</h2>;
      break;
    default:
      Header = () => <h2>{headerText}</h2>;
  }

  // recuperando dados
  const [entity,dispatch] = useReducer(entityReducer, {});
  useEffect(()=> {
    if(props.method == 'create') {
      dispatch({method: 'substitute', entity: {}});
    } else if(props.entity) {
      //theEntity = props.entity;
    } else if(props.entities && props.entities.length > 0 && index < props.entities.length) {
      dispatch({method: 'substitute', entity: props.entities[index]})
    } else {
      // recupere os dadosArtigo Científico
      console.log("recupere o dados com http");
      //theEntity = {};
    }
  }, [props.method, props.entities, props.entity, index])




  let Action = () => <></>;
  let readOnly = true;
  switch (method) {
    case "create":
      readOnly = false;
      Action = () => <>
        <button onClick={() => props.dispatch({method: 'create', entity: entity})}>Salvar</button>
      </>;
      break;
    case "show":
      readOnly = true;
      Action = () => <>
        <button onClick={() => setMethod('editing')}>Alterar</button>
      </>;
      break;
    case 'editing':
      readOnly = false;
      Action = () => <>
        <button onClick={() => props.dispatch({method: 'update', entity: entity})}>Salvar</button>
      </>;
    break;
    default:
      readOnly = true;
  }

  const toReturn =
  <div>
    <Header/>
    {
      description.columns.map((c,i) => {
        switch(c.type) {
          case 'string':
            return <StandaloneField
                      label={c.label}
                      property={c.property}
                      entity={entity}
                      path={path}
                      Field={TextField}
                      readOnly={readOnly}
                      dispatch={dispatch} />;
            case 'year':
              return <StandaloneField
                        label={c.label}
                        property={c.property}
                        entity={entity}
                        path={path}
                        readOnly={readOnly}
                        Field={YearField}
                        dispatch={dispatch} />;
          default:
            return null;
        }
      })
    }
    <Action/>
  </div>;
  return toReturn;

  ;
}
