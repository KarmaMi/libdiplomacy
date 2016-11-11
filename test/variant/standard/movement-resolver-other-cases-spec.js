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

describe('MovementResolver#Other Cases', () => {
  it('No corresponding order (support)', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.A($.Par), $.A($.Mar)]]],
        [], [], []
      ),
      [$.A($.Par).move($.Bur), $.A($.Mar).support($.A($.Par).move($.Gas))]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Mar).support($.A($.Par).move($.Gas)), $.NoCorrespondingOrder],
        [$.A($.Par).move($.Bur), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.A($.Bur), $.A($.Mar)]]],
        [], [], []
      )
    )
  })
  it('No corresponding order (convoy)', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.A($.Bre), $.F($.Eng)]]],
        [], [], []
      ),
      [$.A($.Bre).move($.Par), $.F($.Eng).convoy($.A($.Bre).move($.Lon))]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Eng).convoy($.A($.Bre).move($.Lon)), $.NoCorrespondingOrder],
        [$.A($.Bre).move($.Par), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.A($.Par), $.F($.Eng)]]],
        [], [], []
      )
    )
  })
  it('swap locations using convoy (1)', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.Germany, [$.A($.Pru), $.A($.Ber), $.F($.Bal)]]],
        [], [], []
      ),
      [$.A($.Pru).move($.Ber), $.A($.Ber).move($.Pru), $.F($.Bal).convoy($.A($.Pru).move($.Ber))]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Bal).convoy($.A($.Pru).move($.Ber)), $.Success],
        [$.A($.Ber).move($.Pru), $.Success],
        [$.A($.Pru).move($.Ber), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.Germany, [$.A($.Ber), $.A($.Pru), $.F($.Bal)]]],
        [], [], []
      )
    )
  })
  it('swap locations using convoy (2)', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.Germany, [$.A($.Ber), $.F($.Bal)]],
          [$.Russia, [$.A($.Pru), $.A($.Sil)]]
        ],
        [], [], []
      ),
      [
        $.A($.Pru).move($.Ber), $.A($.Sil).support($.A($.Pru).move($.Ber)),
        $.A($.Ber).move($.Pru), $.F($.Bal).convoy($.A($.Pru).move($.Ber))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Bal).convoy($.A($.Pru).move($.Ber)), $.Success],
        [$.A($.Ber).move($.Pru), $.Success],
        [$.A($.Pru).move($.Ber), $.Success],
        [$.A($.Sil).support($.A($.Pru).move($.Ber)), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [
          [$.Germany, [$.A($.Pru), $.F($.Bal)]],
          [$.Russia, [$.A($.Ber), $.A($.Sil)]]
        ],
        [], [], []
      )
    )
  })
  it('two units support each other.', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.England, [$.F($.Nth), $.F($.Nwy)]]],
        [], [], []
      ),
      [
        $.F($.Nth).support($.F($.Nwy).hold()), $.F($.Nwy).support($.F($.Nth).hold())
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Nwy).support($.F($.Nth).hold()), $.Success],
        [$.F($.Nth).support($.F($.Nwy).hold()), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.England, [$.F($.Nth), $.F($.Nwy)]]],
        [], [], []
      )
    )
  })
  it('self stand-off.', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [[$.France, [$.A($.Par), $.A($.Mar)]]],
        [], [], []
      ),
      [$.A($.Par).move($.Bur), $.A($.Mar).move($.Bur)]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Par).move($.Bur), $.Bounced],
        [$.A($.Mar).move($.Bur), $.Bounced]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [[$.France, [$.A($.Par), $.A($.Mar)]]],
        [], [], [[$.Bur.province, $.Standoff]]
      )
    )
  })
  it('self cutting support.', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.France, [$.A($.Par), $.A($.Bur), $.A($.Gas)]],
          [$.Italy, [$.A($.Mar)]]
        ],
        [], [], []
      ),
      [
        $.A($.Par).move($.Bur), $.A($.Bur).support($.A($.Gas).move($.Mar)), $.A($.Gas).move($.Mar),
        $.A($.Mar).hold()
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.A($.Par).move($.Bur), $.Bounced],
        [$.A($.Mar).hold(), $.Dislodged],
        [$.A($.Gas).move($.Mar), $.Success],
        [$.A($.Bur).support($.A($.Gas).move($.Mar)), $.Success]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Spring, $.Retreat),
        [
          [$.France, [$.A($.Par), $.A($.Bur), $.A($.Mar)]],
          [$.Italy, []]
        ],
        [], [[$.Italy, [[$.A($.Mar), { status: $.Dislodged, attackedFrom: $.Gas.province }]]]], []
      )
    )
  })
  it('a complex case conaining convoy and support.', () => {
    const { board, orderResult } = r.resolve(
      map,
      new Board(
        variant.initialBoard.state,
        [
          [$.Turkey, [$.A($.Tun), $.F($.Tyn)]],
          [$.France, [$.F($.Rom), $.F($.Wes)]],
          [$.Italy, [$.A($.Ven), $.F($.Nap)]]
        ],
        [], [], []
      ),
      [
        $.A($.Tun).move($.Nap), $.F($.Tyn).convoy($.A($.Tun).move($.Nap)),
        $.F($.Rom).support($.F($.Wes).move($.Tyn)), $.F($.Wes).move($.Tyn),
        $.A($.Ven).move($.Rom), $.F($.Nap).support($.A($.Ven).move($.Rom))
      ]
    )

    ResolverSpecUtil.checkOrderResult(
      orderResult,
      [
        [$.F($.Rom).support($.F($.Wes).move($.Tyn)), $.Cut],
        [$.F($.Tyn).convoy($.A($.Tun).move($.Nap)), $.Failed],
        [$.F($.Wes).move($.Tyn), $.Bounced],
        [$.F($.Nap).support($.A($.Ven).move($.Rom)), $.Cut],
        [$.A($.Ven).move($.Rom), $.Bounced],
        [$.A($.Tun).move($.Nap), $.Bounced]
      ]
    )
    ResolverSpecUtil.checkBoard(
      board,
      new Board(
        new State(1901, $.Autumn, $.Movement),
        [
          [$.Turkey, [$.A($.Tun), $.F($.Tyn)]],
          [$.France, [$.F($.Rom), $.F($.Wes)]],
          [$.Italy, [$.A($.Ven), $.F($.Nap)]]
        ],
        [], [], []
      )
    )
  })
})