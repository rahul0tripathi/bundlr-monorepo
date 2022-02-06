import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';

import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import "@google/model-viewer"
import {makeStyles} from '@mui/styles';
import {Container, Grid, Typography, createTheme, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import {useMoralis, useWeb3ExecuteFunction} from "react-moralis";
import {useEffect, useState} from "react";
import {abi as FactoryAbi} from "../../contracts/BundlrFactory.json"
import {abi as BundleAbi} from "../../contracts/Bundle.json"
import {ethers} from 'ethers'
import web3 from "web3"
import Avatar from "@mui/material/Avatar";
import {getAvatar} from "../../util";
import {red} from "@mui/material/colors";

const provider = new ethers.providers.Web3Provider(window.ethereum)
const theme = createTheme({
    typography: {
        fontFamily: ["Open Sans", "sans-serif"]
    }
})
const styles = makeStyles({
    card: {
        margin: "auto",
        transition: "0.3s",
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
            boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
        }
    },
    center: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    defaultFont: {
        fontFamily: `Montserrat, sans-serif !important`
    }


})
const mintNewToken = async (address) => {
    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    let contract = new ethers.Contract(address, BundleAbi, provider)
    await contract.connect(signer).mint();
}


export default function OutlinedCard() {
    const classes = styles();
    const {isAuthenticated, user} = useMoralis();
    let [addresss, setAddress] = useState(null)
    let [metadata, setMetadada] = useState([])
    let [ownedTokens, setOwnedTokens] = useState({})
    let [tokenToRedeem, settokenToRedeem] = useState(0);
    const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', FactoryAbi, provider)
    const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
    let collections = {}
    const test = async () => {
        let newMetaData = []
        let count = await contract.collectionCount.call()


        for (let i = 0; i < web3.utils.toBN(count).toNumber(); i++) {
            let address = await contract.collections(i)
            collections[address] = new ethers.Contract(address, BundleAbi, provider)
            let m = await collections[address].collectionMetaData()
            let count = await collections[address].balanceOf(await signer.getAddress());
            if (web3.utils.toBN(count).toNumber() > 0) {
                let newTokenList = []
                for (let j = 0; j < web3.utils.toBN(count).toNumber(); j++) {
                    let nToken = await collections[address].tokenOfOwnerByIndex(await signer.getAddress(), web3.utils.toBN(j).toString())
                    newTokenList.push(nToken)
                }
                setOwnedTokens({
                    ...ownedTokens,
                    [address]: newTokenList
                })
            }
            newMetaData.push({
                address,
                metadata: JSON.parse(m)
            })

        }
        setMetadada(newMetaData)

    }
    const handleOnchange = (val) => {
        settokenToRedeem(val.target.value)

    }
    const redeem = async (address) => {
        const collection = new ethers.Contract(address, BundleAbi, provider)
        const txn = await collection.connect(signer).redeem(web3.utils.toBN(tokenToRedeem).toString(), {
            value: ethers.utils.parseEther("1.0")
        })
    }
    useEffect(() => {

        console.log(signer)
        console.log(isAuthenticated, "autj")
        test()

    }, [isAuthenticated])
    return (
        <Container maxWidth="lg" className={`${classes.center}, ${classes.defaultFont}`}>
            <Grid container spacing={2} sx={{
                marginTop: "100px"
            }}>
                {metadata.length ? (
                    metadata.map(x => {
                        return <Grid
                            item
                            md={4}
                        >
                            <Card className={classes.card}
                                  variant="outlined"><CardContent>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <model-viewer
                                        style={{
                                            height: "30vw", width: "30vw"
                                        }}
                                        src={x?.gltf ? x.gltf : "/elite_box.gltf"}
                                        poster={x?.poster ? x.poster : "/elite.webp"}
                                        alt="A 3D model of an astronaut"
                                        shadow-intensity="1"
                                        camera-controls
                                        auto-rotate
                                        ar
                                    />
                                </Box>
                                <Typography gutterBottom variant="h5" component="h2"
                                            sx={{display: "inline", verticalAlign: "middle"}}>
                                    {String(x.address).substring(0, 12) +
                                        "..."}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {x.description ? x.description : "This is a cool crate"}
                                </Typography>
                            </CardContent>
                                <CardActions>
                                    <Button variant="contained" onClick={() => mintNewToken(x?.address)}>Mint</Button>
                                    {ownedTokens[x.address]?.length ? (
                                        <FormControl
                                            variant="standard"
                                            sx={{width: "60px", margin: "10px"}}
                                        >
                                            <InputLabel
                                                id="demo-simple-select-label"
                                            >
                                                Token Id
                                            </InputLabel>

                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Token Id"
                                                onChange={handleOnchange}
                                            >
                                                {
                                                    ownedTokens[x.address].map(x => {
                                                        return <MenuItem value={web3.utils.toBN(x).toString()}>
                                                            {web3.utils.toBN(x).toString()}
                                                        </MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    ) : ""}
                                    <Button variant="contained" onClick={() => redeem(x.address)}>Redeem</Button>
                                </CardActions></Card>
                        </Grid>
                    })

                ) : ""}
            </Grid>
        </Container>
    );
}
