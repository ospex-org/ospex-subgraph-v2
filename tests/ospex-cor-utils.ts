import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  ContestCreated,
  ContestScored,
  OwnershipTransferRequested,
  OwnershipTransferred,
  RequestFulfilled,
  RequestSent,
  Response,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/ospexCOR/ospexCOR"

export function createContestCreatedEvent(
  contestId: BigInt,
  rundownId: string,
  sportspageId: string,
  jsonoddsId: string,
  contestCreator: Address,
  contestCriteria: BigInt
): ContestCreated {
  let contestCreatedEvent = changetype<ContestCreated>(newMockEvent())

  contestCreatedEvent.parameters = new Array()

  contestCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "contestId",
      ethereum.Value.fromUnsignedBigInt(contestId)
    )
  )
  contestCreatedEvent.parameters.push(
    new ethereum.EventParam("rundownId", ethereum.Value.fromString(rundownId))
  )
  contestCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "sportspageId",
      ethereum.Value.fromString(sportspageId)
    )
  )
  contestCreatedEvent.parameters.push(
    new ethereum.EventParam("jsonoddsId", ethereum.Value.fromString(jsonoddsId))
  )
  contestCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "contestCreator",
      ethereum.Value.fromAddress(contestCreator)
    )
  )
  contestCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "contestCriteria",
      ethereum.Value.fromUnsignedBigInt(contestCriteria)
    )
  )

  return contestCreatedEvent
}

export function createContestScoredEvent(
  contestId: BigInt,
  awayScore: BigInt,
  homeScore: BigInt
): ContestScored {
  let contestScoredEvent = changetype<ContestScored>(newMockEvent())

  contestScoredEvent.parameters = new Array()

  contestScoredEvent.parameters.push(
    new ethereum.EventParam(
      "contestId",
      ethereum.Value.fromUnsignedBigInt(contestId)
    )
  )
  contestScoredEvent.parameters.push(
    new ethereum.EventParam(
      "awayScore",
      ethereum.Value.fromUnsignedBigInt(awayScore)
    )
  )
  contestScoredEvent.parameters.push(
    new ethereum.EventParam(
      "homeScore",
      ethereum.Value.fromUnsignedBigInt(homeScore)
    )
  )

  return contestScoredEvent
}

export function createOwnershipTransferRequestedEvent(
  from: Address,
  to: Address
): OwnershipTransferRequested {
  let ownershipTransferRequestedEvent = changetype<OwnershipTransferRequested>(
    newMockEvent()
  )

  ownershipTransferRequestedEvent.parameters = new Array()

  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferRequestedEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferRequestedEvent
}

export function createOwnershipTransferredEvent(
  from: Address,
  to: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )

  return ownershipTransferredEvent
}

export function createRequestFulfilledEvent(id: Bytes): RequestFulfilled {
  let requestFulfilledEvent = changetype<RequestFulfilled>(newMockEvent())

  requestFulfilledEvent.parameters = new Array()

  requestFulfilledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return requestFulfilledEvent
}

export function createRequestSentEvent(id: Bytes): RequestSent {
  let requestSentEvent = changetype<RequestSent>(newMockEvent())

  requestSentEvent.parameters = new Array()

  requestSentEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )

  return requestSentEvent
}

export function createResponseEvent(
  requestId: Bytes,
  response: Bytes,
  err: Bytes
): Response {
  let responseEvent = changetype<Response>(newMockEvent())

  responseEvent.parameters = new Array()

  responseEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromFixedBytes(requestId)
    )
  )
  responseEvent.parameters.push(
    new ethereum.EventParam("response", ethereum.Value.fromBytes(response))
  )
  responseEvent.parameters.push(
    new ethereum.EventParam("err", ethereum.Value.fromBytes(err))
  )

  return responseEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}
