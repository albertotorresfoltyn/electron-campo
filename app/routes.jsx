/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch } from 'react-router'
import { Route, Redirect } from 'react-router-dom'
import AppL from './containers/App'
import HomePage from './containers/HomePage'
import PotrerosList from './containers/PotrerosList'
import Potrero from './containers/Potrero'
import MenuedLayout from './containers/MenuedLayout'
export default () => (
  <AppL>
    <Switch>
      <MenuedLayout>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/potreros/:campoId" component={PotrerosList} />
        <Route exact path="/potrero/:potreroId" component={Potrero} />
      </MenuedLayout>
    </Switch>
  </AppL>
)
