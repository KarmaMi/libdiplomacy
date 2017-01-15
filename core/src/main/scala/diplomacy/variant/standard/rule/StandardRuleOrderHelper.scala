package diplomacy.variant.standard.rule

import diplomacy.board.{ Power, Board, DiplomacyUnit }

trait StandardRuleOrderHelper[Turn_ <: Turn, Power_ <: Power] extends Rule.TypeHelper {
  final type Turn = Turn_
  final type Power = Power_

  protected[this] val board: Board

  def A(location: Location): DiplomacyUnit = this.unit(Army)(location)
  def F(location: Location): DiplomacyUnit = this.unit(Fleet)(location)

  private[this] def unit(militaryBranch: MilitaryBranch)(location: Location): DiplomacyUnit = {
    def getUnit(units: Set[DiplomacyUnit]): Option[DiplomacyUnit] = {
      units find { unit => unit.location == location && unit.militaryBranch == militaryBranch }
    }

    this.board.state.phase match {
      case Phase.Movement =>
        getUnit(this.board.units).get
      case Phase.Retreat =>
        getUnit(
          this.board.units filter { unit =>
            this.board.unitStatuses.get(unit) match {
              case Some(UnitStatus.Dislodged(_)) => true
              case _ => false
            }
          }
        ).get
      case Phase.Build =>
        getUnit(this.board.units) match {
          case Some(unit) => unit
          case None =>
            require(location.province.homeOf.isDefined)
            location.province.homeOf match {
              case Some(home) => DiplomacyUnit(home, militaryBranch, location)
              case _ => ???
            }
        }
      case _ => ???
    }
  }

  implicit class GenOrderToLocation(location: Location) {
    require(location.province.homeOf.isDefined)
    def build(tpe: MilitaryBranch) = location.province.homeOf match {
      case Some(home) => Order.Build(DiplomacyUnit(home, tpe, location))
      case _ => ???
    }
  }
  implicit class GenOrderToUnit(unit: DiplomacyUnit) {
    def hold() = Order.Hold(unit)
    def move(destination: Location) = Order.Move(unit, destination, false)
    def support(target: Order.Hold[Power]) = Order.Support(unit, Left(target))
    def support(target: Order.Move[Power]) = Order.Support(unit, Right(target))
    def convoy(target: Order.Move[Power]) = Order.Convoy(unit, target)

    def disband() = Order.Disband(unit)
    def retreat(destination: Location) = Order.Retreat(unit, destination)
  }
  implicit class AddViaConvoyToMove(move: Order.Move[Power]) {
    def viaConvoy = move.copy(useConvoy = true)
  }
}

object StandardRuleOrderHelper {
  def apply[Turn_ <: Turn, Power_ <: Power](
    target: Board[State[Turn_], Power_, MilitaryBranch.MilitaryBranch, UnitStatus.UnitStatus, ProvinceStatus.ProvinceStatus]
  ): StandardRuleOrderHelper[Turn_, Power_] = new StandardRuleOrderHelper[Turn_, Power_] {
    protected[this] lazy val board = target
  }
}