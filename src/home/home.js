import "./home.css";
import asd from "../../assets/js/main";
import tx from "../../assets/img/test.jpg";
import $ from "jquery";
console.log(tx);

let Img = document.createElement("img");
Img.src = tx;
Img.width = 100;
Img.height = 100;
Img.alt="我是js添加的";
document.body.appendChild(Img);
console.log(tx)
console.log("我是首页");

console.log(asd(1,2)+"home---------+++-");
console.log($);

//全局变量
let oDiv = document.createElement("div");
if(DEV === "DEV"){
    oDiv.innerHTML = "我是开发环境";
}else{
    oDiv.innerHTML = "我是生产环境";
}
document.body.appendChild(oDiv);
