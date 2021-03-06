const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
const bodyparser = require("body-parser");
const mysql = require("mysql");
// nodemailer 모듈 요청
const nodemailer = require("nodemailer");
var http = require('http').createServer(app);
const io = require('socket.io')(http);


//mysql연결
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "snsk3779@",
  database: "chang_man",
});

connection.connect();
//bodyparser및 cors 사용
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyparser.json());




io.on('connection',function(socket){
  console.log("소켓 접속 성공");
  socket.on('messagerow',(userid)=>{
    socket.join(userid); //따로 디비 만들어 주어야한다.
  })
  socket.on('message',(messageobject)=>{
    console.log(messageobject);
    io.emit('send message',messageobject)
  })
  socket.on('new message',(messageobject)=>{
    console.log("asdasdasda");
    
    io.to(messageobject.userid).emit('my messagerow',messageobject); //사용자에게 주고
    io.to(messageobject.touser).emit('touser messagerow',messageobject); //보내는 사람에게 주고
  })
  socket.on('random matching',userid=>{

    connection.query('select * from user_info where user_id = ? ',[userid],function(err,rows,field){
      if(rows[0].user_sex === 'm'){
        connection.query('select * from user_info where user_sex = ? ',['w'],function(err,rows2,field){

          if(rows2[0] === undefined){
            console.log();
            socket.emit('fail matching');
          }else if(rows2[0].user_sex === 'w'){
            socket.emit('matching success',rows2[0]);
          }else{
            socket.emit('fail matching');
          }
          
        })
      }else{

      }
    })
  })
})


app.post("/message",(req,res)=>{
  console.log(req.body);
  const roomname = "room1" //여기서 룸정하기
  connection.query("insert into message_table (message_room,message_user,message_touser,message_body) values (?,?,?,?)"
  ,[roomname,req.body.userid,req.body.touser,req.body.body],function(err,rows,field){
    console.log("메세지 넣기 성공");
    res.send();
  })
})
app.post("/messageroomboolean",(req,res)=>{
  console.log("server.js 57"+" "+req.body.rowidex);
  const index = req.body.rowidex // 바꾸고자하는 인덱스위치
  connection.query("select * from  message_table where message_time in (select max(message_time) from message_table group by message_room) and (message_user = ? or message_touser = ?);"
  ,[req.body.userid,req.body.userid],function(err,rows,field){
    console.log("카차차차차차차이이이이"+rows[req.body.rowidex].message_key);
    const room = rows[req.body.rowidex];
    res.send(room);
    
  })
})

app.post("/messageshow",(req,res)=>{
  console.log(req.body);
  connection.query("select * from message_table where message_user = ? or message_touser = ? order by message_time"
  ,[req.body.userid,req.body.userid],function(err,rows,field){
    res.send(rows);
  })
})

app.post("/messagerow",(req,res)=>{
  console.log(req.body);
  connection.query("select * from  message_table where message_time in (select max(message_time) from message_table group by message_room) and (message_user = ? or message_touser = ?);"
  ,[req.body.userid,req.body.userid],function(err,rows,field){
    console.log(rows);
    res.send(rows);
  })
})






//3001/Signup 포트로 보내기
app.post("/Signup", (req, res) => {
  //회원가입
  const _id = req.body._id;
  const mail = req.body.email;
  const pass = req.body.pass;
  const pass2 = req.body.pass2;
  const nickname = req.body.nick;
  connection.query(
    "insert into user_info (user_id,user_password, user_nickname, user_email) values (?,?,?,?)",
    [_id, pass, nickname, mail],
    function (err, rows, fields) {
      if (err) {
        res.send(false);
      } else {
        res.send(true);
      }
    }
  );
});
//닉네임 중복검사 하는거
app.post("/CheckNick", (req, res) => {
  const checkingNick = req.body.check_Nick;
  connection.query(
    "SELECT user_nickname FROM user_info WHERE user_nickname =(?)",
    [checkingNick],
    function (err, rows, fields) {
      console.log(rows[0]);
      if (rows[0] === undefined) {
        res.send(true); //중복 없음 사용가능
      } else {
        res.send(false); // 중복 있음 사용안됨
      }
    }
  );
});
//ID 중복검사 하는거
app.post("/CheckId", (req, res) => {
  const checkingId = req.body.check_Id;
  connection.query(
    "SELECT user_id FROM user_info WHERE user_id =(?)",
    [checkingId],
    function (err, rows, fields) {
      console.log(rows[0]);
      console.log(checkingId);
      if (rows[0] === undefined) {
        res.send(true); //중복 없음 사용가능
      } else {
        res.send(false); // 중복 있음 사용안됨
      }
    }
  );
});

app.post("/login", (req, res) => {
  const name = req.body.name;
  const pass = req.body.pass;
  const box = {};
  box.boolean = false;

  connection.query(
    "SELECT user_id FROM user_info WHERE user_id = (?)",
    [name],
    function (err, rows, fields) {
      console.log(rows[0]);
      if (rows[0] === undefined) {
        res.send(box);
        console.log("1");
      } else {
        connection.query(
          "SELECT user_id, user_password ,user_email,user_nickname FROM user_info WHERE  user_id = (?) AND user_password =(?)",
          [name, pass],
          function (err, rows, fields) {
            if (rows[0] === undefined) {
              console.log("2");
              res.send(box);
            } else {
              console.log("3");
              box.user_id = rows[0].user_id;
              box.user_email = rows[0].user_email;
              box.user_nickname = rows[0].user_nickname;
              box.boolean = true;
              res.send(box);
            }
          }
        );
      }
      //console.log(rows);
    }
  );
});

app.post("/Sendmail", (req, res) => {
  const email = req.body.sendEmail;
  var authNum = Math.floor(Math.random() * 1000000) + 100000;
  if (authNum > 1000000) {
    authNum = authNum - 100000;
  }

  let emailParam = {
    toEmail: email + "@gmail.com",
    subject: "회원가입 인증 메일입니다.",
    text: "인증번호는 " + authNum + "입니다.",
  };
  connection.query(
    "SELECT user_email FROM user_info WHERE user_email = (?)",
    [email],
    function (err, rows, fields) {
      if (rows[0] === undefined) {
        //중복된 메일 없음 메일 발송
        mailSender.sendGmail(emailParam);
        res.send(authNum.toString());
      } else {
        //중복된 메일이 있음
        res.send(true);
      }
    }
  );
});

http.listen(port, () => console.log(`Example app listening on port ${port}!`))

var mailSender = {
  // 메일발송 함수
  sendGmail: function (param) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      prot: 587,
      host: "smtp.gmail.com",
      secure: false,
      requireTLS: true,
      auth: {
        user: "gjdnjsdud10@gmail.com",
        pass: "ekdms!98",
      },
    });
    // 메일 옵션
    var mailOptions = {
      from: "gjdnjsdud10@gmail.com",
      to: param.toEmail, // 수신할 이메일
      subject: param.subject, // 메일 제목
      text: param.text, // 메일 내용
    };
    // 메일 발송
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
};
