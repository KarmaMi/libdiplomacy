package diplomacy.board

case class Location[P <: Power, MB <: MilitaryBranch](
  province: Province[P], militaryBranches: Set[MB]
) {
  override def toString: String = this.province.toString
}