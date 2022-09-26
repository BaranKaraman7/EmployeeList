import React, { Component } from 'react'
import EmployeeList from '../../../components/EmployeeList.tsx'

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <EmployeeList></EmployeeList>
      </div>
    )
  }
}
