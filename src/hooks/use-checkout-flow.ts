import { useQueryState, parseAsString } from 'nuqs'

export function useCheckoutFlow() {
  const [plan, setPlan] = useQueryState('plan', parseAsString)
  const [interval, setInterval] = useQueryState('interval', parseAsString.withDefault('monthly'))

  function clearCheckoutParams() {
    setPlan(null)
    setInterval(null)
  }

  return {
    plan,
    interval,
    setPlan,
    setInterval,
    clearCheckoutParams
  }
}
