// based off https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
import React, { useState, useRef, useEffect, Component } from 'react';
import { Sampler, Synth, Filter, FeedbackDelay, now, Reverb } from "tone";
import * as Tone from "tone"
import A1 from "./audio/ding-1.wav";
import B1 from "./audio/shaker-1.wav";

const Canvas = props => {

  const canvasRef = useRef(null)
  
  // TODO: move out of component, should be passed as a prop
  const draw = ctx => {
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 20, 0, 2*Math.PI)
    ctx.fill()
  }
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    //Our draw come here
    draw(context)
  }, [draw])

  // TODO: move all tone generation to separate component/file

  //Testing Tone Sampler
  const [isLoaded, setLoaded] = useState(false);
  const sampler = useRef(null);

  //create Sampler after each render
  useEffect(() => {
    sampler.current = new Sampler(
      { A1, B1 },
      {
        onload: () => {
          setLoaded(true);
        }
      }
    ).toMaster();
  }, []);

  function playSamplerTone(note) {
    if (isLoaded){
      sampler.current.triggerAttack(note);
    }
  }

  //Periodically call the two audio samples
  setInterval( () => playSamplerTone("A1"), 3000);
  setInterval( () => playSamplerTone("B1"), 5000);

  //Testing Tone synth
  const synth = new Synth();
  const now = Tone.now();

  synth.triggerAttackRelease("C4", "8n", now);
  synth.triggerAttackRelease("E4", "8n", now + 0.5);
  synth.triggerAttackRelease("G4", "1m", now + 1);

  const filter = new Filter(3000, 'lowpass');
  const feedbackDelay = new FeedbackDelay("4n", 0.5);
  const reverb = new Reverb(0.4).toDestination();

  //Run a series of effects on the synth
  synth.connect(filter);
  filter.connect(feedbackDelay);
  feedbackDelay.connect(reverb);

  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas