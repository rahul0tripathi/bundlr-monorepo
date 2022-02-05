import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import "@google/model-viewer"

import {Container, Grid, Typography} from "@mui/material";

const bull = (
  <Box
    component="span"
    sx={{display: 'inline-block', mx: '2px', transform: 'scale(0.8)'}}
  >
    •
  </Box>
);

const card = (
  <React.Fragment>
    <CardContent>
      <Box sx={{
        height: "300px",
        backgroundColor:"black"
      }}>
        <model-viewer
          style={{height: "300px"}}
          src="/elite_box.gltf"
          poster="/elite.webp"
          alt="A 3D model of an astronaut"
          shadow-intensity="1"
          camera-controls
          auto-rotate
          ar
        ></model-viewer>
      </Box>
      <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
        Word of the Day
      </Typography>
      <Typography variant="h5" component="div">
        be{bull}nev{bull}o{bull}lent
      </Typography>
      <Typography sx={{mb: 1.5}} color="text.secondary">
        adjective
      </Typography>
      <Typography variant="body2">
        well meaning and kindly.
        <br/>
        {'"a benevolent smile"'}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">Learn More</Button>
    </CardActions>
  </React.Fragment>
);
const card2 = (gitf,poster)=>{
  return (
  <React.Fragment>
    <CardContent>
      <Box sx={{
        backgroundColor:"black",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }}>
        <model-viewer
          style={{height: "30vw",width:"30vw"
          }}
          src={gitf}
          poster={poster}
          alt="A 3D model of an astronaut"
          shadow-intensity="1"
          camera-controls
          auto-rotate
          ar
        ></model-viewer>
      </Box>
    </CardContent>
    <CardActions>
      <Button size="small">Learn More</Button>
    </CardActions>
  </React.Fragment>
)}
const card3 = (
  <React.Fragment>
    <CardContent>
      <Box sx={{
        height: "300px",
        backgroundColor:"black"
      }}>
        <model-viewer
          style={{height: "300px"}}
          src="/semi_box.gltf"
          poster="/semi_box.webp"
          alt="A 3D model of an astronaut"
          shadow-intensity="1"
          camera-controls
          auto-rotate
          ar
        ></model-viewer>
      </Box>
    </CardContent>
    <CardActions>
      <Button size="small">Learn More</Button>
    </CardActions>
  </React.Fragment>
);
function DefaultCard({gitf = "",poster=""}){
  return (
    <Card variant="outlined">{card2("/classic_box.gltf","/classic_box.webp")}</Card>
  )
}
export default function OutlinedCard() {
  return (
    <Container maxWidth="lg">


      <Grid container spacing={4} sx={{
        marginTop: "100px"
      }}>

        <Grid
          item
          md={6}
        >
          <Card variant="outlined">{card2("/semi_box.gltf","/semi_box.webp")}</Card>
        </Grid>
        <Grid
          item

          md={6}
        >
          <Card variant="outlined">{card2("/elite_box.gltf","/elite.webp")}</Card>
        </Grid>
        <Grid
          item
          md={6}
        >

          <Card variant="outlined">{card2("/classic_box.gltf","/classic_box.webp")}</Card>


        </Grid>
      </Grid>
    </Container>
  );
}
