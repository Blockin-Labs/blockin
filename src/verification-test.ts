import algosdk, { signBytes } from 'algosdk';
import { createChallenge } from './index';
import { verifyChallenge } from './verification';

async function testVerificationFunctions() {
    // Generate a fake account for testing purposes
    const newAccount = algosdk.generateAccount();
    console.log("0) GENERATE FAKE ACCOUNT TO USE");
    console.log("Generating a new Algorand public/private key pair...")
    console.log("Address:", newAccount.addr);
    console.log("Secret Key (bytes):", newAccount.sk.toLocaleString());

    //generate the challenge
    console.log("\n\n1) GENERATE CHALLENGE:");
    const originalChallenge = await createChallenge(
        'https://vt.edu',
        'Blockin would like you to verify ownership of your ASAs.',
        newAccount.addr,
        '',
        undefined,
        undefined,
        ['13365375']
    );
    console.log("\"" + originalChallenge + "\"");
    const originalChallengeToUint8Array = new TextEncoder().encode(originalChallenge);
    const signedBytes = algosdk.signBytes(originalChallengeToUint8Array, newAccount.sk);

    //sign the bytes and verify
    console.log("\n\n2) SIGN BYTES USING SECRET KEY");
    console.log("Signed Challenge (bytes):", signedBytes.toLocaleString());


    // const verified = await verifyChallenge(originalChallenge, signedBytes);

    const verified = await verifyChallenge(`{"name":"Transaction","tag":{"type":"Buffer","data":[84,88]},"from":{"publicKey":{"0":106,"1":224,"2":167,"3":82,"4":210,"5":111,"6":145,"7":212,"8":113,"9":188,"10":183,"11":207,"12":0,"13":90,"14":180,"15":68,"16":71,"17":46,"18":166,"19":15,"20":59,"21":72,"22":248,"23":124,"24":78,"25":84,"26":123,"27":137,"28":128,"29":176,"30":97,"31":198},"checksum":{"0":69,"1":33,"2":41,"3":228}},"to":{"publicKey":{"0":106,"1":224,"2":167,"3":82,"4":210,"5":111,"6":145,"7":212,"8":113,"9":188,"10":183,"11":207,"12":0,"13":90,"14":180,"15":68,"16":71,"17":46,"18":166,"19":15,"20":59,"21":72,"22":248,"23":124,"24":78,"25":84,"26":123,"27":137,"28":128,"29":176,"30":97,"31":198},"checksum":{"0":69,"1":33,"2":41,"3":228}},"amount":0,"note":{"0":104,"1":116,"2":116,"3":112,"4":115,"5":58,"6":47,"7":47,"8":118,"9":116,"10":46,"11":101,"12":100,"13":117,"14":32,"15":119,"16":97,"17":110,"18":116,"19":115,"20":32,"21":121,"22":111,"23":117,"24":32,"25":116,"26":111,"27":32,"28":115,"29":105,"30":103,"31":110,"32":32,"33":105,"34":110,"35":32,"36":119,"37":105,"38":116,"39":104,"40":32,"41":121,"42":111,"43":117,"44":114,"45":32,"46":65,"47":108,"48":103,"49":111,"50":114,"51":97,"52":110,"53":100,"54":32,"55":97,"56":99,"57":99,"58":111,"59":117,"60":110,"61":116,"62":58,"63":10,"64":48,"65":120,"66":49,"67":50,"68":52,"69":53,"70":10,"71":10,"72":66,"73":108,"74":111,"75":99,"76":107,"77":105,"78":110,"79":10,"80":10,"81":85,"82":82,"83":73,"84":58,"85":32,"86":10,"87":86,"88":101,"89":114,"90":115,"91":105,"92":111,"93":110,"94":58,"95":32,"96":49,"97":10,"98":67,"99":104,"100":97,"101":105,"102":110,"103":32,"104":73,"105":68,"106":58,"107":32,"108":49,"109":10,"110":78,"111":111,"112":110,"113":99,"114":101,"115":58,"116":32,"117":50,"118":48,"119":54,"120":54,"121":56,"122":54,"123":53,"124":56,"125":10,"126":73,"127":115,"128":115,"129":117,"130":101,"131":100,"132":32,"133":65,"134":116,"135":58,"136":32,"137":50,"138":48,"139":50,"140":50,"141":45,"142":48,"143":51,"144":45,"145":51,"146":48,"147":84,"148":49,"149":56,"150":58,"151":51,"152":51,"153":58,"154":52,"155":50,"156":46,"157":49,"158":48,"159":54,"160":90},"type":"pay","flatFee":false,"genesisHash":{"type":"Buffer","data":[72,99,181,24,164,179,200,78,200,16,242,45,79,16,129,203,15,113,240,89,167,172,32,222,198,47,127,112,229,9,58,34]},"fee":1000,"firstRound":20668657,"lastRound":20669657,"genesisID":"testnet-v1.0","appArgs":[],"lease":{}}`, signedBytes);


    console.log("");
    if (verified === `Successfully granted access via Blockin`) {
        console.log(verified);
    } else {
        console.log('Error while granting access via Blockin');
        console.log(verified);
    }
}

testVerificationFunctions();