import React, { Component } from "react";
import './message.css';

export default class Message_sendme extends React.Component{
    render(){
        return(
            <div className="message_sendme_main">
                <span className="message_sendme_div">
                    {this.props.message}
                    <div></div>
                </span>
            </div>
        )
    }
}