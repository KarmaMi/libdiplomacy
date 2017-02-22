import { Variant } from "../variant"
import { Unit, Board, Rule, MilitaryBranch, State, Phase, ProvinceStatus } from "./rule/module"
import { Power, map, locations as $ } from "./map/module"
import { Turn, Season } from "./board/module"
import { Province } from "./../../board/module"

const { Army, Fleet } = MilitaryBranch

const board = new Board(
  map, new State(new Turn(1901, Season.Spring), Phase.Movement),
  [
    new Unit(Army, $.Vie, Power.Austria), new Unit(Army, $.Bud, Power.Austria),
    new Unit(Fleet, $.Tri, Power.Austria),
    new Unit(Fleet, $.Edi, Power.England), new Unit(Fleet, $.Lon, Power.England),
    new Unit(Army, $.Lvp, Power.England),
    new Unit(Fleet, $.Bre, Power.France), new Unit(Army, $.Mar, Power.France),
    new Unit(Army, $.Par, Power.France),
    new Unit(Fleet, $.Kie, Power.Germany), new Unit(Army, $.Ber, Power.Germany),
    new Unit(Army, $.Mun, Power.Germany),
    new Unit(Army, $.Ven, Power.Italy), new Unit(Army, $.Rom, Power.Italy),
    new Unit(Fleet, $.Nap, Power.Italy),
    new Unit(Fleet, $.Sev, Power.Russia), new Unit(Army, $.Mos, Power.Russia),
    new Unit(Army, $.War, Power.Russia), new Unit(Fleet, $.StP_SC, Power.Russia),
    new Unit(Army, $.Smy, Power.Turkey), new Unit(Army, $.Con, Power.Turkey),
    new Unit(Fleet, $.Ank, Power.Turkey)
  ],
  [],
  <Array<[Province<Power>, ProvinceStatus<Power>]>>([...map.provinces].map(p => {
    if (p.homeOf) {
      return [p, new ProvinceStatus(p.homeOf, false)]
    } else {
      return null
    }
  }).filter(x => x))
)

export const variant = new Variant(new Rule(), board)