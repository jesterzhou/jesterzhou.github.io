//date and time
const options = { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric'
}

let date = new Date()
const local_date = date.toLocaleDateString("en-US", options)
let timezone = date.toString().substring(34)
timezone = (timezone[1] + timezone[9] + timezone[18])

function clock () {
    let clock = new Date() 
    let time = clock.toLocaleTimeString();
    document.getElementById("clock").innerHTML = time + "\n" + timezone;
    
}

window.onload = () => {
    document.getElementById("date").innerHTML = local_date;

    setInterval(clock, 1000)
}