import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import "@google/model-viewer"
import {makeStyles} from '@mui/styles';
import {
    Container,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Modal
} from "@mui/material";
import {useEffect, useState} from "react";
import {abi as FactoryAbi} from "../../contracts/BundlrFactory.json"
import {abi as BundleAbi} from "../../contracts/Bundle.json"
import {ethers} from 'ethers'
import web3 from "web3"
import * as config from "../../config/index"
import CreateNewCollection from "../newCollection/NewCollection";
import * as NFTMetadata from "../../config/description.json"
import {pinJSONToIPFS} from "../../util"


let provider = null

const gltf = ["/elite_box.gltf", "/classic_box.gltf", "/semi_box.gltf"];
const poster = ["/elite.webp", "/classic_box.webp", "/semi_box.webp"];
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
    const currentItem = web3.utils.toBN(await contract.mintedCrates()).toNumber() + 1
    NFTMetadata.name = `Crate #${currentItem}`;
    const uri = await pinJSONToIPFS(NFTMetadata)
    await contract.connect(signer).mint(uri);
}


export default function OutlinedCard() {
    const classes = styles();
    let [metadata, setMetadada] = useState([])
    let [ownedTokens, setOwnedTokens] = useState({})
    let [tokenToRedeem, settokenToRedeem] = useState(0);
    const [open, setOpen] = React.useState(false);
    try {

        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);
        const contract = new ethers.Contract(config.default.BaseContractAddress, FactoryAbi, provider)
        const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
        provider = new ethers.providers.Web3Provider(window.ethereum)

        let collections = {}
        const init = async () => {
            try {
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
            } catch (err) {
                console.log(err)
                alert(err?.data?.message)
            }
        }
        const handleOnchange = (val) => {
            settokenToRedeem(val.target.value)
        }
        const redeem = async (address) => {
            try {
                const collection = new ethers.Contract(address, BundleAbi, provider)
                const amount = await collection.getCurrentRedeemPrice();
                 await collection.connect(signer).redeem(web3.utils.toBN(tokenToRedeem).toString(), {
                    value: amount
                })
            } catch (err) {
                alert(err?.data?.message)
            }

        }
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            init()

        }, [init])

        return (
            <Box
                sx={{background: `linear-gradient(310deg, rgba(80, 252, 102, 0.3) 9%, rgba(63, 191, 233, 0.3) 35%, rgba(251, 82, 208, 0.3) 63%, rgba(254, 231, 0, 0.3) 89%); !important`}}>
                <Container maxWidth="lg" className={`${classes.center}, ${classes.defaultFont}`} sx={{}}>
                    <Grid container spacing={2} sx={{
                        marginTop: "2px",
                        height: `100vh !important`
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
                                                src={gltf[1]}
                                                poster={poster[1]}
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
                                            <Button variant="contained" sx={{backgroundColor: "black"}}
                                                    onClick={() => mintNewToken(x?.address)}>Mint</Button>
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

                                            <Button variant="contained" sx={{backgroundColor: "black"}}
                                                    onClick={() => redeem(x.address)}>Redeem</Button>
                                            <Button variant="contained" sx={{backgroundColor: "black"}}
                                                    onClick={handleOpen}>New Bundle</Button>
                                            <Modal
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <CreateNewCollection address={x.address}/>
                                            </Modal>
                                        </CardActions></Card>
                                </Grid>
                            })

                        ) : ""}
                        <Grid
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
                                        src={gltf[2]}
                                        poster={poster[2]}
                                        alt="A 3D model of an astronaut"
                                        shadow-intensity="1"
                                        camera-controls
                                        auto-rotate
                                        ar
                                    />
                                </Box>
                                <Typography gutterBottom variant="h5" component="h2"
                                            sx={{display: "inline", verticalAlign: "middle"}}>
                                    {String("0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82").substring(0, 12) +
                                        "..."}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    "This is a cool crate"
                                </Typography>
                            </CardContent>
                                <CardActions>
                                    <Button variant="contained" disabled={true}>Mint</Button>
                                    <Button variant="contained" disabled={true}>Redeem</Button>
                                    <Button variant="contained" disabled={true}>New Bundle</Button>
                                </CardActions></Card>
                        </Grid>
                        <Grid
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
                                        src={gltf[0]}
                                        poster={poster[0]}
                                        alt="A 3D model of an astronaut"
                                        shadow-intensity="1"
                                        camera-controls
                                        auto-rotate
                                        ar
                                    />
                                </Box>
                                <Typography gutterBottom variant="h5" component="h2"
                                            sx={{display: "inline", verticalAlign: "middle"}}>
                                    {String("0xa16e02e87b7454126e5e10d957a927a7f5b5d2be").substring(0, 12) +
                                        "..."}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    "This is a cool crate"
                                </Typography>
                            </CardContent>
                                <CardActions>
                                    <Button variant="contained" disabled={true}>Mint</Button>
                                    <Button variant="contained" disabled={true}>Redeem</Button>
                                    <Button variant="contained" disabled={true}>New Bundle</Button>
                                </CardActions></Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        );
    } catch (err) {
        return (
            <Container maxWidth="lg" className={`${classes.center}, ${classes.defaultFont}`} sx={{}}>
                <Typography variant="h5" component="h2">
                    Please install a web3 provider
                </Typography>
            </Container>
        )
    }
}
