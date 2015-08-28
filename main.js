/******
 * Private Key PEM Encoding and Decoding
 ******/

var asn1 = require('asn1.js');
var BN = require('bn.js');
var EC = require('elliptic').ec;

var ECPrivateKey = asn1.define('ECPrivateKey', function() {
  this.seq().obj(
    this.key('version').int().def(new BN(1)),
    this.key('privateKey').octstr(),
    this.key('parameters').explicit(0).objid().optional(),
    this.key('publicKey').explicit(1).bitstr().optional()
  );
});

/******
 * Hand-crafted Private Key
 ******/

console.log('\n\n**************\nHand-crafted Private Key\n**************');

var secp256k1 = new EC('secp256k1');
var keypair = secp256k1.genKeyPair();
var sepc256k1CurveParameters = '1.3.132.0.10'.split('.');
var publicKey = new Buffer('04147b79e9e1dd3324ceea115ff4037b6c877c73777131418bfb2b713effd0f502327b923861581bd5535eeae006765269f404f5f5c52214e9721b04aa7d040a75', 'hex');
var publicKeyBitstr = { data: publicKey, unused: 0 };
var options = {label: 'EC PRIVATE KEY'};

var privateKeyHex = '844055cca13efd78ce79a4c3a4c5aba5db0ebeb7ae9d56906c03d333c5668d5b';
console.log('\nRaw private key (hex):')
console.log(privateKeyHex);

var privateKeyBuffer = new Buffer(privateKeyHex, 'hex');
//var privateKeyBuffer = new Buffer(keypair.getPrivate().toArray());
//var privateKeyBuffer = new Buffer(keypair.getPublic('bin'));
console.log('\nPrivate key buffer:')
console.log(privateKeyBuffer);

var encodedPrivateKey = ECPrivateKey.encode({
    privateKey: privateKeyBuffer,
    parameters: sepc256k1CurveParameters,
    publicKey: publicKeyBitstr
}, 'pem', options);

console.log('\nEncoded private key:')
console.log(encodedPrivateKey);

var decodedPrivateKey = ECPrivateKey.decode(encodedPrivateKey, 'pem', options);
console.log('\nDecoded private key:');
console.log(decodedPrivateKey);

/******
 * OpenSSL Private Key
 ******/

console.log('\n\n**************\nOpenSSL Private Key\n**************');

var encodedPrivateKey3 = '-----BEGIN EC PRIVATE KEY-----\n' +
'MHQCAQEEIIRAVcyhPv14znmkw6TFq6XbDr63rp1WkGwD0zPFZo1boAcGBSuBBAAK\n' +
'oUQDQgAEFHt56eHdMyTO6hFf9AN7bId8c3dxMUGL+ytxPv/Q9QIye5I4YVgb1VNe\n' +
'6uAGdlJp9AT19cUiFOlyGwSqfQQKdQ==\n' +
'-----END EC PRIVATE KEY-----';

var decodedPrivateKey3 = ECPrivateKey.decode(encodedPrivateKey3, 'pem', options);
console.log('\nDecoded private key:');
console.log(decodedPrivateKey3);

var decodedHexPrivateKey = decodedPrivateKey3.privateKey.toString('hex');
console.log('\nDecoded private Key (Hex):');
console.log(decodedHexPrivateKey);

var decodedHexPublicKey = decodedPrivateKey3.publicKey.data.toString('hex');
console.log('\nDecoded public key (Hex):');
console.log(decodedHexPublicKey);

var reencodedPrivateKey3 = ECPrivateKey.encode(decodedPrivateKey3, 'pem', options);
console.log('\nRe-encoded private key:');
console.log(reencodedPrivateKey3);