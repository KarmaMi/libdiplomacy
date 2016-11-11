const Unit = require('../../data/unit')
const Board = require('../../data/board')
const RuleHelper = require('../../rule/rule-helper')
const StandardRuleUtil = require('./standard-rule-util')

module.exports = class RetreatResolver {
  constructor (rule) {
    this.rule = rule
  }
  resolve (map, board, orders) {
    const $ = new RuleHelper(this.rule)

    const orderResult = new Map()

    // Resolve disband orders
    orders.forEach(order => {
      if (order.type !== 'Disband') return

      orderResult.set(order, $.Success)
    })

    // Create a map from province to retreat order
    const provinceToRetreatOrder = new Map()
    orders.forEach(order => {
      if (order.type !== 'Retreat') return

      if (!provinceToRetreatOrder.has(order.destination.province)) {
        provinceToRetreatOrder.set(order.destination.province, [])
      }
      provinceToRetreatOrder.get(order.destination.province).push(order)
    })

    // Resolve retreat orders
    provinceToRetreatOrder.forEach(orders => {
      if (orders.length === 1) {
        orders.forEach(order => orderResult.set(order, $.Success))
      } else {
        orders.forEach(order => orderResult.set(order, $.Failed))
      }
    })

    // Generate new board
    const { state, units, occupation, unitsStatus } = board

    const nextUnits = new Map([...units])

    const provinceToOrderResult = new Map([...orderResult].map(elem => {
      const [order, result] = elem
      return [order.unit.location.province, [order, result]]
    }))
    unitsStatus.forEach((units, force) => {
      if (!nextUnits.has(force)) {
        nextUnits.set(force, [])
      }
      const us = [...nextUnits.get(force)];

      ([...units]).forEach(elem => {
        const unit = elem[0]
        if (provinceToOrderResult.has(unit.location.province)) {
          const [order, result] = provinceToOrderResult.get(unit.location.province)
          if (order.type === 'Retreat' && result === $.Success) {
            us.push(new Unit(unit.militaryBranch, order.destination))
          }
        } else {
          us.push(unit)
        }
      })
      nextUnits.set(force, us)
    })

    const nextOccupation =
      (state.season === $.Autumn)
        ? StandardRuleUtil.updateOccupation(nextUnits, occupation)
        : occupation

    const nextState = StandardRuleUtil.getNextState(this.rule, state, nextUnits, nextOccupation, [])

    const nextBoard = new Board(nextState, nextUnits, nextOccupation, [], [])

    return { board: nextBoard, orderResult: orderResult }
  }
}