import {useMoralis} from "react-moralis";
import {useState} from "react";
import {accountAddress} from "../../states";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import web3 from "web3";
import Button from "@mui/material/Button";
import {ethers} from "ethers";
import {abi as BundleAbi} from "../../contracts/Bundle.json";
import IERC721 from "../../contracts/IERC20.json"

const style = {
    position: 'absolute',
    top: '50%',
    backgroundColor: "white",
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    p: 4,
    alignContent: "center",
}
const fieldStyle = {
    margin: "10px",
    width: "500px"
}

function getRandomNumberBetween(min, max) {
    max = parseFloat(max).toFixed(3)
    min = parseFloat(min).toFixed(3)
    return parseFloat(Math.random() * (max - min) + min).toFixed(3)
}

export default function CreateNewCollection({address = ""}) {

    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    const [erc20Address, seterc20Address] = useState(null)
    const [erc721Address, seterc721Address] = useState(null)
    const [erc20Amt, setErc20amt] = useState(0);
    const [redeemPrice, setredeemPrice] = useState(0);
    const [min20, setminerc20] = useState(0);

    const submit = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(address, BundleAbi, provider);
            const bundleLength = web3.utils.toBN(await contract.MAX_SUPPLY()).toNumber();
            const emptyCrate = [false, false, "0x0000000000000000000000000000000000000000", [], "0x0000000000000000000000000000000000000000", 0]
            let hasERC20 = false;
            let hasERC721 = false;
            if (erc20Amt < min20 * bundleLength) {
                alert("invalid min config")
            }
            if (erc20Address != null || erc20Address != "") {
                const ERC20COntract = new ethers.Contract(erc20Address, IERC721, provider);
                const connectTxn = await ERC20COntract.connect(signer).approve(
                    address,
                    web3.utils.toWei(`${erc20Amt}`, "ether").toString()
                )
                hasERC20 = true;
                await connectTxn.wait()
            }
            let BundleArray = []

            if (hasERC20 || hasERC721) {
                let total = erc20Amt - (bundleLength * min20);
                total = parseFloat(total).toFixed(3)
                while (total > 0) {
                    let amt = getRandomNumberBetween(0.000, total);
                    console.log(amt)
                    if (BundleArray.length >= bundleLength - 1) {
                        BundleArray.push([false, true, "0x0000000000000000000000000000000000000000", [], erc20Address, total]);
                        break
                    }
                    if (amt < total && amt > 0) {
                        BundleArray.push([false, true, "0x0000000000000000000000000000000000000000", [], erc20Address, amt]);
                        total -= amt;
                        total = total.toFixed(3)
                    } else {
                        BundleArray.push([false, true, "0x0000000000000000000000000000000000000000", [], erc20Address, total]);
                        break;
                    }
                }

            }
            console.log(BundleArray.length, bundleLength)
            if (BundleArray.length < bundleLength) {
                while (BundleArray.length < bundleLength) {
                    BundleArray.push(emptyCrate)
                }
            }
            for (let i = 0; i < BundleArray.length; i++) {
                let val = BundleArray[i][5];
                let sum = parseFloat(parseFloat(val).toFixed(3) + parseFloat(min20).toFixed(3)).toFixed(3)
                BundleArray[i][5] = web3.utils.toWei(`${sum}`, "ether").toString()
            }
            console.log(BundleArray.length, bundleLength)
            if (BundleArray.length === bundleLength) {
                const bundleTxn = await contract.connect(signer).newCycle(BundleArray, web3.utils.toWei(redeemPrice, "ether"));
                await bundleTxn.wait();
                alert("Updated bundle")
            }
        } catch (err) {
            alert(err?.data?.message)
        }


    }
    return (
        <Box sx={style}>
            <Typography variant="h6" component="h2">
                Create New Bundle
            </Typography>
            <FormControl
                variant="standard"
                sx={{width: "200px", margin: "10px"}}
            >
                <TextField id="outlined-basic" label="ERC20 Address" sx={fieldStyle} variant="outlined"
                           onChange={(v) => {
                               seterc20Address(v.target.value)
                           }}/>
                <TextField id="outlined-basic" label="ERC721 Address" sx={fieldStyle} variant="outlined"
                           onChange={(v) => {
                               seterc721Address(v.target.value)
                           }}/>
                <TextField id="outlined-basic" label="ERC20 Amount" sx={fieldStyle} type="number" variant="outlined"
                           onChange={(v) => {
                               setErc20amt(v.target.value)
                           }}/>
                <TextField id="outlined-basic" label="Redeem Price (ETH)" sx={fieldStyle} type="number"
                           variant="outlined"
                           onChange={(v) => {
                               setredeemPrice(v.target.value)
                           }}/>
                <TextField id="outlined-basic" label="Min ERC20" sx={fieldStyle} type="number"
                           variant="outlined"
                           onChange={(v) => {
                               setminerc20(v.target.value)
                           }}/>
            </FormControl>
            <Box>
                <Button variant="contained" onClick={() => submit()}>Submit</Button>
            </Box>
        </Box>
    )
}