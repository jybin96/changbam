import React, { Component } from "react";
import './message.css';
export default class Messageroom extends React.Component{
    constructor(props){
        super(props);

    }
    onclick=(e)=>{
        var box = document.getElementsByClassName('messageroom_main');
        
        console.log(box.style);
    }
    render(){
        return(
            <div className="messageroom_main" onClick={this.onclick}>
                <div className="messageroom_img">

                </div>
                <div className="messageroom_body">
                    <div className="messageroom_body_name">
                        {this.props.name}
                    </div>
                    <div className="messageroom_body_main">
                        {this.props.body}
                    </div>
                    
                </div>
                <div className="messageroom_button">
                    <button>x</button>
                </div>
            </div>
        )
    }
}