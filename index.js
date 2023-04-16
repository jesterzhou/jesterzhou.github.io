//date and time

let date = new Date()
const local_date = date.toLocaleDateString("en-US")

let timezone = date.toTimeString()
timezone = (timezone[19] + timezone[27] + timezone[36])

function clock () {
    let clock = new Date() 
    let time = clock.toLocaleTimeString("en-US", {timeZone: "America/New_York"});
    document.getElementById("clock").innerHTML = time + "\n " + timezone;


}

window.onload = () => {
    document.getElementById("date").innerHTML = local_date;
    clock()
    setInterval(clock,1000)

}