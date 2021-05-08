import React, { useEffect, useState, useReducer } from 'react';
import { useBooleanArray } from './Hooks.js';
import { Crud } from './RestConsumer.js';
import {showOnDatatable} from './ColumnsHelpers.js';
import {Details} from './Details.js';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";

export const Datatable = (props) => {
  // Router
  let { path, url } = useRouteMatch();

  // STATE TRACKING
  const [selecteds, resetSelecteds, select, unselect] = useBooleanArray(0, false);
  const [entities, setEntities] = useState([]);
  const [message, setMessage] = useState("");

  // DATA
  const [fetching, setFetching] = useState(true);
  const crud = new Crud(props.description, props.http);

  let Notification = () => <p>{message}</p>;

  // ações
  const fetch = () => {
    setFetching(true);
    crud.getOperation().then(
      (r) => {
        setEntities(r);
        resetSelecteds(r.length);
        setFetching(false);
      }
    );
  }

  const dispatch = (action) => {
    let entity = null;
    let url = "";
    switch(action.method) {
      case 'create':
        crud.postOperation(action.entity).then (
          (r) => {
            setMessage("Criado com sucesso");
            fetch();
          },
          (e) => {
            setMessage(e);
          }
        );
      break;
      case 'delete':
        entity = entities[action.index];
        url = entity._links.self.href;
        crud.deleteOperation(url).then (
          (r) => {
            setMessage("Apagado com sucesso.");
            fetch();
          },
          (e) => {
            setMessage(e);
          }
        )
      break;
      case 'fetch':
        fetch();
        break;
      case 'update':
        url = action.entity._links.self.href;
        crud.patchOperation(url, action.entity).then(
          (r) => {
            setMessage("Alterado com sucesso.");
            fetch();
          },
          (e) => {
            setMessage(e);
          }
        )
        fetch();
      default:
    }
  };

  useEffect(() => {dispatch({method:'fetch'});}, []);

  // pieces
  const Actions = ({index}) => <>
      <Link to={`${url}/${index}`}>Detalhes</Link>
      <button onClick={() => dispatch({method:'delete',index: index})}>Apagar</button>
    </>;

  const Selector = ({i}) => <input
      type="checkbox"
      name={i + "._selected"}
      checked={selecteds[i]}
      onChange={ (e) => e.target.checked ? select(i) : unselect(i) } >
    </input>;

  let Headers = props.headers;

  if(!props.headers) {
    Headers = ({SelectorHeader,ActionsHeader}) =>
      <tr>
        <th><SelectorHeader/></th>
        {props.description.columns.map ((row,j) => showOnDatatable(row) ? <th>{row.header ? row.header : row.label}</th> : null )}
        <th><ActionsHeader/></th>
      </tr>;
  }

  // creating rows from data
  let rows = <></>;
  if(props.description.columns) {
    rows = entities.map ((entity,i) =>
      <tr>
        <td>
          <Selector i={i}/>
        </td>
        {props.description.columns.map ((row,j) => showOnDatatable(row) ? <td>{row.datatableRender(entity)}</td> : null)}
        <td>
          <Actions index={i}/>
        </td>
      </tr>
    );
  } else {
    const View = props.view;
    rows = entities.map ((entity,index) =>
      <View
        data={{
          value: entity,
          path: [index]
        }}
        key={index}
        Selector={Selector}
        Actions={<Actions/>}
        />
    );
  }


  return (
    <div>
      <table>
        <thead>
          <Headers
           SelectorHeader={(props) => <>#</>}
           ActionsHeader={(props) => <>Ações</>} />
        </thead>
        <tbody>
          {rows}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="100">
              <button onClick={() => dispatch({method:'delete'})}>Próxima</button>
              <button onClick={() => dispatch({method:'delete'})}>Anterior</button>
            </td>
          </tr>
            <tr>
              <td colSpan="100">
                <Link to={`${url}/create`}>Adicionar</Link>
                <button onClick={()=>dispatch({method:'delete'})}>Apagar</button>
              </td>
            </tr>
        </tfoot>
      </table>
      <Switch>
        <Route exact path={path}>
          <p>Aqui vão aparecer os detalhes</p>
        </Route>
        <Route path={`${path}/create`}>
          <Details
            http={props.http}
            description={props.description}
            dispatch={dispatch}
            entity={{}}
            method="create" />
        </Route>
        <Route
          path={`${path}/:index`}>
          <Details
            http={props.http}
            description={props.description}
            entities={entities}
            dispatch={dispatch}
            method={"show"} />
        </Route>
      </Switch>
      <Notification/>
    </div>
  );
}
