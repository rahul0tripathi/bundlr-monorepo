import {useMoralis} from "react-moralis";
import {useState as hookState} from "@hookstate/core";
import {accountAddress} from "../../states";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const style = {
    position: 'absolute',
    top: '50%',
    backgroundColor:"white",
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    p: 4,
}

export default function CreateNewCollection() {

    return (
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{mt: 2}}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
        </Box>
    )
}