import {
  ContestCreated,
  ContestScored
} from "../generated/ospexCOR/ContestOracleResolved"
import {
  SpeculationCreated,
  SpeculationLocked,
  SpeculationScored,
  PositionCreated,
  Claim
} from "../generated/ospexCFP/CFPv1"
import { BigInt, Address } from '@graphprotocol/graph-ts'

import { Contest, Speculation, Position, User } from "../generated/schema"

import leagueLegend from "./leagueLegend"
import teamLegend from "./teamLegend"

class ContestStatus {
  static Unverified: string = "Unverified"
  static Verified: string = "Verified"
  static Scored: string = "Scored"
  static NotMatching: string = "NotMatching"
  static ScoredManually: string = "ScoredManually"
  static RequiresConfirmation: string = "RequiresConfirmation"
  static Void: string = "Void"
}

class WinSide {
  static TBD: string = "TBD"
  static Away: string = "Away"
  static Home: string = "Home"
  static Over: string = "Over"
  static Under: string = "Under"
  static Push: string = "Push"
  static Forfeit: string = "Forfeit"
  static Invalid: string = "Invalid"
  static Void: string = "Void"
}

class SpeculationStatus {
  static Open: string = "Open"
  static Locked: string = "Locked"
  static Closed: string = "Closed"
}

class PositionTypeSpecified {
  static Away: string = "Away"
  static Home: string = "Home"
  static Over: string = "Over"
  static Under: string = "Under"
}

const totalAddress = Address.fromString("0x4be070cb3f4c6ce07fec0586e3d7453b5dce33e3")

export function handleContestCreated(event: ContestCreated): void {

  const id = event.params.contestId
  const contest = new Contest(id.toString())

  contest.contestCreator = event.params.contestCreator
  contest.rundownId = event.params.rundownId
  contest.sportspageId = event.params.sportspageId
  contest.jsonoddsId = event.params.jsonoddsId
  contest.contestCreationId = event.params.contestCriteria.toString()
  contest.leagueId = <i32>parseInt(contest.contestCreationId!.substr(0, 1))
  contest.awayTeamId = <i32>parseInt(contest.contestCreationId!.substr(1, 4))
  contest.homeTeamId = <i32>parseInt(contest.contestCreationId!.substr(5, 4))
  contest.eventTime = <i32>parseInt(contest.contestCreationId!.substr(9))
  contest.contestStatus = ContestStatus.Verified

  for (let i = 0; i < leagueLegend.length; i++) {
    if (leagueLegend[i].id === contest.leagueId) {
      contest.league = leagueLegend[i].league
      break
    }
  }

  for (let i = 0; i < teamLegend.length; i++) {
    if (teamLegend[i].leagueId === contest.leagueId && teamLegend[i].id === contest.awayTeamId) {
      contest.awayTeam = teamLegend[i].team
      break
    }
  }

  for (let i = 0; i < teamLegend.length; i++) {
    if (teamLegend[i].leagueId === contest.leagueId && teamLegend[i].id === contest.homeTeamId) {
      contest.homeTeam = teamLegend[i].team
      break
    }
  }

  contest.save()
}

export function handleContestScored(event: ContestScored): void {

  const id = event.params.contestId
  let contest = Contest.load(id.toString())

  if (contest) {
    contest.awayScore = <i32>parseInt(event.params.awayScore.toString())
    contest.homeScore = <i32>parseInt(event.params.homeScore.toString())
    contest.contestStatus = ContestStatus.Scored
    contest.save()
  }
}

export function handleSpeculationCreated(event: SpeculationCreated): void {

  const id = event.params.speculationId
  const speculation = new Speculation(id.toString())

  speculation.lockTime = <i32>parseInt(event.params.lockTime.toString())
  speculation.speculationScorer = event.params.speculationScorer
  speculation.theNumber = event.params.theNumber
  speculation.speculationCreator = event.params.speculationCreator
  speculation.contest = event.params.contestId.toString()
  speculation.contestId = event.params.contestId.toString()
  speculation.upperAmount = new BigInt(0)
  speculation.lowerAmount = new BigInt(0)
  speculation.winSide = WinSide.TBD
  speculation.speculationStatus = SpeculationStatus.Open

  speculation.save()
}

