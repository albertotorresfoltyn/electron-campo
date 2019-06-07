/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch } from 'react-router'
import { Route, Redirect } from 'react-router-dom'
import AppL from './containers/App'
import HomePage from './containers/HomePage'
import PotrerosList from './containers/PotrerosList'
import MenuedLayout from './containers/MenuedLayout'
export default () => (
  <AppL>
    <Switch>
      <MenuedLayout>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/potreros/:campoid" component={PotrerosList} />
      </MenuedLayout>
    </Switch>
  </AppL>
)
