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
        height: "300px"
      }}>
        <model-viewer
          style={{height: "300px", marginLeft: "8vw"}}
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
const card2 = (
  <React.Fragment>
    <CardContent>
      <Box sx={{
        height: "300px"
      }}>
        <model-viewer
          style={{height: "300px", marginLeft: "8vw"}}
          src="/classic_box.gltf"
          poster="/classic_box.webp"
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
const card3 = (
  <React.Fragment>
    <CardContent>
      <Box sx={{
        height: "300px"
      }}>
        <model-viewer
          style={{height: "300px", marginLeft: "8vw"}}
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
export default function OutlinedCard() {
  return (
    <Container maxWidth="lg">


      <Grid container spacing={4} sx={{
        marginTop: "100px"
      }}>

        <Grid
          item
          spacing={4}
          md={6}
        >
          <Card variant="outlined">{card3}</Card>
        </Grid>
        <Grid
          item
          spacing={4}
          md={6}
        >
          <Card variant="outlined">{card}</Card>
        </Grid>
        <Grid
          item
          spacing={4}
          md={6}
        >

          <Card variant="outlined">{card2}</Card>


        </Grid>
      </Grid>
    </Container>
  );
}
