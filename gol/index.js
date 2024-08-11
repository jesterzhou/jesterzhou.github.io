//author : jester zhou
//https://github.com/jesterzhou/gol

onload = () => { //await onload page event.
    let spacing = 20; //cell grid n x n
    let lines = "#737A7A"; //grid grey.
    let cell_color = "#ccc"; //cell colour grey.

    //manage state
    let events = { //state of events.
        md : false, //mouse key down event.
        ctrl : false, //ctrl key down event.
    }

    let kd = []; //track keys down states

    //manage objects
    let live = new Set(); // add objects of cell, store it as [row-column], not coordinate [x,y] ... all live cells

    //previous mouse pos.
    let x = 0; 
    let y = 0;

    //change in axis x and y mouse pos.
    let dx = 0;
    let dy = 0;

    //html stuff
    let canvas = document.getElementById("cell");
    let ctx = canvas.getContext("2d"); //context of canvas, assigned on onload.

    //generation counter and cell counter overlay
    let gen_count = 0; //generation count of simulation
    gen = document.getElementById("gen"); //generation count div

    let cell_count = document.getElementById("count");

    //html menu overlay , used to toggle between visibility of menu, t or f.
    let instr = document.getElementById("instructions");
    
    function size(width, height) {
        canvas.width = width; 
        canvas.height = height;
    }

    function init() {
        //+spacing at end of x and y part to fill in the void from of page./
        size(Math.round(window.innerWidth/spacing)*spacing+spacing, Math.round(window.innerHeight/spacing)*spacing+spacing);
        draw();
    }

    function draw() { //draw canvas grid

        ctx.fillStyle = cell_color;
        ctx.strokeStyle = lines;

        ctx.clearRect(0,0, canvas.width, canvas.height); //clear canvas from (0,0)        
        ctx.beginPath();

        // -dx to span in same direction as mouse cursor. i.e. left, canvas translates left.
        // dy to span in opposite direction as mouse cursor. i.e. up, canvas translates down.
        
        //add '/ spacing' after x < canvas.width + Math.abs(dx) , to view original viewport sized canvas
        // column lines
        
        for (let x = 0.5; x < canvas.width + Math.abs(dx); x += spacing) {
            
            if (dx > 0) {
                //span +x (right)
                ctx.moveTo(-dx + x, 0); //dx + x, top
                ctx.lineTo(-dx + x, canvas.height); //dx -> x, bottom
                
            } else {
                //span -x, + canvas.width to span additional page, not until (0,0) / previous pos, but rather entire page. i.e. await after viewport x dimension passes before spanning -x (left)
                ctx.moveTo(-dx - x + canvas.width, 0); //-inf, top
                ctx.lineTo(-dx - x + canvas.width, canvas.height); //-inf, top
            }
        }
    
        // row lines
        for (let y = 0.5; y < canvas.height + Math.abs(dy) ; y += spacing) {
            if (dy > 0) {
                //span (down) +y 
                ctx.moveTo(0, -dy + y); //-inf, top
                ctx.lineTo(canvas.width , -dy + y) //inf, -inf    
            } else {
                //span (up) -y
                ctx.moveTo(0, -dy - y + canvas.height);
                ctx.lineTo(canvas.width, -dy - y + canvas.height);
            }
        }

        //four conditions of cell's dx, and dy (used to keep it rendered onpage, when mouse pans in certain direction)
        // dx, dy
        
        // -dx, -dy 

        // dx, -dy 
        // -dx, dy

        for (let value of live.values()) {
            cell = value.split(","); //split string into corresponding x and y components.
            
            let cx = parseInt(cell[0]) * spacing; 
            let cy = parseInt(cell[1]) * spacing;

            if (dx >= 0 && dy >= 0) { // +dx, +dy
                ctx.fillRect(cx-Math.abs(dx),cy-Math.abs(dy), spacing, spacing)
            }

            if (dx <= 0 && dy <= 0) { // -dx, -dy
                ctx.fillRect(cx+Math.abs(dx),cy+Math.abs(dy), spacing, spacing)
            } 

            if (dx <= 0 && dy >= 0) { // -dx, +dy
                ctx.fillRect(cx+Math.abs(dx),cy-Math.abs(dy), spacing, spacing)
            }

            if (dx >= 0 && dy <= 0) { // +dx, -dy
                ctx.fillRect(cx-Math.abs(dx),cy+Math.abs(dy), spacing, spacing)
            }
        }

        ctx.stroke(); //render lines
        ctx.closePath(); //stop drawing lines
        ctx.restore(); //restore previous state.

    }

    init()

    function next() { //check for next generation of to-be alive or dead cells
        let nexts = new Set();
        for (let cell of live) { //check all current living cells

            cell = cell.split(","); //split string into corresponding x and y components.

            let cx = parseInt(cell[0]); 
            let cy = parseInt(cell[1]);
            
            cell = [cx,cy];
            
            let n = chk(cell); //number of live neighbors
            
            if (n == 2 || n == 3) {
                nexts.add(cell.toString());
            }
    
            //check the adjacent cells and their live neighbors
            let a = [cell[0]-1, cell[1]-1];
            let b = [cell[0]+0, cell[1]-1];
            let c = [cell[0]+1, cell[1]-1];
    
            let d = [cell[0]-1, cell[1]+0];
            let e = [cell[0]+1, cell[1]+0];
    
            let f = [cell[0]-1, cell[1]+1];
            let g = [cell[0]+0, cell[1]+1];
            let h = [cell[0]+1, cell[1]+1];    

            let neighbors = [a,b,c,d,e,f,g,h];

            for (let adj of neighbors) {
                let n = chk(adj); //number of live neighbors the adjacent cells has.

                if (n == 3) {
                    nexts.add(adj.toString())
                }
            }
        }

        live = nexts;
        // console.log(live);
    }

    // a b c
    // d z e
    // f g h
    function chk(cell) { //check adjacent cells relative to this cell and return neighbor count.
        let count = 0;

        let z = [cell[0],cell[1]]; //for computation of adjacent, use values # x,y of cell provided.
        //cells in grid relative to z (itself)

        let a = [z[0]-1, z[1]-1];
        let b = [z[0]+0, z[1]-1];
        let c = [z[0]+1, z[1]-1];

        let d = [z[0]-1, z[1]+0];
        let e = [z[0]+1, z[1]+0];

        let f = [z[0]-1, z[1]+1];
        let g = [z[0]+0, z[1]+1];
        let h = [z[0]+1, z[1]+1];

        let neighbors = [a,b,c,f,g,h,d,e]; //relative neighbors / adjacent of original cell (z)

        //check adjacent cells of already alive cells 
        for (let cells of neighbors) {
            cells = cells.toString();

            if (live.has(cells)) {
                count += 1;
            }
        }
        return count;
    }

    function step() { //step function, to proceed to next generation call this function -> calling next() function
        next()
        draw();

        //update counters
        gen_count += 1
        gen.innerHTML = ("generation #: "+ gen_count);
    
        cell_count.innerHTML = ("alive cell #: "+ live.size);
    }

    // why use static noise? since cells can only be 0 or 1 state, we can generate a grid of n*n and each grid box will contain a value from
    // 0.0 -> 1.0, we can round up or down to make that value 0 or 1. (giving alive or dead cell)
    
    function static() {
        let row = [];
        live.clear();

        for (let y = 0; y < Math.round(window.innerHeight/spacing); y++) { //rows
            let column = [];

            for (let x = 0; x < Math.round(window.innerWidth/spacing); x++) { //columns
                column.push(Math.random());
            }
            row.push(column);
        }
        // console.log(row)
        //iterate through each row
        for (let r = 0; r < row.length; r++) {
            for (let c = 0; c < row[r].length; c++) {
                
                if (row[r][c] > 0.67) { //if row[n] > ... , append [x,y] / [c#,r#] to live ... the threshold selected is arbitrary.
                    // console.log(c,r)
                    live.add([c,r].toString());

                    cell_count.innerHTML = ("alive cell #:" + live.size);
                }
            }
        }
        draw();
    }
    
    function instruction() { //toggle instructions tab / menu
        if (instr.style.visibility === 'hidden') {
            instr.style.visibility = 'visible'
        } else {
            instr.style.visibility = 'hidden'
        }
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has
    //have to convert coordinates [x,y] to string "[x,y]", as .add([0,0]) won't reference to the same .has([0,0])
    //my understanding is that strings are stored in string pools, and since ["a","b"] is just an object of type String {"a", "b"}, it'll be in the string-pool, where it can be referenced.

    // onresize event handler property
    onresize = () => {
        size(Math.floor(window.innerWidth/spacing)*spacing+spacing, Math.floor(window.innerHeight/spacing)*spacing+spacing);
        draw();
    }

    // onmouse... event handler property
    onmousedown = (event) => {
        events.md = true;
        
        // set origin mouse pos. (+dx and dy to account for changes)
        x = event.clientX + dx;  
        y = event.clientY + dy;

        console.log("\n\ninit mouse pos:",x,"x",y)
        
        // console.log("rounded coordinates:", Math.floor(x/spacing)*spacing, Math.floor(y/spacing)*spacing) //coordinates
        // console.log("cell number:", Math.floor(x/spacing), Math.floor(y/spacing)) //cell x,y
        
        let cell = [Math.floor(x/spacing)*spacing, Math.floor(y/spacing)*spacing] //let cell be the coordinates of the cell number / row-columns 

        let c = [cell[0]/spacing, cell[1]/spacing].toString(); //let c be [row-column] format 
        
        if (!kd.includes("Control") && instr.style.visibility === "hidden") { //used so that when panning with ctrl + md, doesnt accidentally add cell to live ... second part, when instruction menu up, cannot place live cells.

            //check if set contains cell already (add, remove feature), store as [row-column]
            if (!(live.has(c))) { 
                live.add(c);
            } else {
                live.delete(c)
            }
        }

        cell_count.innerHTML = ("alive cell #: "+ live.size);
        draw();
    }

    onmouseup = () => {
        events.md = false;
        
        console.log("\nchange in viewport pos from (0,0)",dx,"x",-dy); //negative dy for opposite movement of cursor in y direction
        console.log("new mouse pos:",x + dx,"x",y -dy); //true total change from (0,0)
        draw();

        document.body.style.cursor = "default";
    }

    onmousemove = (event) => {
        if (events.md && kd.includes("Control")) {   
        
            dx = x - event.clientX; //displacement in x coordinate from origin pos.
            dy = y - event.clientY; //displacement in y coordinate from origin pos.

            draw();        
            document.body.style.cursor = "grabbing";

        } else { //when control is released, then mousedown = false, you want this because if state of md != false, then on next ctrl + mousedown, cursor will jump to last previous onmousedown.
            //also does not allow for panning after md = true, ... only can be kd.includes("Control") + events.md 
            events.md = false;
            document.body.style.cursor = "default"
        }
    }

    //onkey... event handler property
    onkeydown = (event) => {
        kd[kd.length] = event.key; //record onkeydown event to kd

        if (kd.length > 1) { //ensures that holding of ctrl key or any other key does NOT take up extra memory. especially when user wants to pan for long periods. also acts as a safeguard for 1 key press at a time.
            kd = [];
            kd[kd.length] = event.key
        }

        if (kd.includes(" ")) { // " " <- this is what event.key tracks as spacebar lol
            step();
        } 

        if (kd.includes("x")) { //reset
            live = new Set();
            draw();
        
            gen_count = 0;
            gen.innerHTML = ("generation #: "+ gen_count)

            cell_count.innerHTML = ("alive cell #: "+ 0)
        }

        if (kd.includes("z")) {
            static();
        }

        if (kd.includes("m")) {
            instruction();
        }
    }
 
    onkeyup = () => {
        kd = []; //clear keys down object when keys are not pressed
    }

}
//note
// equivalent to writing a "addEventListener() method"
// i.e. EventTarget.addEventListener("eventType", (event) => {...}); ... allows for multiple listeners to be assigned to an element 