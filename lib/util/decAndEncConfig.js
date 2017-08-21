'use strict'

var serverPrivateKey = '-----BEGIN RSA PRIVATE KEY-----\n'+
    'MIICXAIBAAKBgQCcgzMGh8wVeUxVxsXLt6hOxwSVG8rzEpuCtxExQRpSXkd++4G4\n'+
    '8nYEoFGuqDvcSY2KnJQgXHkhuIdWW4ENbPOkutapSNRksPk7StSDLTfJ2JZOj8jq\n'+
    '3B08M7qKVdr3KXzHMAcvVnkwyaoYs86xjGHYPeGkvV6hLklwYHZq6nV7KQIDAQAB\n'+
    'AoGARceM4VV8HPrWmMuldh0s8epzVZNtmY/rO40pIh+Xf6+/CpNRk8at7YQYxtkE\n'+
    'z0MP0wPaWs8/xlQCKvNjBzxTJ6UL4MYbHgzwyoOP4kbIFi1fmVwn2HRCvSe9tfkK\n'+
    'vAekNw0nvPG9w0e9Ing2xLZQHXLFHupnXjZBMiksJfW6hbECQQDMFmiIT9pBkofv\n'+
    'jvjbn0Lduc+ZFGCQQrksbVIIEMUupTERNwcOJ2viCvM8nRfrhpO9p+Ao04iSSvMY\n'+
    'JHwmxeVNAkEAxFLXhMrFXS3GDx9k/T8VD1R36/HEua0h/dcpiwRnzoZTsCHE5cGH\n'+
    'mMGn4FZmE075F6K0yZ4YIXrEOrF+CoAPTQJBAJPg3MeAjNYcldD4WMvSP4InxAvY\n'+
    'nwuIvWI6qEjd1fKxkbc2ly8jU2GLq6nM7msjrWOsA5mxhPDzy+c/cJIrrLUCQDts\n'+
    'i9mg+r5qhYG8UfgpqPk76xSa2J4PHrPT9bojejxUAm7UueGFg8KkE2lfHYSIqfMS\n'+
    'h8BjPxCbNVxCr1EEVB0CQGGQzVYrHFl/oC90kr1dkMNEnbp/Myx7+Fv6ZeO3OIXa\n'+
    '9tvPOuNUZZTWTccoEMMmS1Nsr9tOwoOZUd2e/rpVAsI=\n'+
    '-----END RSA PRIVATE KEY-----';

var serverPublicKey =  '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCcgzMGh8wVeUxVxsXLt6hOxwSV\n'+
    'G8rzEpuCtxExQRpSXkd++4G48nYEoFGuqDvcSY2KnJQgXHkhuIdWW4ENbPOkutap\n'+
    'SNRksPk7StSDLTfJ2JZOj8jq3B08M7qKVdr3KXzHMAcvVnkwyaoYs86xjGHYPeGk\n'+
    'vV6hLklwYHZq6nV7KQIDAQAB\n'+
    '-----END PUBLIC KEY-----';

var clientPublicKey = '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQacK3XhQ3TF3QBhNhwPpWGnQd\n' +
    'xzT6/vWeHF5mBEXjXpE5BNDYY3OqTrg8qYSvGOF/D8ujK7CHz9BI0KPm13kQfGSi\n' +
    'Jn/P8mSCb0Rt7tsueP0vfqsgmMddblIplQLJTZMMdFQxxF19guGtsp0UqVx0BiVp\n' +
    'Pe6wyeBJx60LwGIyhwIDAQAB\n' +
    '-----END PUBLIC KEY-----';

var clientPrivateKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIICXgIBAAKBgQCQacK3XhQ3TF3QBhNhwPpWGnQdxzT6/vWeHF5mBEXjXpE5BNDY\n' +
    'Y3OqTrg8qYSvGOF/D8ujK7CHz9BI0KPm13kQfGSiJn/P8mSCb0Rt7tsueP0vfqsg\n' +
    'mMddblIplQLJTZMMdFQxxF19guGtsp0UqVx0BiVpPe6wyeBJx60LwGIyhwIDAQAB\n' +
    'AoGAelsRXll4mW27onAzZcSiledt8HkC+5Kfumng1WDTchSCyKO660xACNEPql4a\n' +
    'jFxxWj2g1MxEkp1RpRAZfpGcAUQLmmwgMEB4D0ChHwz9UvqOQXxIFNLy/pTTC0Qi\n' +
    '5XnHNFixqCb+/JJ8kpadv09wSk5HGWaJkul62oFf9YvQLFkCQQDPohH2nZP9SLwT\n' +
    'Zl/jy2z/+DBQxq96WypfQGiRm7m54+nwHkJ1PdNlF2q8Bhjwc3FSUr3Mt7U4s134\n' +
    'HCO/uxtbAkEAsg2mcUr3W1LVSeYpTvTsbZgMiHSx+2OomeAfdxEZAbBjZg3inkrV\n' +
    'Wajgpp3j1JxzsgOIKSeh+AsKIwL3mIrpRQJBAMay5ZfpUt9XxMyX8vnvCf+nhq02\n' +
    'hmWEavc+jxORQFp5lr14Z8cFBJFAqJ8JAsLQ50iN8B7CS4XYePvgCgIIz/MCQQCF\n' +
    'NvNFpkoFOKc9oAdd/J97q5wM6ApVxI1bezTvd4pXGip0K4VW2zRe3Zwe7NiNtPRW\n' +
    'xo+0AuQK2e+enFS0+5FlAkEAuTG29/3wckL4wQD0K9FysCkFrIIX2QiLQaUIxkwl\n' +
    '3NEmNRJWLaMIgwzGoQbf92bENsUv5IBP8CortABBvNG5bg==\n' +
    '-----END RSA PRIVATE KEY-----';

var appId = "9943462d0d28";

var appScrect = "2722ffbbd2584f10"

exports.decAndEncConfig = {
    getServerPrivateKey: function () {
        return serverPrivateKey;
    },

    getServerpublicKey: function () {
        return serverPublicKey;
    },
    getClientPublicKey: function () {
        return clientPublicKey;
    },
    getClientPrivateKey: function () {
        return clientPrivateKey
    },
    getAppId: function() {
        return appId;
    },
    getAppScrect: function() {
        return appScrect;
    }
};