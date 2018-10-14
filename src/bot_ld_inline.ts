/**
 * Dynamically inject linked-data for bots.
 */

if (/bot|crawl|spider/i.test(navigator.userAgent)) {
  ajax('ld.json', false, text => {
    let script = document.createElement('script')
    script.type = 'application/ld+json'
    setTextContent(script, text)
    $body.appendChild(script)
  })
}
