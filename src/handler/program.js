import createLogger from 'debug'
import {
  PROGRAM_INTRO_UTTERANCE,
  PROGRAM_DAY_PROMPT_UTTERANCE,
  PROGRAM_DAY_REPROMPT_UTTERANCE,
  INTRO_PROMPT_UTTERANCE,
  PROGRAM_DAY_INTRO_UTTERANCE_FRIDAY,
  PROGRAM_DAY_INTRO_UTTERANCE_SATURDAY,
  PROGRAM_DAY_INTRO_UTTERANCE_SUNDAY
} from '../constants'
import { wrapIn } from '../util'
import { say, elicit, getSlot } from '../alexa'

const debug = createLogger('alexa:GetProgram')

const daySpecificUtterances = {
  FRIDAY: PROGRAM_DAY_INTRO_UTTERANCE_FRIDAY,
  SATURDAY: PROGRAM_DAY_INTRO_UTTERANCE_SATURDAY,
  SUNDAY: PROGRAM_DAY_INTRO_UTTERANCE_SUNDAY
}

export default function programHandler({ request }) {
  const { slots } = request.intent
  const slot = getSlot(slots, 'Tag')

  debug('slots=%o', slots)
  debug('slots.Tag: %s', JSON.stringify(slot))

  if (!slot && request.dialogState === 'STARTED') {
    const speechOutput = [
      PROGRAM_INTRO_UTTERANCE,
      PROGRAM_DAY_PROMPT_UTTERANCE
    ].map(wrapIn('p')).join('')
    return {
      response: elicit(speechOutput, 'Tag')
        .reprompt(PROGRAM_DAY_REPROMPT_UTTERANCE)
        .valueOf()
    }
  }

  if (!slot) {
    return {
      response: elicit(PROGRAM_DAY_PROMPT_UTTERANCE, 'Tag')
        .reprompt(PROGRAM_DAY_PROMPT_UTTERANCE)
        .valueOf()
    }
  }

  debug('Requested canonicalSlot=%o', slot)

  // build output and emit
  const speechOutput = daySpecificUtterances[slot.id]
    .concat(INTRO_PROMPT_UTTERANCE)
    .map(wrapIn('p')).join('')

  return {
    response: say(speechOutput).valueOf()
  }
}