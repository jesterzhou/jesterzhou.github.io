//date and time
function clock () {
    
    const dt_options = {
        day : "numeric",
        month : "long",
        year : "numeric",
        
        timeZone : "America/New_York",
        timeZoneName: "long"
    }

    const d_t = new Date()
    let d_t_str = (d_t.toLocaleTimeString("en-US", dt_options))

    const d_t_arr = [
        d_t_str.slice(0,14), //date
        d_t_str.slice(18, 29), //time
        (d_t_str[30] + d_t_str[38] + d_t_str[47]) //timezone
    ]
    
    document.getElementById("date").innerHTML = d_t_arr[0]
    document.getElementById("clock").innerHTML =( d_t_arr[1] + "\n" +d_t_arr[2])

}

window.onload = () => {
    clock()
    // setInterval(clock,1000)
}