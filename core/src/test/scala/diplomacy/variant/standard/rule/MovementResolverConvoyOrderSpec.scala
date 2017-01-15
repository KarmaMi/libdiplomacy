package diplomacy.variant.standard.rule

import diplomacy.UnitSpec
import diplomacy.board._
import diplomacy.rule.OrderResult
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._

class MovementResolverConvoyOrderSpec extends UnitSpec {
  val resolver = new MovementResolver() {
    type Turn = map.Turn
    type Power = map.Power
  }
  val $$ = DiplomacyMapHelper(map.map)
  val orderHelper = new OrderHelper[map.Power]() {}
  import orderHelper._

  type Executed =
    OrderResult.Executed[resolver.Power, resolver.MilitaryBranch, resolver.Order, resolver.Result]

  "A movement-resolver" should {
    "handle DIAGRAM 19" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.England, $$.m.A, $$.Lon),
          DiplomacyUnit(Power.England, $$.m.F, $$.Nth)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Lon).move($.Nwy),
          $.F($.Nth).convoy($.A($.Lon).move($.Nwy))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Lon).move($.Nwy), Result.Success),
        new Executed($.F($.Nth).convoy($.A($.Lon).move($.Nwy)), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.England, $$.m.A, $$.Nwy),
          DiplomacyUnit(Power.England, $$.m.F, $$.Nth)
        )
      ))
    }

    "handle DIAGRAM 20" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.England, $$.m.A, $$.Lon),
          DiplomacyUnit(Power.England, $$.m.F, $$.Eng),
          DiplomacyUnit(Power.England, $$.m.F, $$.Mid),
          DiplomacyUnit(Power.England, $$.m.F, $$.Wes)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Lon).move($.Tun),
          $.F($.Eng).convoy($.A($.Lon).move($.Tun)),
          $.F($.Mid).convoy($.A($.Lon).move($.Tun)),
          $.F($.Wes).convoy($.A($.Lon).move($.Tun))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Lon).move($.Tun), Result.Success),
        new Executed($.F($.Eng).convoy($.A($.Lon).move($.Tun)), Result.Success),
        new Executed($.F($.Mid).convoy($.A($.Lon).move($.Tun)), Result.Success),
        new Executed($.F($.Wes).convoy($.A($.Lon).move($.Tun)), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.England, $$.m.A, $$.Tun),
          DiplomacyUnit(Power.England, $$.m.F, $$.Eng),
          DiplomacyUnit(Power.England, $$.m.F, $$.Mid),
          DiplomacyUnit(Power.England, $$.m.F, $$.Wes)
        )
      ))
    }

    "handle DIAGRAM 21" in {
      val board = new resolver.Board(
        map.map, State(Turn(1901, Season.Spring), Phase.Movement),
        Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Spa),
          DiplomacyUnit(Power.France, $$.m.F, $$.GoL),
          DiplomacyUnit(Power.France, $$.m.F, $$.Tyn),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Ion),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Tun)
        ),
        Map(), Map(), Map()
      )

      val $ = BoardHelper(board)
      val Right(result) = resolver(
        board,
        Set(
          $.A($.Spa).move($.Nap),
          $.F($.GoL).convoy($.A($.Spa).move($.Nap)),
          $.F($.Tyn).convoy($.A($.Spa).move($.Nap)),
          $.F($.Ion).move($.Tyn),
          $.F($.Tun).support($.F($.Ion).move($.Tyn))
        )
      )

      result.result should be(Set(
        new Executed($.A($.Spa).move($.Nap), Result.Failed),
        new Executed($.F($.GoL).convoy($.A($.Spa).move($.Nap)), Result.Failed),
        new Executed($.F($.Tyn).convoy($.A($.Spa).move($.Nap)), Result.Dislodged($.Ion.province)),
        new Executed($.F($.Ion).move($.Tyn), Result.Success),
        new Executed($.F($.Tun).support($.F($.Ion).move($.Tyn)), Result.Success)
      ))
      result.board should be(board.copy(
        state = State(Turn(1901, Season.Spring), Phase.Retreat),
        units = Set(
          DiplomacyUnit(Power.France, $$.m.A, $$.Spa),
          DiplomacyUnit(Power.France, $$.m.F, $$.GoL),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Tyn),
          DiplomacyUnit(Power.Italy, $$.m.F, $$.Tun)
        ),
        unitStatuses =
          Map($.F($.Tyn) -> UnitStatus.Dislodged($.Ion.province))
      ))
    }
  }
}