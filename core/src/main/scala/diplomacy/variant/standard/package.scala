package diplomacy.variant

import diplomacy.board._
import diplomacy.variant.standard.map
import diplomacy.variant.standard.map._
import diplomacy.variant.standard.rule._

package object standard {
  private[this] val initialBoard =
    Board[State[map.Turn], Power.Power, MilitaryBranch.MilitaryBranch, UnitStatus.UnitStatus, ProvinceStatus.ProvinceStatus](
      map.map,
      1901.Spring - Movement,
      units = Set(
        DiplomacyUnit(Austria, Army, Vie), DiplomacyUnit(Austria, Army, Bud), DiplomacyUnit(Austria, Fleet, Tri),
        DiplomacyUnit(England, Army, Lvp), DiplomacyUnit(England, Fleet, Edi), DiplomacyUnit(England, Fleet, Lon),
        DiplomacyUnit(France, Army, Mar),  DiplomacyUnit(France, Army, Par),  DiplomacyUnit(France, Fleet, Bre),
        DiplomacyUnit(Germany, Army, Ber), DiplomacyUnit(Germany, Army, Mun), DiplomacyUnit(Germany, Fleet, Kie),
        DiplomacyUnit(Italy, Army, Ven),   DiplomacyUnit(Italy, Army, Rom),   DiplomacyUnit(Italy, Fleet, Nap),
        DiplomacyUnit(Russia, Army, Mos),  DiplomacyUnit(Russia, Army, War),
        DiplomacyUnit(Russia, Fleet, Sev), DiplomacyUnit(Russia, Fleet, StP_SC),
        DiplomacyUnit(Turkey, Army, Smy),  DiplomacyUnit(Turkey, Army, Con),  DiplomacyUnit(Turkey, Fleet, Ank)
      ),
      occupation = (map.map.provinces collect {
        case p@ Province(_, Some(home), _) => p -> home
      }).toMap,
      Map(),
      Map()
  )

    private[this] val rule = new Rule[map.Turn, map.Power](_ match {
      case map.Turn(year, Spring) => map.Turn(year, Autumn)
      case map.Turn(year, Autumn) => map.Turn(year + 1, Spring)
      case _ => ???
    })

  val variant = Variant(rule, initialBoard)
}
