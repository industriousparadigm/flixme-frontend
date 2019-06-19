import React, { useState, useEffect } from 'react'

import Select from 'react-select'
import { colourOptions } from './docs/data'
import API from '../api/API'


const MultiSelect = props => {

  return <Select
    defaultValue={null}
    isMulti
    name="genres"
    options={props.genres}
    className="basic-multi-select"
    classNamePrefix="select"
  />
}

export default MultiSelect