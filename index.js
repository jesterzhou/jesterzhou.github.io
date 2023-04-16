//date and time
const options = { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric'
    
}

let date = new Date()
const local_date = date.toLocaleDateString("en-US", options)
let timezone = date.toString()
timezone = (timezone[35] + timezone[43] + timezone[52])

function clock () {
    let clock = new Date() 
    let time = clock.toLocaleTimeString("en-US", {timeZone: "America/New_York"});
    document.getElementById("clock").innerHTML = time + "\n" + timezone;

}


window.onload = () => {
    document.getElementById("date").innerHTML = local_date;

    setInterval(clock, 1000)
}