'use strict'

const chai = require('chai')
const assert = require('assert')

const Board = require('./../../../lib/data/board')
const State = require('./../../../lib/data/state')
const Helper = require('./../../../lib/variant/helper')
const MovementResolver = require('./../../../lib/variant/standard/movement-resolver')

const ResolverSpecUtil = require('./resolver-spec-util')

const rule = require('./../../../lib/variant/standard/rule')
const map = require('./../../../lib/variant/standard/map')
const variant = require('./../../../lib/variant/standard/variant')

const $ = new Helper(rule, map)
const r = new MovementResolver(rule)

chai.should()

describe('MovementResolver', () => {
  it('DIAGRAM 4', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.A($.Ber)]], [$.Russia, [$.A($.War)]]],
        [], [], []
      ),
      [$.A($.Ber).move($.Sil), $.A($.War).move($.Sil)]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [[$.A($.Ber).move($.Sil), $.Standoff], [$.A($.War).move($.Sil), $.Standoff]]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.Germany, [$.A($.Ber)]], [$.Russia, [$.A($.War)]]],
        [], [], [[$.Sil.province, $.Standoff]]
      )
    )
  })
  it('DIAGRAM 5', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.A($.Kie), $.A($.Ber)]], [$.Russia, [$.A($.Pru)]]],
        [], [], []
      ),
      [$.A($.Kie).move($.Ber), $.A($.Ber).move($.Pru), $.A($.Pru).hold()]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Pru).hold(), $.Success],
        [$.A($.Ber).move($.Pru), $.Fail],
        [$.A($.Kie).move($.Ber), $.Fail]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.Germany, [$.A($.Kie), $.A($.Ber)]], [$.Russia, [$.A($.Pru)]]],
        [], [], []
      )
    )
  })
  it('DIAGRAM 6', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.A($.Ber)]], [$.Russia, [$.A($.Pru)]]],
        [], [], []
      ),
      [$.A($.Ber).move($.Pru), $.A($.Pru).move($.Ber)]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Pru).move($.Ber), $.Fail],
        [$.A($.Ber).move($.Pru), $.Fail]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.Germany, [$.A($.Ber)]], [$.Russia, [$.A($.Pru)]]],
        [], [], []
      )
    )
  })
  it('DIAGRAM 7', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.England, [$.F($.Bel), $.F($.Nth)]], [$.Germany, [$.A($.Hol)]]],
        [], [], []
      ),
      [$.F($.Bel).move($.Nth), $.F($.Nth).move($.Hol), $.A($.Hol).move($.Bel)]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Hol).move($.Bel), $.Success],
        [$.F($.Nth).move($.Hol), $.Success],
        [$.F($.Bel).move($.Nth), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.England, [$.F($.Nth), $.F($.Hol)]], [$.Germany, [$.A($.Bel)]]],
        [], [], []
      )
    )
  })
  it('DIAGRAM 8', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.A($.Gas), $.F($.Mar)]], [$.Germany, [$.A($.Bur)]]],
        [], [], []
      ),
      [$.A($.Mar).move($.Bur), $.A($.Gas).support($.A($.Mar).move($.Bur)), $.A($.Bur).hold()]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Gas).support($.A($.Mar).move($.Bur)), $.Success],
        [$.A($.Bur).hold(), $.Dislodged],
        [$.A($.Mar).move($.Bur), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.France, [$.A($.Gas), $.F($.Bur)]], [$.Germany, []]],
        [], [[$.A($.Bur), $.Dislodged]], []
      )
    )
  })
  it('DIAGRAM 9', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.F($.Bal), $.A($.Sil)]], [$.Russia, [$.A($.Pru)]]],
        [], [], []
      ),
      [$.F($.Bal).support($.A($.Sil).move($.Pru)), $.A($.Sil).move($.Pru), $.A($.Pru).hold()]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Bal).support($.A($.Sil).move($.Pru)), $.Success],
        [$.A($.Pru).hold(), $.Dislodged],
        [$.A($.Sil).move($.Pru), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [[$.Germany, [$.F($.Bal), $.A($.Pru)]], [$.Russia, []]],
        [], [[$.A($.Pru), $.Dislodged]], []
      )
    )
  })
  it('DIAGRAM 10', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.F($.GoL), $.F($.Wes)]], [$.Italy, [$.F($.Rom), $.F($.Nap)]]],
        [], [], []
      ),
      [
        $.F($.GoL).move($.Tyn), $.F($.Wes).support($.F($.GoL).move($.Tyn)),
        $.F($.Nap).move($.Tyn), $.F($.Rom).support($.F($.Nap).move($.Tyn))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Wes).support($.F($.GoL).move($.Tyn)), $.Success],
        [$.F($.Rom).support($.F($.Nap).move($.Tyn)), $.Success],
        [$.F($.GoL).move($.Tyn), $.Standoff],
        [$.F($.Nap).move($.Tyn), $.Standoff]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.F($.GoL), $.F($.Wes)]], [$.Italy, [$.F($.Rom), $.F($.Nap)]]],
        [], [], [[$.Tyn.province, $.Standoff]]
      )
    )
  })
  it('DIAGRAM 11', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.F($.GoL), $.F($.Wes)]], [$.Italy, [$.F($.Rom), $.F($.Tyn)]]],
        [], [], []
      ),
      [
        $.F($.GoL).move($.Tyn), $.F($.Wes).support($.F($.GoL).move($.Tyn)),
        $.F($.Tyn).hold(), $.F($.Rom).support($.F($.Tyn).hold())
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Wes).support($.F($.GoL).move($.Tyn)), $.Success],
        [$.F($.Rom).support($.F($.Tyn).hold()), $.Success],
        [$.F($.Tyn).hold(), $.Success],
        [$.F($.GoL).move($.Tyn), $.Fail]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.F($.GoL), $.F($.Wes)]], [$.Italy, [$.F($.Rom), $.F($.Tyn)]]],
        [], [], []
      )
    )
  })
})
