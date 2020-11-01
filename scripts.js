class PhotoBooth{
    constructor(){
        this.red = false;
        this.split = false;
        this.greenScreen = false;
        this.negative = false;
        this.sunny = false;
        this.ifDraw= false;
        this.sticker = false;
        //DRAW SVG 
            // state
        this.draw = false;
        this.points = [];
        this.lines = [];
        this.svg = null;
        this.video = document.querySelector('.player');
        this.canvas = document.querySelector('.photo');
        this.ctx = this.canvas.getContext('2d');
        this.strip = document.querySelector('.strip-insider');
        this.snap = document.querySelector('.snap');
        this.shutter = document.querySelector("#camButton");
        this.drawBox = document.querySelector("#draw");
        this.stickerBtn = document.querySelector("#drag1");
        //*control buttons here
        this.redBtn = document.querySelector("#redEffect");
        this.splitBtn = document.querySelector("#splitEffect");
        this.greenScreenBtn = document.querySelector("#greenScreenEffect");
        this.imageNegativeBtn = document.querySelector("#imageNegative");
        this.sunnyBtn = document.querySelector("#sunny");
        this.ifDrawBtn = document.querySelector("#ifDraw");
        this.redBtn.addEventListener("click", ()=>{
            this.greenScreen = false;
            this.split = false;
            this.negative = false;
            this.sunny = false;
            this.red = !this.red;
        });
        this.splitBtn.addEventListener("click", ()=>{
            this.greenScreen = false;
            this.red = false;
            this.negative = false;
            this.sunny = false;
            this.split = !this.split;
        });
        this.greenScreenBtn.addEventListener("click", ()=>{
            this.greenScreen = !this.greenScreen;
            this.red = false;
            this.split = false;
            this.negative = false;
            this.sunny = false;
        });
        this.imageNegativeBtn.addEventListener("click", () => {
            this.red = false;
            this.split = false;
            this.greenScreen = false;
            this.sunny = false;
            this.negative = !this.negative;
        });
        this.sunnyBtn.addEventListener("click", () => {
            this.red = false;
            this.split = false;
            this.greenScreen = false;
            this.sunny = !this.sunny;
            this.negative = flase;
        })
        this.stickerBtn.addEventListener("click", ()=> {
            this.sticker = !this.sticker;
            if(this.sticker){
                this.stickerBtn.classList.add("sticlicked");
                this.canvas.addEventListener('click', (evt) => {
                    let mousePos = this.getMousePos(this.canvas, evt);
                    this.ctx.drawImage(this.stickerBtn,0,0, 100, 100);
                    
                    }, true);
            }else{
                this.stickerBtn.classList.remove("sticlicked");
            }
        });
        camButton.addEventListener("click", ()=>this.takePhoto());
        this.getVideo();
        this.video.addEventListener("canplay", () => {
            this.paintToCanvas();
        });
        this.ifDrawBtn.addEventListener("click", ()=>{
            this.ifDraw = !this.ifDraw;
            if(this.ifDraw){
                this.render();
            }
            });


    }
    getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    console.log(rect);
    const coords =  {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
    return(coords);
    }

    getVideo() {
        navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            })
            .then(localMediaStream => {
                this.video.srcObject = localMediaStream;
                this.video.play();
            })
            .catch(error => {
                console.error("Egad!  You don't want video!", error);
            })
    }
    paintToCanvas() {
        const width = this.video.videoWidth;
        const height = this.video.videoHeight;
        console.log(width, height);
        this.canvas.width = width;
        this.canvas.height = height;
    
        return setInterval(() => {
            this.ctx.drawImage(this.video, 0, 0, width, height);
            // *take pixels out
            let pixels = this.ctx.getImageData(0, 0, width, height);
            //crazy huge array that goes[r,g,b,a,r,g,b,a,r,g,b,a.....]
            //console.log(pixels);
            //debugger;
            if(this.red==true){
                pixels = this.redEffect(pixels);
            }
            if(this.split==true){
                pixels = this.rgbSplit(pixels);
            }
            if(this.greenScreen==true){
                pixels = this.greenScreenEffect(pixels);
            }
            if(this.negative==true){
                pixels = this.imageNegative(pixels);
            }
            if(this.sunny==true){
                pixels = this.sunShade(pixels);
            }
            this.ctx.putImageData(pixels, 0, 0);
        }, 16)
    }

    
    redEffect(pixels) {
        for (let i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
            pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
            pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
        }
        return pixels;
    }
    
    rgbSplit(pixels) {
        for (let i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i + 0] = pixels.data[i + 100]; // RED
            pixels.data[i + 1] = pixels.data[i + 1]; // GREEN
            pixels.data[i + 2] = pixels.data[i + 202]; // Blue
        }
        return pixels;
    }
    imageNegative(pixels){
        for(let i =0; i < pixels.data.length; i += 4){
            pixels.data[i + 0] = pixels.data[i + 0] ^ 255; // Red
            pixels.data[i+1] = pixels.data[i+1] ^ 255; // Green
            pixels.data[i+2] = pixels.data[i+2] ^ 255; // Blue
        }
        return pixels;
    }
    sunShade(pixels){
        for(let i =0; i < pixels.data.length; i += 4){
            pixels.data[i + 0] = pixels.data[i + 0] + 125; // Red
            pixels.data[i+1] = pixels.data[i+1] + 125; // Green
            pixels.data[i+2] = pixels.data[i+2] + 125; // Blue
        }
        return pixels;
    }
    
    greenScreenEffect(pixels) {
        const levels = {};
    
        document.querySelectorAll('.rgb input').forEach((input) => {
            levels[input.name] = input.value;
        });
        for (let i = 0; i < pixels.data.length; i = i + 4) {
            let red = pixels.data[i + 0];
            let green = pixels.data[i + 1];
            let blue = pixels.data[i + 2];
            const alpha = pixels.data[i + 3];
    
            if (red >= levels.rmin &&
                green >= levels.gmin &&
                blue >= levels.bmin &&
                red <= levels.rmax &&
                green <= levels.gmax &&
                blue <= levels.bmax) {
                // take it out!
                alpha = 0;
                console.log("I am alive");
            }else{
                console.log("I am Dead");
            }
        }
    
        return pixels;
    }
    render() {

        // create the selection area
        this.svg = d3.select(this.drawBox)
                .attr('height', "100vh")
                .attr('width', "800px")
    
        this.svg.on('mousedown', function() {
            this.draw = true;
            const coords = d3.mouse(this);
                drawPoint(coords[0], coords[1], false);
        });
    
        this.svg.on('mouseup', () =>{
            this.draw = false;
        });
    
        this.svg.on('mousemove', function() {
            if (!this.draw)
                return;
            const coords = d3.mouse(this);
                drawPoint(coords[0], coords[1], true);
        });
    
        document.querySelector('#erase').onclick = () => {
            for (let i = 0; i < points.length; i++)
                points[i].remove();
            for (let i = 0; i < lines.length; i++)
                lines[i].remove();
            this.points = [];
            this.lines = [];
        }
    
    }
    drawPoint(x, y, connect) {
    
        const color = document.querySelector('#color-picker').value;
        const thickness = document.querySelector('#thickness-picker').value;
    
        if (connect) {
            const last_point = points[points.length - 1];
            const line = svg.append('line')
                            .attr('x1', last_point.attr('cx'))
                            .attr('y1', last_point.attr('cy'))
                            .attr('x2', x)
                            .attr('y2', y)
                            .attr('stroke-width', thickness * 2)
                            .style('stroke', color);
            lines.push(line);
        }
    
        const point = svg.append('circle')
                        .attr('cx', x)
                        .attr('cy', y)
                        .attr('r', thickness)
                        .style('fill', color);
        points.push(point);
    }

    takePhoto() {
        this.snap.currentTime = 0;
        this.snap.play();
        const data = this.canvas.toDataURL('image/jpg');
        //console.log(data);
        const link = document.createElement('a');
        link.href = data;
        link.setAttribute("download", "zaphod");
        link.textContent = "Download Image";
        link.innerHTML = `<img src=${data} alt="Still no tentacles"/>`;
        this.strip.insertBefore(link, this.strip.firstChild);
    }
}
let myPhotoBooth = new PhotoBooth();