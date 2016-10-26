'use strict'

const chai = require('chai')
const assert = require('assert')

const Name = require('./../lib/data/name')

chai.should()

describe('Name', () => {
  it('receives a name and an abbreviated name.', () => {
    const name = new Name('English Channel', 'Eng')

    name.name.should.equal('English Channel')
    name.abbreviatedName.should.equal('Eng')
  })
  it('omit an abbreviated name', () => {
    const name = new Name('Sweden')

    name.abbreviatedName.should.equal('Sweden')
  })
  it('implements a custom toString.', () => {
    const name = new Name('English Channel', 'Eng')

    name.toString().should.equal('Eng')
  })
})
