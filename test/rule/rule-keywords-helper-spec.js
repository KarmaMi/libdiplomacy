'use strict'

const chai = require('chai')

const Name = require('./../../lib/data/name')
const Location = require('./../../lib/data/location')
const Province = require('./../../lib/data/province')
const RuleKeywords = require('./../../lib/rule/rule-keywords')
const RuleKeywordsHelper = require('./../../lib/rule/rule-keywords-helper')
const Order = require('./../../lib/variant/standard/order')

chai.should()

describe('RuleKeywordsHelper', () => {
  it('defines helper functions.', () => {
    const fleet = new Name('Fleet', 'F')
    const army = new Name('Army', 'A')

    const spain = new Province(new Name('Spa'), null, true)
    const spa = new Location(spain, [army])
    const spaSc = new Location(spain, [fleet])
    spaSc.toString = () => 'Spa/SC'

    const naples = new Province(new Name('Nap'))
    const nap = new Location(naples, [army, fleet])

    const western = new Province(new Name('Wes'))
    const wes = new Location(western, [fleet])

    const orders = []
    for (const name in Order) {
      orders.push([name.toLowerCase(), Order[name]])
    }

    const h = RuleKeywordsHelper(new RuleKeywords([], [], [], [fleet, army], orders))
    h.$m.F(nap).militaryBranch.should.deep.equal(fleet)
    h.$m.F(nap).location.should.deep.equal(nap)

    const c = h.F(wes).convoy(h.A(nap).move(spa).viaConvoy())

    c.unit.militaryBranch.should.deep.equal(fleet)
    c.unit.location.should.deep.equal(wes)
    c.target.unit.militaryBranch.should.deep.equal(army)
    c.target.unit.location.should.deep.equal(nap)
    c.target.destination.should.deep.equal(spa)
    c.target.isViaConvoy.should.equal(true)
  })
})