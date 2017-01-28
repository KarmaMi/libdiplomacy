package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.OrderResult
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map.Power
import diplomacy.variant.standard.map.Keywords._
import diplomacy.variant.standard.board.{ Turn => T }
import diplomacy.variant.standard.board.Keywords._
import diplomacy.variant.standard.board.Implicits._
import diplomacy.variant.standard.rule.Keywords._
import diplomacy.variant.standard.rule.Implicits._

class RuleSpec extends UnitSpec {
  val rule = new Rule[T, map.Power](T.nextTurn)
  type Executed =
    OrderResult.Executed[map.Power, rule.MilitaryBranch, rule.Order, rule.Result]

  "A Rule" when {
    "there are no dislodged units" should {
      "skip retreat phase." in {
        val board =
          new Board[T, map.Power](
            map.map,
            1901.Spring - Movement,
            Set(
              DiplomacyUnit(France, Army, Bre),
              DiplomacyUnit(Germany, Army, Pic)
            ), Map(), Map(), Map()
          )
        val ruleHelper = StandardRuleOrderHelper(board)
        import ruleHelper._

        val Right(result) = rule.resolve(board, Set(A(Bre).hold(), A(Pic).hold()))
        result.board should be (board.copy(state = 1901.Autumn - Movement))
      }
    }
    "all dislodged units cannot retreat" should {
      "skip retreat phase." in {
        val board =
          new Board[T, map.Power](
            map.map,
            1901.Spring - Movement,
            Set(
              DiplomacyUnit(France, Army, Bre),
              DiplomacyUnit(Germany, Army, Gas),
              DiplomacyUnit(Germany, Army, Par),
              DiplomacyUnit(Germany, Army, Pic)
            ), Map(), Map(), Map()
          )
        val ruleHelper = StandardRuleOrderHelper(board)
        import ruleHelper._

        val Right(result) = rule.resolve(board, Set(
          A(Bre).hold(),
          A(Pic).move(Bre), A(Par).support(A(Pic).move(Bre)), A(Gas).support(A(Pic).move(Bre))
        ))
        result.board should be (board.copy(
          state = 1901.Autumn - Movement,
          units = Set(
              DiplomacyUnit(Germany, Army, Gas),
              DiplomacyUnit(Germany, Army, Par),
              DiplomacyUnit(Germany, Army, Bre)
            )
        ))
        result.result should be(Set(
          new Executed(A(Bre).hold(), Result.Dislodged(Pic.province)),
          new Executed(A(Bre).disband(), Result.Success),
          new Executed(A(Pic).move(Bre), Result.Success),
          new Executed(A(Par).support(A(Pic).move(Bre)), Result.Success),
          new Executed(A(Gas).support(A(Pic).move(Bre)), Result.Success)
        ))
      }
    }
    "there are no power that can build units" should {
      "skip build phase." in {
        val board =
          new Board[T, map.Power](
            map.map,
            1901.Autumn - Movement,
            Set(
              DiplomacyUnit(France, Army, Bre),
              DiplomacyUnit(Germany, Army, Mun)
            ), Map(Bre.province -> France, Mun.province -> Germany), Map(), Map()
          )
        val ruleHelper = StandardRuleOrderHelper(board)
        import ruleHelper._

        val Right(result) = rule.resolve(board, Set(A(Bre).hold(), A(Mun).hold()))
        result.board should be (board.copy(state = 1902.Spring - Movement))
      }
    }
    "all build and disband orders are automatically decidable" should {
      "skip build phase." in {
        val board =
          new Board[T, map.Power](
            map.map,
            1901.Autumn - Movement,
            Set(
              DiplomacyUnit(France, Army, Gas),
              DiplomacyUnit(Germany, Army, Mun)
            ), Map(Gas.province -> France, Mun.province -> Germany), Map(), Map()
          )
        val ruleHelper = StandardRuleOrderHelper(board)
        import ruleHelper._

        val Right(result) = rule.resolve(board, Set(A(Gas).hold(), A(Mun).hold()))
        result.board should be (board.copy(
          state = 1902.Spring - Movement,
          units = Set(DiplomacyUnit(Germany, Army, Mun))
        ))
        result.result should be(Set(
          new Executed(A(Gas).hold(), Result.Success),
          new Executed(A(Gas).disband(), Result.Success),
          new Executed(A(Mun).hold(), Result.Success)
        ))
      }
    }
    "a power controls half of supply centers" should {
      "finish the game." in {
        val board =
          new Board[T, map.Power](
            map.map, 1901.Autumn - Movement,
            Set(),
            Map(
              StP.province -> France,
              Swe.province -> France,
              Nwy.province -> France,
              Den.province -> France,
              Lvp.province -> France,
              Edi.province -> France,
              Lon.province -> France,
              Ber.province -> France,
              Kie.province -> France,
              Mun.province -> France,
              Hol.province -> France,
              Bel.province -> France,
              Bre.province -> France,
              Par.province -> France,
              Mar.province -> France,
              Spa.province -> France,
              Por.province -> France,
              Tun.province -> France
            ),
            Map(), Map()
          )
        val $ = StandardRuleOrderHelper(board)
        import $._

        val Right(result) = rule.resolve(board, Set())
        result.isFinished should be(true)
      }
    }
  }
}
