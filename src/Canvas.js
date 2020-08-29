// based off https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
import React, { useState, useRef, useEffect, Component } from 'react';
import { Sampler } from "tone";
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
  
  //Setup for Sampler
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

  function playTone(note) {
    if (isLoaded){
      sampler.current.triggerAttack(note);
    }
  }

  //Periodically call the two tones
  setInterval( () => playTone("A1"), 3000);
  setInterval( () => playTone("B1"), 5000);

  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas