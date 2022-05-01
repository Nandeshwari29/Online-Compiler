import React, { Component} from "react";
import "./Compiler.css";
export default class Compiler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: localStorage.getItem('input')||``,
      output: ``,
      language_id:localStorage.getItem('language_Id')|| 2,
      user_input: ``,
      font_id:localStorage.getItem('font_id'),
      font:``,
      bgColor:"rgb(58, 56, 56)",
      color:"white",
      fontSize: ""
    };
  }
  fontchange = (e)=>{
    this.setState({ fontSize: e.target.value});
  }
  changeColor= (e)=>{
    if(this.state.bgColor==="rgb(58, 56, 56)"){
        this.setState({bgColor:"whitesmoke", color:"black"})
    }
    else{
        this.setState({bgColor:"rgb(58, 56, 56)", color:"white"})
    }
 }
  clear= (event)=>{
      this.setState({userInput:'',input:"" , language_id:'', output:''})
  }
  input = (event) => { 
    event.preventDefault();
    this.setState({ input: event.target.value });
    localStorage.setItem('input', event.target.value) 
  };
  
  userInput = (event) => {
    event.preventDefault();
    this.setState({ user_input: event.target.value });
  };
  
  language = (event) => {  
    event.preventDefault();
    this.setState({ language_id: event.target.value });
    localStorage.setItem('language_Id',event.target.value)
   
  };
  
  submit = async (e) => {
    e.preventDefault();
    let outputText = document.getElementById("output");
    outputText.innerHTML = "";
    outputText.innerHTML += "Creating Submission ...\n";
    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": "970fff4b9fmshc5bd7be3c828f55p11c03fjsnc0721a037cff", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: this.state.input,
          stdin: this.state.user_input,
          language_id: this.state.language_id,
        }),
      }
    );
    
    outputText.innerHTML += "Submission Created ...\n";
    const jsonResponse = await response.json();
    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };
    while (
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;
        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": "970fff4b9fmshc5bd7be3c828f55p11c03fjsnc0721a037cff", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
            "content-type": "application/json",
          },
        });
        jsonGetSolution = await getSolution.json();
      }
    }
    
    if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout);
      outputText.innerHTML = "";
      outputText.innerHTML += `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr);
      outputText.innerHTML = "";
      outputText.innerHTML += `\n Error :${error}`;
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output);
      outputText.innerHTML = "";
      outputText.innerHTML += `\n Error :${compilation_error}`;
    }
  };
  render() {

    return (
      <>
      <div className="main" style={{backgroundColor: this.state.bgColor, color:this.state.color}}>
          <div>
        <div className="header">
            Online Compiler</div>
        </div>
      <div>
        <span className="Headings">Source Code</span>
        <label htmlFor="tags" className="language">Language:</label>
        <select value={this.state.language_id} onChange={this.language} id="tags" className="language_selector">
          <option value="54">C++</option>
          <option value="50">C</option>
          <option value="62">Java</option>
          <option value="71">Python</option>
        </select>
        <span className="fntsizeh">Font Size:</span>
        <select  onChange={this.fontchange} className="font-select">
            <option value="16">16</option>
            <option value="18">18</option>
            <option value="24">24</option>
            <option value="26">26</option>
            <option value="30">30</option>
        </select>
        
        <button type="submit" className="button" onClick={this.submit}>Run</button>
        <button type="submit" className="button" onClick={this.clear}>Clear </button>
        <span className="dark-light">Light Mode:</span>
            <label class="switch"> <input type="checkbox" onChange={this.changeColor} /><span class="slider round"></span>
            </label>
      </div>
      <div className="code">
          <textarea style={{fontSize: this.state.fontSize+'px', color:this.state.color}} placeholder="Enter your code here" required name="solution" id="source" onChange={this.input} value={this.state.input}>
          </textarea>

          <div className="inout">
            <div className="inputs">
              <div className="select">
                <div className="Heading">  Input  </div>
              </div>
                <textarea  style={{fontSize: this.state.fontSize+'px', color:this.state.color}} id="input" onChange={this.userInput} placeholder="Enter your input before"></textarea>
            </div>
            <div className="outputs">
              <div className="select">
                <div className="Heading"> Output </div>
              </div>
              <div className="outputSection">
                <textarea style={{fontSize: this.state.fontSize+'px', color:this.state.color}}  id="output"></textarea>
              </div>
            </div>
          </div>
      </div>
      </div>
      </>
    );
  }
}