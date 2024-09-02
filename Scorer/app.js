homeScore = 0
guestScore = 0

let scoreHome = document.getElementById("homeScore")
let scoreGuest = document.getElementById("guestScore")
let winner = document.getElementById("winner")

function addOneHome() {
    homeScore += 1
    scoreHome.innerText = homeScore
    winnerScore()
}

function addTwoHome() {
    homeScore += 2
    scoreHome.innerText = homeScore
    winnerScore()
}
function addThreeHome() {
    homeScore += 3
    scoreHome.innerText = homeScore
    winnerScore()
}

function addOneGuest() {
    guestScore += 1
    scoreGuest.innerText = guestScore
    winnerScore()
}

function addTwoGuest() {
    guestScore += 2
    scoreGuest.innerText = guestScore
    winnerScore()
}
function addThreeGuest() {
    guestScore += 3
    scoreGuest.innerText = guestScore
    winnerScore()
}

function winnerScore(params) {
    if (homeScore > guestScore) {
        winner.innerText = "Winner: Home"
    }else if (guestScore > homeScore) {
        winner.innerText = "Winner: Guest"
    }else {
        winner.innerText = "Winner: "
    }
}

function reset(params) {
    homeScore = 0
    guestScore = 0
    scoreGuest.innerText = 0
    scoreHome.innerText = 0
}
