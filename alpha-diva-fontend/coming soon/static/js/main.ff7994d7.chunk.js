(this["webpackJsonpalpha-diva-fontend"]=this["webpackJsonpalpha-diva-fontend"]||[]).push([[0],{50:function(e,a,t){e.exports=t(60)},55:function(e,a,t){},56:function(e,a,t){},60:function(e,a,t){"use strict";t.r(a);var n=t(0),i=t.n(n),o=t(7),r=t.n(o),l=(t(55),t(22)),c=t(19),m=t(87),d=t(89),s=t(94),u=t(91),h=t(95),g=t(92),p=t(96),f=t(93),b=(t(56),Object(m.a)({logo:{fontFamily:"Dancing Script",fontSize:25},container:Object(c.a)({height:"100vh",display:"flex",flexDirection:"column",justifyContent:"space-between",paddingTop:20,paddingBottom:20,backgroundImage:"url('/images/comingSoon.png')",backgroundPosition:"right",backgroundRepeat:"no-repeat"},"@media (max-width:780px)",{backgroundImage:"url()"}),heading:Object(c.a)({fontSize:90,fontWeight:"bolder",lineHeight:1.2,fontFamily:"Poppins"},"@media (max-width:780px)",{fontSize:50}),meet:{color:"#e50914",fontFamily:"Poppins",fontWeight:900},caption:Object(c.a)({width:"70%",marginTop:50,fontSize:20},"@media (max-width:780px)",{width:"100%"}),footer:{display:"flex",justifyContent:"space-between",alignItems:"center"},button:{borderRadius:0,border:"thin solid white",color:"white",marginTop:20,padding:10,paddingLeft:25,paddingRight:25},duration:{display:"flex",alignItems:"center"},durationDate:{fontSize:30},durationWord:{fontSize:12},durationBox:{height:15,width:1,backgroundColor:"white",marginLeft:10,marginRight:10,marginTop:-20},modalContainer:Object(c.a)({alignItems:"center",height:"100%",display:"flex","&:active":{outline:"none"},"&:focus":{outline:"none",border:"none"}},"@media (max-width:488px)",{flexDirection:"column",justifyContent:"center"}),button2:Object(c.a)({borderRadius:0,border:"thin solid white",color:"white",marginTop:20,padding:10,paddingLeft:25,paddingRight:25},"@media (max-width:488px)",{width:"100%"}),button3:Object(c.a)({borderRadius:0,border:"thin solid white",color:"white",marginTop:20,padding:10,paddingLeft:25,paddingRight:25,width:"100%",display:"none"},"@media (max-width:488px)",{display:"block"}),textInput:Object(c.a)({"& .MuiInput-input":{color:"white",borderBottom:"thin solid white",marginRight:10,width:300},"& label.Mui-focused":{color:"white"},"& .MuiInput-underline:after":{borderBottomColor:"white"},"& .MuiFormLabel-root":{color:"white"},"& .MuiInput-underline":{marginRight:10}},"@media (max-width:488px)",{width:"100%"}),modal:{background:"rgba(0,0,0,0.7)"}}));var E=function(){var e=b(),a=Object(n.useState)("0"),t=Object(l.a)(a,2),o=t[0],r=t[1],c=Object(n.useState)("0"),m=Object(l.a)(c,2),E=m[0],w=m[1],x=Object(n.useState)("0"),N=Object(l.a)(x,2),j=N[0],y=N[1],O=Object(n.useState)("0"),S=Object(l.a)(O,2),v=S[0],k=S[1],C=Object(n.useState)(""),D=Object(l.a)(C,2),I=D[0],R=D[1],W=Object(n.useState)(!1),M=Object(l.a)(W,2),z=M[0],B=M[1],L=function(){B(!1)};function T(e){return e>9?""+e:"0"+e}return Object(n.useEffect)((function(){document.title="Alpha Diva"})),setInterval((function(){var e=new Date("2020-07-31"),a=new Date,t=Math.floor((e-a)/1e3),n=Math.floor(t/60),i=Math.floor(n/60),o=Math.floor(i/24);t=t-24*o*60*60-60*(i-=24*o)*60-60*(n=n-24*o*60-60*i),r(T(o)),w(T(i)),y(T(n)),k(T(t))}),1e3),i.a.createElement(d.a,{maxWidth:"md",className:e.container},i.a.createElement(s.a,null,i.a.createElement(u.a,{className:e.logo},"Alpha-Diva")),i.a.createElement(s.a,null,i.a.createElement(u.a,{className:e.heading},"Nice to ",i.a.createElement("br",null),i.a.createElement("span",{className:e.meet},"meet ")," you"),i.a.createElement(u.a,{className:e.caption},"We are preparing something amazing and exciting for you. Special surprise for our subscribers only."),i.a.createElement(h.a,{className:e.button,onClick:function(){B(!0)}},"Notify me ",i.a.createElement(g.a,{style:{marginLeft:20}},"notifications_active"))),i.a.createElement(s.a,{className:e.footer},i.a.createElement(s.a,null,i.a.createElement(g.a,{className:"fa fa-facebook",style:{fontSize:15,marginRight:20}}),i.a.createElement(g.a,{className:"fa fa-twitter",style:{fontSize:15}})),i.a.createElement(s.a,{item:!0},i.a.createElement(s.a,{className:e.duration},i.a.createElement(s.a,null,i.a.createElement(u.a,{className:e.durationDate},o),i.a.createElement(u.a,{className:e.durationWord},"DAYS")),i.a.createElement(s.a,{className:e.durationBox}),i.a.createElement(s.a,null,i.a.createElement(u.a,{className:e.durationDate},E),i.a.createElement(u.a,{className:e.durationWord},"HOURS")),i.a.createElement(s.a,{className:e.durationBox}),i.a.createElement(s.a,null,i.a.createElement(u.a,{className:e.durationDate},j),i.a.createElement(u.a,{className:e.durationWord},"MIN")),i.a.createElement(s.a,{className:e.durationBox}),i.a.createElement(s.a,null,i.a.createElement(u.a,{className:e.durationDate},v),i.a.createElement(u.a,{className:e.durationWord},"SEC"))))),i.a.createElement(p.a,{open:z,onClose:L,"aria-labelledby":"simple-modal-title","aria-describedby":"simple-modal-description",className:e.modal},i.a.createElement(d.a,{maxWidth:"md",className:e.modalContainer},i.a.createElement(f.a,{onChange:function(e){R(e.target.value)},className:e.textInput,id:"standard-basic",label:"Email"}),i.a.createElement(h.a,{className:e.button2,onClick:function(){I.trim().length>0&&L()}},"Submit"),i.a.createElement(h.a,{className:e.button3,onClick:function(){L()}},"Cancel"))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(E,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[50,1,2]]]);
//# sourceMappingURL=main.ff7994d7.chunk.js.map