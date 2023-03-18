const ethers = require("ethers");
//donate: 0xF5e46C10D5Ff948a9b02070062441A3991688590

const mnemonic = '313131313'; //privatekey without 0, CHANGE THIS
const provider = new ethers.providers.JsonRpcProvider('https://xxx.xxxx'); //http private node lebih gud, CHANGE THIS
const wallet = new ethers.Wallet(mnemonic, provider);
const iface = new ethers.utils.Interface(['function transfer(address to, uint256 amount)'])

//const account = wallet.connect(provider);
const eth_wei_minimal = ethers.utils.parseUnits('0.001'); //change this, line 22, CHANGE THIS
const rawr = iface.encodeFunctionData("transfer", [
    "0xF5e46C10D5Ff948a9b02070062441A3991688590", // change to your receiver ARB token, CHANGE THIS
    ethers.utils.parseUnits("10250", "ether") // your $ARB token value, manual ok? example is 10.250 ARB, CHANGE THIS
]);

(async () => {
    var counter = 0;
    var done = 0;
    var errors = 0;

    while (true) {
        counter++;
        if (Number(await provider.getBalance(wallet.address)) > eth_wei_minimal) { //line 9
    try {
       //============== CLAIM ARB =============\\
        const nonce = await provider.getTransactionCount(wallet.address); //better manual, CHANGE THIS

        const tx = {
            to: "0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9", //0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9 address claim ARB
            value: ethers.utils.parseEther("0".toString()),
            data: "0x4e71d92d", //function claim()
            nonce: nonce,
            gasPrice: ethers.utils.parseUnits('0.123', 'gwei'),
        };


        const recipt = await wallet.sendTransaction(tx);
        console.log(`tx claim = https://arbiscan.io/tx/${recipt.hash}`);


//============== SENDING ARB =============\\
//only 1-3 block (ping rpc < 20ms)
        const tx2 = {
            to: "0x912CE59144191C1204E64559FE8253a0e49E6548", //0x912CE59144191C1204E64559FE8253a0e49E6548 address token
            value: ethers.utils.parseEther("0".toString()),
            data: rawr, //data pake rawr line 11
            nonce: nonce+1,
            gasPrice: ethers.utils.parseUnits('0.123', 'gwei'),
        };


        const recipt2 = await wallet.sendTransaction(tx2);
        console.log(`tx2 send = https://arbiscan.io/tx/${recipt2.hash}`);
        done++;
        process.exit(0); //end

    } catch (err) {
        //  console.log(err);
        console.error(`tx ERROR`);
        errors++;

    }
}}
})();