export function handleSpeculationLocked(event: SpeculationLocked): void {
  const id = event.params.speculationId
  let speculation = Speculation.load(id.toString())

  if (speculation) {
    speculation.speculationStatus = SpeculationStatus.Locked
    speculation.save()
  }
}

export function handleSpeculationScored(event: SpeculationScored): void {
  const id = event.params.speculationId
  let speculation = Speculation.load(id.toString())

  if (speculation) {
    speculation.speculationStatus = SpeculationStatus.Closed
    speculation.upperAmount = event.params.upperAmount
    speculation.lowerAmount = event.params.lowerAmount

    if (event.params.winSide === 1) {
      speculation.winSide = WinSide.Away
    } else if (event.params.winSide === 2) {
      speculation.winSide = WinSide.Home
    } else if (event.params.winSide === 3) {
      speculation.winSide = WinSide.Over
    } else if (event.params.winSide === 4) {
      speculation.winSide = WinSide.Under
    } else if (event.params.winSide === 5) {
      speculation.winSide = WinSide.Push
    } else if (event.params.winSide === 6) {
      speculation.winSide = WinSide.Forfeit
    } else if (event.params.winSide === 7) {
      speculation.winSide = WinSide.Invalid
    } else if (event.params.winSide === 8) {
      speculation.winSide = WinSide.Void
    }

    if (speculation.positionIds) {
      for (let i = 0; i < speculation.positionIds!.length; i++) {
        let positionId = speculation.positionIds![i]
        let position = Position.load(positionId)

        if (position) {
          let user = User.load(position.userId!)
          if (user) {
            user.totalClaimable = user.totalClaimable || new BigInt(0)
            user.totalLost = user.totalLost || new BigInt(0)
            user.totalPending = user.totalPending || new BigInt(0)
            user.wins = user.wins || 0
            user.losses = user.losses || 0
            user.ties = user.ties || 0
            user.net = user.net || new BigInt(0)

            user.totalPending = user.totalPending!.minus(position.amount!)

            let winnings = new BigInt(0)
            if (speculation.winSide == WinSide.Push || speculation.winSide == WinSide.Forfeit || speculation.winSide == WinSide.Invalid || speculation.winSide == WinSide.Void) {
              winnings = position.amount!
              user.ties += 1
            } else if (speculation.winSide != position.positionType) {
              user.totalLost = user.totalLost!.plus(position.amount!)
              user.losses += 1
              user.net = user.net!.minus(position.amount!)
            } else {
              let totalAmount = speculation.upperAmount!.plus(speculation.lowerAmount!)
              if ((speculation.winSide == WinSide.Away || speculation.winSide == WinSide.Over) &&
                (position.positionType == PositionTypeSpecified.Away || position.positionType == PositionTypeSpecified.Over)) {
                winnings = position.amount!.times(totalAmount).div(speculation.upperAmount!)
                user.wins += 1
                user.net = user.net!.plus(winnings)
                user.net = user.net!.minus(position.amount!)
              } else if ((speculation.winSide == WinSide.Home || speculation.winSide == WinSide.Under) &&
                (position.positionType == PositionTypeSpecified.Home || position.positionType == PositionTypeSpecified.Under)) {
                winnings = position.amount!.times(totalAmount).div(speculation.lowerAmount!)
                user.wins += 1
                user.net = user.net!.plus(winnings)
                user.net = user.net!.minus(position.amount!)
              }
            }
            user.totalClaimable = user.totalClaimable!.plus(winnings)
            user.save()
          }
        }
      }
    }
    speculation.save()
  }
}

