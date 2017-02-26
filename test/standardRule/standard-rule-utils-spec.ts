import * as chai from "chai"
import { standardRule } from "./../../src/standardRule"
import { standardMap } from "./../../src/standardMap"

const { StandardRuleUtils, Board, Unit, MilitaryBranch, State, Phase, ProvinceStatus } =
  standardRule
declare type Power = standardMap.Power
const { locations: $, Power, map } = standardMap

const { Army, Fleet } = MilitaryBranch
const { France, England } = Power

const should = chai.should()

const turn = {
  isBuildable: true,
  isOccupationUpdateable: true,
  nextTurn: () => this
}

const state = new State(turn, Phase.Movement)

describe("The StandardRuleUtil", () => {
  it("calculates the number of supply centers for each power.", () => {
    const board = new Board<Power>(
      map, state, [], [],
      [
        [$.Mar.province, new ProvinceStatus<Power>(France, false)],
        [$.Spa.province, new ProvinceStatus<Power>(France, false)]
      ]
    )
    Array.from(StandardRuleUtils.numberOfSupplyCenters(board))
      .should.have.deep.members([[France, 2]])
  })
  it("finds the provinces that an unit can move to", () => {
    const board = new Board(
      map, state,
      [
        new Unit(Army, $.Lvp, England), new Unit(Army, $.Edi, England),
        new Unit(Fleet, $.Nrg, England), new Unit(Fleet, $.Bar, England)
      ],
      [], []
    )

    Array.from(StandardRuleUtils.movableLocationsOf<Power>(board, new Unit(Army, $.Lvp, England)))
      .should.have.deep.members(
        [...board.map.movableLocationsOf($.Lvp, Army)]
      )
    Array.from(StandardRuleUtils.movableLocationsOf(board, new Unit(Army, $.Edi, England)))
      .should.have.deep.members(
        [...board.map.movableLocationsOf($.Edi, Army)].concat([$.Nwy, $.StP])
      )
  })
  it("calculte the number of buildable units", () => {
    const board = new Board<Power>(
      map, state,
      [new Unit(Army, $.Yor, England)],
      [],
      [
        [$.Mar.province, new ProvinceStatus<Power>(France, false)],
        [$.Spa.province, new ProvinceStatus<Power>(France, false)]
      ]
    )
    const x = StandardRuleUtils.numberOfBuildableUnits(board)
    should.equal(x.get(France), 2)
    should.equal(x.get(England), -1)
  })
})