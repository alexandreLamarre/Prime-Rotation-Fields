import React from "react";
import {generatePrimes, rotateLineSegment} from "./helpers";

import "./CustomCanvas.css";

class CustomCanvas extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      height: 0,
      width: 0,
      centerX: 0,
      centerY: 0,
      running: false,
      num_primes:500,
      primes: [],
      points: [],
      degree: 1,
      scale: 1,
      dragging:false,
      mouseX: 0,
      mouseY: 0,
      offsetX: 0,
      offsetY:0,
      colored: false,
    };
    this.canvas = React.createRef();
  }

  componentDidMount(){
    const w = window.innerWidth*0.60;
    const h = window.innerHeight*0.60;
    this.setState({width: w, height: h, centerX: w/2, centerY: h/2});
  }

  componentDidUpdate(){
    this.canvas.current.width = this.state.width;
    this.canvas.current.height = this.state.height;
    const ctx = this.canvas.current.getContext("2d");
    ctx.scale(this.state.scale, this.state.scale);
    // ctx.clearRect(0,0, this.state.width, this.state.height);
    // ctx.scale(this.state.scale, this.state.scale);
    const points = this.state.points;
    const increment = 255/points.length;
    const colored = this.state.colored;
    for(let i = 0; i < points.length-1; i ++){
      const start_point = points[i][0];
      const end_point = points[i][1];
      ctx.beginPath();
      ctx.moveTo(start_point[0] + this.state.offsetX, start_point[1]+this.state.offsetY);
      ctx.lineTo(end_point[0]+this.state.offsetX, end_point[1]+this.state.offsetY);

      ctx.strokeStyle = colored === true?"rgb("+parseInt(255-increment*i).toString()+ ",0,0)": "rgb(0,0,0)";
      ctx.globalAlpha = 1;
      ctx.stroke();
      ctx.closePath();
    }
  }

  setPrimeTarget(e){
    const value = parseInt(e.target.value);
    this.setState({num_primes: value});
  }

  setDegree(e){
    const value = parseFloat(e.target.value);
    this.setState({degree: value});
  }

  setColored(e){
    const colored = this.state.colored;
    this.setState({colored: !colored});
  }

  createPrimeList(){
    const prime_array = generatePrimes(this.state.num_primes);
    return prime_array;
  }

  drawPrimeRotation(){
    const primes = this.createPrimeList(this.state.num_primes);
    const degree_increment = this.state.degree;
    const centerX = this.state.centerX;
    const centerY = this.state.centerY;
    this.canvas.current.width = this.state.width;
    this.canvas.current.height = this.state.height;
    const ctx = this.canvas.current.getContext("2d");
    var degree = 0;
    var start_point = [centerX,centerY];
    var end_point = [centerX,centerY];
    const points = [];
    for(let i = 0; i < primes.length; i++){
      start_point = end_point;
      var offset = primes[i-1] === undefined?primes[i]:primes[i]-primes[i-1];
      end_point = [start_point[0]+offset, start_point[1]];
      end_point = rotateLineSegment(Math.PI*degree/180,start_point,end_point);
      degree += degree_increment;
      degree = degree%360;
      points.push([start_point, end_point]);
    }
    this.setState({points: points, primes: primes})
  }

  zoomCamera(e){
    const current_scale = this.state.scale;
    const delta = -Math.sign(e.deltaY)*0.05;
    this.setState({scale: current_scale+delta});
  }

  resetCamera(){
    this.setState({scale:1, offsetX:0, offsetY:0});
  }

  setDrag(e,v){
    this.setState({dragging: v});
  }


  updateCamera(e){
    const previousX = this.state.mouseX;
    const previousY = this.state.mouseY;
    if(this.state.dragging === true){
      const rect = this.canvas.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const new_offsetX = this.state.offsetX +(x - previousX);
      const new_offsetY = this.state.offsetY + (y - previousY);
      this.setState({mouseX:x, mouseY:y, offsetX: new_offsetX,
        offsetY: new_offsetY});
    }
    else{
      const rect = this.canvas.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.setState({mouseX : x, mouseY: y});
    }

  }

  saveAs(extension){
    const canvas = this.canvas.current;
    const image = canvas.toDataURL("primes/"+extension);
    var link = document.createElement('a');
    link.href = image;
    link.download = 'primes.'+extension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  render(){
    return <div>
              <canvas className = "primeCanvas"
              onWheel = {(e) => this.zoomCamera(e)}
              onMouseLeave = {(e) => this.setDrag(e,false)}
              onMouseMove = {(e) => this.updateCamera(e)}
              onMouseDown = {(e) => this.setDrag(e, true)}
              onMouseUp = {(e) => this.setDrag(e, false)}
              ref = {this.canvas}
              style = {{height: this.state.height, width: this.state.width}}

              ></canvas>
              <br></br>
              <br></br>
              <input className = "slider"
              type="range"
              onChange = {(e) => this.setPrimeTarget(e)}
              min = "500"
              step = "1"
              value = {this.state.num_primes}
              max = "1000000"/>
              <br></br>
              <label> Primes up to: {this.state.num_primes}  </label>
              <br></br>
              <input className = "slider"
              type = "range"
              min = "0.5"
              max = "359.5"
              step = "0.5"
              value = {this.state.degree}
              onChange = {(e) => this.setDegree(e)}
              />
              <br></br>
              <label> Rotation: {this.state.degree} degrees  </label>
              <br></br>
              <label> Color :  </label>
              <input onChange = {(e) => this.setColored(e)}
              type = "checkbox"/>
              <br></br>
              <button onClick = {() => this.drawPrimeRotation()}> Prime Rotation </button>
              <button onClick = {() => this.resetCamera()}>Reset Camera</button>
              <div className = "dropdown">
              <button className = "saveB"
              title = "Save as">
              Save as
              </button>
              <div className = "dropdown-content">
                <a className = "aFile" onClick = {() => this.saveAs("png")}>.png</a>
                <a className = "aFile" onClick = {() => this.saveAs("jpg")}>.jpg</a>
              </div>
            </div>

           </div>
  }
}

export default CustomCanvas;
