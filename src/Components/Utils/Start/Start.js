import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import './Start.css';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import io from 'socket.io-client';


const socket = io('http://localhost:3001');

export default class Start extends Component {

constructor(props){
    super(props);
    this.state = {
        button1: false
    }
}

componentWillMount(){
    this.setState({
        userid: this.props.userid
    })
    console.log(this.props.userid);
    setTimeout(
        socket.on('fail matching',()=>{
            socket.emit('random matching',this.props.userid);
        }), 3000);
    
}


onclick1=()=>{
    this.setState({
        button1:true
    })
    socket.emit('random matching',this.props.userid);
    
    socket.on('matching success',row=>{
        alert(row.user_id+"매칭성공");
        this.setState({
            button1:false
        })
    })
}

//     //기존
//    state = {
//        count : 1
//    }

//     modify = (n) => {
//         this.setState({
//             count : n
//         });
//     };

//     update = (n) => {
//         this.setState({
//             count : 1
//         });
//     };

    render() {

        //기존
        // const {count} = this.state;
        return (
            this.props.count === 1 ?
            <div>
                {this.state.button1 ?
                (<div className="matching_start_main">
                    <div className="matching_start">
                        매칭 중입니다
                    </div>
                        <CircularProgress color="secondary"/>
                </div>)
                 : (<div><button className = "Font_start" onClick={this.onclick1}> 매칭 시작! </button></div>)} 
            </div>
            :
            <div>
                <button className ="Font2_start"> 매칭 찾기! </button>
            </div>
           

            //기존
            // count === 5 ?
            // <div>
            //     <Link to ="#">
            //         <button onClick={() => this.update(count)} className = "Font">{count} : {count} 과팅</button>
            //     </Link>
            // </div>
            // : 
            // <div>
            //     <Link to ="#">
            //         <button onClick={() => this.modify(count + 1)} className = "Font">{count} : {count} 과팅</button>
            //     </Link>
            // </div>
        )
    }
}