export function handlePositionCreated(event: PositionCreated): void {
  const id = event.params.speculationId.toHex() + event.params.user.toHex() + event.params.positionType.toString()
  const speculationId = event.params.speculationId
  const userId = event.params.user.toHex()

  let speculation = Speculation.load(speculationId.toString())
  let position = Position.load(id)
  let user = User.load(userId)
  let type: string | null

  if (speculation) {
    let positionIds = speculation.positionIds
    if (!positionIds) {
      positionIds = []
    }
    if (!positionIds.includes(id)) {
      positionIds.push(id)
      speculation.positionIds = positionIds
    }
  }

  if (speculation && speculation.speculationScorer! == totalAddress && event.params.positionType === 0) {
    type = PositionTypeSpecified.Over
  } else if (speculation && speculation.speculationScorer! == totalAddress && event.params.positionType === 1) {
    type = PositionTypeSpecified.Under
  } else if (event.params.positionType === 0) {
    type = PositionTypeSpecified.Away
  } else if (event.params.positionType === 1) {
    type = PositionTypeSpecified.Home
  }

  if (speculation && event.params.positionType === 0) {
    speculation.upperAmount = speculation.upperAmount!.plus(event.params.amount)
  } else if (speculation && event.params.positionType === 1) {
    speculation.lowerAmount = speculation.lowerAmount!.plus(event.params.amount)
  }

  if (position) {
    position.amount! = position.amount!.plus(event.params.amount)
    position.contributedUponCreation = position.contributedUponCreation!.plus(event.params.contributionAmount)
  } else {
    position = new Position(id)
    position.speculation = event.params.speculationId.toString()
    position.speculationId = event.params.speculationId.toString()
    position.user = event.params.user.toHex()
    position.userId = event.params.user.toHex()
    position.amount = event.params.amount
    position.contributedUponCreation = event.params.contributionAmount
    if (type!) {
      position.positionType = type!
    }
    position.claimed = false
    position.amountClaimed = new BigInt(0)
  }

  if (!user) {
    user = new User(userId.toString())
    user.totalSpeculated = new BigInt(0)
    user.totalClaimed = new BigInt(0)
    user.totalClaimable = new BigInt(0)
    user.totalContributed = new BigInt(0)
    user.totalLost = new BigInt(0)
    user.totalPending = new BigInt(0)
  }

  user.totalSpeculated = user.totalSpeculated!.plus(event.params.amount)
  user.totalPending = user.totalPending!.plus(event.params.amount)
  if (event.params.contributionAmount.gt(new BigInt(0))) {
    user.totalContributed = user.totalContributed!.plus(event.params.contributionAmount)
  }

  position.save()
  speculation!.save()
  user.save()
}

export function handleClaim(event: Claim): void {

  const speculationId = event.params.speculationId
  let speculation = Speculation.load(speculationId.toString())
  let user = User.load(event.params.user.toHex())

  if (speculation) {
    let positionIds: string[] = []

    if (speculation.winSide == "Away" || speculation.winSide == "Over") {
      positionIds.push(event.params.speculationId.toHex() + event.params.user.toHex() + "0")
    } else if (speculation.winSide == "Home" || speculation.winSide == "Under") {
      positionIds.push(event.params.speculationId.toHex() + event.params.user.toHex() + "1")
    } else if (speculation.winSide == "Push" || speculation.winSide == "Forfeit" || speculation.winSide == "Invalid" || speculation.winSide == "Void") {
      positionIds.push(event.params.speculationId.toHex() + event.params.user.toHex() + "0")
      positionIds.push(event.params.speculationId.toHex() + event.params.user.toHex() + "1")
    }

    for (let i = 0; i < positionIds.length; i++) {
      let position = Position.load(positionIds[i])
      if (position) {
        position.claimed = true
        if (speculation.winSide == "Push" || speculation.winSide == "Forfeit" || speculation.winSide == "Invalid" || speculation.winSide == "Void") {
          position.amountClaimed = position.amount
          position.contributedUponClaim = positionIds[i].endsWith("0") ? event.params.contributionAmount : new BigInt(0)
        } else {
          position.amountClaimed = event.params.amount
          position.contributedUponClaim = event.params.contributionAmount
        }
        position.save()
      }
    }
  }

  if (user) {
    user.totalClaimed = user.totalClaimed!.plus(event.params.amount)
    user.totalClaimable = user.totalClaimable!.minus(event.params.amount)
    user.totalContributed = user.totalContributed!.plus(event.params.contributionAmount)
    if (event.params.contributionAmount.gt(new BigInt(0))) {
      user.totalClaimed = user.totalClaimed!.minus(event.params.contributionAmount)
    }
    user.save()
  }
}
