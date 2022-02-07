import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {useMoralis} from "react-moralis";
import Avatar from '@mui/material/Avatar';
import {accountAddress} from '../../states/index'
import {useState as hookState} from "@hookstate/core";
import {getAvatar} from "../../util"
import {Chip} from "@mui/material";

export default function ButtonAppBar() {
    const {authenticate, isAuthenticated, user} = useMoralis();
    const state = hookState(accountAddress);

    const updateState = () => {
        state.set(user.get('ethAddress'))
    }
    return (
        <AppBar position="static" sx={{backgroundColor: "black"}}>
            <Toolbar>

                <Typography type="title" color="inherit" style={{flex: 1, fontSize: "30px"}}>
                    BUNDLR
                    <Chip label="MUMBAI" sx={{
                        backgroundColor: "red",
                        color: "white",
                        height: "15px",
                        fontWeight: "bold",
                        margin: "5px",
                        fontSize: "8px",
                        verticalAlign: "top"
                    }}/>
                </Typography>


                <Button variant="outlined" color="inherit" edge="end"
                        onClick={() => {
                            if (!isAuthenticated) {
                                authenticate({signMessage: "hello", onComplete: () => updateState()})
                            } else {
                                updateState()
                            }
                        }}>
                    {state.get() != null ? (
                        <Avatar alt="Remy Sharp" sx={{
                            height: "30px", width: "30px"
                        }} src={getAvatar(state.get())}/>
                    ) : ("")
                    }
                    <Typography
                        variant="p"
                        sx={{
                            fontSize: "0.7rem",
                            display: {xs: "none", md: "block"},
                        }}
                    >
                        {state.get() != null
                            ?
                            String(state.get()).substring(0, 12) +
                            "..." +
                            String(state.get()).substring(38)
                            : `Connect To Wallet`}
                    </Typography></Button>
            </Toolbar>

        </AppBar>

    );
}