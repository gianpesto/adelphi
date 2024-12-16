/**
 * @type {import('vanilla-cookieconsent').CookieConsentConfig}
 */

import { optIn, optOut } from 'vue-gtag'

const config = {
  guiOptions: {
    consentModal: {
      layout: 'box inline',
      position: 'bottom right'
    },
    preferencesModal: {
      layout: 'box'
    }
  },

  // onFirstConsent: ({ cookie }) => {

  // },

  onConsent: ({ cookie }) => {
    if (cookie.categories.includes('analytics')) {
      optIn()
    }
  },

  onChange: ({ cookie }) => {
    if (cookie.categories.includes('analytics')) {
      optIn()
    } else {
      optOut()
    }
  },

  categories: {
    necessary: {
      readOnly: true,
      enabled: true
    },
    analytics: {
      autoClear: {
        cookies: [
          {
            name: /^(_ga|_gid)/
          }
        ]
      }
    }
  },

  language: {
    default: 'de',

    translations: {
      de: {
        consentModal: {
          title: 'Cookies!',
          description:
            'Wir möchten unsere Webseite fortlaufend optimal gestalten und verbessern. Bitte erlauben Sie uns daher die Verwendung von Cookies.',
          acceptAllBtn: 'Alle Akzeptieren',
          acceptNecessaryBtn: 'Ablehnen',
          showPreferencesBtn: 'Einstellungen',
          closeIconLabel: 'Ablehnen und schließen',
          footer: `
                      <a target="_blank" href="https://naturpark-lueneburger-heide.de/datenschutz">Datenschutzerklärung</a>
                      <a target="_blank" href="https://naturpark-lueneburger-heide.de/impressum">Impressum</a>
                  `
        },
        preferencesModal: {
          title: 'Cookie-Einstellungen',
          acceptAllBtn: 'Alle akzeptieren',
          acceptNecessaryBtn: 'Alle ablehnen',
          savePreferencesBtn: 'Einstellungen speichern',
          sections: [
            {
              title: 'Cookie Kategorien',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. For more details, refer to our <a href="#" class="cc__link">privacy policy</a>.'
            },
            {
              title: 'erforderliche Cookies',
              description:
                'Diese Cookies sind notwendig, um die grundlegenden Funktionen der Website zu ermöglichen.',
              linkedCategory: 'necessary'
            },
            {
              title: 'Leistungs- und Analyse-Cookies',
              description:
                'Diese Cookies helfen uns zu verstehen, wie die Website genutzt wird, und verbessern dadurch Ihre Benutzererfahrung. Sie können diese Cookies aktivieren oder deaktivieren.',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Cookie',
                  domain: 'Domain',
                  desc: 'Description'
                },
                body: [
                  {
                    name: '_ga',
                    domain: 'yourdomain.com',
                    desc: 'description ...'
                  },
                  {
                    name: '_gid',
                    domain: 'yourdomain.com',
                    desc: 'description ...'
                  }
                ]
              }
            },
            {
              title: 'More information',
              description:
                'For any queries in relation to our policy on cookies and your choices, please <a class="cc__link" href="#yourdomain.com">contact me</a>.'
            }
          ]
        }
      }
    }
  }
}

export default config
