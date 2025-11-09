/* Pseudo Code for things I want to do:
- How do I allow people to comment on posts?
  - There would have to be some appendage logic for this I think
    - How can we get these comments to nest and open up?
- Can I create a heart option in the logic?
- How can I make it populate as their own boxes instead of as a list?
  - To do this I would have to change the structrue inside of the EJS
- How do you change the icon and add a new one?


*/

addEventListener('load', getTrivia)

document.getElementById('submit').addEventListener('click', checkAnswer)
const list =  document.querySelector('.chatMessages')



// document.getElementById('trueAnswer').addEventListener('change', clearEntries)

var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");


function getTrivia () {
  const questionLocation = document.getElementById('questionLocation').innerText
  const myHeaders = new Headers();
  myHeaders.append("X-Api-Key", "pZh/LHD2HypZAvi8/vagBQ==gLZmCoKXKbGJW72N");
  
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  
  fetch("https://api.api-ninjas.com/v1/triviaoftheday", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      // console.log(result)
      // console.log(result.split(","))
      // console.log(result.text)
      document.getElementById('questionLocation').innerText = result[0].question
      document.getElementById('trueAnswer').value = result[0].answer
      
    })
    .catch((error) => console.error(error));
}
// Worked on setting up and debugging this function with Michael Kazin
function checkAnswer () {
  const name = document.getElementById('contestant').value
  const msg = document.getElementById('answer').value
  const trueAnswer = document.getElementById('trueAnswer').value
  if (document.getElementById('answer').value.toLowerCase() ===  document.getElementById('trueAnswer').value.toLowerCase()) {
    alert('Congrats You\'re a Winner')
    fetch('chatMessages', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'trueanswer': trueAnswer
      })
    })
      .then ((response => response.json()))
      .then ((result) => {
        console.log(result.content)
        // list.innerText = result.content
        list.style.display = 'inline-flex'
      })
  //  list.style.flex-direction = 'column'
  } else {
    alert ('Wrong Answer')
    fetch('chatMessages', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'trueanswer': trueAnswer
      })
    })
  }
}

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('chatMessages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(thumbDown).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('chatMessages', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbDown':thumbDown
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('chatMessages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

