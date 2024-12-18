const frame1 = document.querySelector('.frame1');
const frame2 = document.querySelector('.frame2');
let getNet = frame2.querySelector('#netContainer');
window.onload = function() {
    frame1.querySelector('img').classList.add('frame1Ball');
}
const ball1 = frame1.querySelectorAll('.img');
let startFunction = ()=>{
  const ball1 = frame1.querySelectorAll('.img');
  ball1.forEach((img) => {
      img.onclick = function() {
          frame1.style.display = 'none';
          frame2.style.display = 'block';
          getNet.classList.add('activeNet');
      };
  });
}

startFunction();
const takeShot =  frame2.querySelector('.takeShotConatiner');
const kickedBall = frame2.querySelector('.kickball');
const shotballText = frame2.querySelector('.shotballText');
const tryagainText = frame2.querySelector('.tryagainText');
const aimcenterText = frame2.querySelector('.aimcenterText');
const frAnimate = frame2.querySelectorAll('.fr-animate');
const subHeading = frame2.querySelector('.subHeading');
const ballShadow = frame2.querySelector('.ballShadow');
const centerArrow = frame2.querySelector('#centerArrow');
shotballText.classList.add('oneTextAnimation');
aimcenterText.classList.add('twoTextAnimation');
let aimCenter = ()=>{
const dropBall = ()=>{
    kickedBall.classList.add('kickedBallDrop');
    frAnimate.forEach( frAnimate => frAnimate.classList.add('frame2-animate'));
    ballShadow.style.display = 'block';
    getNet.style.display = 'none';
    centerArrow.style.display = 'none';
    setTimeout(()=>{
        subHeading.style.left = '0px';
    },1000)
} 
    takeShot.classList.add('d-none');
    kickedBall.style.display = "block";
    shotballText.style.display = "none";
    // tryagainText.style.display = "none";
    kickedBall.classList.add('basketballKicked');
    let rect = getNet.getBoundingClientRect();
    let react = rect.left;

if(react >= 65 && react <= 113) {
    getNet.classList.remove('activeNet');
    setTimeout(dropBall,2200);
} else {
   setTimeout(()=>{
    tryagainText.classList.add('oneTextAnimation');
    shotballText.style.display = "none";
    aimcenterText.classList.add('twoTextAnimation');
    kickedBall.classList.remove('basketballKicked');
    takeShot.classList.remove('d-none');
    kickedBall.style.display = "none";
   },800)
}
    // if(netActive.classList.contains('netGot')) {
    //     // alert('cought');
    // }
   // setTimeout(dropBall,3500);

//         function BallcheckHeight() {
//     const remainingHeight = container.clientHeight - element.clientHeight;
//     if (remainingHeight <= 59) {
//         element.classList.add('highlight');
//         alert("Remaining height is less than or equal to 59px!");
//     } else {
//         element.classList.remove('highlight');
//     }
// }
// BallcheckHeight();
    // }
};

if(takeShot) {
  takeShot.addEventListener('click', aimCenter);
} 

let kickball = function() {
  frame1.style.display = 'none';
  frame2.style.display = 'block';
  getNet.classList.add('activeNet');
};
const socket = io("https://qrconnect.mediaferry.com/");
let sessionId = null;

fetch("https://qrconnect.mediaferry.com/generateBasketballCode", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to fetch QR code");
    }
    return response.json();
  })
  .then(data => {
    document.getElementById("QrCode").src = data.qrCode;
    sessionId = data.sessionId;
    socket.emit("join-session", sessionId);
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Failed to load QR code. Please try again.");
  });

socket.on("connect", () => {
  if (sessionId) {
    socket.emit("join-session", sessionId);
  }
});

socket.on("perform-action", (action) => {
  // const controlledContent = document.getElementById("sp");
    if (action === "kick") {
      kickball();
    }else if(action === 'aimCenter'){
      aimCenter();
    }
    //   if (action === "changeColor") {
//     controlledContent.style. = "";
//   } else
});