import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { ContestCreated } from "../generated/schema"
import { ContestCreated as ContestCreatedEvent } from "../generated/ospexCOR/ospexCOR"
import { handleContestCreated } from "../src/ospex-cor"
import { createContestCreatedEvent } from "./ospex-cor-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let contestId = BigInt.fromI32(234)
    let rundownId = "Example string value"
    let sportspageId = "Example string value"
    let jsonoddsId = "Example string value"
    let contestCreator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let contestCriteria = BigInt.fromI32(234)
    let newContestCreatedEvent = createContestCreatedEvent(
      contestId,
      rundownId,
      sportspageId,
      jsonoddsId,
      contestCreator,
      contestCriteria
    )
    handleContestCreated(newContestCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("ContestCreated created and stored", () => {
    assert.entityCount("ContestCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ContestCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "contestId",
      "234"
    )
    assert.fieldEquals(
      "ContestCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "rundownId",
      "Example string value"
    )
    assert.fieldEquals(
      "ContestCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sportspageId",
      "Example string value"
    )
    assert.fieldEquals(
      "ContestCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "jsonoddsId",
      "Example string value"
    )
    assert.fieldEquals(
      "ContestCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "contestCreator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ContestCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "contestCriteria",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
