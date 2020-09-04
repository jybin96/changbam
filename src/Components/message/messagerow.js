import React, { Component } from "react";
import ScrollToBottom from 'react-scroll-to-bottom';
import Messageroom from './messageroom';
import Messageroom_click from './messageroom_click';
import './message.css';
import io from 'socket.io-client';


const socket = io('http://localhost:3001');

export default class Messagerow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userid:"jybin96",
            divshow:[],
            reload:false
        }
    }

    componentWillMount(){
        socket.emit('messagerow',this.state.userid);
        socket.on('my messagerow',(messageobject)=>{
            const newdivshow = this.state.divshow.slice();
            const index = this.state.divshow.findIndex(x =>x.userid === messageobject.touser)
            console.log(index);
            newdivshow[index].message_body = messageobject.body
                const post2 ={
                    rowidex:index,
                    userid:this.state.userid, //durl
                
                }
                fetch('http://localhost:3001/messageroomboolean',{
                        method:"post",
                        headers : {
                            'content-type':'application/json'
                        },
                        body:JSON.stringify(post2)
                }).then(res => res.json())
                .then(json=>{
                    console.log(json);
                    if(json.message_user === this.state.userid){  //만약 보낸 메시지의 주인이 나의 아이디와 같다면
                        newdivshow[index].message_bool = 0
                        console.log("1"+newdivshow[index].message_bool);
                        this.setState({
                            divshow:newdivshow
                        })
                    }else{
                        newdivshow[index].message_bool = 1
                        console.log("2"+newdivshow[index].message_bool);
                         
                        this.setState({
                            divshow:newdivshow
                        })
                    }
                    
                })
                
           
        })
        socket.on('touser messagerow',(messageobject)=>{ //messageobject.touser 는 나자신이고 messageobject.userid는 보낸 사람이다 
            const newdivshow = this.state.divshow.slice();
            const index = this.state.divshow.findIndex(x =>x.userid === messageobject.userid)
            console.log(index);
            newdivshow[index].message_body = messageobject.body
            const post2 ={
                rowidex:index,
                userid:this.state.userid, //durl
               
            }
            fetch('http://localhost:3001/messageroomboolean',{
                    method:"post",
                    headers : {
                        'content-type':'application/json'
                    },
                    body:JSON.stringify(post2)
            }).then(res => res.json())
            .then(json=>{
                console.log(json);
                if(json.message_user === this.state.userid){  //만약 보낸 메시지의 주인이 나의 아이디와 같다면
                    newdivshow[index].message_bool = 0
                    console.log("3"+newdivshow[index].message_bool);
                     
            this.setState({
                divshow:newdivshow
            })
                }else{
                    newdivshow[index].message_bool = 1
                    console.log("4"+newdivshow[index].message_bool);
                     
            this.setState({
                divshow:newdivshow
            })
                }
            })
               
        console.log("jybin96 touser message ");
            
           
        })
        const post = {
            userid:this.state.userid
        }
        fetch('http://localhost:3001/messagerow',{
            method:"post",
            headers : {
                'content-type':'application/json'
            },
            body:JSON.stringify(post)
        }).then(res=>res.json())
        .then(json=>{
            console.log(json); //정보를 받아와서 넣는다~ 근데 touser에 자기 이름이면 userid를 사용해야하고 userid가 내 아이디이면 to user를 사용해야된다.
            json.map((json)=>{
                console.log(json.message_touser);
                if(json.message_touser === this.state.userid){
                    const messagebox = {
                        touser: json.message_user,
                        userid : json.message_user, //나에게 보낸 사용자의 이름
                        message_body:json.message_body, //메세지 내용
                        message_bool: 1
                        
                    }
                    this.setState({
                        divshow:[...this.state.divshow,messagebox]
                    })
                }else if(json.message_user === this.state.userid){
                    const messagebox = {
                        touser: json.message_user,
                        userid : json.message_touser,
                        message_body:json.message_body,
                        message_bool: 0
                        
                    }
                    this.setState({
                        divshow:[...this.state.divshow,messagebox]
                    })
                }
            })
        })
    }
   
    render(){
        return(
            <div className="messagerow_main" onClick={this.onclick}>
                <div className="messagerow_title">
                    메시지 보관함
                    
                </div>
                <div className="messagerow_scroll">
                    <ScrollToBottom className="chat_scroll">
                    {this.state.divshow.map((divshow)=>{
                        console.log("bool: "+divshow.message_bool);
                        if(divshow.message_bool === 1){
                            console.log(divshow.touser);
                            return (<Messageroom_click name={divshow.userid} body={divshow.message_body}/>)
                            
                           }else{
                            return (<Messageroom name={divshow.userid} body={divshow.message_body}/>)
                           }
                               
                           
                        
                                       
                                    })
                        }
                    </ScrollToBottom>
                </div>      
            </div>
        )
    }
}