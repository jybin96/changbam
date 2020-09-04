import React, { Component } from "react";
import './message.css';

export default class Message_sendfrom extends React.Component{
    constructor(props){
        super(props);
        
    }
    
    render(){
        return(
            <div className="message_sendfrom_main">
                <span className="message_sendfrom_div">
                    {this.props.message}
                    <div>
                       
                    </div>
                </span>
               
            </div>
        )
    }
}