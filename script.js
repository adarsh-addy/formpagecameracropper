var imgurl;
var cropped = document.getElementsByClassName('cropped'),
    img_result = document.getElementsByClassName('img-result')
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result)
        };
        reader.readAsDataURL(input.files[0]);
        setTimeout(initCropper, 1000);
    }
}
function initCropper() {
    console.log("Came here")
    var image = document.getElementById('blah');
    var cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        crop: function (e) {
            console.log(e.detail.x);
            console.log(e.detail.y);
        }
    });

    // save on click
    let flag=true;
    document.getElementById('save_button').addEventListener('click', (e) => {
        e.preventDefault();
        // get result to data uri
        if(flag){
        imgurl = cropper.getCroppedCanvas().toDataURL();
        console.log(imgurl);
        var img1 = document.createElement("img");
        img1.src = imgurl;//base64 image address are very big address are not used to store into database
        document.getElementById("cropped_result").appendChild(img1);
        flag=false;
        }
    });

    /* ---------------- SEND IMAGE TO THE SERVER-------------------------
 
                cropper.getCroppedCanvas().toBlob(function (blob) {
                      var formData = new FormData();
                      formData.append('croppedImage', blob);
                      // Use `jQuery.ajax` method
                      $.ajax('/path/to/upload', {
                        method: "POST",
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function () {
                          console.log('Upload success');
                        },
                        error: function () {
                          console.log('Upload error');
                        }
                      });
                });
            ----------------------------------------------------*/
    //     })
}


 //for camera
 let camera_button = document.querySelector("#start-camera");
 let video = document.querySelector("#video");
 let click_button = document.querySelector("#click-photo");
 let canvas = document.querySelector("#canvas");

 camera_button.addEventListener("click", async function (e) {
   e.preventDefault();
   console.log("hi")
   let stream = await navigator.mediaDevices.getUserMedia({
     video: true,
     audio: false,
   });
   video.srcObject = stream;
 });
console.log(camera_button);
 click_button.addEventListener("click", function (e) {
   e.preventDefault()
   canvas
     .getContext("2d")
     .drawImage(video, 0, 0, canvas.width, canvas.height);
   let image_data_url = canvas.toDataURL("'image/jpeg', 1.0");

   // data url of the image
   console.log(image_data_url);

   //cropper code

  //  var img1url;
  
   console.log("Came here");
   var cropper1 = new Cropper(canvas, {
     aspectRatio: 16 / 9,
     crop: function (e) {
       console.log(e.detail.x);
       console.log(e.detail.y);
     },
   });

   // save on click
   let flag=true;
   document
     .getElementById("m_save_button")
     .addEventListener("click", (e) => {
       e.preventDefault();
       // get result to data uri
       if(flag){
       imgurl = cropper1.getCroppedCanvas().toDataURL();
       console.log(imgurl);
       //showing the image
       var img1 = document.createElement("img");
       img1.src = imgurl;
       document.getElementById("m_cropped_result").appendChild(img1);
       flag=false;
       }
     });
   // }
 });



//changing base64 into normal url
// writing to file named 'example.jpg'

// const image = await encode(url, options);
// await decode(image, { fname: 'example', ext: 'jpg' });

// writing to a sub-directory
// after creating a directory called 'photos'

// const image = await encode(url, options);
// await decode(image, { fname: './photos/example', ext: 'jpg' });





 //backend connection 
 let btn = document.querySelector("#submit-btn");
btn.addEventListener("click", async function (e) {
  e.preventDefault();
// console.log("hi");
  let id = document.querySelector("input[name='id']").value;
  let product_name = document.querySelector("input[name='product_n']").value;
  let point_per_bag = document.querySelector("input[name='point_p_b']").value;
  let product_priority = document.querySelector("input[name='product_p']").value;
  let min_order_oty = document.querySelector("input[name='min_order_o']").value;
  let img = imgurl;//global variable assigned which carry cropped img url
 
  let resp = await axios.post("/backend/save", {
    id,
    product_name,
    point_per_bag,
    product_priority,
    min_order_oty,
    img
  });

  

  console.log(resp.data);
  let result=await axios.get("/backend/show")
console.log(result.data);

  //code carry on for table.....
let tableData=result.data.records
console.log(tableData);
let tbody=document.querySelector("tbody");
tbody.innerHTML=[];
for(let tad of tableData){
var imgAdress=tad.img;
console.log(imgAdress);
function base64ToImage(imgAdress,callback){
  var img=new Image();
  img.onload=function(){
    callback(img);
  };
  img.src=imgAdress
}
base64ToImage(imgAdress,function(img){
  console.log("hello");
  document.getElementById('main').appendChild(img)
})
let tbl=` <tr>
<td>${tad.id}</td>
<td>${tad.productname}</td>
<td>${tad.pointperbag}</td>
<td>${tad.productpriority}</td>
<td>${tad.minorderoty}</td>
<td><div id='main'></div></td>
</tr>`
tbody.innerHTML+=tbl;
}

});
