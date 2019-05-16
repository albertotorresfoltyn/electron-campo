/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch } from 'react-router'
import { Route, Redirect } from 'react-router-dom'
const home = (
    <div>hola perros!</div>
)

export default () => (

    <Switch>
      <Route exact path="/" component={home} />
    </Switch>

)
