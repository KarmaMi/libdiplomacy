package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.InvalidOrderMessage
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._

class MovementVailidatorSpec extends UnitSpec {
  val validator = new MovementValidator {
    type Turn = map.Turn
    type Power = map.Power
  }
  val board = {
    val $ = DiplomacyMapHelper(map.map)
    Board[State[map.Turn], Power.Power, MilitaryBranch.MilitaryBranch, UnitStatus.UnitStatus, ProvinceStatus.ProvinceStatus](
      map.map,
      State(Turn(1901, Season.Spring), Phase.Movement),
      Set(
        DiplomacyUnit(Power.England, MilitaryBranch.Army, $.Lvp),
        DiplomacyUnit(Power.England, MilitaryBranch.Fleet, $.Lon),
        DiplomacyUnit(Power.England, MilitaryBranch.Fleet, $.Eng),
        DiplomacyUnit(Power.France, MilitaryBranch.Army, $.Spa),
        DiplomacyUnit(Power.France, MilitaryBranch.Army, $.Bur)
      ), Map(), Map(), Map()
    )
  }
  val $ = BoardHelper(board)

  val orderHelper = new OrderHelper[Power.Power]() {}
  import orderHelper._

  "A movement-validator" when {
    "a valid order is received" should {
      "return null (1)." in {
        validator.errorMessageOfOrder(board)($.A($.Lvp).move($.Bre)) should be(None)
      }
      "return null (2)." in {
        validator.errorMessageOfOrder(board)($.A($.Spa).move($.Tun)) should be(None)
      }
    }

    "an order that its target unit does not exist is received" should {
      "return an error message." in {
        val aLon = new validator.DiplomacyUnit($.p.England, $.m.A, $.Lon)
        validator.errorMessageOfOrder(board)(aLon.move($.Tun)) should be(Some(
          InvalidOrderMessage("A Lon does not exist.")
        ))
      }
    }

    "a unit tries to move an invalid location" should {
      "return an error message." in {
        validator.errorMessageOfOrder(board)($.A($.Lvp).move($.Bud)) should be(Some(
          InvalidOrderMessage("A Lvp cannot move to Bud.")
        ))
      }
    }

    "a unit tries to support an invalid location" should {
      "return an error message (1)." in {
        validator.errorMessageOfOrder(board)($.A($.Lvp).support($.A($.Spa).hold())) should be(Some(
          InvalidOrderMessage("A Lvp cannot support A Spa H.")
        ))
      }

      "return an error message (2)." in {
        validator.errorMessageOfOrder(board)($.A($.Lvp).support($.A($.Spa).move($.Bud))) should be(Some(
          InvalidOrderMessage("A Spa cannot move to Bud.")
        ))
      }
    }

    "a unit tries to convoy an invalid order" should {
      "return an error message (1)." in {
        validator.errorMessageOfOrder(board)($.A($.Lvp).convoy($.F($.Lon).move($.Yor))) should be(Some(
          InvalidOrderMessage("A Lvp is not fleet.")
        ))
      }
      "return an error message (2)." in {
        validator.errorMessageOfOrder(board)($.F($.Eng).convoy($.F($.Lon).move($.Eng))) should be(Some(
          InvalidOrderMessage("F Lon is not army.")
        ))
      }
      "return an error message (3)." in {
        validator.errorMessageOfOrder(board)($.F($.Eng).convoy($.A($.Bur).move($.Mar))) should be(Some(
          InvalidOrderMessage("Moving from Bur to Mar via convoy is invalid.")
        ))
      }
    }
  }
}