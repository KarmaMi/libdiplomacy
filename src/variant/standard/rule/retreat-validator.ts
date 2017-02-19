import { Validator } from "./validator"
import { StandardRuleUtils } from "./standard-rule-utils"
import { OrderType, Order, Disband, Retreat } from "./order"
import { Dislodged } from "./dislodged"
import { Board, Unit } from "./types"

export class RetreatValidator<Power> implements Validator<Power> {
  unitsRequiringOrder (board: Board<Power>) {
    return new Set([...board.unitStatuses].map(elem => elem[0]))
  }
  errorMessageOfOrder (board: Board<Power>, order: Order<Power>) {
    // The order is invalid if order.unit is not dislodged
    const dislodged = board.unitStatuses.get(order.unit)

    if (!dislodged) {
      return `${order.unit} is not dislodged`
    }

    if (order instanceof Retreat) {
      const ls = StandardRuleUtils.locationsToRetreat(board, order.unit, dislodged.attackedFrom)
      if (!ls.has(order.destination)) {
        return `${order.unit} cannot retreat to ${order.destination}`
      }
    } else if (!(order instanceof Disband)) {
      return `${order} is for Retreat phase`
    }
    return null
  }

  errorMessageOfOrders (board: Board<Power>, orders: Set<Order<Power>>) {
    for (let elem of [...board.unitStatuses]) {
      const [unit, status] = elem
      const hasOrder = [...orders].some(order => order.unit === unit)

      if (!hasOrder) {
        return `${unit} has no order`
      }
    }
    return null
  }
}
