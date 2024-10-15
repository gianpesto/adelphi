export function loadPayPalSdk(clientId) {
  return new Promise((resolve, reject) => {
    if (window.paypal) {
      resolve(window.paypal) // SDK is already loaded
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
    script.onload = () => resolve(window.paypal)
    script.onerror = reject
    document.head.appendChild(script)
  })
}
